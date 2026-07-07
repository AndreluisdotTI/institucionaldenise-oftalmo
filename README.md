# Site institucional — Dra. Denise Perillo

Site institucional da Dra. Denise Perillo, oftalmologista especialista em cirurgia de catarata, cirurgia refrativa e lentes premium, em Brasília — DF.

## ⚠️ Sobre a stack (leia antes de importar frameworks)

Este projeto **não usa React, Next.js, Vite ou Tailwind** — é um site **100% estático**, feito em HTML + CSS (inline) + JavaScript vanilla, sem processo de build. Isso é intencional: carrega instantaneamente, não tem dependências para quebrar, e funciona em qualquer host estático (Vercel, Netlify, GitHub Pages) sem nenhuma configuração.

Por isso este projeto **não inclui** `vite.config`, `next.config.js`, `tailwind.config.js`, `tsconfig.json` ou `.env` — nenhuma dessas ferramentas está em uso, e adicionar arquivos de configuração vazios para elas seria enganoso. O `package.json` existe apenas para padronizar os comandos `npm run dev` / `npm run build` (ver abaixo).

## Estrutura

```
.
├── index.html          # Home
├── trajetoria.html      # Trajetória da Dra. Denise
├── tratamentos.html     # Tratamentos (com seletor de lentes interativo)
├── resultados.html      # Depoimentos e números
├── duvidas.html          # Perguntas frequentes
├── contato.html          # Formulário de contato + WhatsApp
├── assets/
│   ├── site.js               # Toda a interatividade (menu, scroll-reveal, contadores, slider, accordion, formulário)
│   ├── logo-emblem.png
│   ├── hero-denise.jpg
│   ├── congresso.jpg
│   ├── video-ceratocone.mp4
│   └── video-lente.mp4
├── package.json
├── vercel.json
└── .gitignore
```

Cada página HTML é independente e autocontida (cabeçalho, rodapé e botão de WhatsApp duplicados em cada arquivo — padrão comum em sites estáticos sem etapa de build).

## Rodando localmente

Não há dependências reais para instalar, mas `npm install` funciona sem erros (não há pacotes declarados). Para servir o site localmente:

```bash
npm install
npm run dev
```

Isso sobe um servidor estático em `http://localhost:3000` (via `npx serve`). Você também pode simplesmente abrir `index.html` direto no navegador.

`npm run build` não faz nada além de imprimir uma mensagem — não existe passo de build a executar.

## Deploy na Vercel

1. Suba esta pasta para um repositório no GitHub.
2. Na Vercel, clique em **New Project** → importe o repositório.
3. Em **Framework Preset**, selecione **Other** (ou deixe a detecção automática — o `vercel.json` já cobre o essencial).
4. **Build Command**: deixe em branco ou `npm run build` (não faz nada).
5. **Output Directory**: deixe em branco / raiz (`.`).
6. Deploy. Pronto — sem variáveis de ambiente, sem etapas extras.

O `vercel.json` ativa `cleanUrls`, então `/trajetoria` funciona sem precisar digitar `.html`.

## Contato configurado no site

- WhatsApp: +55 61 99509-2732
- E-mail do formulário de contato: denisedpoftalmo@gmail.com
- Endereço: Clínica Medplus — QN 5A, Conjunto 2, Lote 7, Riacho Fundo II, Brasília · DF (em frente à Administração Regional do Riacho Fundo 2)

## Personalizando

- **Textos e imagens**: edite diretamente o HTML de cada página (estilos são inline, sem classes CSS externas a rastrear, exceto os estados `:hover`, que ficam num `<style>` no `<head>` de cada página).
- **Comportamento (scroll-reveal, slider, accordion, formulário)**: tudo centralizado em `assets/site.js`.
- **Redes sociais**: os ícones de Instagram/LinkedIn no rodapé e na página de Contato apontam para `href="#"` — troque pelos links reais quando disponíveis.
