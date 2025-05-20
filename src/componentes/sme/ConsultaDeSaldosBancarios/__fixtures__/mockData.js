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

export const mockTiposDeConta = [
    {
        "uuid": "uuid-1",
        "nome": "Conta Corrente"
    },
    {
        "uuid": "uuid-2",
        "nome": "Conta Poupança"
    },
    {
        "uuid": "uuid-3",
        "nome": "Conta Salário"
    }
]

export const mockDres = [
    {
        "uuid": "uuid-1",
        "nome": "Dre 1"
    },
    {
        "uuid": "uuid-2",
        "nome": "Dre 2"
    },
    {
        "uuid": "uuid-3",
        "nome": "Dre 3"
    }
]

export const mockTabelaAssociacoes = {
    "tipos_unidade": [
        {
            "id": "ADM",
            "nome": "ADM"
        },
        {
            "id": "DRE",
            "nome": "DRE"
        },
        {
            "id": "IFSP",
            "nome": "IFSP"
        },
        {
            "id": "CMCT",
            "nome": "CMCT"
        },
        {
            "id": "CECI",
            "nome": "CECI"
        },
        {
            "id": "CEI",
            "nome": "CEI"
        },
        {
            "id": "CEMEI",
            "nome": "CEMEI"
        },
        {
            "id": "CIEJA",
            "nome": "CIEJA"
        },
        {
            "id": "EMEBS",
            "nome": "EMEBS"
        },
        {
            "id": "EMEF",
            "nome": "EMEF"
        },
        {
            "id": "EMEFM",
            "nome": "EMEFM"
        },
        {
            "id": "EMEI",
            "nome": "EMEI"
        },
        {
            "id": "CEU",
            "nome": "CEU"
        },
        {
            "id": "CEU CEI",
            "nome": "CEU CEI"
        },
        {
            "id": "CEU EMEF",
            "nome": "CEU EMEF"
        },
        {
            "id": "CEU EMEI",
            "nome": "CEU EMEI"
        },
        {
            "id": "CEU CEMEI",
            "nome": "CEU CEMEI"
        },
        {
            "id": "CEI DIRET",
            "nome": "CEI DIRET"
        }
    ],
    "dres": [
        {
            "uuid": "63db6f59-e32c-4f2f-8c76-29ef40b16e7d",
            "nome": "DRE DIRETORIA TESTE MATHEUS"
        },
        {
            "uuid": "d5fb851a-089b-4a1a-abf2-fc270a48a2d7",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO PENHA"
        },
        {
            "uuid": "72b2b20b-b211-428e-a100-9f8c185119ee",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCAÇÃO GESÁ"
        },
        {
            "uuid": "47d6719a-fee4-4de4-9d57-9002b6961163",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO FREGUESIA/BRASILANDIA"
        },
        {
            "uuid": "1911663a-b3d6-4cb7-9dec-2b0458253894",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO BUTANTA"
        },
        {
            "uuid": "5cf7e134-5742-4a58-892f-a4423bdfb8a0",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO"
        },
        {
            "uuid": "db52b97b-7ddb-4c79-b34c-b4085443b264",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO GUAIANASES"
        },
        {
            "uuid": "62f300a3-8587-43d5-8cfd-da1edbfd2428",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO IPIRANGA"
        },
        {
            "uuid": "a3f5adb0-87fd-46e4-a2d8-853b149739e5",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO JACANA/TREMEMBE"
        },
        {
            "uuid": "176cdf20-c5ee-42c6-98af-7613dbac1a48",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO SAO MIGUEL"
        },
        {
            "uuid": "3c4412a0-3fcf-4fdb-acdf-bd562f90a4f0",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO SAO MATEUS"
        },
        {
            "uuid": "7e47b03e-3957-44bf-b51c-6cd432ef2ac8",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO CAMPO LIMPO"
        },
        {
            "uuid": "009f460d-7697-40b1-9a0c-2652f614dfb7",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO ITAQUERA"
        },
        {
            "uuid": "87102eea-229d-413f-9a6a-a3888c67f1e8",
            "nome": "DRE DRE Teste Daiane"
        },
        {
            "uuid": "1f70ddba-021d-466f-b757-7b696412682f",
            "nome": "DRE DRE Teste Nathan"
        },
        {
            "uuid": "839e49fc-b83b-4fd0-a7b8-d1578db9cc82",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO FIGUEIRÓ"
        },
        {
            "uuid": "eead331e-a5c1-4c9a-8c1c-efa4c337031d",
            "nome": "DRE GUAIANASES (TESTE)"
        },
        {
            "uuid": "32eff230-8d7b-4676-9faf-e8c32a6182aa",
            "nome": "DRE DRE Teste"
        },
        {
            "uuid": "dc6d5e38-265c-41e9-bb0f-67a5c4837756",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO PIRITUBA/JARAGUA"
        },
        {
            "uuid": "a75ee0a8-8c11-4c91-8468-4f75891dd542",
            "nome": "DRE DIRETORIA REGIONAL DE EDUCACAO SANTO AMARO"
        }
    ],
    "filtro_informacoes": [
        {
            "id": "ENCERRADAS",
            "nome": "Encerradas"
        },
        {
            "id": "NAO_ENCERRADAS",
            "nome": "Não encerradas"
        }
    ]
}