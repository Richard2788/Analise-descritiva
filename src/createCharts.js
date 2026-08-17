/**
 * Criação modularizada de gráficos Chart.js
 * Listagem + modal de expansão com seletor de métrica
 * Compatível com bundlers (Vite) e Node 24+
 */

import { buildLineData, getLineOptions, metricLabels } from './chartConfig.js';

export const METRICS = ['notaMinima', 'CandidatoPorVaga', 'candidatos', 'vagas'];

/** @type {import('chart.js').Chart | null} */
let modalChartInstance = null;

/**
 * Cria os gráficos de um único curso
 * @param {object} curso
 * @param {HTMLElement} container
 * @param {typeof import('chart.js').Chart} Chart
 */
export function createChartsForCourse(curso, container, Chart) {
    const section = document.createElement('section');
    section.className = 'course-section card shadow-sm mb-4';
    section.id = `curso-${curso.id}`;

    const header = document.createElement('div');
    header.className = 'course-header card-header bg-white d-flex justify-content-between align-items-start flex-wrap gap-2';
    header.innerHTML = `
        <div>
            <h2 class="h4 mb-1">${curso.nome}</h2>
            <p class="modalidade text-muted mb-1 small">Modalidade: <strong>${curso.modalidade}</strong></p>
            ${curso.salariosAtuais?.length ? `
                <p class="salario text-muted small mb-0">
                    Salário de referência (${curso.salariosAtuais[0].cargo}):
                    <strong>R$ ${curso.salariosAtuais[0].salario.toLocaleString('pt-BR')}</strong>
                    <a href="${curso.salariosAtuais[0].referencia}" target="_blank" rel="noopener" class="ms-1">fonte</a>
                </p>
            ` : ''}
        </div>
        <button type="button"
                class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                data-bs-toggle="modal"
                data-bs-target="#chartModal"
                data-curso-id="${curso.id}"
                data-metric="notaMinima"
                title="Expandir gráficos">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
            Expandir
        </button>
    `;
    section.appendChild(header);

    const chartsGrid = document.createElement('div');
    chartsGrid.className = 'charts-grid card-body';

    for (const metric of METRICS) {
        const { labels, datasets } = buildLineData(curso, metric);
        const hasData = datasets.some((ds) => ds.data.some((v) => v !== null && v !== 0));

        if (!hasData && metric !== 'notaMinima') continue;

        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper chart-clickable';
        chartWrapper.setAttribute('role', 'button');
        chartWrapper.setAttribute('tabindex', '0');
        chartWrapper.setAttribute('aria-label', `Abrir gráfico de ${metricLabels[metric]} de ${curso.nome}`);
        chartWrapper.dataset.bsToggle = 'modal';
        chartWrapper.dataset.bsTarget = '#chartModal';
        chartWrapper.dataset.cursoId = String(curso.id);
        chartWrapper.dataset.metric = metric;
        chartWrapper.title = 'Clique para expandir';

        const canvas = document.createElement('canvas');
        canvas.id = `chart-${curso.id}-${metric}`;
        chartWrapper.appendChild(canvas);
        chartsGrid.appendChild(chartWrapper);

        new Chart(canvas, {
            type: 'line',
            data: { labels, datasets },
            options: getLineOptions(`${metricLabels[metric]} — ${curso.nome}`, metric),
        });
    }

    section.appendChild(chartsGrid);
    container.appendChild(section);
}

/**
 * Renderiza (ou atualiza) o gráfico individual no modal
 */
function renderModalChart(curso, metric, Chart) {
    const canvas = document.getElementById('modalChartCanvas');
    if (!canvas) return;

    if (modalChartInstance) {
        modalChartInstance.destroy();
        modalChartInstance = null;
    }

    const { labels, datasets } = buildLineData(curso, metric);

    modalChartInstance = new Chart(canvas, {
        type: 'line',
        data: { labels, datasets },
        options: {
            ...getLineOptions(`${metricLabels[metric]} — ${curso.nome}`, metric),
            plugins: {
                ...getLineOptions('', metric).plugins,
                title: {
                    display: true,
                    text: `${metricLabels[metric]} — ${curso.nome}`,
                    font: { size: 18 },
                },
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 14, padding: 12, font: { size: 13 } },
                },
            },
        },
    });

    const titleEl = document.getElementById('chartModalLabel');
    const analiseEl = document.getElementById('modalAnalise');
    if (titleEl) titleEl.textContent = curso.nome;
    if (analiseEl) analiseEl.textContent = curso.analise || 'Análise ainda não definida.';

    document.querySelectorAll('#metricSelector .btn').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.metric === metric);
    });
}

/**
 * Monta os botões de seleção de métrica no modal
 */
function buildMetricSelector(curso, Chart) {
    const container = document.getElementById('metricSelector');
    if (!container) return;
    container.innerHTML = '';

    for (const metric of METRICS) {
        const { datasets } = buildLineData(curso, metric);
        const hasData = datasets.some((ds) => ds.data.some((v) => v !== null && v !== 0));
        if (!hasData && metric !== 'notaMinima') continue;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-secondary btn-sm';
        btn.dataset.metric = metric;
        btn.textContent = metricLabels[metric];
        btn.addEventListener('click', () => {
            renderModalChart(curso, metric, Chart);
        });
        container.appendChild(btn);
    }
}

/**
 * Inicializa o modal (uma vez)
 * relatedTarget pode ser o botão "Expandir" ou o .chart-wrapper clicado
 */
export function setupModal(cursos, Chart) {
    const modalEl = document.getElementById('chartModal');
    if (!modalEl) return;

    modalEl.addEventListener('show.bs.modal', (event) => {
        const trigger = event.relatedTarget;
        if (!trigger) return;

        const cursoId = Number(trigger.getAttribute('data-curso-id') || trigger.dataset.cursoId);
        const metric = trigger.getAttribute('data-metric') || trigger.dataset.metric || 'notaMinima';
        const curso = cursos.find((c) => c.id === cursoId);
        if (!curso) return;

        buildMetricSelector(curso, Chart);
        renderModalChart(curso, metric, Chart);
    });

    modalEl.addEventListener('hidden.bs.modal', () => {
        if (modalChartInstance) {
            modalChartInstance.destroy();
            modalChartInstance = null;
        }
    });
}

/**
 * Cria todos os gráficos
 */
export function createAllCharts(cursos, rootContainer, Chart) {
    rootContainer.innerHTML = '';

    const nav = document.createElement('nav');
    nav.className = 'course-nav alert alert-light border d-flex flex-wrap align-items-center gap-1 mb-4';
    nav.innerHTML = '<strong class="me-1">Cursos:</strong> ';
    cursos.forEach((c, i) => {
        const link = document.createElement('a');
        link.href = `#curso-${c.id}`;
        link.className = 'text-decoration-none';
        link.textContent = c.nome;
        nav.appendChild(link);
        if (i < cursos.length - 1) {
            nav.appendChild(document.createTextNode(' · '));
        }
    });
    rootContainer.appendChild(nav);

    for (const curso of cursos) {
        createChartsForCourse(curso, rootContainer, Chart);
    }

    setupModal(cursos, Chart);
}