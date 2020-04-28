import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {useParams} from 'react-router-dom'
import {DespesaContext} from "../../../context/Despesa";
import {getDespesa} from "../../../services/Despesas.service";
import {CadastroDeDespesas} from "../../../componentes/Despesas/CadastroDeDespesas";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
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
                    }) : ""

                    item.valor_item_capital = item.valor_item_capital ? Number(item.valor_item_capital).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : ""
                })

                const init = {
                    ...resp,
                    mais_de_um_tipo_despesa : resp.rateios.length > 1 ? "sim" : "nao",
                    data_documento: resp.data_documento ?  moment(resp.data_documento, "YYYY-MM-DD"): null,
                    data_transacao: resp.data_transacao ?  moment(resp.data_transacao, "YYYY-MM-DD"): null,

                    valor_total: resp.valor_total ? Number(resp.valor_total).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    valor_recursos_proprios: resp.valor_recursos_proprios ? Number(resp.valor_recursos_proprios).toLocaleString('pt-BR', {
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
                <CadastroDeDespesas/>
            </div>
        </PaginasContainer>
    )

}