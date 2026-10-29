# Publicar com segurança na Netlify

## 1. Configure os segredos no painel da Netlify

No site do projeto, abra **Project configuration → Environment variables** e cadastre:

- `SUPABASE_URL` = URL do projeto Supabase.
- `SUPABASE_SECRET_KEY` = uma chave `sb_secret_...` criada em **Supabase → Project Settings → API Keys**.

Marque o escopo de **Functions**. Não coloque a chave `sb_secret_...` em arquivos do site, no Git ou em mensagens. A chave `sb_publishable_...` do painel pode continuar no `supabase-config.js`.

## 2. Publique pelo Git ou pela Netlify CLI

As funções do servidor precisam ser implantadas junto do site. Conecte o repositório Git à Netlify ou use a Netlify CLI. Enviar somente os arquivos estáticos por arrastar e soltar não publica as funções.

O `netlify.toml` configura o comando `node build.mjs`; o conteúdo público é preparado em `dist/`. O código das funções fica em `netlify/functions/`, fora dessa pasta.

## 3. Atualize as permissões do Supabase

Depois de configurar a variável secreta, abra `supabase-setup.sql`, copie o arquivo inteiro para o SQL Editor do Supabase e execute. Ele pode ser executado novamente: remove a gravação anônima, preserva a leitura do painel para a Bianca e cria a autorização de declaração de uso único.

## 4. O que os limites fazem

- `/api/quiz-score`: até 10 solicitações por IP em 60 segundos. O servidor confere as dez respostas e calcula os acertos.
- `/api/declaration`: até 3 solicitações por IP em 60 segundos. Exige uma prova assinada emitida após o quiz; cada prova só pode gerar uma declaração.
- O formulário também tem um campo honeypot para filtrar automações simples.

Após o deploy, confira o log de publicação da Netlify para confirmar que as duas regras de rate limit foram reconhecidas. Os limites da Netlify levam alguns segundos para entrar em vigor depois que o limite é ultrapassado.
