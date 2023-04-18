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
    },
    {
        titulo: 'Prestações de contas: Relação de bens',
        descricao: 'Arquivo com informações da relação de bens das prestações de contas por conta, período e unidade. ',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/relacao-bens/'
    },
    {
        titulo: 'Prestações de contas: Status',
        descricao: 'Arquivo com informações do status das prestações de contas por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/status-prestacoes-contas/'
    },
    {
        titulo: 'Prestações de contas: Devolução ao tesouro',
        descricao: 'Arquivo com informações de devolução ao tesouro das prestações de contas por período e unidade',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/devolucao-ao-tesouro-prestacoes-contas/'
    },
    {
        titulo: 'Prestações de contas: Atas',
        descricao: 'Arquivo com informações das atas de reuniões relativas às prestações de contas, por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/atas-prestacoes-contas/'
    },
    {
        titulo: 'Despesas: Classificação das despesas',
        descricao: 'Arquivo com informações de despesas (item de despesa classificado) por conta, período e unidade. ',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/rateios/'
    },
    {
        titulo: 'Prestações de contas: Demonstrativos',
        descricao: 'Arquivo com informações dos demonstrativos financeiros das prestações de contas por conta, período e unidade. ',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/demonstrativos-financeiros/'
    },
    {
        titulo: 'Despesas: Documentos',
        descricao: 'Arquivo com informações de despesas por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/documentos-despesas/'
    },
]