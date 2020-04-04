import React, {useState, createContext, useEffect} from "react";
import Api from "../../services/Api";

export const GetDadosApiDespesaContext = createContext( {
    despesastabelas:[],
    setDespesasTabelas(){},

    especificacaoMaterialServico:[],
    setEspecificacaoMterialServico(){},

    getReceitas(){}

});

export const GetDadosApiDespesaContextProvider = ({children}) => {

    const [despesastabelas, setDespesasTabelas] = useState([]);
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

    const getReceitas = async (idAssociacao) => {
        const response = await Api.get(`api/receitas/`)
        return response
    }



    return (
        <GetDadosApiDespesaContext.Provider value={
            {

                getDespesa,
                getReceitas,


                especificacaoMaterialServico,
                setEspecificacaoMterialServico,

                despesastabelas,
                setDespesasTabelas,

            }}>
            {children}
        </GetDadosApiDespesaContext.Provider>
    )

}