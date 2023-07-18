import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getGrupos = async (visaoBase) => {
    return (await api.get(`/api/grupos/`, {
        ...authHeader,
        params: {
            visao_base: visaoBase,
        }
    })).data
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
    const result = (await api.get(`/api/usuarios-v2/`, {
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
