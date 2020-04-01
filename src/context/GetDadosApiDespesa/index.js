import React, {useState, createContext, useEffect} from "react";
import Api from "../../services/Api";

export const GetDadosApiDespesaContext = createContext( {
    despesastabelas:[],
    setDespesasTabelas(){},

    especificacaoMaterialServico:[],
    setEspecificacaoMterialServico(){},

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



    return (
        <GetDadosApiDespesaContext.Provider value={
            {

                getDespesa,

                especificacaoMaterialServico,
                setEspecificacaoMterialServico, 

                despesastabelas,
                setDespesasTabelas,

            }}>
            {children}
        </GetDadosApiDespesaContext.Provider>
    )

}