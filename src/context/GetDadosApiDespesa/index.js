import React, {useState, createContext, useEffect, useContext} from "react";
import Api from "../../services/Api";
import {DadosDoGastoContext} from "../DadosDoGasto";

export const GetDadosApiDespesaContext = createContext( {

    despesa:[],
    setDespesa(){},

    updateDespesa:[],
    setUpdateDespesa(){},

    despesastabelas:[],
    setDespesasTabelas(){},

    especificacaoMaterialServico:[],
    setEspecificacaoMterialServico(){},

});

export const GetDadosApiDespesaContextProvider = ({children}) => {
    const dadosDoGastoContext = useContext(DadosDoGastoContext);

    const [despesa, setDespesa] = useState([]);
    const [despesastabelas, setDespesasTabelas] = useState([]);
    const [updateDespesa, setUpdateDespesa] = useState([]);


    const [especificacaoMaterialServico, setEspecificacaoMterialServico] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('api/despesas/tabelas/')
            setDespesasTabelas(response.data);
        };
        fetchData();
    }, []);

    const getDespesa = async (idAssociacao) => {
        const response = await Api.get(`api/despesas/${idAssociacao}/`)
        return response
    }



    return (
        <GetDadosApiDespesaContext.Provider value={
            {
                despesa,
                setDespesa,
                getDespesa,

                updateDespesa,
                setUpdateDespesa,

                especificacaoMaterialServico,
                setEspecificacaoMterialServico, 

                despesastabelas,
                setDespesasTabelas,

            }}>
            {children}
        </GetDadosApiDespesaContext.Provider>
    )

}