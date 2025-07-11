export const mockNotificacoes = [
    {
        data: "Segunda 09 Dez. 2024",
        infos: [
            {
                uuid: "5f7892eb-9d0a-4c81-871a-37eca17863fe",
                titulo: "Ajustes necessários na PC | Prazo: 09/12/2024",
                descricao: "A DRE solicitou alguns ajustes em sua prestação de contas do período 2023.2. O seu prazo para envio das mudanças é 09/12/2024",
                lido: false,
                hora: "15:25",
                tipo: "Alerta",
                remetente: "DRE",
                categoria: "Devolução de PC para ajustes",
                unidade: "cd6572b3-03cb-41c4-9cf3-39dcdad09543",
                periodo: null
            },
            {
                uuid: "02a25c89-2d95-42a6-9d24-827257d9f51b",
                titulo: "Ajustes necessários na PC | Prazo: 10/12/2024",
                descricao: "A DRE solicitou alguns ajustes em sua prestação de contas do período 2023.2. O seu prazo para envio das mudanças é 10/12/2024",
                lido: true,
                hora: "15:13",
                tipo: "Alerta",
                remetente: "DRE",
                categoria: "Devolução de PC para ajustes",
                unidade: "cd6572b3-03cb-41c4-9cf3-39dcdad09543",
                periodo: null
            }
        ]
    }
]

export const mockTiposNotificacoes = [
    {
        "id": "ALERTA",
        "nome": "Alerta"
    },
    {
        "id": "INFORMACAO",
        "nome": "Informação"
    },
    {
        "id": "URGENTE",
        "nome": "Urgente"
    },
    {
        "id": "AVISO",
        "nome": "Aviso"
    }
]

export const mockRemetentes = [
    {
        "id": "SISTEMA",
        "nome": "Sistema"
    },
    {
        "id": "DRE",
        "nome": "DRE"
    },
    {
        "id": "ASSOCIACAO",
        "nome": "Associação"
    },
    {
        "id": "SME",
        "nome": "SME"
    }
]

export const mockCategorias = [
    {
        "id": "COMENTARIO_PC",
        "nome": "Comentário na prestação de contas"
    },
    {
        "id": "ELABORACAO_PC",
        "nome": "Elaboração de PC"
    },
    {
        "id": "ANALISE_PC",
        "nome": "Análise de PC"
    },
    {
        "id": "DEVOLUCAO_PC",
        "nome": "Devolução de PC para ajustes"
    },
    {
        "id": "APROVACAO_PC",
        "nome": "Aprovação de PC"
    },
    {
        "id": "APROVACAO_RESSALVAS_PC",
        "nome": "Aprovação de PC com ressalvas"
    },
    {
        "id": "REPROVACAO_PC",
        "nome": "Reprovação de PC"
    },
    {
        "id": "ERRO_AO_CONCLUIR_PC",
        "nome": "Erro ao concluir PC"
    },
    {
        "id": "DEVOLUCAO_CONSOLIDADO",
        "nome": "Devolução de relatório consolidado"
    },
    {
        "id": "COMENTARIO_CONSOLIDADO_DRE",
        "nome": "Comentário no relatório consolidado"
    },
    {
        "id": "ENCERRAMENTO_CONTA_BANCARIA",
        "nome": "Encerramento de Conta Bancária"
    },
    {
        "id": "GERACAO_ATA",
        "nome": "Geração de Ata"
    },
    {
        "id": "CONCLUSAO_PC",
        "nome": "Conclusão da PC"
    }
]

export const mockTabelaNotificacoes = {
    "tipos_notificacao": mockTiposNotificacoes,
    "remetentes": mockRemetentes,
    "categorias": mockCategorias
}