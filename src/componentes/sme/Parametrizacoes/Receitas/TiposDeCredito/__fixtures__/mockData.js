export const mockFiltros = {
    "tipos_contas": [
        {
            "uuid": "581af94a-d8dd-466d-9738-2be24655c221",
            "id": 4,
            "nome": "C6 BANK",
            "banco_nome": "C6 BANK",
            "agencia": "0012",
            "numero_conta": "12132-9",
            "numero_cartao": "1248 1548 2002 3699",
            "apenas_leitura": false,
            "permite_inativacao": true
        },
        {
            "uuid": "38c381e1-6a11-44a9-a2dd-39243799fac1",
            "id": 1,
            "nome": "Cheque",
            "banco_nome": "",
            "agencia": "",
            "numero_conta": "",
            "numero_cartao": "",
            "apenas_leitura": false,
            "permite_inativacao": true
        },
        {
            "uuid": "105198f5-1284-4c95-8127-896bf9b09922",
            "id": 2,
            "nome": "Cartão",
            "banco_nome": "Banco do Brasil",
            "agencia": "1897-X",
            "numero_conta": "19.150-7",
            "numero_cartao": "",
            "apenas_leitura": false,
            "permite_inativacao": true
        }
    ],
    "tipos": [
        {
            "field_name": "e_repasse",
            "name": "Repasse"
        },
        {
            "field_name": "e_rendimento",
            "name": "Rendimento"
        },
        {
            "field_name": "e_devolucao",
            "name": "Devolução"
        },
        {
            "field_name": "e_estorno",
            "name": "Estorno"
        }
    ],
    "aceita": [
        {
            "field_name": "aceita_capital",
            "name": "Capital"
        },
        {
            "field_name": "aceita_custeio",
            "name": "Custeio"
        },
        {
            "field_name": "aceita_livre",
            "name": "Livre aplicação"
        }
    ],
    "detalhes": [
        {
            "id": 26,
            "nome": "123"
        },
        {
            "id": 13,
            "nome": "Abril"
        },
        {
            "id": 9,
            "nome": "Agosto"
        },
        {
            "id": 1,
            "nome": "Desacordo com art. 3º da lei 13.991/2005 (gasto indevido)"
        }
    ]
}


export const mockTiposReceitas = {
    "links": {
        "next": "http://hom-sig-escola.sme.prefeitura.sp.gov.br/api/tipos-receitas/?nome=&page=2&page_size=20&tipos_conta__uuid=&uso_associacao=0",
        "previous": null
    },
    "count": 45,
    "page": 1,
    "page_size": 20,
    "results": [
        {
            "id": 55,
            "uuid": "7f226487-8673-4fdb-8b30-6b8dd408b27c",
            "nome": "todas",
            "aceita_capital": true,
            "aceita_custeio": false,
            "aceita_livre": false,
            "e_rendimento": true,
            "e_repasse": false,
            "e_devolucao": false,
            "e_recursos_proprios": false,
            "e_estorno": false,
            "mensagem_usuario": "",
            "possui_detalhamento": true,
            "detalhes": [],
            "tipos_conta": [
                {
                    "uuid": "20ec9d5d-19a0-4a77-a539-c13e0910357b",
                    "id": 5,
                    "nome": "CAIXA",
                    "banco_nome": "CAIXA",
                    "agencia": "11111",
                    "numero_conta": "111111",
                    "numero_cartao": "11111",
                    "apenas_leitura": false,
                    "permite_inativacao": true
                }
            ],
            "unidades": [],
            "todas_unidades_selecionadas": true
        },
        {
            "id": 57,
            "uuid": "550b969d-50d9-4d95-a8bb-5dab603c4997",
            "nome": "teste total total",
            "aceita_capital": true,
            "aceita_custeio": false,
            "aceita_livre": false,
            "e_rendimento": false,
            "e_repasse": true,
            "e_devolucao": false,
            "e_recursos_proprios": false,
            "e_estorno": false,
            "mensagem_usuario": "",
            "possui_detalhamento": true,
            "detalhes": [
                {
                    "id": 22,
                    "nome": "teste"
                }
            ],
            "tipos_conta": [
                {
                    "uuid": "581af94a-d8dd-466d-9738-2be24655c221",
                    "id": 4,
                    "nome": "C6 BANK",
                    "banco_nome": "C6 BANK",
                    "agencia": "0012",
                    "numero_conta": "12132-9",
                    "numero_cartao": "1248 1548 2002 3699",
                    "apenas_leitura": false,
                    "permite_inativacao": true
                },
                {
                    "uuid": "90a20bad-49a9-4967-975a-c86253efab8a",
                    "id": 717,
                    "nome": "Débito",
                    "banco_nome": "",
                    "agencia": "",
                    "numero_conta": "",
                    "numero_cartao": "",
                    "apenas_leitura": false,
                    "permite_inativacao": false
                }
            ],
            "unidades": [],
            "todas_unidades_selecionadas": true
        },
        {
            "id": 60,
            "uuid": "bce9d017-df48-4bd6-b9e8-d7eb9136e821",
            "nome": "Teste SME 2",
            "aceita_capital": false,
            "aceita_custeio": false,
            "aceita_livre": true,
            "e_rendimento": false,
            "e_repasse": false,
            "e_devolucao": true,
            "e_recursos_proprios": false,
            "e_estorno": false,
            "mensagem_usuario": "",
            "possui_detalhamento": false,
            "detalhes": [],
            "tipos_conta": [
                {
                    "uuid": "105198f5-1284-4c95-8127-896bf9b09922",
                    "id": 2,
                    "nome": "Cartão",
                    "banco_nome": "Banco do Brasil",
                    "agencia": "1897-X",
                    "numero_conta": "19.150-7",
                    "numero_cartao": "",
                    "apenas_leitura": false,
                    "permite_inativacao": true
                }
            ],
            "unidades": [
                {
                    "uuid": "920fe080-08a9-4315-96cf-1a4b87a11bb9",
                    "codigo_eol": "019341",
                    "tipo_unidade": "EMEF",
                    "nome": "JARDIM GUARANI - JOSE ALFREDO APOLINARIO, PROF.",
                    "sigla": "",
                    "dre": {
                        "uuid": "47d6719a-fee4-4de4-9d57-9002b6961163",
                        "codigo_eol": "108400",
                        "tipo_unidade": "DRE",
                        "nome": "DIRETORIA REGIONAL DE EDUCACAO FREGUESIA/BRASILANDIA",
                        "sigla": "F"
                    },
                    "email": "emefjguarani@sme.prefeitura.sp.gov.br",
                    "telefone": "39245136",
                    "tipo_logradouro": "Rua",
                    "logradouro": "SANTANA DO ARACUAI",
                    "numero": "190",
                    "complemento": "",
                    "bairro": "JARDIM GUARANI",
                    "cep": "02849130",
                    "qtd_alunos": 0,
                    "diretor_nome": "",
                    "dre_cnpj": "",
                    "dre_diretor_regional_rf": "",
                    "dre_diretor_regional_nome": "",
                    "dre_designacao_portaria": "",
                    "dre_designacao_ano": "",
                    "observacao": ""
                }
            ],
            "todas_unidades_selecionadas": false
        },
        {
            "id": 61,
            "uuid": "bce9d017-df48-4bd6-b9e8-d7eb9136e822",
            "nome": "Teste SME 3",
            "aceita_capital": false,
            "aceita_custeio": false,
            "aceita_livre": true,
            "e_rendimento": false,
            "e_repasse": false,
            "e_devolucao": false,
            "e_recursos_proprios": true,
            "e_estorno": false,
            "mensagem_usuario": "",
            "possui_detalhamento": false,
            "detalhes": [],
            "tipos_conta": [
                {
                    "uuid": "105198f5-1284-4c95-8127-896bf9b09922",
                    "id": 2,
                    "nome": "Cartão",
                    "banco_nome": "Banco do Brasil",
                    "agencia": "1897-X",
                    "numero_conta": "19.150-7",
                    "numero_cartao": "",
                    "apenas_leitura": false,
                    "permite_inativacao": true
                }
            ],
            "unidades": [
                {
                    "uuid": "920fe080-08a9-4315-96cf-1a4b87a11bb9",
                    "codigo_eol": "019341",
                    "tipo_unidade": "EMEF",
                    "nome": "JARDIM GUARANI - JOSE ALFREDO APOLINARIO, PROF.",
                    "sigla": "",
                    "dre": {
                        "uuid": "47d6719a-fee4-4de4-9d57-9002b6961163",
                        "codigo_eol": "108400",
                        "tipo_unidade": "DRE",
                        "nome": "DIRETORIA REGIONAL DE EDUCACAO FREGUESIA/BRASILANDIA",
                        "sigla": "F"
                    },
                    "email": "emefjguarani@sme.prefeitura.sp.gov.br",
                    "telefone": "39245136",
                    "tipo_logradouro": "Rua",
                    "logradouro": "SANTANA DO ARACUAI",
                    "numero": "190",
                    "complemento": "",
                    "bairro": "JARDIM GUARANI",
                    "cep": "02849130",
                    "qtd_alunos": 0,
                    "diretor_nome": "",
                    "dre_cnpj": "",
                    "dre_diretor_regional_rf": "",
                    "dre_diretor_regional_nome": "",
                    "dre_designacao_portaria": "",
                    "dre_designacao_ano": "",
                    "observacao": ""
                }
            ],
            "todas_unidades_selecionadas": false
        },
        {
            "id": 62,
            "uuid": "bce9d017-df48-4bd6-b9e8-d7eb9136e823",
            "nome": "Teste SME 3",
            "aceita_capital": false,
            "aceita_custeio": false,
            "aceita_livre": true,
            "e_rendimento": false,
            "e_repasse": false,
            "e_devolucao": false,
            "e_recursos_proprios": false,
            "e_estorno": true,
            "mensagem_usuario": "",
            "possui_detalhamento": false,
            "detalhes": [],
            "tipos_conta": [
                {
                    "uuid": "105198f5-1284-4c95-8127-896bf9b09922",
                    "id": 2,
                    "nome": "Cartão",
                    "banco_nome": "Banco do Brasil",
                    "agencia": "1897-X",
                    "numero_conta": "19.150-7",
                    "numero_cartao": "",
                    "apenas_leitura": false,
                    "permite_inativacao": true
                }
            ],
            "unidades": [
                {
                    "uuid": "920fe080-08a9-4315-96cf-1a4b87a11bb9",
                    "codigo_eol": "019341",
                    "tipo_unidade": "EMEF",
                    "nome": "JARDIM GUARANI - JOSE ALFREDO APOLINARIO, PROF.",
                    "sigla": "",
                    "dre": {
                        "uuid": "47d6719a-fee4-4de4-9d57-9002b6961163",
                        "codigo_eol": "108400",
                        "tipo_unidade": "DRE",
                        "nome": "DIRETORIA REGIONAL DE EDUCACAO FREGUESIA/BRASILANDIA",
                        "sigla": "F"
                    },
                    "email": "emefjguarani@sme.prefeitura.sp.gov.br",
                    "telefone": "39245136",
                    "tipo_logradouro": "Rua",
                    "logradouro": "SANTANA DO ARACUAI",
                    "numero": "190",
                    "complemento": "",
                    "bairro": "JARDIM GUARANI",
                    "cep": "02849130",
                    "qtd_alunos": 0,
                    "diretor_nome": "",
                    "dre_cnpj": "",
                    "dre_diretor_regional_rf": "",
                    "dre_diretor_regional_nome": "",
                    "dre_designacao_portaria": "",
                    "dre_designacao_ano": "",
                    "observacao": ""
                }
            ],
            "todas_unidades_selecionadas": false
        },
    ]
}