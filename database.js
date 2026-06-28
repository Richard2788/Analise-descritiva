/*
    ____________UEPG____________
    export const db = {
    cursos: [
        {
            id: 1,
            nome: 'Curso',
            modalidade: 'Modalidade',
            salarioMedioAtual: [
                {
                    cargo: 'Cargo',
                    salario: 0.00
                }
            ],
            cotas: {
                2025: [
                    {
                        tipo: 'Publica',
                        vagas: 0,
                        candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                    {
                        tipo: 'Negros',
                        vagas: 0,
                        candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                    {
                        tipo: 'negrosPublica',
                        vagas: 0,
                        candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                    {
                        tipo: 'Universal',
                        vagas: 0, candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                ]
            }
        }
    ]
}

    ____________UTFPR-PG____________
    {
            id: 1,
            nome: 'Curso',
            modalidade: 'Modalidade',
            salarioMedioAtual: [
                {
                    cargo: 'Cargo',
                    salario: 0.00
                }
            ],
            cotas: {
                2025: [
                    {
                        tipo: 'brPublica',
                        vagas: 0,
                        candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                    {
                        tipo: 'brNegros',
                        vagas: 0,
                        candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                    {
                        tipo: 'irPublica',
                        vagas: 0,
                        candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                    {
                        tipo: 'irNegros',
                        vagas: 0, candidatos: 0,
                        CandidatoPorVaga: 0.123,
                        notaMinima: 1234
                    },
                ]
            }
        }
*/

export const db = {
  cursos: [
    {
      id: 1,
      nome: "Curso",
      modalidade: "Modalidade",
      salarioMedioAtual: [
        {
          cargo: "Cargo",
          salario: 0.0,
        },
      ],
      cotas: {
        2025: [
          {
            tipo: "Publica",
            vagas: 0,
            candidatos: 0,
            CandidatoPorVaga: 0.123,
            notaMinima: 1234,
          },
          {
            tipo: "negrosPublica",
            vagas: 0,
            candidatos: 0,
            CandidatoPorVaga: 0.123,
            notaMinima: 1234,
          },
          {
            tipo: "Universal",
            vagas: 0,
            candidatos: 0,
            CandidatoPorVaga: 0.123,
            notaMinima: 1234,
          },
        ],
      },
    },
  ],
};
