// Prepara somente os arquivos que podem ser publicados no navegador.
// O código das funções Netlify e os arquivos SQL ficam fora da pasta dist.
import { cp, copyFile, mkdir } from "node:fs/promises";

const arquivosPublicos = [
  "index.html",
  "style.css",
  "script.js",
  "painel-bianca.html",
  "painel-bianca.js",
  "supabase-config.js"
];

await mkdir("dist", { recursive: true });

for (const arquivo of arquivosPublicos) {
  await copyFile(arquivo, `dist/${arquivo}`);
}

await cp("assets", "dist/assets", { recursive: true, force: true });
console.log("Arquivos do site preparados na pasta dist.");
