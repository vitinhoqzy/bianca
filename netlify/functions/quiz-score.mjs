import { criarProvaQuiz, inserirNoSupabase, lerJson, origemPermitida, responder, textoValido } from "../lib/security.mjs";

const gabarito = ["B", "D", "A", "C", "B", "A", "D", "B", "C", "A"];

export default async function (request) {
  if (request.method !== "POST") return responder({ mensagem: "Método não permitido." }, 405);
  if (!origemPermitida(request)) return responder({ mensagem: "Origem da solicitação não permitida." }, 403);

  let dados;
  try {
    dados = await lerJson(request, 4000);
  } catch (erro) {
    return responder({ mensagem: erro.message === "PAYLOAD_TOO_LARGE" ? "Dados muito grandes." : "JSON inválido." }, erro.message === "PAYLOAD_TOO_LARGE" ? 413 : 400);
  }

  if (!dados || typeof dados !== "object" || Array.isArray(dados)) {
    return responder({ mensagem: "Envie os dados do quiz em formato JSON." }, 400);
  }

  const nickname = typeof dados.nickname === "string" ? dados.nickname.trim() : "";
  const respostas = dados.answers;
  if (!textoValido(nickname, 1, 40) || !Array.isArray(respostas) || respostas.length !== gabarito.length || !respostas.every((item) => ["A", "B", "C", "D"].includes(item))) {
    return responder({ mensagem: "Nickname ou respostas inválidas. Responda às 10 perguntas." }, 400);
  }

  const acertos = respostas.reduce((total, resposta, indice) => total + Number(resposta === gabarito[indice]), 0);
  const pontuacao = Math.round((acertos / gabarito.length) * 4) * 25;

  try {
    await inserirNoSupabase("quiz_scores", {
      nickname,
      score: pontuacao,
      correct_answers: acertos
    });
    const prova = criarProvaQuiz(nickname);
    await inserirNoSupabase("quiz_completion_tokens", {
      id: prova.nonce,
      nickname,
      expires_at: prova.expires_at
    });
    return responder({ ok: true, score: pontuacao, correct_answers: acertos, proof: prova.proof });
  } catch (erro) {
    console.error("Falha ao registrar resultado do quiz:", erro.message);
    return responder({ mensagem: "Não foi possível registrar o resultado agora." }, 503);
  }
}

export const config = {
  path: "/api/quiz-score",
  method: "POST",
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] }
};
