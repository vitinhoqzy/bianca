// Seleciona os campos e as áreas do painel privado.
const cliente = window.biancaSupabaseClient || null;
const loginSection = document.querySelector("#admin-login-section");
const loginForm = document.querySelector("#admin-login-form");
const loginFeedback = document.querySelector("#admin-login-feedback");
const loginButton = document.querySelector("#admin-login-button");
const dashboard = document.querySelector("#admin-dashboard");
const welcome = document.querySelector("#admin-welcome");
const rankingList = document.querySelector("#ranking-list");
const rankingFeedback = document.querySelector("#ranking-feedback");
const declarationsList = document.querySelector("#declarations-list");
const declarationsFeedback = document.querySelector("#declarations-feedback");
const configNote = document.querySelector("#admin-config-note");
const logoutButton = document.querySelector("#admin-logout");
const themeButton = document.querySelector("#admin-theme-toggle");
const themeIcon = document.querySelector("#admin-theme-icon");
const themeColor = document.querySelector('meta[name="theme-color"]');

// Aplica a mesma preferência de tema salva na página principal.
const savedTheme = localStorage.getItem("tema-bianca");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setAdminTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));
themeButton.addEventListener("click", function () {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setAdminTheme(nextTheme);
  localStorage.setItem("tema-bianca", nextTheme);
});

function setAdminTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const dark = theme === "dark";
  themeIcon.textContent = dark ? "☀️" : "🌙";
  themeButton.setAttribute("aria-label", dark ? "Ativar modo claro" : "Ativar modo noturno");
  themeButton.title = dark ? "Ativar modo claro" : "Ativar modo noturno";
  themeColor.setAttribute("content", dark ? "#1b1014" : "#fff7f8");
}

// Atualiza o ano exibido no rodapé.
document.querySelector("#year").textContent = new Date().getFullYear();

// Sem URL e chave pública, exibimos orientação em vez de tentar fazer login.
if (!cliente) {
  loginSection.hidden = true;
  configNote.hidden = false;
} else {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    loginFeedback.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Entrando…";

    const email = document.querySelector("#admin-email").value.trim();
    const password = document.querySelector("#admin-password").value;

    try {
      const { data, error } = await cliente.auth.signInWithPassword({ email: email, password: password });
      if (error) throw error;
      await abrirPainel(data.session);
    } catch (error) {
      console.error("Falha no login do painel:", error);
      loginFeedback.textContent = "Não consegui entrar. Confira o e-mail e a senha da Bianca.";
    } finally {
      loginButton.disabled = false;
      loginButton.innerHTML = 'Entrar no painel <span aria-hidden="true">→</span>';
    }
  });

  logoutButton.addEventListener("click", async function () {
    await cliente.auth.signOut();
    mostrarLogin();
  });

  // Mantém a tela coerente se a sessão expirar ou for encerrada.
  cliente.auth.onAuthStateChange(function (_event, session) {
    if (session) abrirPainel(session);
    else mostrarLogin();
  });

  cliente.auth.getSession().then(function ({ data }) {
    if (data.session) abrirPainel(data.session);
  });
}

function mostrarLogin() {
  dashboard.hidden = true;
  loginSection.hidden = false;
  loginFeedback.textContent = "";
}

// O banco aplica RLS: apenas a conta da Bianca consegue ler estas tabelas.
async function abrirPainel(session) {
  const emailConfigurado = (window.BIANCA_ADMIN_EMAIL || "").toLowerCase();
  const emailLogado = ((session && session.user && session.user.email) || "").toLowerCase();

  if (!emailConfigurado || emailLogado !== emailConfigurado) {
    await cliente.auth.signOut();
    mostrarLogin();
    loginFeedback.textContent = "Esta conta não está autorizada a abrir o painel da Bianca.";
    return;
  }

  // Evita carregar duas vezes quando o login e a restauração da sessão coincidem.
  if (!dashboard.hidden) return;

  loginSection.hidden = true;
  configNote.hidden = true;
  dashboard.hidden = false;
  welcome.textContent = "Olá, Bianca!";
  await Promise.all([carregarRanking(), carregarDeclaracoes()]);
}

async function carregarRanking() {
  rankingList.replaceChildren();
  rankingFeedback.textContent = "";

  const { data, error } = await cliente
    .from("quiz_scores")
    .select("nickname, score, correct_answers, created_at")
    .order("score", { ascending: false })
    .order("correct_answers", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Falha ao carregar ranking:", error);
    rankingFeedback.textContent = "Não foi possível carregar o ranking. Confira as políticas do Supabase.";
    return;
  }

  if (!data.length) {
    adicionarCelula(rankingList, "Ainda não há resultados. Depois dos primeiros quizzes, eles aparecem aqui.", 4);
    return;
  }

  data.forEach(function (item, index) {
    const row = document.createElement("tr");
    [String(index + 1), item.nickname, item.correct_answers + " / 10", item.score + "%"].forEach(function (value) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.append(cell);
    });
    rankingList.append(row);
  });
}

async function carregarDeclaracoes() {
  declarationsList.replaceChildren();
  declarationsFeedback.textContent = "";

  // IMPORTANTE: Certifica-te de que o campo 'id' está incluído no .select() para sabermos qual registo apagar!
  const { data, error } = await cliente
    .from("declarations")
    .select("id, nickname, message, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Falha ao carregar declarações:", error);
    declarationsFeedback.textContent = "Não foi possível carregar as declarações. Confira as políticas do Supabase.";
    return;
  }

  if (!data.length) {
    const empty = document.createElement("p");
    empty.className = "admin-muted";
    empty.textContent = "Ainda não chegaram declarações. 💌";
    declarationsList.append(empty);
    return;
  }

  data.forEach(function (item) {
    const card = document.createElement("article");
    card.className = "declaration-item";
    
    const header = document.createElement("div");
    header.className = "declaration-item__header";
    
    const name = document.createElement("h3");
    name.textContent = item.nickname;
    
    const date = document.createElement("time");
    date.dateTime = item.created_at;
    date.textContent = new Date(item.created_at).toLocaleString("pt-BR");
    
    header.append(name, date);

    const message = document.createElement("p");
    message.textContent = item.message;

    // Botão de excluir
    const deleteButton = document.createElement("button");
    deleteButton.className = "text-button admin-delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "🗑️";
    deleteButton.style.marginTop = "10px";
    deleteButton.style.fontSize = "0.85rem";
    deleteButton.style.color = "#d9534f"; // Tom avermelhado subtil para o botão de apagar

    // Ação ao clicar no botão de excluir
    deleteButton.addEventListener("click", async function () {
      if (confirm(`Tens a certeza de que queres apagar a declaração de ${item.nickname}?`)) {
        await excluirDeclaracao(item.id, card);
      }
    });

    card.append(header, message, deleteButton);
    declarationsList.append(card);
  });
}

// Nova função para remover do Supabase e da tela
async function excluirDeclaracao(id, cardElement) {
  const { error } = await cliente
    .from("declarations")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir declaração:", error);
    declarationsFeedback.textContent = "Não foi possível excluir a declaração.";
    return;
  }

  // Remove o card visualmente da tela sem precisar recarregar a página toda
  cardElement.remove();
  
  // Se a lista ficar vazia, mostra a mensagem de vazio
  if (!declarationsList.children.length) {
    const empty = document.createElement("p");
    empty.className = "admin-muted";
    empty.textContent = "Ainda não chegaram declarações. 💌";
    declarationsList.append(empty);
  }
}

  data.forEach(function (item) {
    const card = document.createElement("article");
    card.className = "declaration-item";
    const header = document.createElement("div");
    header.className = "declaration-item__header";
    const name = document.createElement("h3");
    name.textContent = item.nickname;
    const date = document.createElement("time");
    date.dateTime = item.created_at;
    date.textContent = new Date(item.created_at).toLocaleString("pt-BR");
    const message = document.createElement("p");
    message.textContent = item.message;
    header.append(name, date);
    card.append(header, message);
    declarationsList.append(card);
  });


function adicionarCelula(tbody, texto, colspan) {
  const row = document.createElement("tr");
  const cell = document.createElement("td");
  cell.colSpan = colspan;
  cell.textContent = texto;
  row.append(cell);
  tbody.append(row);
}
