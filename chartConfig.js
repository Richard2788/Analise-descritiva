/**
 * Configurações e utilitários para gráficos Chart.js
 * Estrutura modularizada para visualização de dados de cotas por curso
 */

export const chartColors = {
    Publica: 'rgb(54, 162, 235)',
    negrosPublica: 'rgb(255, 99, 132)',
    Negros: 'rgb(255, 159, 64)',
    Universal: 'rgb(75, 192, 192)',
    brPublica: 'rgb(54, 162, 235)',
    brNegros: 'rgb(255, 99, 132)',
    irPublica: 'rgb(153, 102, 255)',
    irNegros: 'rgb(255, 159, 64)',
    amConcorrencia: 'rgb(75, 192, 192)'
};

export const metricLabels = {
    notaMinima: 'Nota Mínima',
    CandidatoPorVaga: 'Candidatos por Vaga',
    candidatos: 'Número de Candidatos',
    vagas: 'Número de Vagas'
};

/**
 * Extrai anos únicos de um curso, ordenados
 */
export function getYears(curso) {
    return curso.cotas.map(c => c.ano).sort((a, b) => a - b);
}

/**
 * Extrai todos os tipos de cota únicos de um curso
 */
export function getTiposCota(curso) {
    const tipos = new Set();
    curso.cotas.forEach(ano => {
        ano.tipoCota.forEach(t => tipos.add(t.tipo));
    });
    return Array.from(tipos);
}

/**
 * Monta dados para um gráfico de linha: anos no eixo X, valores de uma métrica no Y
 * @param {Object} curso - objeto do curso
 * @param {string} metric - 'notaMinima' | 'CandidatoPorVaga' | 'candidatos' | 'vagas'
 * @returns {Object} datasets e labels prontos para Chart.js
 */
export function buildLineData(curso, metric) {
    const years = getYears(curso);
    const tipos = getTiposCota(curso);

    const datasets = tipos.map(tipo => {
        const data = years.map(ano => {
            const anoData = curso.cotas.find(c => c.ano === ano);
            if (!anoData) return null;
            const tipoData = anoData.tipoCota.find(t => t.tipo === tipo);
            return tipoData ? tipoData[metric] : null;
        });

        return {
            label: tipo,
            data,
            borderColor: chartColors[tipo] || `hsl(${Math.random() * 360}, 70%, 50%)`,
            backgroundColor: (chartColors[tipo] || `hsl(${Math.random() * 360}, 70%, 50%)`).replace('rgb', 'rgba').replace(')', ', 0.1)'),
            tension: 0.2,
            fill: false,
            spanGaps: true
        };
    });

    return {
        labels: years.map(String),
        datasets
    };
}

/**
 * Opções padrão de gráfico de linha
 */
export function getLineOptions(title, metric) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: title,
                font: { size: 16 }
            },
            legend: {
                position: 'bottom',
                labels: { boxWidth: 12, padding: 10 }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Ano'
                }
            },
            y: {
                title: {
                    display: true,
                    text: metricLabels[metric] || metric
                },
                beginAtZero: metric !== 'notaMinima'
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };
}
