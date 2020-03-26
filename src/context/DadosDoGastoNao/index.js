import React, {useState, createContext} from "react";

export const DadosDoGastoNaoContext = createContext( {
    dadosDoGastoNao: [],
    setDadosDoGastoNao(){},
    limpaFormulario(){},
});

export const DadosDoGastoNaoContextProvider = ({children}) => {

    const [dadosDoGastoNao, setDadosDoGastoNao] = useState({
        // Custeio
        associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
        aplicacao_recurso: "",
        tipo_aplicacao_recurso: 1,
        tipo_custeio: 1,
        especificacao_material_servico:"",
        conta_associacao:"conta1",
        acao_associacao:"",
        valor_rateio:'',
        //Capital
        quantidade_itens_capital:'',
        valor_item_capital:'',
        numero_processo_incorporacao_capital:"",
    })

    const limpaFormulario = ()=>{
        setDadosDoGastoNao({
            associacao: "07ac1e8f-de2f-4e71-8e7a-cc6074cf6a69",
            aplicacao_recurso: "",
            tipo_aplicacao_recurso: 1,
            tipo_custeio: 1,
            especificacao_material_servico:"",
            conta_associacao:"conta1",
            acao_associacao:"",
            valor_rateio:'',
            //Capital
            quantidade_itens_capital:'',
            valor_item_capital:'',
            numero_processo_incorporacao_capital:"",
        });
    }

    const handleChangeDadosDoGastoNao = (name, value) => {
        setDadosDoGastoNao({
            ...dadosDoGastoNao,
            [name]: value
        });
    };

    return (
        <DadosDoGastoNaoContext.Provider value={ { dadosDoGastoNao, setDadosDoGastoNao, handleChangeDadosDoGastoNao, limpaFormulario } }>
            {children}
        </DadosDoGastoNaoContext.Provider>
    )
}