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
                associacao: "c619138d-8c82-4fdd-8544-2bde5803cb4d",
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
                associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
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
                    associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                    aplicacao_recurso: "",
                    tipo_aplicacao_recurso: "",
                    tipo_custeio: 1,
                    especificacao_material_servico: "",
                    conta_associacao: "",
                    acao_associacao: "",
                    valor_rateio: "",
                    quantidade_itens_capital: "",
                    valor_item_capital: "",
                    numero_processo_incorporacao_capital: "",
                }],

            }
        }
    } else {
        valoreIniciais = {
            associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
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
                associacao: "52ad4766-3515-4de9-8ab6-3b12078f8f14",
                aplicacao_recurso: "",
                tipo_aplicacao_recurso: "",
                tipo_custeio: 1,
                especificacao_material_servico: "",
                conta_associacao: "",
                acao_associacao: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
                numero_processo_incorporacao_capital: "",
            }],


        }
    }

    return valoreIniciais;

}