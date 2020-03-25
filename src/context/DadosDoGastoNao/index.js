import React, {useState, createContext} from "react";

export const DadosDoGastoNaoContext = createContext( {
    dadosDoGastoNao: [],
    setDadosDoGastoNao(){},
});

export const DadosDoGastoNaoContextProvider = ({children}) => {

    const [dadosDoGastoNao, setDadosDoGastoNao] = useState({
        tipoDespesa:"custeio",
        tipoCusteio:"tipo_custeio_01",
        especificacaoMaterialServico:"servico",
        valorRecursoAcoes:"",
        tipoDeConta:"conta1",
        valorDoCusteio:"",
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