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
    if (aplicacao_recurso === "CUSTEIO") {
        return (await api.get(`api/especificacoes/?aplicacao_recurso=${aplicacao_recurso}&tipo_custeio=${tipo_custeio}`, authHeader)).data
    } else if (aplicacao_recurso === "CAPITAL") {
        return (await api.get(`api/especificacoes/?aplicacao_recurso=${aplicacao_recurso}`, authHeader)).data
    }
}

export const getDespesa = async (idDespesa) => {
    console.log("GetDespesa" , idDespesa)
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

