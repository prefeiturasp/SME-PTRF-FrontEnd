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


export const getUsuarios = async () =>{
    const result = (await api.get(`/api/usuarios-v2/`, authHeader))
    console.log('getUsuarios', result)
    return result.data
    // return (await api.get(`/api/usuarios-v2/`, authHeader)).data
};
