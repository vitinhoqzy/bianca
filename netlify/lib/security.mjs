import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

export function responder(dados, status = 200) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });
}

export function origemPermitida(request) {
  const origem = request.headers.get("origin");
  // Alguns clientes legítimos omitem Origin; quando enviado, deve ser do mesmo site.
  if (!origem) return true;

  try {
    return new URL(origem).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function lerJson(request, limite = 12_000) {
  const tamanhoDeclarado = Number(request.headers.get("content-length") || 0);
  if (tamanhoDeclarado > limite) throw new Error("PAYLOAD_TOO_LARGE");

  const texto = await request.text();
  if (new TextEncoder().encode(texto).byteLength > limite) throw new Error("PAYLOAD_TOO_LARGE");
  return JSON.parse(texto);
}

export function textoValido(valor, minimo, maximo) {
  return typeof valor === "string" && valor.trim().length >= minimo && valor.trim().length <= maximo;
}

function segredoSupabase() {
  const url = process.env.SUPABASE_URL;
  // Usa o nome da variável configurada no Netlify para a chave privada do Supabase.
  const chave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !chave) throw new Error("SUPABASE_ENV_MISSING");
  return { url: url.replace(/\/$/, ""), chave };
}

export async function inserirNoSupabase(tabela, registro) {
  const { url, chave } = segredoSupabase();
  const resposta = await fetch(`${url}/rest/v1/${tabela}`, {
    method: "POST",
    headers: {
      apikey: chave,
      "content-type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify(registro)
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    console.error(`Supabase recusou a gravação em ${tabela}:`, resposta.status, detalhe.slice(0, 500));
    throw new Error("SUPABASE_INSERT_FAILED");
  }
}

export function criarProvaQuiz(nickname) {
  const exp = Date.now() + 30 * 60 * 1000;
  const nonce = randomUUID();
  const payload = Buffer.from(JSON.stringify({
    nickname,
    exp,
    nonce
  })).toString("base64url");
  const assinatura = createHmac("sha256", segredoSupabase().chave).update(payload).digest("base64url");
  return { proof: `${payload}.${assinatura}`, nonce, expires_at: new Date(exp).toISOString() };
}

export function validarProvaQuiz(prova, nickname) {
  if (typeof prova !== "string" || prova.length > 2048) return null;
  const [payload, assinatura, extra] = prova.split(".");
  if (!payload || !assinatura || extra) return null;

  let assinaturaEsperada;
  try {
    assinaturaEsperada = createHmac("sha256", segredoSupabase().chave).update(payload).digest();
    const assinaturaRecebida = Buffer.from(assinatura, "base64url");
    if (assinaturaRecebida.length !== assinaturaEsperada.length || !timingSafeEqual(assinaturaRecebida, assinaturaEsperada)) return null;

    const dados = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (dados.nickname !== nickname || !Number.isFinite(dados.exp) || dados.exp <= Date.now() || typeof dados.nonce !== "string") return null;
    return { nonce: dados.nonce, expires_at: new Date(dados.exp).toISOString() };
  } catch {
    return null;
  }
}

export async function enviarDeclaracaoComProva({ nonce, expires_at, nickname, message }) {
  const { url, chave } = segredoSupabase();
  const resposta = await fetch(`${url}/rest/v1/rpc/submit_declaration_once`, {
    method: "POST",
    headers: {
      apikey: chave,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      p_nonce: nonce,
      p_expires_at: expires_at,
      p_nickname: nickname,
      p_message: message
    })
  });

  if (!resposta.ok) {
    const detalhe = await resposta.text();
    console.error("Supabase recusou a declaração:", resposta.status, detalhe.slice(0, 500));
    throw new Error("SUPABASE_INSERT_FAILED");
  }

  return resposta.json();
}
