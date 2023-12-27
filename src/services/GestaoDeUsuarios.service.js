import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const URL_GRUPOS = '/api/grupos/';
const URL_USUARIOS = '/api/usuarios-v2/';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getGrupos = async (visaoBase) => {
    return (await api.get(URL_GRUPOS, {
        ...authHeader,
        params: {
            visao_base: visaoBase,
        }
    })).data
};

export const getGruposDisponiveisAcessoUsuario = async (username, visao_base, uuid_unidade) => {
    const response = await api.get(`${URL_GRUPOS}grupos-disponiveis-por-acesso-visao`, {
        params: {
            username: username,
            visao_base: visao_base,
            uuid_unidade: uuid_unidade
        }
    });
    return response.data;
};

export const patchDesabilitarGrupoAcesso = async (payload) => {
    return (await api.patch(`${URL_GRUPOS}desabilitar-grupo-acesso/`, {
            ...payload
        },
        authHeader,
    ))
};

export const patchHabilitarGrupoAcesso = async (payload) => {
    return (await api.patch(`${URL_GRUPOS}habilitar-grupo-acesso/`, {
            ...payload
        },
        authHeader,
    ))
};


export const getUsuarios = async (uuidUnidadeBase, filter, currentPage) => {
    const {search, grupo, tipoUsuario, nomeUnidade, apenasUsuariosDaUnidade} = filter;

    let unidades__uuid = null;
    if (apenasUsuariosDaUnidade && uuidUnidadeBase !== 'SME') {
        unidades__uuid = uuidUnidadeBase;
    }

    let visoes__nome = null;
    if (apenasUsuariosDaUnidade && uuidUnidadeBase === 'SME') {
        visoes__nome = 'SME';
    }
    const result = (await api.get(URL_USUARIOS, {
        ...authHeader,
        params: {
            uuid_unidade_base: uuidUnidadeBase,
            page: currentPage,
            search,
            groups__id: grupo,
            e_servidor: tipoUsuario === 'servidor' ? true : tipoUsuario === 'nao-servidor' ? false : null,
            unidades__nome: nomeUnidade,
            unidades__uuid,
            visoes__nome
        }
    }))
    return result.data
};

export const getUsuarioById = async (usuarioId) => {
    const result = (await api.get(`${URL_USUARIOS}${usuarioId}/`, {
        ...authHeader,
    }))
    return result.data
};

export const getUsuarioStatus = async (username, e_servidor, uuid_unidade) =>{
        const result = (await api.get(`${URL_USUARIOS}status/`, {
        ...authHeader,
        params: {
            username,
            e_servidor,
            uuid_unidade,
        }
    }))
    return result.data
};

export const postUsuario = async (payload) => {
    return (await api.post(URL_USUARIOS, payload, authHeader)).data
};

export const putUsuario = async (id, payload) => {
    return (await api.put(`${URL_USUARIOS}${id}/`, payload, authHeader)).data
};

export const removerAcessosUnidadeBase = async (id, uuidUnidadeBase) => {
    return (await api.put(`${URL_USUARIOS}${id}/remover-acessos-unidade-base/${uuidUnidadeBase}/`, {}, authHeader)).data
};

export const getUnidadesUsuario = async(username, visao_base, uuid_unidade) => {
    const response = await api.get(`${URL_USUARIOS}unidades-do-usuario/`, {
        params: {
            username: username,
            visao_base: visao_base,
            uuid_unidade: uuid_unidade
        }
    });
    return response.data;
}

export const patchHabilitarAcesso = async (payload) => {
    return (await api.patch(`${URL_USUARIOS}habilitar-acesso/`, {
            ...payload
        },
        authHeader,
    ))
};

export const patchDesabilitarAcesso = async (payload) => {
    return (await api.patch(`${URL_USUARIOS}desabilitar-acesso/`, {
            ...payload
        },
        authHeader,
    ))
};

export const getUnidadesDisponiveisInclusao = async(username, search, currentPage) => {
    const response = await api.get(`${URL_USUARIOS}unidades-disponiveis-para-inclusao/`, {
        params: {
            page: currentPage,
            username: username,
            search: search,
        }
    });
    return response.data;
}

export const postIncluirUnidade = async (payload) => {
    return (await api.post(`${URL_USUARIOS}incluir-unidade/`, {
        ...payload
    },
        authHeader,
    ))
};
