import { enviarDeclaracaoComProva, lerJson, origemPermitida, responder, textoValido, validarProvaQuiz } from "../lib/security.mjs";

export default async function (request) {
  if (request.method !== "POST") return responder({ mensagem: "Método não permitido." }, 405);
  if (!origemPermitida(request)) return responder({ mensagem: "Origem da solicitação não permitida." }, 403);

  let dados;
  try {
    dados = await lerJson(request, 8000);
  } catch (erro) {
    return responder({ mensagem: erro.message === "PAYLOAD_TOO_LARGE" ? "Dados muito grandes." : "JSON inválido." }, erro.message === "PAYLOAD_TOO_LARGE" ? 413 : 400);
  }

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return responder({ mensagem: "Envie os dados da declaração em formato JSON." }, 400);
  }

  // Campo invisível para pessoas: preenchê-lo normalmente indica envio automatizado.
  if (typeof dados.website === "string" && dados.website.trim()) return responder({ ok: true });

  const nickname = typeof dados.nickname === "string" ? dados.nickname.trim() : "";
  const message = typeof dados.message === "string" ? dados.message.trim() : "";
  if (!textoValido(nickname, 1, 40) || !textoValido(message, 1, 1000)) {
    return responder({ mensagem: "Confira o nickname e o tamanho da declaração." }, 400);
  }
  const prova = validarProvaQuiz(dados.proof, nickname);
  if (!prova) {
    return responder({ mensagem: "Conclua o quiz antes de enviar uma declaração." }, 403);
  }

  try {
    const declaracaoSalva = await enviarDeclaracaoComProva({ ...prova, nickname, message });
    if (declaracaoSalva !== true) {
      return responder({ mensagem: "Esta conclusão do quiz já foi usada. Faça o quiz novamente para enviar outra declaração." }, 409);
    }
    return responder({ ok: true, mensagem: "Declaração enviada com sucesso!" });
  } catch (erro) {
    console.error("Falha ao salvar declaração:", erro.message);
    return responder({ mensagem: "Não foi possível enviar a declaração agora." }, 503);
  }
}

export const config = {
  path: "/api/declaration",
  method: "POST",
  rateLimit: { windowLimit: 3, windowSize: 60, aggregateBy: ["ip", "domain"] }
};
