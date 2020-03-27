import React, {useState, createContext, useEffect} from "react";
import Api from "../../services/Api";

export const GetDadosApiDespesaContext = createContext( {
    tiposCusteio:[],
    setTiposCusteio(){},
    especificacaoMterialServico:[],
    setEspecificacaoMterialServico(){},
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
});

export const GetDadosApiDespesaContextProvider = ({children}) => {

    const [tiposCusteio, setTiposCusteio] = useState([]);
    const [especificacaoMterialServico, setEspecificacaoMterialServico] = useState([]);
    const [contaAssociacao, setContaAssociacao] = useState([]);
    const [acoesAssociacao, setAcoesAssociacao] = useState([]);
    const [tipoAplicacaoRecurso, setTipoAplicacaoRecurso] = useState([]);
    const [tipoTransacao, setTipoTransacao] = useState([]);
    const [tipoDocumento, setTipoDocumento] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('tipos_custeio')
            setTiposCusteio(response.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('especificacao_material_servico')
            setEspecificacaoMterialServico(response.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('contas_associacao')
            setContaAssociacao(response.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('acoes_associacao')
            setAcoesAssociacao(response.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('tipos_aplicacao_recurso')
            setTipoAplicacaoRecurso(response.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('tipos_transacao')
            setTipoTransacao(response.data);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await Api.get('tipos_documento')
            setTipoDocumento(response.data);
        };
        fetchData();
    }, []);


    return (
        <GetDadosApiDespesaContext.Provider value={
            {
                tiposCusteio, 
                setTiposCusteio, 
                especificacaoMterialServico, 
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


            }}>
            {children}
        </GetDadosApiDespesaContext.Provider>
    )

}