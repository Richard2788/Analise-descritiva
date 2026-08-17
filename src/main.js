/**
 * Entry point — Node 24 / Vite
 */
import { db } from './database.js';
import { createAllCharts } from './createCharts.js';

// Chart.js is loaded globally via CDN (window.Chart)
const Chart = window.Chart;

if (!Chart) {
  console.error('Chart.js não foi carregado. Verifique o script no index.html.');
} else {
  const root = document.getElementById('charts-root');
  if (root) {
    createAllCharts(db.cursos, root, Chart);
  }
}
