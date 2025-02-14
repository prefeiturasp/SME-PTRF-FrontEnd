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


export const mockListaAssociacoes = {
    "links": {
        "next": "http://localhost:8000/api/parametrizacoes-associacoes/?filtro_informacoes=&nome=&page=2&page_size=20&unidade__dre__uuid=&unidade__tipo_unidade=",
        "previous": null
    },
    "count": 25,
    "page": 1,
    "page_size": 20,
    "results": [
        {
            "uuid": "5003fbd5-fd37-40eb-8889-e40042ec7e77",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA",
            "cnpj": "11.267.355/0001-68",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "acf92a00-3fc7-4c41-8eab-ee54e3864052",
                "codigo_eol": "200204",
                "nome_com_tipo": "CECI JARAGUA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PIRITUBA/JARAGUA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "0673b05b-3ff1-4381-b4b0-bd3e578e021e",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CENTRO DE EDUCACAO E CULTURA INDIGENA CENTRO DE EDUCACAO INFANTIL KR",
            "cnpj": "11.162.038/0001-87",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "4244adf2-672c-4046-a79d-8d596d109890",
                "codigo_eol": "200205",
                "nome_com_tipo": "CECI KRUKUTU",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "f4e6495c-9891-4eae-93ad-ab12d9b827c6",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CENTRO DE EDUCACAO E CULTURA INDIGENA CENTRO DE EDUCACAO INFANTIL TE",
            "cnpj": "11.111.429/0001-72",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "76214e46-f323-4519-aaf4-9fa7e3702383",
                "codigo_eol": "200206",
                "nome_com_tipo": "CECI TENONDE PORA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO CAPELA DO SOCORRO"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "716b8bb0-21cb-4cd4-a4ba-24338383639e",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CENTRO DE EDUCACAO INFANTIL 13 DE MAIO",
            "cnpj": "22.454.411/0001-90",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "649cf2ee-257d-406b-bcf0-a2a54da17e4c",
                "codigo_eol": "400496",
                "nome_com_tipo": "CEI DIRET 13 DE MAIO",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO IPIRANGA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "e38c6687-2a35-46d6-babc-a26d49212328",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI PROF ABGAIL DA ROCHA MORENO",
            "cnpj": "09.311.219/0001-86",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "41c01a29-32d5-489e-a05c-747340883894",
                "codigo_eol": "400292",
                "nome_com_tipo": "CEI DIRET ABGAIL DA ROCHA MORENO, PROFA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PENHA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "bacd7643-4823-4dce-956a-17c65b4a167a",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI ADELAIDE LOPES RODRIGUES",
            "cnpj": "07.968.253/0001-00",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "2331f17d-9094-4804-9450-caf39215e293",
                "codigo_eol": "400001",
                "nome_com_tipo": "CEI DIRET ADELAIDE LOPES RODRIGUES",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO JACANA/TREMEMBE"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "d3f59304-0788-4bb9-a1c2-9ef7e609a841",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI ADHEMAR FERREIRA DA SILVA",
            "cnpj": "07.898.847/0001-84",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "d7d43686-aa22-4d06-bfc2-4096390242ff",
                "codigo_eol": "400280",
                "nome_com_tipo": "CEI DIRET ADHEMAR FERREIRA DA SILVA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO GUAIANASES"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "c6391ad6-777a-4c7e-9daf-b9c866c354bb",
            "nome": "APM DO CEI FREI AIRTON PEREIRA DA SILVA",
            "cnpj": "06.537.576/0001-79",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "51df0a3a-dc26-4df5-b573-4e671837d023",
                "codigo_eol": "400301",
                "nome_com_tipo": "CEI DIRET AIRTON PEREIRA DA SILVA, FREI",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO CAMPO LIMPO"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "518be0b0-f6db-4a0c-a49b-dad566c0cb83",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI ALASTAIR QUINTAS GONCALVES",
            "cnpj": "09.371.823/0001-06",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "5409dfe1-1043-47b4-b833-78dc6fc82b27",
                "codigo_eol": "400002",
                "nome_com_tipo": "CEI DIRET ALASTAIR QUINTAS GONCALVES",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PENHA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "c62d5380-ae6a-4df9-a65d-6594062b02d3",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI PROF ALBERTINA RODRIGUES SIMON",
            "cnpj": "08.729.456/0001-07",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "464537ed-0e4e-40db-89da-28a42980048a",
                "codigo_eol": "400100",
                "nome_com_tipo": "CEI DIRET ALBERTINA RODRIGUES SIMON, PROFA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO CAMPO LIMPO"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "ffaa4679-e772-4e9e-b186-dd43706b665f",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI PROFA. ALICE APARECIDA DE SOUZA",
            "cnpj": "07.906.487/0001-15",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "115da3dc-f30a-43a3-aa04-107e7f60c191",
                "codigo_eol": "400304",
                "nome_com_tipo": "CEI DIRET ALICE APARECIDA DE SOUZA , PROFA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO GUAIANASES"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "9c9e5d0f-8d87-4f7b-99d8-1bd6d03b52ee",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI VEREADOR ALOYSIO DE MENEZES GREENHALGH",
            "cnpj": "06.375.382/0001-14",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "bf1ad4c2-8f5c-4e05-be93-07ff7e6fd775",
                "codigo_eol": "400003",
                "nome_com_tipo": "CEI DIRET ALOYSIO DE MENEZES GREENHALGH, VER.",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO BUTANTA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "b26483d8-8eeb-48d2-8ab2-df2b9692e135",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI AMERICO DE SOUZA",
            "cnpj": "08.236.262/0001-61",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "51be2434-a8eb-4f99-9e2f-675e4ef37f62",
                "codigo_eol": "400004",
                "nome_com_tipo": "CEI DIRET AMERICO DE SOUZA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PENHA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "a3d73ead-9751-4a0f-b42c-0b96b5ca736b",
            "nome": "APM DO CEI ANGELA MARIA FERNANDES",
            "cnpj": "08.266.381/0001-67",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "9777502a-4820-4cf6-bac4-23de0eddf34b",
                "codigo_eol": "400244",
                "nome_com_tipo": "CEI DIRET ANGELA MARIA FERNANDES",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO SANTO AMARO"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "4981bf59-5f14-41e1-be33-d465488dc4d3",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI PROF ANITA CASTALDI ZAMPIROLLO",
            "cnpj": "08.036.219/0001-52",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "647eb71a-2d00-46dc-a2e1-b544239ba0d9",
                "codigo_eol": "400005",
                "nome_com_tipo": "CEI DIRET ANITA CASTALDI ZAMPIROLLO, PROFA.",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO JACANA/TREMEMBE"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "f6a4a95d-986b-4a71-a3f6-5b5ed1c48797",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI ANITA GARIBALDI",
            "cnpj": "07.572.629/0001-55",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "f81c62d9-2d3f-4c7e-ad6b-e1fc810f1fc6",
                "codigo_eol": "400006",
                "nome_com_tipo": "CEI DIRET ANITA GARIBALDI",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO SAO MATEUS"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "17ea1e65-ea5e-4682-b5cb-0bbe2e040fa5",
            "nome": "ASSOCIACAO DE PAIS E MESTRES CEI ANNA FLORENCIO ROMAO",
            "cnpj": "08.503.541/0001-44",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "b2f9e41c-1ef8-432a-b2c2-a058b2ee3e72",
                "codigo_eol": "400007",
                "nome_com_tipo": "CEI DIRET ANNA FLORENCIO ROMAO",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PENHA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "0978bb3e-46d8-47bf-98fb-69dc6baf4c8e",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI ANTONIA MARIA TORRES DA SILVA",
            "cnpj": "08.446.011/0001-01",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "ceff00d2-06d3-4f53-9bc5-9dddcb50522e",
                "codigo_eol": "400008",
                "nome_com_tipo": "CEI DIRET ANTONIA MARIA TORRES DA SILVA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PENHA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "7a2522c7-2e02-4a04-a4d5-dcd40a65f81a",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI ANTONIA MUOTRI LAMBERGA",
            "cnpj": "08.829.790/0001-24",
            "status_valores_reprogramados": "EM_CONFERENCIA_DRE",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "9d6898d5-b60c-4568-84b2-8640c3a7e0a7",
                "codigo_eol": "400009",
                "nome_com_tipo": "CEI DIRET ANTONIA MUOTRI LAMBERGA",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PENHA"
            },
            "encerrada": false,
            "informacoes": []
        },
        {
            "uuid": "4c653e7a-1be9-4f79-b8c1-29ecb328bc89",
            "nome": "ASSOCIACAO DE PAIS E MESTRES DO CEI DR ANTONIO JOAO ABDALLA",
            "cnpj": "06.925.962/0001-38",
            "status_valores_reprogramados": "VALORES_CORRETOS",
            "data_de_encerramento": null,
            "tooltip_data_encerramento": null,
            "tooltip_encerramento_conta": null,
            "unidade": {
                "uuid": "366279a7-dd7a-4ae4-8f65-d55d5989ab4e",
                "codigo_eol": "400010",
                "nome_com_tipo": "CEI DIRET ANTONIO JOAO ABDALLA, DR.",
                "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO BUTANTA"
            },
            "encerrada": false,
            "informacoes": []
        }
    ]
}


export const mockListaPeriodos = [
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
        "uuid": "1e8c492b-2edb-4acd-a808-71bdf0d805d5",
        "referencia": "2024.3",
        "data_inicio_realizacao_despesas": "2024-09-01",
        "data_fim_realizacao_despesas": "2024-12-31",
        "data_prevista_repasse": null,
        "data_inicio_prestacao_contas": "2025-02-01",
        "data_fim_prestacao_contas": "2025-02-10",
        "editavel": false,
        "periodo_anterior": {
            "uuid": "d6d72eef-8ede-4128-9725-e507cfdfd60e",
            "referencia": "2024.2",
            "data_inicio_realizacao_despesas": "2024-05-01",
            "data_fim_realizacao_despesas": "2024-08-31",
            "referencia_por_extenso": "2° repasse de 2024"
        }
    }
]