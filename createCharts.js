/**
 * Módulo principal para criação modularizada de gráficos Chart.js
 * Gera um conjunto de gráficos por curso + modal de expansão com seletor de métrica
 */

import { buildLineData, getLineOptions, metricLabels } from './chartConfig.js';

export const METRICS = ['notaMinima', 'CandidatoPorVaga', 'candidatos', 'vagas'];

/** Instância atual do gráfico dentro do modal (para destruir/recriar) */
let modalChartInstance = null;
/** Curso atualmente aberto no modal */
let currentModalCurso = null;

/**
 * Cria os gráficos de um único curso dentro de um container
 */
export function createChartsForCourse(curso, container, Chart) {
    const section = document.createElement('section');
    section.className = 'course-section card shadow-sm mb-4';
    section.id = `curso-${curso.id}`;

    // Header com título + botão de expandir (modal)
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
                    <a href="${curso.salariosAtuais[0].referencia}" target="_blank" rel="noopener" class="ms-1">Fonte</a>
                </p>
            ` : ''}
        </div>
        <button type="button"
                class="btn btn-outline-primary btn-sm d-flex align-items-center gap-1"
                data-bs-toggle="modal"
                data-bs-target="#chartModal"
                data-curso-id="${curso.id}"
                title="Expandir gráficos">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/>
            </svg>
            Expandir
        </button>
    `;
    section.appendChild(header);

    const chartsGrid = document.createElement('div');
    chartsGrid.className = 'charts-grid card-body';

    METRICS.forEach(metric => {
        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-wrapper';

        const canvas = document.createElement('canvas');
        canvas.id = `chart-${curso.id}-${metric}`;
        chartWrapper.appendChild(canvas);
        chartsGrid.appendChild(chartWrapper);

        const { labels, datasets } = buildLineData(curso, metric);

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
 * Renderiza (ou atualiza) o gráfico individual no modal
 */
function renderModalChart(curso, metric, Chart) {
    const canvas = document.getElementById('modalChartCanvas');
    if (!canvas) return;

    // Destrói instância anterior para evitar vazamento de memória
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
                    font: { size: 18 }
                },
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 14, padding: 12, font: { size: 13 } }
                }
            }
        }
    });

    // Atualiza título do modal e análise
    document.getElementById('chartModalLabel').textContent = curso.nome;
    document.getElementById('modalAnalise').textContent = curso.analise || 'Análise ainda não definida.';

    // Destaca o botão da métrica ativa
    document.querySelectorAll('#metricSelector .btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.metric === metric);
    });
}

/**
 * Monta os botões de seleção de métrica no modal
 */
function buildMetricSelector(curso, Chart) {
    const container = document.getElementById('metricSelector');
    container.innerHTML = '';

    METRICS.forEach(metric => {
        // Verifica se a métrica tem dados úteis
        const { datasets } = buildLineData(curso, metric);
        const hasData = datasets.some(ds => ds.data.some(v => v !== null && v !== 0));
        if (!hasData && metric !== 'notaMinima') return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-outline-secondary btn-sm';
        btn.dataset.metric = metric;
        btn.textContent = metricLabels[metric];
        btn.addEventListener('click', () => {
            renderModalChart(curso, metric, Chart);
        });
        container.appendChild(btn);
    });
}

/**
 * Inicializa o modal (chamado uma vez após criar os cursos)
 */
export function setupModal(cursos, Chart) {
    const modalEl = document.getElementById('chartModal');
    if (!modalEl) return;

    // Quando o modal abre, carrega o curso correspondente
    modalEl.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const cursoId = Number(button.getAttribute('data-curso-id'));
        const curso = cursos.find(c => c.id === cursoId);
        if (!curso) return;

        currentModalCurso = curso;
        buildMetricSelector(curso, Chart);
        // Abre com a primeira métrica disponível (notaMinima)
        renderModalChart(curso, 'notaMinima', Chart);
    });

    // Limpa o gráfico ao fechar o modal
    modalEl.addEventListener('hidden.bs.modal', () => {
        if (modalChartInstance) {
            modalChartInstance.destroy();
            modalChartInstance = null;
        }
        currentModalCurso = null;
    });
}

/**
 * Cria todos os gráficos para a lista de cursos
 */
export function createAllCharts(cursos, rootContainer, Chart) {
    rootContainer.innerHTML = '';

    // Navegação rápida
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

    cursos.forEach(curso => {
        createChartsForCourse(curso, rootContainer, Chart);
    });

    // Configura o modal reutilizável
    setupModal(cursos, Chart);
}
