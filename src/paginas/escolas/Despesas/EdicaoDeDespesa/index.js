import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../../PaginasContainer";
import {useParams, useLocation} from 'react-router-dom'
import {DespesaContext} from "../../../../context/Despesa";
import {getDespesa} from "../../../../services/escolas/Despesas.service";
import {CadastroDeDespesas} from "../../../../componentes/escolas/Despesas/CadastroDeDespesas";
import {ASSOCIACAO_UUID} from "../../../../services/auth.service";
import moment from "moment";
import {visoesService} from "../../../../services/visoes.service";
import { metodosAuxiliares } from "../../../../componentes/escolas/Despesas/metodosAuxiliares";

const tituloPagina = (parametroLocation) => {
    const aux = metodosAuxiliares;
    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome')

    if(visao_selecionada === "DRE"){
        return "Visualização de Despesa"
    }

    if(visao_selecionada === "UE"){
        if(aux.origemAnaliseLancamento(parametroLocation)){
            let operacao = parametroLocation.state.operacao;
            let texto = operacao === "requer_exclusao_lancamento_gasto" ? "Exclusão de Despesa" : "Edição de Despesa";
            return texto;
        }
        else{
            return "Edição de Despesa"
        }
    }

    return "";
}


export const EdicaoDeDespesa = ()=>{

    const despesaContext = useContext(DespesaContext)

    let {associacao} = useParams();    
    const parametroLocation = useLocation();

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

                if(resp && resp.despesas_impostos && resp.despesas_impostos.length > 0){
                    let despesas_impostos_tratados = resp.despesas_impostos.map((despesa_imposto) => {
                        despesa_imposto.associacao = localStorage.getItem(ASSOCIACAO_UUID);
                        despesa_imposto.tipo_documento = despesa_imposto.tipo_documento ? despesa_imposto.tipo_documento : "";
                        despesa_imposto.numero_documento = despesa_imposto.numero_documento ? despesa_imposto.numero_documento : "";
                        despesa_imposto.tipo_transacao = despesa_imposto.tipo_transacao ? despesa_imposto.tipo_transacao : "";
                        despesa_imposto.documento_transacao = despesa_imposto.documento_transacao ? despesa_imposto.documento_transacao : "";
                        despesa_imposto.data_transacao = despesa_imposto.data_transacao ? moment(despesa_imposto.data_transacao, "YYYY-MM-DD"): null;

                        if(despesa_imposto.rateios && despesa_imposto.rateios.length > 0){
                            despesa_imposto.rateios.map((rateio) => {
                                rateio.uuid = rateio.uuid ? rateio.uuid : null;
                                rateio.tipo_custeio = rateio.tipo_custeio ? rateio.tipo_custeio : "";
                                rateio.especificacao_material_servico = rateio.especificacao_material_servico ? rateio.especificacao_material_servico : "";
                                rateio.acao_associacao = rateio.acao_associacao ? rateio.acao_associacao : "";
                                rateio.aplicacao_recurso = "CUSTEIO";
                                rateio.associacao = localStorage.getItem(ASSOCIACAO_UUID);
                                rateio.conta_associacao = rateio.conta_associacao ? rateio.conta_associacao : "";
                                rateio.escolha_tags = "";
                                rateio.numero_processo_incorporacao_capital = rateio.numero_processo_incorporacao_capital ? rateio.numero_processo_incorporacao_capital : "";
                                rateio.quantidade_itens_capital = 0;
                                rateio.valor_item_capital = 0;
                                rateio.valor_original = rateio.valor_original ? Number(rateio.valor_original).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }) : "";
                                rateio.valor_rateio = rateio.valor_rateio ? Number(rateio.valor_rateio).toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                }) : "";
                            })
                        }
                    })
                }
                
                const init = {
                    ...resp,
                    mais_de_um_tipo_despesa : resp.rateios.length > 1 ? "sim" : "nao",
                    data_documento: resp.data_documento ?  moment(resp.data_documento, "YYYY-MM-DD"): null,
                    data_transacao: resp.data_transacao ?  moment(resp.data_transacao, "YYYY-MM-DD"): null,
                    motivos_pagamento_antecipado: resp.motivos_pagamento_antecipado,
                    outros_motivos_pagamento_antecipado: resp.outros_motivos_pagamento_antecipado,

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
            <h1 className="titulo-itens-painel mt-5">{tituloPagina(parametroLocation)}</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel mb-4">Dados do documento</h2>
                <CadastroDeDespesas
                    verbo_http={"PUT"}
                />
            </div>
        </PaginasContainer>
    )

}