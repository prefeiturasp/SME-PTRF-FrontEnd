import React, {useState, createContext, useEffect} from "react";
import {ASSOCIACAO_UUID} from "../../services/auth.service";

export const DespesaContext = createContext( {
    verboHttp:[],
    setVerboHttp(){},

    idDespesa:"",
    setIdDespesa(){},

    initialValues:"",
    setInitialValues(){},

    valores_iniciais:[],

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
        valor_total: "",
        valor_recursos_proprios: "",
        // Auxiliares
        mais_de_um_tipo_despesa: "",
        valor_recusos_acoes:0,
        valor_total_dos_rateios:0,
        // Fim Auxiliares
        rateios: [
            {
                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                conta_associacao: "",
                acao_associacao: "",
                aplicacao_recurso: "CUSTEIO",
                tipo_custeio: "1",
                especificacao_material_servico: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
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
        valor_total: "",
        valor_recursos_proprios: "",
        // Auxiliares
        mais_de_um_tipo_despesa: "",
        valor_recusos_acoes:0,
        valor_total_dos_rateios:0,
        // Fim Auxiliares
        rateios: [
            {
                associacao: localStorage.getItem(ASSOCIACAO_UUID),
                conta_associacao: "",
                acao_associacao: "",
                aplicacao_recurso: "CUSTEIO",
                tipo_custeio: "1",
                especificacao_material_servico: "",
                valor_rateio: "",
                quantidade_itens_capital: "",
                valor_item_capital: "",
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