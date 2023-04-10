export const cards = [
    // { Para a criação de um novo card e feita a inserção de dados via objeto
    //     titulo: '',
    //     descricao: '',
    //     tags: [''],
    //     action: () => <CardButton > Exportar Dados </CardButton>
    // }
    {
        titulo: 'Créditos das Unidades Educacionais no período',
        descricao: 'Arquivo com os créditos informados por todas as unidades educacionais no período. Arquivos: creditos_principal.csv e creditos_motivos_estorno.csv.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/creditos/'
    },
    {
        titulo: 'Especificações de materiais e serviços',
        descricao: 'Arquivo com as especificações de materiais e serviços para cadastro de despesas nas unidades educacionais. Arquivos: especificacoes_materiais_servicos.csv e tipos_de_custeio.csv.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/materiais-e-servicos/'
    },
    {
        titulo: 'Saldo final do período',
        descricao: 'Arquivo com valores do saldo final por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/saldos-finais-periodos/'
    }
]