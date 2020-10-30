import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getGrupos = async (visao_selecionada) =>{
    return (await api.get(`/api/usuarios/grupos/?visao=${visao_selecionada}`, authHeader)).data
};

export const getConsultarUsuario = async (visao_selecionada, username) =>{
    return (await api.get(`/api/usuarios/consultar/?visao=${visao_selecionada}&username=${username}`, authHeader))
};

export const getUsuarios = async (visao_selecionada) =>{
    return (await api.get(`/api/usuarios/?visao=${visao_selecionada}`, authHeader)).data
};

export const postCriarUsuario = async (payload) => {
    return (await api.post(`/api/usuarios/`, payload, authHeader)).data
};

export const putEditarUsuario = async (usuario_id, payload) => {
    return (await api.put(`/api/usuarios/${usuario_id}`, payload, authHeader)).data
};