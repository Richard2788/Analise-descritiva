# Análise de Cotas por Curso

Gráficos interativos (Chart.js + Bootstrap 5) com dados de cotas por curso.

## Requisitos

- **Node.js 24+** (`engines` no `package.json`)
- Navegador moderno com suporte a ES modules

## Desenvolvimento local

```bash
npm start
# ou
npx serve .
```

Abra a URL indicada (ex.: `http://localhost:5173`).

Com Vite (opcional):

```bash
npm install
npx vite
```

## GitHub Pages

1. Faça deploy da pasta do projeto (ou `dist/` se usar `vite build`).
2. Paths relativos (`./src/main.js` e `base: './'` no Vite) evitam quebra em repositórios publicados em subpath (`username.github.io/repo/`).
3. Se o site **não** estiver na raiz do domínio Pages, no `vite.config.js` use:
   ```js
   base: '/nome-do-repositorio/'
   ```

## Uso

- **Clique em qualquer gráfico** da listagem → abre o modal naquela métrica.
- Botão **Expandir** → abre o modal (padrão: Nota Mínima).
- No modal, use os botões horizontais para trocar o tipo de gráfico.
- A **análise** do curso aparece **somente** no modal.

## Estrutura

```
index.html          # UI + Bootstrap + Chart.js (CDN)
src/
  main.js           # entry point
  database.js       # dados
  chartConfig.js    # cores, labels, buildLineData
  createCharts.js   # listagem + modal
package.json        # Node >= 24
vite.config.js      # opcional (build)
```
