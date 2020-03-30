import React, {useContext} from "react";
import {GetDadosApiDespesaContext} from "../../../context/GetDadosApiDespesa";

export const DespesaFormGetInitialValues = (parametros)=>{

    const {idAssociacao} = parametros

    const dadosApiContext = useContext(GetDadosApiDespesaContext);

    let valoreIniciais;
    let meusValores;
    let rateios=[];

    if (idAssociacao !== undefined) {
        dadosApiContext.updateDespesa.length > 0 && dadosApiContext.updateDespesa.map((item) => {
            item.rateios.map((dataItem, index) => {
                rateios.push(dataItem)
            })
            meusValores = {
                associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                cpf_cnpj_fornecedor: item.cpf_cnpj_fornecedor,
                nome_fornecedor: item.nome_fornecedor,
                tipo_documento: item.tipo_documento.id,
                numero_documento: item.numero_documento,
                data_documento: item.data_documento,
                tipo_transacao: item.tipo_transacao.id,
                data_transacao: item.data_transacao,
                valor_total: item.valor_total,
                valor_recursos_proprios: item.valor_recursos_proprios,
                valorRecursoAcoes: "",
                dadosDoGasto: "",
                rateios:rateios,

            }
        })
        if (meusValores) {
            valoreIniciais = meusValores
        } else {

            valoreIniciais = {
                associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                cpf_cnpj_fornecedor: "",
                nome_fornecedor: "",
                tipo_documento: "",
                numero_documento: "",
                data_documento: "",
                tipo_transacao: "",
                data_transacao: "",
                valor_total: "",
                valor_recursos_proprios: "",
                valorRecursoAcoes: "",
                dadosDoGasto: "",
                rateios: [{
                    associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                    aplicacao_recurso: "",
                    tipo_aplicacao_recurso: "CUSTEIO",
                    tipo_custeio: 1,
                    especificacao_material_servico: "",
                    conta_associacao: "conta1",
                    acao_associacao: "",
                    valor_rateio: 0,
                    //Capital
                    quantidade_itens_capital: 0,
                    valor_item_capital: 0,
                    numero_processo_incorporacao_capital: "",
                }],

            }
        }
    } else {
        valoreIniciais = {
            associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
            cpf_cnpj_fornecedor: "",
            nome_fornecedor: "",
            tipo_documento: "",
            numero_documento: "",
            data_documento: "",
            tipo_transacao: "",
            data_transacao: "",
            valor_total: "",
            valor_recursos_proprios: "",
            valorRecursoAcoes: "",
            dadosDoGasto: "",
            rateios: [{
                associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
                aplicacao_recurso: "",
                tipo_aplicacao_recurso: "CUSTEIO",
                tipo_custeio: 1,
                especificacao_material_servico: "",
                conta_associacao: "conta1",
                acao_associacao: "",
                valor_rateio: 0,
                //Capital
                quantidade_itens_capital: 0,
                valor_item_capital: 0,
                numero_processo_incorporacao_capital: "",
            }],


        }
    }

    return valoreIniciais;

}