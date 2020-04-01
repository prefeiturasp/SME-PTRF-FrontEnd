import React, {useState, createContext, useEffect} from "react";
import Api from "../../services/Api";

export const GetDadosApiDespesaContext = createContext( {
    updateDespesa:[],
    setUpdateDespesa(){},
    tiposCusteio:[],
    setTiposCusteio(){},

    contaAssociacao:[],
    setContaAssociacao(){},
    acoesAssociacao:[],
    setAcoesAssociacao(){},
    tipoAplicacaoRecurso:[],
    setTipoAplicacaoRecurso(){},
    tipoTransacao:[],
    setTipoTransacao(){},
    tipoDocumento:[],
    setTipoDocumento(){},
    despesastabelas:[],
    setDespesasTabelas(){},

    especificacaoMaterialServico:[],
    setEspecificacaoMterialServico(){},

});

export const GetDadosApiDespesaContextProvider = ({children}) => {


    const [despesastabelas, setDespesasTabelas] = useState([]);
    const [updateDespesa, setUpdateDespesa] = useState([]);
    const [tiposCusteio, setTiposCusteio] = useState([]);
    const [contaAssociacao, setContaAssociacao] = useState([]);
    const [acoesAssociacao, setAcoesAssociacao] = useState([]);
    const [tipoAplicacaoRecurso, setTipoAplicacaoRecurso] = useState([]);
    const [tipoTransacao, setTipoTransacao] = useState([]);
    const [tipoDocumento, setTipoDocumento] = useState([]);

    const [especificacaoMaterialServico, setEspecificacaoMterialServico] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('api/despesas/tabelas/')
            setDespesasTabelas(response.data);
        };
        fetchData();
    }, []);

/*    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=1')
            setEspecificacaoMterialServico(response.data);
        };
        fetchData();
    }, [especificacaoMaterialServico]);*/

/*
    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('update-despesa')
            setUpdateDespesa(response.data);
        };
        fetchData();
    }, []);
*/






    return (
        <GetDadosApiDespesaContext.Provider value={
            {
                updateDespesa,
                setUpdateDespesa,
                tiposCusteio,
                setTiposCusteio,
                especificacaoMaterialServico,
                setEspecificacaoMterialServico, 
                contaAssociacao,
                setContaAssociacao,
                acoesAssociacao, 
                setAcoesAssociacao,
                tipoAplicacaoRecurso,
                setTipoAplicacaoRecurso,
                tipoTransacao,
                setTipoTransacao,
                tipoDocumento,
                setTipoDocumento,
                despesastabelas,
                setDespesasTabelas,

            }}>
            {children}
        </GetDadosApiDespesaContext.Provider>
    )

}