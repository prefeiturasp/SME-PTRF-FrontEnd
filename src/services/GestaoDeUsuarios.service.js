import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getGrupos = async () =>{
    return (await api.get(`/api/grupos/`, authHeader)).data
};


export const getUsuarios = async (filter) => {
    const {search, grupo, tipoUsuario} = filter;
    const result = (await api.get(`/api/usuarios-v2/`, {
        ...authHeader,
        params: {
            search,
            groups__id: grupo,
            e_servidor: tipoUsuario === 'servidor' ? true : tipoUsuario === 'nao-servidor' ? false : null,
        }
    }))
    return result.data
};