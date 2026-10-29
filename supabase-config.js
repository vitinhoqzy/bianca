// Configuração pública do Supabase usada pelo navegador.
// O e-mail autorizado é o que você informou para a conta da Bianca.
// Troque a URL e a chave pública abaixo pelos dados do seu projeto Supabase.
// A chave publishable pode ficar no site quando as políticas RLS estiverem ativas.
// Nunca coloque aqui a chave secreta (secret/service_role).
window.BIANCA_ADMIN_EMAIL = "realeden71@gmail.com";

(function configurarSupabase() {
  const url = "https://vdtteagcveitxwuqgftg.supabase.co";
  const chavePublica = "sb_publishable_lh-1hzYNN7EhCgdpSWe-XA_5m0mKj6n";

  const configuracaoPendente =
    url.startsWith("COLE_AQUI") ||
    chavePublica.startsWith("COLE_AQUI") ||
    window.BIANCA_ADMIN_EMAIL.startsWith("COLOQUE_AQUI");

  if (!window.supabase || configuracaoPendente) {
    window.biancaSupabaseClient = null;
    return;
  }

  window.biancaSupabaseClient = window.supabase.createClient(url, chavePublica);
})();
