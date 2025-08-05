export const mockPrestacaoContasPropSetStatusPC = {
    excede_tentativas: false
}

export const mockPeriodos = [
    {
        uuid: "f5630a79-6f9f-4060-afb3-d0c86b903aec",
        referencia: "2023.2",
        data_inicio_realizacao_despesas: "2023-05-01",
        data_fim_realizacao_despesas: "2023-08-31",
        referencia_por_extenso: "2° repasse de 2023"
    },
    {
        uuid: "022e2d4c-7b66-45e9-980b-fc9283e825ad",
        referencia: "2023.1",
        data_inicio_realizacao_despesas: "2023-01-01",
        data_fim_realizacao_despesas: "2023-04-30",
        referencia_por_extenso: "1° repasse de 2023"
    }
]

const statusPeriodo = {
    associacao: "a3d73ead-9751-4a0f-b42c-0b96b5ca736b",
    periodo_referencia: "2023.2",
    aceita_alteracoes: true,
    prestacao_contas_status: {
        periodo_encerrado: true,
        documentos_gerados: false,
        pc_requer_conclusao: true,
        status_prestacao: "NAO_APRESENTADA",
        texto_status: "Período finalizado. Documentos pendentes de geração.",
        periodo_bloqueado: false,
        legenda_cor: 3,
        prestacao_de_contas_uuid: null,
        requer_retificacao: false,
        tem_acertos_pendentes: false
    },
    prestacao_conta: "",
    gerar_ou_editar_ata_apresentacao: true,
    gerar_ou_editar_ata_retificacao: false,
    gerar_previas: true,
    pendencias_cadastrais: null,
    tem_conta_encerrada_com_saldo: false,
    tipos_das_contas_encerradas_com_saldo: []
}

export const mockStatusPeriodoCondicaoIrParaDadosAssociacao = {
    ...statusPeriodo,
    pendencias_cadastrais: {
        dados_associacao: { // pendencias de Dados de Associacao
            pendencia_cadastro: true,
            pendencia_membros: false,
            pendencia_contas: false,
            pendencia_novo_mandato: false
        },
        conciliacao_bancaria: null
    }
}

export const mockStatusPeriodoCondicaoIrParaConciliacaoBancaria = {
    ...statusPeriodo,
    pendencias_cadastrais: {
        conciliacao_bancaria: {
            contas_pendentes: ["uuid-1", "uuid-2"]
         } // Pendência de conciliação bancária
    }
}

export const mockStatusPeriodoCondicaoSemPendencia = {
    ...statusPeriodo,
    pendencias_cadastrais: null
}

export const mockStatusPeriodoCondicaoAmbasPendencias = {
    ...statusPeriodo,
    pendencias_cadastrais: {
        dados_associacao: mockStatusPeriodoCondicaoIrParaDadosAssociacao.pendencias_cadastrais.dados_associacao,
        conciliacao_bancaria: mockStatusPeriodoCondicaoIrParaConciliacaoBancaria.pendencias_cadastrais.conciliacao_bancaria
    }
}

export const mockContasAtivas = [
    {
        nome: "Cartão",
        status: "ATIVA",
        uuid: "78eaeda1-e1ac-4a4f-b34e-2810a33d194b"
    },
    {
        nome: "Cheque",
        status: "ATIVA",
        uuid: "d521e5bc-ab53-4593-8399-03d14259e084"
    }
]

export const mockAta = {
    uuid: 'uuid-ata',
    nome: 'Ata Apresentação',
    alterado_em: '2025-07-20T12:00:00',
    completa: true
}

export const mockContasAssociacoes = [
    {
      uuid: 'c1',
      nome: 'Conta Corrente',
      solicitacao_encerramento: {
        data_de_encerramento_na_agencia: '2025-06-01',
      },
    },
    {
      uuid: 'c2',
      nome: 'Conta Ativa',
      solicitacao_encerramento: null,
    },
]