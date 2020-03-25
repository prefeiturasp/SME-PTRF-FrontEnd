import React, {useState, createContext} from "react";

export const DadosDoGastoNaoContext = createContext( {
    dadosDoGastoNao: [],
    setDadosDoGastoNao(){},
});

export const DadosDoGastoNaoContextProvider = ({children}) => {

    const [dadosDoGastoNao, setDadosDoGastoNao] = useState({
        // Custeio
        associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
        aplicacao_recurso: "",
        tipo_aplicacao_recurso: 1,
        tipo_custeio: 1,
        especificacao_material_servico:"servico",
        conta_associacao:"conta1",
        acao_associacao:"",
        valor_rateio:0,
        //Capital
        quantidade_itens_capital:0,
        valor_item_capital:0,
        numero_processo_incorporacao_capital:"",
    })

    const handleChangeDadosDoGastoNao = (name, value) => {
        setDadosDoGastoNao({
            ...dadosDoGastoNao,
            [name]: value
        });
    };

    return (
        <DadosDoGastoNaoContext.Provider value={ { dadosDoGastoNao, setDadosDoGastoNao, handleChangeDadosDoGastoNao } }>
            {children}
        </DadosDoGastoNaoContext.Provider>
    )
}