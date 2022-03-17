import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../../PaginasContainer";
import {useParams} from 'react-router-dom'
import {DespesaContext} from "../../../../context/Despesa";
import {getDespesa} from "../../../../services/escolas/Despesas.service";
import {CadastroDeDespesas} from "../../../../componentes/escolas/Despesas/CadastroDeDespesas";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import moment from "moment";



export const EdicaoDeDespesa = ()=>{

    const despesaContext = useContext(DespesaContext)

    let {associacao} = useParams();

    useEffect(() => {
        (async function setValoresIniciais() {
            await despesaContext.setVerboHttp("PUT");
            await despesaContext.setIdDespesa(associacao);
            const resp = await getDespesa(associacao)
            .then(response =>{
                const resp = response;

                let rateios_tratados = resp.rateios.map((item) =>{

                    item.associacao = localStorage.getItem(ASSOCIACAO_UUID)
                    item.conta_associacao = item.conta_associacao ? item.conta_associacao : ""
                    item.acao_associacao = item.acao_associacao ? item.acao_associacao : ""
                    item.aplicacao_recurso = item.aplicacao_recurso? item.aplicacao_recurso : "CUSTEIO"
                    item.tipo_custeio = item.tipo_custeio ? item.tipo_custeio : ""
                    item.especificacao_material_servico = item.especificacao_material_servico ? item.especificacao_material_servico : ""
                    item.valor_rateio = item.valor_rateio ? item.valor_rateio : ""
                    item.quantidade_itens_capital = item.quantidade_itens_capital ? item.quantidade_itens_capital : ""
                    item.valor_item_capital = item.valor_item_capital ? item.valor_item_capital : ""
                    item.numero_processo_incorporacao_capital = item.numero_processo_incorporacao_capital ? item.numero_processo_incorporacao_capital : ""

                    item.valor_rateio = item.valor_rateio ? Number(item.valor_rateio).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "";

                    item.valor_item_capital = item.valor_item_capital ? Number(item.valor_item_capital).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "";

                    item.valor_original = item.valor_original ? Number(item.valor_original).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : ""
                });

                const init = {
                    ...resp,
                    despesa_imposto: {
                        associacao: localStorage.getItem(ASSOCIACAO_UUID),
                        tipo_documento: resp && resp.despesa_imposto && resp.despesa_imposto.tipo_documento ? resp.despesa_imposto.tipo_documento : "",
                        numero_documento: resp && resp.despesa_imposto && resp.despesa_imposto.numero_documento ? resp.despesa_imposto.numero_documento : "",
                        tipo_transacao: resp && resp.despesa_imposto && resp.despesa_imposto.tipo_transacao ? resp.despesa_imposto.tipo_transacao : "",
                        documento_transacao: resp && resp.despesa_imposto && resp.despesa_imposto.documento_transacao ? resp.despesa_imposto.documento_transacao : "",
                        data_transacao: resp && resp.despesa_imposto && resp.despesa_imposto.data_transacao ? moment(resp.despesa_imposto.data_transacao, "YYYY-MM-DD"): null,
                        rateios: resp && resp.despesa_imposto && resp.despesa_imposto.rateios && resp.despesa_imposto.rateios.length > 0 ?
                            [{
                                uuid: resp.despesa_imposto.rateios[0].uuid ? resp.despesa_imposto.rateios[0].uuid : null,
                                tipo_custeio: resp.despesa_imposto.rateios[0].tipo_custeio ? resp.despesa_imposto.rateios[0].tipo_custeio : "",
                                especificacao_material_servico: resp.despesa_imposto.rateios[0].especificacao_material_servico ? resp.despesa_imposto.rateios[0].especificacao_material_servico : "",
                                acao_associacao: resp.despesa_imposto.rateios[0].acao_associacao ? resp.despesa_imposto.rateios[0].acao_associacao : "",
                                aplicacao_recurso: "CUSTEIO",
                                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                conta_associacao: resp.despesa_imposto.rateios[0].conta_associacao ? resp.despesa_imposto.rateios[0].conta_associacao : "",
                                escolha_tags:"",
                                numero_processo_incorporacao_capital: resp.despesa_imposto.rateios[0].numero_processo_incorporacao_capital ? resp.despesa_imposto.rateios[0].numero_processo_incorporacao_capital : "",
                                quantidade_itens_capital: 0,
                                valor_item_capital: 0,
                                valor_original: resp.despesa_imposto.rateios[0].valor_original ? Number(resp.despesa_imposto.rateios[0].valor_original).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }) : "",
                                valor_rateio: resp.despesa_imposto.rateios[0].valor_rateio ? Number(resp.despesa_imposto.rateios[0].valor_rateio).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }) : ""
                            }]:
                            [{
                                tipo_custeio: "",
                                especificacao_material_servico: "",
                                acao_associacao: "",
                                aplicacao_recurso: "CUSTEIO",
                                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                                conta_associacao: "",
                                escolha_tags: "",
                                numero_processo_incorporacao_capital: "",
                                quantidade_itens_capital: 0,
                                valor_item_capital: 0,
                                valor_original: "",
                                valor_rateio: ""
                            }],
                    },
                    mais_de_um_tipo_despesa : resp.rateios.length > 1 ? "sim" : "nao",
                    data_documento: resp.data_documento ?  moment(resp.data_documento, "YYYY-MM-DD"): null,
                    data_transacao: resp.data_transacao ?  moment(resp.data_transacao, "YYYY-MM-DD"): null,
                    motivos_pagamento_antecipado: [],
                    outros_motivos_pagamento_antecipado:"",

                    valor_total: resp.valor_total ? Number(resp.valor_total).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    valor_recursos_proprios: resp.valor_recursos_proprios ? Number(resp.valor_recursos_proprios).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",

                    valor_original: resp.valor_original ? Number(resp.valor_original).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",

                    valor_original_total: resp.valor_original ? Number(resp.valor_original).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",

                    valor_total_dos_rateios: resp.valor_total_dos_rateios ? Number(resp.valor_total_dos_rateios).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",

                }
                despesaContext.setInitialValues(init)
            }).catch(error => {
                console.log(error);
            });
        })();
    }, []);

    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Edição de Despesa</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel mb-4">Dados do documento</h2>
                <CadastroDeDespesas
                    verbo_http={"PUT"}
                />
            </div>
        </PaginasContainer>
    )

}