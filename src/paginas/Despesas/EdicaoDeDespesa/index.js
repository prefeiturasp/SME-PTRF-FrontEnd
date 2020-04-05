import React, {useContext, useEffect} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {useParams} from 'react-router-dom'
import {DespesaContext} from "../../../context/Despesa";
import {getDespesa} from "../../../services/Despesas.service";
import {CadastroDeDespesas} from "../../../componentes/Despesas/CadastroDeDespesas";
import {ASSOCIACAO_UUID} from "../../../services/auth.service";
import CurrencyInput from 'react-currency-input';



export const EdicaoDeDespesa = ()=>{

    const despesaContext = useContext(DespesaContext)

    let {associacao} = useParams();

    useEffect(() => {
        (async function setValoresIniciais() {
            //debugger
            await despesaContext.setVerboHttp("PUT");
            await despesaContext.setIdDespesa(associacao);
            const resp = await getDespesa(associacao)
            .then(response =>{

                const resp = response;

                let rateios_tratados = resp.rateios.map((item) =>{

                        item.associacao = localStorage.getItem(ASSOCIACAO_UUID)
                        item.conta_associacao= item.conta_associacao ? item.conta_associacao : ""
                        item.acao_associacao = item.acao_associacao ? item.acao_associacao : ""
                        item.aplicacao_recurso = item.aplicacao_recurso? item.aplicacao_recurso : "CUSTEIO"
                        item.tipo_custeio = item.tipo_custeio ? item.tipo_custeio : "1"
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
                    valor_total: resp.valor_total ? Number(resp.valor_total).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    valor_recursos_proprios: resp.valor_recursos_proprios ? Number(resp.valor_recursos_proprios).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    // Auxiliares
                    mais_de_um_tipo_despesa: "",
                    valor_recusos_acoes: resp.valor_recusos_acoes ? Number(resp.valor_recusos_acoes).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    valor_total_dos_rateios: resp.valor_total_dos_rateios ? Number(resp.valor_total_dos_rateios).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    }) : "",
                    // Fim Auxiliares
                    rateios: resp.rateios


                }
                //setInitialValue(init);
                //setReceita(resp);


                console.log("Edicao Despesa Page ", response)
                despesaContext.setInitialValues(response)
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