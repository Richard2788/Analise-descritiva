/**
 * Módulo principal para criação modularizada de gráficos Chart.js
 * Gera um conjunto de gráficos por curso (um para cada métrica relevante)
 */

import { buildLineData, getLineOptions, metricLabels } from './chartConfig.js';

const METRICS = ['notaMinima', 'CandidatoPorVaga', 'candidatos', 'vagas'];

/**
 * Cria os gráficos de um único curso dentro de um container
 * @param {Object} curso - dados do curso
 * @param {HTMLElement} container - elemento pai onde os canvas serão inseridos
 * @param {Object} Chart - referência global do Chart.js
 */
export function createChartsForCourse(curso, container, Chart) {
    const section = document.createElement('section');
    section.className = 'course-section';
    section.id = `curso-${curso.id}`;

    const header = document.createElement('div');
    header.className = 'course-header';
    header.innerHTML = `
        <h2>${curso.nome}</h2>
        <p class="modalidade">Modalidade: <strong>${curso.modalidade}</strong></p>
        ${curso.salariosAtuais?.length ? `
            <p class="salario">
                Salário de referência (${curso.salariosAtuais[0].cargo}): 
                <strong>R$ ${curso.salariosAtuais[0].salario.toLocaleString('pt-BR')}</strong>
                <a href="${curso.salariosAtuais[0].referencia}" target="_blank" rel="noopener">fonte</a>
            </p>
        ` : ''}
    `;
    section.appendChild(header);

    const chartsGrid = document.createElement('div');
    chartsGrid.className = 'charts-grid';

    METRICS.forEach(metric => {
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';

        const canvas = document.createElement('canvas');
        canvas.id = `chart-${curso.id}-${metric}`;
        chartWrapper.appendChild(canvas);
        chartsGrid.appendChild(chartWrapper);

        const { labels, datasets } = buildLineData(curso, metric);

        // Só cria o gráfico se houver algum dado válido
        const hasData = datasets.some(ds => ds.data.some(v => v !== null && v !== 0));
        if (!hasData && metric !== 'notaMinima') {
            chartWrapper.style.display = 'none';
            return;
        }

        new Chart(canvas, {
            type: 'line',
            data: { labels, datasets },
            options: getLineOptions(
                `${metricLabels[metric]} — ${curso.nome}`,
                metric
            )
        });
    });

    section.appendChild(chartsGrid);
    container.appendChild(section);
}

/**
 * Cria todos os gráficos para a lista de cursos
 * @param {Array} cursos - array de cursos do db
 * @param {HTMLElement} rootContainer - container raiz
 * @param {Object} Chart - Chart.js
 */
export function createAllCharts(cursos, rootContainer, Chart) {
    // Limpa conteúdo anterior se houver
    rootContainer.innerHTML = '';

    // Navegação rápida
    const nav = document.createElement('nav');
    nav.className = 'course-nav';
    nav.innerHTML = '<strong>Cursos:</strong> ';
    cursos.forEach(c => {
        const link = document.createElement('a');
        link.href = `#curso-${c.id}`;
        link.textContent = c.nome;
        nav.appendChild(link);
        nav.appendChild(document.createTextNode(' · '));
    });
    rootContainer.appendChild(nav);

    cursos.forEach(curso => {
        createChartsForCourse(curso, rootContainer, Chart);
    });
}
