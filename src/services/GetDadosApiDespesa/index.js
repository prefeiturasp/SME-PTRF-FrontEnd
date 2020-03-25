import  {useState, useEffect} from "react";
import Api from "../Api";

export const GetEspecificacaoMaterialServicoApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('especificacao_material_servico')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}

export const GetContasAssociacaoApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('contas_associacao')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}

export const GetAcoesAssociacaoApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('acoes_associacao')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}

export const GetTiposCusteioApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('tipos_custeio')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}
export const GetTiposAplicacaoRecursoApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('tipos_aplicacao_recurso')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}

export const GetTipoTransacaoApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('tipos_transacao')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}

export const GetTiposDeDocumentoApi = () =>{
    const [retornApi, setRetornoApi] = useState([]);
    useEffect(() => {
        async function loadApi() {
            const response = await Api.get('tipos_documento')
            setRetornoApi(response.data)
        }
        loadApi();
    }, [])
    return retornApi
}




