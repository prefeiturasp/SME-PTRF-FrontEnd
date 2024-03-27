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
        endpoint: '/api/exportacoes-dados/creditos/',
        visao: ['SME']
    },
    {
        titulo: 'Especificações de materiais e serviços',
        descricao: 'Arquivo com as especificações de materiais e serviços para cadastro de despesas nas unidades educacionais. Arquivos: especificacoes_materiais_servicos.csv e tipos_de_custeio.csv.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/materiais-e-servicos/',
        visao: ['SME']
    },
    {
        titulo: 'Saldo final do período',
        descricao: 'Arquivo com valores do saldo final por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/saldos-finais-periodos/',
        visao: ['DRE', 'SME']
    },
    {
        titulo: 'Prestações de contas: Relação de bens',
        descricao: 'Arquivo com informações da relação de bens das prestações de contas por conta, período e unidade. ',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/relacao-bens/',
        visao: ['SME']
    },
    {
        titulo: 'Prestações de contas: Status',
        descricao: 'Arquivo com informações do status das prestações de contas por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/status-prestacoes-contas/',
        visao: ['DRE', 'SME']
    },
    {
        titulo: 'Prestações de contas: Devolução ao tesouro',
        descricao: 'Arquivo com informações de devolução ao tesouro das prestações de contas por período e unidade',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/devolucao-ao-tesouro-prestacoes-contas/',
        visao: ['SME']
    },
    {
        titulo: 'Prestações de contas: Atas',
        descricao: 'Arquivo com informações das atas de reuniões relativas às prestações de contas, por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/atas-prestacoes-contas/',
        visao: ['SME']
    },
    {
        titulo: 'Despesas: Classificação das despesas',
        descricao: 'Arquivo com informações de despesas (item de despesa classificado) por conta, período e unidade. ',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/rateios/',
        visao: ['SME']
    },
    {
        titulo: 'Prestações de contas: Demonstrativos',
        descricao: 'Arquivo com informações dos demonstrativos financeiros das prestações de contas por conta, período e unidade. ',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/demonstrativos-financeiros/',
        visao: ['SME']
    },
    {
        titulo: 'Despesas: Documentos',
        descricao: 'Arquivo com informações de despesas por período e unidade.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/documentos-despesas/',
        visao: ['SME']
    },
    {
        titulo: 'Dados das contas',
        descricao: 'Arquivo com dados das contas das associações.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/contas-associacao/',
        visao: ['SME']
    },
    {
        titulo: 'Repasses',
        descricao: 'Arquivo com dados dos repasses pendentes e realizados para as associações.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/repasses/',
        visao: ['SME']
    },
    {
        titulo: 'Membros da APM',
        descricao: 'Arquivo com dados dos membros das associações.',
        tags: ['CSV'],
        endpoint: '/api/exportacoes-dados/dados_membros_apm/',
        visao: ['SME']
    },
]