import api from './Api'

const authHeader = {
    'Content-Type': 'application/json'
}

export const deleteDespesa = async uuid => {
    return (await api.delete(`api/despesas/${uuid}/`, authHeader)).data
}

export const getDespesasTabelas = async () => {
    return (await api.get(`api/despesas/tabelas/`, authHeader)).data
}

export const getEspecificacaoMaterialServico = async (aplicacao_recurso, tipo_custeio) => {
    //console.log("getEspecificacaoMaterialServico aplicacao_recurso |", aplicacao_recurso)
    //console.log("getEspecificacaoMaterialServico tipo_custeio | ", tipo_custeio)

    if (aplicacao_recurso === "CUSTEIO") {

        return (
            await api.get(`api/especificacoes/?aplicacao_recurso=${aplicacao_recurso}&tipo_custeio=${tipo_custeio}`, authHeader)
        ).data

    } else if (aplicacao_recurso === "CAPITAL") {

        return (
            await api.get(`api/especificacoes/?aplicacao_recurso=${aplicacao_recurso}`, authHeader)
        ).data
    }
}

export const getEspecificacoesCapital = async () => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CAPITAL`, authHeader)).data
}

export const getEspecificacoesCusteio = async (id_tipo_custeio) => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=${id_tipo_custeio}`, authHeader)).data
}

/*
export const getEspecificacoesCusteioMaterial = async () => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=1`, authHeader)).data
}

export const getEspecificacoesCusteioServicos = async () => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=2`, authHeader)).data
}

export const getEspecificacoesCusteioImpostos = async () => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=3`, authHeader)).data
}

export const getEspecificacoesCusteioTarifas = async () => {
    return (await api.get(`api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=6`, authHeader)).data
}


*/
export const getDespesa = async (idDespesa) => {
    return (await api.get(`api/despesas/${idDespesa}`, authHeader)).data
}

export const criarDespesa = async (payload) => {
    return api.post('api/despesas/', payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
}

export const alterarDespesa = async (payload, idDespesa) => {
    return api.put(`api/despesas/${idDespesa}`, payload, authHeader).then(response => {
        return response;
    }).catch(error => {
        return error.response;
    });
}

