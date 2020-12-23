import React, {useState, createContext} from "react";
import {ASSOCIACAO_UUID} from "../../services/auth.service";

export const DespesaContext = createContext( {
    verboHttp:[],
    setVerboHttp(){},

    idDespesa:"",
    setIdDespesa(){},

    initialValues:"",
    setInitialValues(){},

    valores_iniciais:[],
    valores_iniciais_recursos_proprios:[],

});

export const DespesaContextProvider = ({children}) => {

    const [verboHttp, setVerboHttp] = useState("");
    const [idDespesa, setIdDespesa] = useState("");
    const [initialValues, setInitialValues] = useState(
        {
        associacao: localStorage.getItem(ASSOCIACAO_UUID),
        tipo_documento: "",
        tipo_transacao: "",
        numero_documento: "",
        data_documento: "",
        cpf_cnpj_fornecedor: "",
        nome_fornecedor: "",
        data_transacao: "",
        documento_transacao: "",
        valor_total: "",
        valor_recursos_proprios: "",
        // Auxiliares
        mais_de_um_tipo_despesa: "nao",
        valor_recusos_acoes:0,
        valor_total_dos_rateios:0,
        valor_original:"",
        valor_original_total:"",
        // Fim Auxiliares
        rateios: [
            {
                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                escolha_tags:"",
                tag:"",
                conta_associacao: "",
                acao_associacao: "",
                aplicacao_recurso: "CUSTEIO",
                tipo_custeio: "",
                especificacao_material_servico: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
                valor_original: "",
                numero_processo_incorporacao_capital: "",
            }
        ],
    });

    const valores_iniciais = {
        associacao: localStorage.getItem(ASSOCIACAO_UUID),
        tipo_documento: "",
        tipo_transacao: "",
        numero_documento: "",
        data_documento: "",
        cpf_cnpj_fornecedor: "",
        nome_fornecedor: "",
        data_transacao: "",
        documento_transacao: "",
        valor_total: "",
        valor_recursos_proprios: "",
        // Auxiliares
        mais_de_um_tipo_despesa: "nao",
        valor_recusos_acoes:0,
        valor_total_dos_rateios:0,
        valor_original:"",
        valor_original_total:"",
        // Fim Auxiliares
        rateios: [
            {
                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                escolha_tags:"",
                tag:"",
                conta_associacao: "",
                acao_associacao: "",
                aplicacao_recurso: "CUSTEIO",
                tipo_custeio: "",
                especificacao_material_servico: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
                valor_original: "",
                numero_processo_incorporacao_capital: "",
            }
        ],
    }

    return (
        <DespesaContext.Provider value={{verboHttp, setVerboHttp,idDespesa, setIdDespesa, initialValues, setInitialValues, valores_iniciais}}>
            {children}
        </DespesaContext.Provider>
    )

}