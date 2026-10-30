// Localiza os elementos da página que o JavaScript precisa atualizar.
const formulario = document.querySelector("#nickname-form");
const campoNickname = document.querySelector("#nickname");
const pagina = document.querySelector("#page-shell");
const telaInicial = document.querySelector("#intro-screen");
const telaQuiz = document.querySelector("#quiz-screen");
const telaPergunta = document.querySelector("#question-screen");
const telaResultado = document.querySelector("#result-screen");
const contadorPergunta = document.querySelector("#question-counter");
const barraProgresso = document.querySelector("#quiz-progress");
const preenchimentoProgresso = document.querySelector("#progress-fill");
const textoProgresso = document.querySelector("#progress-label");
const tituloPergunta = document.querySelector("#question-title");
const opcoesResposta = document.querySelector("#answer-options");
const nomeResultado = document.querySelector("#result-nickname");
const porcentagemResultado = document.querySelector("#match-percent");
const tituloFaixaResultado = document.querySelector("#result-tier-title");
const mensagemResultado = document.querySelector("#result-message");
const botaoCompartilhar = document.querySelector("#share-result");
const mensagemCompartilhamento = document.querySelector("#share-feedback");
const campoCopiaManual = document.querySelector("#share-fallback");
const rotuloCopiaManual = document.querySelector("#share-fallback-label");
const botaoVoltarInicio = document.querySelector("#back-to-start");
const botaoPerguntaAnterior = document.querySelector("#previous-question");
const botaoReverRespostas = document.querySelector("#review-answers");
const botaoRefazer = document.querySelector("#restart-quiz");
const botaoTema = document.querySelector("#theme-toggle");
const iconeTema = document.querySelector("#theme-icon");
const metaTema = document.querySelector("meta[name=theme-color]");
const ano = document.querySelector("#year");
const botaoMusica = document.querySelector("#music-toggle");
const iconeBotaoMusica = document.querySelector("#music-toggle-icon");
const rotuloBotaoMusica = document.querySelector("#music-toggle-label");
const areaSpotify = document.querySelector("#spotify-embed");
const statusMusica = document.querySelector("#music-status");
const playerMusica = document.querySelector("#music-dock");
const botaoMinimizarMusica = document.querySelector("#music-minimize");
const botaoRestaurarMusica = document.querySelector("#music-restore");
const formularioDeclaracao = document.querySelector("#declaration-form");
const nomeDeclaracao = document.querySelector("#declaration-nickname");
const textoDeclaracao = document.querySelector("#declaration-message");
const contadorDeclaracao = document.querySelector("#declaration-counter");
const botaoEnviarDeclaracao = document.querySelector("#declaration-submit");
const feedbackDeclaracao = document.querySelector("#declaration-feedback");
const statusSalvamentoRanking = document.querySelector("#ranking-save-status");
const secaoDeclaracao = document.querySelector("#declaration-section");

// O player oficial só será solicitado quando a pessoa apertar o botão.
let controladorSpotify = null;
let carregandoSpotify = false;
let musicaTocando = false;
let scriptSpotify = null;

// Perguntas e alternativas enviadas pela Bianca para o quiz.
const perguntas = [
  {
    titulo: "💌 1. A Bianca sai linda e posta uma foto. Qual é sua reação?",
    respostas: [
      { letra: "A", texto: "Comenta: “Minha namorada é linda demais, pqp 😍❤️”" },
      { letra: "B", texto: "Vê a foto e denuncia pra ninguém mais ver." },
      { letra: "C", texto: "Diz: “Tá linda, amor. Mas já tô com saudade e você nem saiu ainda.”" },
      { letra: "D", texto: "Curte e comenta, por que ela é a mais linda do mundo." }
    ]
  },
  {
    titulo: "👀 2. Um menino começa a dar em cima da Bianca na sua frente. Você faz o que?",
    respostas: [
      { letra: "B", texto: "Fico com ciúmes, mas confio nela." },
      { letra: "C", texto: "Chego perto dela e deixo claro que estamos juntos." },
      { letra: "D", texto: "Soco a cara dele pra mostrar que ela tem dono." },
      { letra: "A", texto: "Abraço ela pela cintura e solto um “tá procurando alguma coisa, parceiro?”." }
    ]
  },
  {
    titulo: "❤️ 3. Como você gosta de demonstrar que está apaixonado?",
    respostas: [
      { letra: "A", texto: "Fazendo questão de mostrar que ela é especial pra mim, todos os dias." },
      { letra: "B", texto: "Com carinho, beijo e atenção o tempo todo." },
      { letra: "C", texto: "Com ciúmes, provocação e muito grude." },
      { letra: "D", texto: "Com mensagens fofas e declarações do nada." }
    ]
  },
  {
    titulo: "📱 4. A Bianca demora horas pra responder. E agora?",
    respostas: [
      { letra: "A", texto: "Você manda “Tá tudo bem, amor? “" },
      { letra: "B", texto: "Vou sentir falta, mas espero ela responder." },
      { letra: "C", texto: "Mando mil mensagens para saber onde ela estava." },
      { letra: "D", texto: "Você manda “Você ta louca de não me avisar? Quer ficar solteira?”" }
    ]
  },
  {
    titulo: "💋 5. Qual frase você mais falaria pra Bianca?",
    respostas: [
      { letra: "A", texto: "“Você não tem noção do quanto eu sou apaixonado por você.”" },
      { letra: "B", texto: "“Eu morreria por você, te daria tudo que quisesse.”" },
      { letra: "C", texto: "“Você é tudo pra mim, quero você pra sempre.”" },
      { letra: "D", texto: "“Se eu pudesse faria de tudo pra te ver feliz,.”" }
    ]
  },
  {
    titulo: "🤭 6. A Bianca pergunta se você sente ciúmes dela. Você responde:",
    respostas: [
      { letra: "A", texto: "“Muito, se você falar com outro eu te mato.”" },
      { letra: "B", texto: "“Um pouquinho, não vou mentir.”" },
      { letra: "C", texto: "“Sinto, porque gosto de você, mas confio em você.”" },
      { letra: "D", texto: "“Se eu pudesse, ficava agarrado com você 24 horas por dia.”" }
    ]
  },
  {
    titulo: "🫦 7. Qual seria seu jeito de ficar com a Bianca?",
    respostas: [
      { letra: "A", texto: "Todo romântico, fazendo cartinhas e dando flores." },
      { letra: "B", texto: "Grudado nela, beijando e fazendo carinho." },
      { letra: "C", texto: "Com aquela postura de marrento com todo mundo, mas um amorzinho com ela." },
      { letra: "D", texto: "Provocando, implicando e sentindo ciúmes." }
    ]
  },
  {
    titulo: "🥹 8. A Bianca está insegura e precisa de carinho. O que você faz?",
    respostas: [
      { letra: "A", texto: "Abraço ela e digo que não precisa enfrentar tudo sozinha." },
      { letra: "B", texto: "Digo que ela é a única pessoa que eu quero e demonstro isso com atitudes." },
      { letra: "C", texto: "Encho ela de beijos até ela começar a rir." },
      { letra: "D", texto: "Largo tudo por um momento pra dar atenção a ela." }
    ]
  },
  {
    titulo: "💍 9. Se você realmente gostasse da Bianca, o que faria?",
    respostas: [
      { letra: "A", texto: "Chamaria ela pra sair e tentaria conquistá-la." },
      { letra: "B", texto: "Deixaria claro que quero algo sério com ela." },
      { letra: "C", texto: "Trataria ela como minha princesa, seria fiel e faria ela se sentir amada e segura." },
      { letra: "D", texto: "Faria questão de demonstrar carinho, atenção e um pouquinho de ciúmes." }
    ]
  },
  {
    titulo: "🌟 10. Como seriam seu casamento e lua de mel perfeitos?",
    respostas: [
      { letra: "A", texto: "Pediria em casamento em Paris e a lua de mel na Grecia." },
      { letra: "B", texto: "Um casamento na praia e lua de mel também." },
      { letra: "C", texto: "Casamento na igreja e a lua de mel em uma praia paradisiaca." },
      { letra: "D", texto: "Faria uma festa de casamento para os mais próximos e a lua de mel em Maldivas." }
    ]
  }
];

// Gabarito passado pela Bianca, na mesma ordem das dez perguntas.
const gabarito = ["B", "D", "A", "C", "B", "A", "D", "B", "C", "A"];

// Guarda em que pergunta a pessoa está e quantos pontos já acumulou.
let perguntaAtual = 0;
const respostasEscolhidas = [];
let nicknameAtual = "";
let trocandoPergunta = false;
let rankingResultadoSalvo = false;
let provaConclusaoQuiz = "";

// Preenche o ano no rodapé sem precisar atualizá-lo manualmente.
ano.textContent = new Date().getFullYear();

// Usa o tema salvo; se não houver um salvo, segue a preferência do aparelho.
const temaSalvo = localStorage.getItem("tema-bianca");
const prefereNoturno = window.matchMedia("(prefers-color-scheme: dark)").matches;
aplicarTema(temaSalvo || (prefereNoturno ? "dark" : "light"));

// Alterna o tema e lembra a escolha neste navegador.
botaoTema.addEventListener("click", function () {
  const temaAtual = document.documentElement.dataset.theme;
  const proximoTema = temaAtual === "dark" ? "light" : "dark";
  aplicarTema(proximoTema);
  localStorage.setItem("tema-bianca", proximoTema);
});

// Atualiza as cores do navegador, o ícone do botão e os estilos da página.
function aplicarTema(tema) {
  document.documentElement.dataset.theme = tema;
  const estaNoEscuro = tema === "dark";
  iconeTema.textContent = estaNoEscuro ? "☀️" : "🌙";
  botaoTema.setAttribute("aria-label", estaNoEscuro ? "Ativar modo claro" : "Ativar modo noturno");
  botaoTema.title = estaNoEscuro ? "Ativar modo claro" : "Ativar modo noturno";
  metaTema.setAttribute("content", estaNoEscuro ? "#1b1014" : "#fff7f8");
}

// Atualiza o botão personalizado para acompanhar o estado do player oficial.
function atualizarBotaoMusica(estaTocando) {
  musicaTocando = estaTocando;
  iconeBotaoMusica.textContent = estaTocando ? "Ⅱ" : "▶";
  rotuloBotaoMusica.textContent = estaTocando ? "Pausar" : "Tocar";
  botaoMusica.setAttribute("aria-pressed", String(estaTocando));
  botaoMusica.setAttribute("aria-label", (estaTocando ? "Pausar" : "Tocar") + " Máquina do Tempo, de Matuê");
}

// Cria o player oficial do Spotify somente depois do primeiro toque.
function carregarPlayerSpotify() {
  if (carregandoSpotify || controladorSpotify) return;

  carregandoSpotify = true;
  areaSpotify.hidden = false;
  document.body.classList.add("music-player-open");
  botaoMusica.disabled = true;
  rotuloBotaoMusica.textContent = "Carregando…";
  statusMusica.textContent = "Carregando o player oficial do Spotify…";

  // A API avisa quando terminou de carregar; então criamos o player da música.
  window.onSpotifyIframeApiReady = function (iframeApi) {
    iframeApi.createController(
      areaSpotify,
      {
        uri: "spotify:track:5oI9blwsXC8AkTWw6wASY8",
        width: 350,
        height: 152
      },
      function (controlador) {
        controladorSpotify = controlador;
        carregandoSpotify = false;
        botaoMusica.disabled = false;
        atualizarBotaoMusica(false);

        const iframe = areaSpotify.querySelector("iframe");
        if (iframe) iframe.title = "Player do Spotify: Máquina do Tempo, de Matuê";

        // Mantém o nosso botão sincronizado com os controles dentro do Spotify.
        controlador.addListener("playback_started", function () {
          atualizarBotaoMusica(true);
          statusMusica.textContent = "Máquina do Tempo está tocando.";
        });

        controlador.addListener("playback_update", function (evento) {
          if (evento.data && typeof evento.data.isPaused === "boolean") {
            atualizarBotaoMusica(!evento.data.isPaused);
          }
        });

        controlador.addListener("playback_ended", function () {
          atualizarBotaoMusica(false);
          statusMusica.textContent = "A música terminou. Toque em “Tocar” para ouvir de novo.";
        });

        // Tentamos iniciar após o toque. Alguns navegadores exigem tocar no ▶ do Spotify.
        try {
          Promise.resolve(controlador.resume()).catch(function () {
            statusMusica.textContent = "Toque em ▶ dentro do player do Spotify para começar a ouvir.";
          });
        } catch {
          // O player oficial continua visível e seus próprios controles podem ser usados.
        }

        statusMusica.textContent = "Se a música não começar, toque em ▶ dentro do player do Spotify.";
      }
    );
  };

  // A API é carregada sob demanda para não atrasar a abertura inicial do site.
  scriptSpotify = document.createElement("script");
  scriptSpotify.src = "https://open.spotify.com/embed/iframe-api/v1";
  scriptSpotify.async = true;
  scriptSpotify.onerror = function () {
    carregandoSpotify = false;
    botaoMusica.disabled = false;
    rotuloBotaoMusica.textContent = "Tentar de novo";
    statusMusica.textContent = "Não foi possível carregar o Spotify. Verifique sua conexão e tente novamente.";
    scriptSpotify.remove();
    scriptSpotify = null;
  };
  document.head.append(scriptSpotify);
}

// No primeiro toque, carrega o player. Depois, o mesmo botão pausa ou retoma.
botaoMusica.addEventListener("click", function () {
  if (!controladorSpotify) {
    carregarPlayerSpotify();
    return;
  }

  try {
    if (musicaTocando) {
      controladorSpotify.pause();
      atualizarBotaoMusica(false);
      statusMusica.textContent = "Música pausada.";
    } else {
      Promise.resolve(controladorSpotify.resume()).catch(function () {
        atualizarBotaoMusica(false);
        statusMusica.textContent = "Use ▶ dentro do player do Spotify para começar a ouvir.";
      });
      statusMusica.textContent = "Tentando retomar a música…";
    }
  } catch {
    statusMusica.textContent = "Use os controles dentro do player do Spotify para continuar.";
  }
});

// Esconde o módulo sem mandar pausar a música que já estiver tocando.
botaoMinimizarMusica.addEventListener("click", function () {
  playerMusica.hidden = true;
  botaoRestaurarMusica.hidden = false;
  document.body.classList.remove("music-player-open");
  document.body.classList.add("music-player-minimized");
  botaoRestaurarMusica.focus();
});

// Reabre o módulo e devolve o foco para o botão de música.
botaoRestaurarMusica.addEventListener("click", function () {
  playerMusica.hidden = false;
  botaoRestaurarMusica.hidden = true;
  document.body.classList.remove("music-player-minimized");
  if (!areaSpotify.hidden) document.body.classList.add("music-player-open");
  botaoMusica.focus();
});

// Recebe o nickname e inicia o quiz sem recarregar a página.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();
  nicknameAtual = campoNickname.value.trim();
  nomeDeclaracao.value = nicknameAtual;

  if (!nicknameAtual) {
    campoNickname.focus();
    return;
  }

  perguntaAtual = 0;
  respostasEscolhidas.length = 0;
  rankingResultadoSalvo = false;
  provaConclusaoQuiz = "";
  botaoEnviarDeclaracao.disabled = true;
  pagina.classList.add("is-playing");
  document.querySelector("#inicio").setAttribute("aria-labelledby", "question-title");
  telaInicial.hidden = true;
  telaQuiz.hidden = false;
  telaResultado.hidden = true;
  telaPergunta.hidden = false;
  desenharPergunta();
});

// Desenha a pergunta atual e suas quatro opções identificadas por letra.
function desenharPergunta() {
  const pergunta = perguntas[perguntaAtual];
  contadorPergunta.textContent = "pergunta " + (perguntaAtual + 1) + " de " + perguntas.length;
  tituloPergunta.textContent = pergunta.titulo;
  opcoesResposta.replaceChildren();

  // Mantém a ordem visual A, B, C, D em celulares e computadores.
  // A letra continua ligada à mesma resposta e ao gabarito do quiz.
  const respostasOrdenadas = [...pergunta.respostas].sort(function (a, b) {
    return a.letra.localeCompare(b.letra);
  });

  respostasOrdenadas.forEach(function (resposta) {
    const botao = document.createElement("button");
    const emoji = document.createElement("span");
    const texto = document.createElement("span");

    botao.type = "button";
    botao.className = "answer-option";
    const estaSelecionada = respostasEscolhidas[perguntaAtual] === resposta.letra;
    botao.classList.toggle("is-selected", estaSelecionada);
    botao.setAttribute("aria-pressed", String(estaSelecionada));
    emoji.className = "answer-option__emoji";
    emoji.setAttribute("aria-hidden", "true");
    emoji.textContent = resposta.letra + ")";
    texto.className = "answer-option__text";
    texto.textContent = resposta.texto;
    botao.append(emoji, texto);

    // Registra a letra escolhida e apresenta a próxima pergunta.
    botao.addEventListener("click", function () {
      escolherResposta(resposta.letra);
    });

    opcoesResposta.append(botao);
  });

  botaoPerguntaAnterior.hidden = perguntaAtual === 0;
  atualizarProgresso();
  tituloPergunta.focus();
}

// Mostra quanto do quiz já foi respondido para todas as pessoas.
function atualizarProgresso() {
  const quantidadeRespondida = respostasEscolhidas.filter(function (letraDaResposta) {
    return typeof letraDaResposta === "string";
  }).length;
  const porcentagem = Math.round((quantidadeRespondida / perguntas.length) * 100);
  preenchimentoProgresso.style.width = porcentagem + "%";
  textoProgresso.textContent = porcentagem + "% respondido";
  barraProgresso.setAttribute("aria-valuenow", String(quantidadeRespondida));
  barraProgresso.setAttribute("aria-valuetext", quantidadeRespondida + " de " + perguntas.length + " perguntas respondidas");
}

// Faz as opções desaparecerem suavemente antes de mostrar o próximo conjunto.
function escolherResposta(letra) {
  if (trocandoPergunta) return;
  trocandoPergunta = true;
  // Ao mudar uma resposta, a prova anterior deixa de valer.
  provaConclusaoQuiz = "";
  rankingResultadoSalvo = false;
  botaoEnviarDeclaracao.disabled = true;
  respostasEscolhidas[perguntaAtual] = letra;

  Array.from(opcoesResposta.querySelectorAll("button")).forEach(function (botao) {
    botao.disabled = true;
  });
  opcoesResposta.classList.add("is-changing");

  const prefereMovimentoReduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tempoDaTransicao = prefereMovimentoReduzido ? 0 : 230;

  window.setTimeout(function () {
    perguntaAtual += 1;
    opcoesResposta.classList.remove("is-changing");

    if (perguntaAtual < perguntas.length) {
      desenharPergunta();
    } else {
      mostrarResultado();
    }

    trocandoPergunta = false;
  }, tempoDaTransicao);
}

// Compara as respostas com o gabarito e transforma os acertos em cinco faixas.
function mostrarResultado() {
  const quantidadeAcertos = respostasEscolhidas.reduce(function (total, letra, indice) {
    return total + (letra === gabarito[indice] ? 1 : 0);
  }, 0);
  const compatibilidade = Math.round((quantidadeAcertos / perguntas.length) * 4) * 25;
  nomeResultado.textContent = nicknameAtual;
  porcentagemResultado.textContent = String(compatibilidade);

  const textosResultado = {
    100: {
      titulo: "💍 100% — O HOMEM QUE A BIANCA PRECISA",
      mensagem: "Romântico, ciumento, carinhoso e completamente apaixonado. Você gosta de deixar claro quando quer alguém e não tem vergonha de demonstrar seus sentimentos. 👀❤️"
    },
    75: {
      titulo: "💋 75% — O CIUMENTO APAIXONADO",
      mensagem: "Você tem seu lado romântico, mas também gosta de provocar e sentir ciúmes. Poderia fazer o tipo dela.❤️"
    },
    50: {
      titulo: "💌 50% — TEM CHANCE, MAS NÃO SE ANIMA",
      mensagem: "Você até combina com ela, mas ainda precisa mostrar serviço. A química pode existir, só falta descobrir se vocês dariam certo juntos. 👀"
    },
    25: {
      titulo: "🤨 25% — A BIANCA TERIA QUE PENSAR",
      mensagem: "Vocês podem até se dar bem, mas suas respostas não convenceram muito. Vai ter que conquistar essa menina na conversa! KKKKKK 😭"
    },
    0: {
      titulo: "🤡 0% — AMIGO, É MELHOR TENTAR DE NOVO",
      mensagem: "KKKKKKKK, você e a Bianca aparentemente vivem em universos diferentes! Vocês podem ser amigos. 😂"
    }
  };

  tituloFaixaResultado.textContent = textosResultado[compatibilidade].titulo;
  mensagemResultado.textContent = textosResultado[compatibilidade].mensagem;
  salvarPontuacaoRanking(compatibilidade, quantidadeAcertos);

  atualizarProgresso();
  telaPergunta.hidden = true;
  telaResultado.hidden = false;
  secaoDeclaracao.hidden = false;
  document.querySelector("#inicio").setAttribute("aria-labelledby", "result-title");
  document.querySelector("#result-title").focus();
}

// Mostra quantos caracteres já foram escritos na declaração.
textoDeclaracao.addEventListener("input", function () {
  contadorDeclaracao.textContent = textoDeclaracao.value.length + " / 1000 caracteres";
});

// Envia a declaração pela função do servidor, que exige uma prova do quiz concluído.
formularioDeclaracao.addEventListener("submit", async function (evento) {
  evento.preventDefault();
  feedbackDeclaracao.textContent = "";

  if (!provaConclusaoQuiz) {
    feedbackDeclaracao.textContent = "Aguarde o registro da conclusão do quiz antes de enviar sua declaração.";
    return;
  }

  const nickname = nomeDeclaracao.value.trim();
  const message = textoDeclaracao.value.trim();
  const campoArmadilha = formularioDeclaracao.querySelector('[name="website"]');
  if (!nickname || !message) {
    feedbackDeclaracao.textContent = "Preencha seu nickname e a declaração antes de enviar.";
    return;
  }

  botaoEnviarDeclaracao.disabled = true;
  botaoEnviarDeclaracao.textContent = "Enviando…";

  try {
    const resposta = await fetch("/api/declaration", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        nickname: nickname,
        message: message,
        proof: provaConclusaoQuiz,
        website: campoArmadilha ? campoArmadilha.value : ""
      })
    });
    const resultado = await resposta.json().catch(function () { return {}; });
    if (!resposta.ok) throw new Error(resultado.mensagem || "Falha ao enviar declaração.");

    formularioDeclaracao.reset();
    contadorDeclaracao.textContent = "0 / 1000 caracteres";
    feedbackDeclaracao.textContent = resultado.mensagem || "Declaração enviada com sucesso! 💌";
  } catch (erro) {
    console.error("Erro ao enviar declaração:", erro);
    feedbackDeclaracao.textContent = erro.message || "Não foi possível enviar agora. Confira sua conexão e tente novamente.";
  } finally {
    botaoEnviarDeclaracao.disabled = !provaConclusaoQuiz;
    botaoEnviarDeclaracao.innerHTML = 'Enviar para a Bianca <span aria-hidden="true">♡</span>';
  }
});

// Grava o resultado para compor o ranking privado exibido no painel da Bianca.
async function salvarPontuacaoRanking(compatibilidade, quantidadeAcertos) {
  if (rankingResultadoSalvo) return;
  rankingResultadoSalvo = true;

  statusSalvamentoRanking.textContent = "Salvando sua pontuação…";

  try {
    const resposta = await fetch("/api/quiz-score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ nickname: nicknameAtual, answers: respostasEscolhidas })
    });
    const resultado = await resposta.json().catch(function () { return {}; });
    if (!resposta.ok) throw new Error(resultado.mensagem || "Falha ao registrar pontuação.");
    if (resultado.score !== compatibilidade || resultado.correct_answers !== quantidadeAcertos || !resultado.proof) {
      throw new Error("O resultado recebido do servidor não corresponde às respostas do quiz.");
    }

    provaConclusaoQuiz = resultado.proof;
    botaoEnviarDeclaracao.disabled = false;
    statusSalvamentoRanking.textContent = "Sua pontuação foi registrada no ranking privado da Bianca.";
  } catch (erro) {
    console.error("Erro ao salvar pontuação:", erro);
    statusSalvamentoRanking.textContent = erro.message || "Não foi possível salvar sua pontuação agora.";
    botaoEnviarDeclaracao.disabled = true;
    rankingResultadoSalvo = false;
  }
}

// Copia um resumo simples que a pessoa pode colar em uma conversa.
botaoCompartilhar.addEventListener("click", async function () {
  const porcentagem = porcentagemResultado.textContent;
  const resumo = "Meu match com a Bianca deu " + porcentagem + "% de compatibilidade no quiz! 💘 Conheça a Bianca: https://www.instagram.com/eyesdest/";

  mensagemCompartilhamento.textContent = "";
  campoCopiaManual.hidden = true;
  rotuloCopiaManual.hidden = true;

  let copiado = false;

  // A API moderna funciona quando a página está em localhost ou HTTPS.
  try {
    if (!navigator.clipboard) throw new Error("Área de transferência indisponível");
    await navigator.clipboard.writeText(resumo);
    copiado = true;
  } catch {
    // Se o navegador bloquear a API moderna, tentamos a cópia tradicional.
    const caixaTemporaria = document.createElement("textarea");
    caixaTemporaria.value = resumo;
    caixaTemporaria.setAttribute("readonly", "");
    caixaTemporaria.style.position = "fixed";
    caixaTemporaria.style.opacity = "0";
    document.body.append(caixaTemporaria);
    caixaTemporaria.select();
    copiado = document.execCommand("copy");
    caixaTemporaria.remove();
  }

  if (copiado) {
    mensagemCompartilhamento.textContent = "Resumo copiado! Agora é só colar onde quiser. 💌";
    return;
  }

  // Deixa o texto visível e selecionado para a pessoa copiar manualmente.
  campoCopiaManual.value = resumo;
  campoCopiaManual.hidden = false;
  rotuloCopiaManual.hidden = false;
  campoCopiaManual.focus();
  campoCopiaManual.select();
  mensagemCompartilhamento.textContent = "A cópia automática foi bloqueada. O resumo ficou selecionado abaixo para você copiar.";
});

// Volta uma pergunta sem apagar a resposta que já foi escolhida.
botaoPerguntaAnterior.addEventListener("click", function () {
  if (perguntaAtual === 0) return;
  perguntaAtual -= 1;
  desenharPergunta();
});

// Permite rever a última resposta depois de ver o resultado.
botaoReverRespostas.addEventListener("click", function () {
  perguntaAtual = perguntas.length - 1;
  provaConclusaoQuiz = "";
  botaoEnviarDeclaracao.disabled = true;
  telaResultado.hidden = true;
  telaPergunta.hidden = false;
  secaoDeclaracao.hidden = true;
  document.querySelector("#inicio").setAttribute("aria-labelledby", "question-title");
  desenharPergunta();
});

// Permite voltar ao começo antes de iniciar outro nickname.
botaoVoltarInicio.addEventListener("click", function () {
  provaConclusaoQuiz = "";
  botaoEnviarDeclaracao.disabled = true;
  telaQuiz.hidden = true;
  telaInicial.hidden = false;
  secaoDeclaracao.hidden = true;
  document.querySelector("#inicio").setAttribute("aria-labelledby", "hero-title");
  pagina.classList.remove("is-playing");
  campoNickname.focus();
});

// Reinicia o quiz mantendo o nickname preenchido.
botaoRefazer.addEventListener("click", function () {
  perguntaAtual = 0;
  respostasEscolhidas.length = 0;
  rankingResultadoSalvo = false;
  provaConclusaoQuiz = "";
  botaoEnviarDeclaracao.disabled = true;
  telaResultado.hidden = true;
  telaPergunta.hidden = false;
  secaoDeclaracao.hidden = true;
  document.querySelector("#inicio").setAttribute("aria-labelledby", "question-title");
  desenharPergunta();
});
