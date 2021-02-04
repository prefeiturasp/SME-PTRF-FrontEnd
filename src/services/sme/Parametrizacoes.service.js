import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

// Tags
export const getTodasTags = async () => {
    return (await api.get(`/api/tags/`, authHeader)).data
};

export const getFiltrosTags = async () => {
    return (await api.get(`/api/tags/`, authHeader)).data
};

// Associacoes
export const getAssociacoes = async () => {
    return (await api.get(`/api/associacoes/`, authHeader)).data
};
export const getTabelaAssociacoes = async () => {
    return (await api.get(`/api/associacoes/tabelas/`, authHeader)).data
};
export const getFiltrosAssociacoes = async (tipo_unidade, unidade__dre__uuid, nome) => {
    return (await api.get(`/api/associacoes/?unidade__tipo_unidade=${tipo_unidade}&unidade__dre__uuid=${unidade__dre__uuid}&nome=${nome}`, authHeader)).data
};
export const getAssociacaoPorUuid = async (associacao_uuid) => {
    return (await api.get(`/api/associacoes/${associacao_uuid}/`, authHeader)).data
};
export const getUnidadePeloCodigoEol = async (codigo_eol_unidade) => {
    return (await api.get(`/api/associacoes/eol/?codigo_eol=${codigo_eol_unidade}`, authHeader)).data
};
export const postCriarAssociacao = async (payload) => {
    return (await api.post(`/api/associacoes/`, payload, authHeader)).data
};
export const patchUpdateAssociacao = async (associacao_uuid, payload) => {
    return (await api.patch(`/api/associacoes/${associacao_uuid}/`, payload, authHeader)).data
};
export const deleteAssociacao = async (associacao_uuid) => {
    return (await api.delete(`/api/associacoes/${associacao_uuid}/`, authHeader))
};


// Periodos
export const getTodosPeriodos = async () => {
    return (await api.get(`/api/periodos/`, authHeader)).data
};
export const getFiltrosPeriodos = async (referencia) => {
    return (await api.get(`/api/periodos/?referencia=${referencia}`, authHeader)).data
};
export const getDatasAtendemRegras = async (data_inicio_realizacao_despesas, data_fim_realizacao_despesas, periodo_anterior_uuid, periodo_uuid) => {
    return (await api.get(`/api/periodos/verificar-datas/?data_inicio_realizacao_despesas=${data_inicio_realizacao_despesas}&data_fim_realizacao_despesas=${data_fim_realizacao_despesas}&periodo_anterior_uuid=${periodo_anterior_uuid}${periodo_uuid ? '&periodo_uuid='+periodo_uuid : ''}`, authHeader)).data
};
export const getPeriodoPorUuid = async (periodo_uuid) => {
    return (await api.get(`/api/periodos/${periodo_uuid}/`, authHeader)).data
};
export const postCriarPeriodo = async (payload) => {
    return (await api.post(`/api/periodos/`, payload, authHeader)).data
};
export const patchUpdatePeriodo = async (periodo_uuid, payload) => {
    return (await api.patch(`/api/periodos/${periodo_uuid}/`, payload, authHeader)).data
};
export const deletePeriodo = async (periodo_uuid) => {
    return (await api.delete(`/api/periodos/${periodo_uuid}/`, authHeader))
};

// AcoesDasAssociacoes
export const getTodasAcoesDasAssociacoes = async () => {
    return (await api.get(`/api/acoes-associacoes/`, authHeader)).data
};

export const getListaDeAcoes = async () => {
    return (await api.get(`/api/acoes/`, authHeader)).data
};

export const getFiltros = async (nome='', acao__uuid, status) => {
    return (await api.get(`/api/acoes-associacoes/?nome=${nome}${acao__uuid ? '&acao__uuid='+acao__uuid : ''}${status ? '&status='+status : ''}`, authHeader)).data
};

export const postAddAcaoAssociacao = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/`, payload, authHeader)).data
};

export const putAtualizarAcaoAssociacao = async (acao_associacao_uuid, payload) => {
    return (await api.put(`/api/acoes-associacoes/${acao_associacao_uuid}/`, payload, authHeader)).data
};

export const deleteAcaoAssociacao = async (acao_associacao_uuid) => {
    return (await api.delete(`/api/acoes-associacoes/${acao_associacao_uuid}/`, authHeader))
};

export const getRateiosAcao = async (acao_associacao_uuid, associacao_uuid) => {
    return (await api.get(`api/rateios-despesas/?acao_associacao__uuid=${acao_associacao_uuid}&associacao__uuid=${associacao_uuid}`, authHeader)).data
};

export const getReceitasAcao = async (associacao_uuid, acao_associacao_uuid) => {
    return (await api.get(`api/receitas/?associacao__uuid=${associacao_uuid}&acao_associacao__uuid=${acao_associacao_uuid}`, authHeader)).data
};


export const getAcoesFiltradas = async (nome='') => {
    return (await api.get(`/api/acoes/?nome=${nome}`, authHeader)).data
};

export const postAddAcao = async (payload) => {
    return (await api.post(`/api/acoes/`, payload, authHeader)).data
};

export const putAtualizarAcao = async (acao_uuid, payload) => {
    return (await api.put(`/api/acoes/${acao_uuid}/`, payload, authHeader)).data
};

export const deleteAcao = async (acao_uuid) => {
    return (await api.delete(`/api/acoes/${acao_uuid}/`, authHeader))
};

export const getUnidadesPorAcao = async (acao_uuid, nome="") => {
    return (await api.get(`api/acoes-associacoes/?acao__uuid=${acao_uuid}&nome=${nome}`, authHeader)).data
};

export const getAcao = async (uuid='') => {
    return (await api.get(`/api/acoes/${uuid}/`, authHeader)).data
};

export const deleteAcoesAssociacoesEmLote = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/excluir-lote/`, payload, authHeader)).data
};

export const getAssociacoesNaoVinculadasAAcao = async (acao_uuid, nome="") => {
    if (nome === ""){
        return (await api.get(`api/acoes/${acao_uuid}/associacoes-nao-vinculadas/`, authHeader)).data
    }
    else {
        return (await api.get(`api/acoes/${acao_uuid}/associacoes-nao-vinculadas-por-nome/${nome}/`, authHeader)).data
    }

};

export const addAcoesAssociacoesEmLote = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/incluir-lote/`, payload, authHeader)).data
};
