export const mockTabelaArquivos = {
    status: [
        {
            id: "PENDENTE",
            nome: "Pendente"
        },
        {
            id: "SUCESSO",
            nome: "Sucesso"
        },
        {
            id: "ERRO",
            nome: "Erro"
        },
        {
            id: "PROCESSADO_COM_ERRO",
            nome: "Processado com erro"
        },
        {
            id: "PROCESSANDO",
            nome: "Processando..."
        }
    ],
    tipos_cargas: [
        {
            id: "REPASSE_REALIZADO",
            nome: "Repasses realizados",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_PERIODO_INICIAL",
            nome: "Carga período inicial",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "REPASSE_PREVISTO",
            nome: "Repasses previstos",
            requer_periodo: true,
            requer_tipo_de_conta: true
        },
        {
            id: "CARGA_ASSOCIACOES",
            nome: "Carga de Associações",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_CONTAS_ASSOCIACOES",
            nome: "Carga de Contas de Associações",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_USUARIOS",
            nome: "Carga de usuários",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_CENSO",
            nome: "Carga de censo",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_REPASSE_PREVISTO_SME",
            nome: "Repasses previstos sme",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_DEVOLUCAO_TESOURO",
            nome: "Devoluções ao Tesouro",
            requer_periodo: false,
            requer_tipo_de_conta: false
        },
        {
            id: "CARGA_MATERIAIS_SERVICOS",
            nome: "Especificações de Materiais e Serviços",
            requer_periodo: false,
            requer_tipo_de_conta: false
        }
    ],
    tipos_delimitadores: [
        {
            id: "DELIMITADOR_PONTO_VIRGULA",
            nome: "Delimitador ponto e vírgula"
        },
        {
            id: "DELIMITADOR_VIRGULA",
            nome: "Delimitador vírgula"
        }
    ]
}


export const mockListaArquivos = [
    {
        id: 20,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-06T11:02:58.988854",
        alterado_em: "2025-02-06T11:03:02.654774",
        uuid: "6c672a11-1fe7-449c-ae9c-da0d96d5891c",
        identificador: "carga_16",
        conteudo: "http://localhost:8000/media/acoes_associacoes_T5yL7dd.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "SUCESSO",
        log: "\n3 linha(s) importada(s) com sucesso. 0 erro(s) reportado(s).",
        ultima_execucao: "2025-02-06T11:03:02.550837"
    },
    {
        id: 19,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-06T11:01:44.172933",
        alterado_em: "2025-02-06T11:01:54.342090",
        uuid: "506c4368-9ecd-4930-b509-d4780e087365",
        identificador: "carga_15",
        conteudo: "http://localhost:8000/media/acoes_associacoes_LC7PFRz.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "SUCESSO",
        log: "\n2 linha(s) importada(s) com sucesso. 0 erro(s) reportado(s).",
        ultima_execucao: "2025-02-06T11:01:54.265290"
    },
    {
        id: 17,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T11:39:39.936093",
        alterado_em: "2025-02-05T11:39:49.603311",
        uuid: "acc01e42-1c6b-4873-abb8-65159db8cea5",
        identificador: "carga_13",
        conteudo: "http://localhost:8000/media/acoes_associacoes_fRPtBll.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "ERRO",
        log: "\nLinha:1 Houve um erro na carga dessa linha: Ação não existe\nLinha:2 Houve um erro na carga dessa linha: Ação não existe\n0 linha(s) importada(s) com sucesso. 2 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T11:39:49.570176"
    },
    {
        id: 16,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T11:31:17.439953",
        alterado_em: "2025-02-05T11:39:13.408444",
        uuid: "b3e37558-5969-4465-8f6c-75eed0ee2dae",
        identificador: "carga_12",
        conteudo: "http://localhost:8000/media/acoes_associacoes_UGGbNtx.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "ERRO",
        log: "\nLinha:1 Houve um erro na carga dessa linha:Ação não existe\nLinha:2 Houve um erro na carga dessa linha:Ação não existe\n0 linha(s) importada(s) com sucesso. 2 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T11:31:31.818816"
    },
    {
        id: 21,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T11:12:43.879643",
        alterado_em: "2025-02-05T11:12:56.260073",
        uuid: "ec16213f-9d9c-4ba1-9612-3205386083e5",
        identificador: "carga_contas_associacoes",
        conteudo: "http://localhost:8000/media/contas_associacoes_JBK5n8C.csv",
        tipo_carga: "CARGA_CONTAS_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "PROCESSANDO",
        log: "",
        ultima_execucao: "2025-02-05T11:12:56.155804"
    },
    {
        id: 14,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T11:11:24.671906",
        alterado_em: "2025-02-05T11:11:41.780899",
        uuid: "64fefc26-b76a-4577-af49-ac39604b2639",
        identificador: "carga_10",
        conteudo: "http://localhost:8000/media/acoes_associacoes_wfmfQIi.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "SUCESSO",
        log: "\n2 linha(s) importada(s) com sucesso. 0 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T11:11:41.675336"
    },
    {
        id: 13,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:46:20.371020",
        alterado_em: "2025-02-05T10:46:31.171302",
        uuid: "5dac2e72-5040-4ff8-8135-fa1fa3e53f30",
        identificador: "carga_9",
        conteudo: "http://localhost:8000/media/acoes_associacoes_nw1MuAr.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "ERRO",
        log: "\nLinha:1 Houve um erro na carga dessa linha:'AcaoAssociacao' object has no attribute 'nome'\nLinha:2 Houve um erro na carga dessa linha:'AcaoAssociacao' object has no attribute 'nome'\n0 linha(s) importada(s) com sucesso. 2 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:46:31.077151"
    },
    {
        id: 12,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:44:44.675839",
        alterado_em: "2025-02-05T10:45:00.107579",
        uuid: "a5a5d1e4-350c-4afb-a425-35e89ba0ec8a",
        identificador: "carga_8",
        conteudo: "http://localhost:8000/media/acoes_associacoes_tUgfQEs.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "SUCESSO",
        log: "\n2 linha(s) importada(s) com sucesso. 0 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:44:55.628543"
    },
    {
        id: 11,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:41:42.140824",
        alterado_em: "2025-02-05T10:44:33.868227",
        uuid: "af36b79f-38af-453c-90fb-44a0d36d0259",
        identificador: "carga_7",
        conteudo: "http://localhost:8000/media/acoes_associacoes_BJmdBRw.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "PROCESSADO_COM_ERRO",
        log: "\nLinha:3 Houve um erro na carga dessa linha:list index out of range\n2 linha(s) importada(s) com sucesso. 1 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:41:54.682250"
    },
    {
        id: 10,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:38:35.445426",
        alterado_em: "2025-02-05T10:41:30.774366",
        uuid: "f233eb90-c480-4852-90e1-53f5b7b14cd4",
        identificador: "carga_6",
        conteudo: "http://localhost:8000/media/acoes_associacoes_f4NAiKR.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "ERRO",
        log: "\nLinha:1 Houve um erro na carga dessa linha:'AcaoAssociacao' object has no attribute 'nome'\nLinha:2 Houve um erro na carga dessa linha:'AcaoAssociacao' object has no attribute 'nome'\nLinha:3 Houve um erro na carga dessa linha:list index out of range\n0 linha(s) importada(s) com sucesso. 3 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:38:48.894596"
    },
    {
        id: 9,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:13:57.026653",
        alterado_em: "2025-02-05T10:38:23.077845",
        uuid: "071a3e56-1d89-4d1f-9531-8760a978240c",
        identificador: "carga_5",
        conteudo: "http://localhost:8000/media/acoes_associacoes_uByMg8R.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "ERRO",
        log: "\nLinha:1 Houve um erro na carga dessa linha:Status ATIVA inválido\nLinha:2 Houve um erro na carga dessa linha:Status INATIVA inválido\nLinha:3 Houve um erro na carga dessa linha:list index out of range\n0 linha(s) importada(s) com sucesso. 3 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:14:09.597252"
    },
    {
        id: 8,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:12:58.570683",
        alterado_em: "2025-02-05T10:13:46.617556",
        uuid: "2f6790c5-436e-4e4e-b054-ddb654c4d6d7",
        identificador: "carga_4",
        conteudo: "http://localhost:8000/media/acoes_associacoes_tfO9Dkk.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "ERRO",
        log: "\nLinha:1 Houve um erro na carga dessa linha:Cannot resolve keyword 'nome_iexact' into field. Choices are: aceita_capital, aceita_custeio, aceita_livre, alterado_em, associacoes_da_acao, criado_em, e_recursos_proprios, history, id, nome, posicao_nas_pesquisas, uuid\nLinha:2 Houve um erro na carga dessa linha:Cannot resolve keyword 'nome_iexact' into field. Choices are: aceita_capital, aceita_custeio, aceita_livre, alterado_em, associacoes_da_acao, criado_em, e_recursos_proprios, history, id, nome, posicao_nas_pesquisas, uuid\nLinha:3 Houve um erro na carga dessa linha:list index out of range\n0 linha(s) importada(s) com sucesso. 3 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:13:10.305515"
    },
    {
        id: 7,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:11:45.133686",
        alterado_em: "2025-02-05T10:12:47.294590",
        uuid: "a00d3dea-be1a-4a70-b423-490259710a7c",
        identificador: "carga_3",
        conteudo: "http://localhost:8000/media/acoes_associacoes_tFxfPZN.csv",
        tipo_carga: "CARGA_ACOES_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "SUCESSO",
        log: "\n2 linha(s) importada(s) com sucesso. 0 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:12:50.515539"
    },
    {
        id: 6,
        periodo: null,
        tipo_de_conta: null,
        criado_em: "2025-02-05T10:11:45.133686",
        alterado_em: "2025-02-05T10:12:47.294590",
        uuid: "a00d3dea-be1a-4a70-b423-49025971047c",
        identificador: "carga_3",
        conteudo: "http://localhost:8000/media/contas_associacoes_tFxfPZN.csv",
        tipo_carga: "CARGA_CONTAS_ASSOCIACOES",
        tipo_delimitador: "DELIMITADOR_PONTO_VIRGULA",
        status: "SUCESSO",
        log: "\nLinha:1 Houve um erro na carga dessa linha:Cannot resolve keyword 'nome_iexact' into field. Choices are: aceita_capital, aceita_custeio, aceita_livre, alterado_em, associacoes_da_acao, criado_em, e_recursos_proprios, history, id, nome, posicao_nas_pesquisas, uuid\nLinha:2 Houve um erro na carga dessa linha:Cannot resolve keyword 'nome_iexact' into field. Choices are: aceita_capital, aceita_custeio, aceita_livre, alterado_em, associacoes_da_acao, criado_em, e_recursos_proprios, history, id, nome, posicao_nas_pesquisas, uuid\nLinha:3 Houve um erro na carga dessa linha:list index out of range\n0 linha(s) importada(s) com sucesso. 3 erro(s) reportado(s).",
        ultima_execucao: "2025-02-05T10:12:50.515539"
    }
]

export const mockPeriodos = [
    {
        "uuid": "d9bc43e3-cfd5-4969-bada-af78d96e8faf",
        "referencia": "2025.1",
        "data_inicio_realizacao_despesas": "2025-01-01",
        "data_fim_realizacao_despesas": "2025-04-30",
        "data_prevista_repasse": null,
        "data_inicio_prestacao_contas": "2025-05-01",
        "data_fim_prestacao_contas": "2025-05-10",
        "editavel": true,
        "periodo_anterior": {
            "uuid": "1e8c492b-2edb-4acd-a808-71bdf0d805d5",
            "referencia": "2024.3",
            "data_inicio_realizacao_despesas": "2024-09-01",
            "data_fim_realizacao_despesas": "2024-12-31",
            "referencia_por_extenso": "3° repasse de 2024"
        }
    },
    {
        "uuid": "d9bc43e3-cfd5-4969-bada-af78d96e8faa",
        "referencia": "2025.2",
        "data_inicio_realizacao_despesas": "2025-07-01",
        "data_fim_realizacao_despesas": "2025-09-30",
        "data_prevista_repasse": null,
        "data_inicio_prestacao_contas": "2025-07-01",
        "data_fim_prestacao_contas": "2025-09-10",
        "editavel": true,
        "periodo_anterior": {
            "uuid": "1e8c492b-2edb-4acd-a808-71bdf0d805d5",
            "referencia": "2025.1",
            "data_inicio_realizacao_despesas": "2024-09-01",
            "data_fim_realizacao_despesas": "2024-12-31",
            "referencia_por_extenso": "3° repasse de 2024"
        }
    },
]

export const mockTipoContas = [
    {uuid: 'ba8b96ef-f05c-41f3-af10-73753490c111', nome: 'Tipo 1'},
    {uuid: 'ba8b96ef-f05c-41f3-af10-73753490c222', nome: 'Tipo 2'},
]