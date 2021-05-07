import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getUsuario = async (id_usuario) =>{
    return (await api.get(`/api/usuarios/${id_usuario}`, authHeader)).data
};

export const getUsuarioStatus = async (username, e_servidor, uuid_unidade="") =>{
    return (await api.get(`/api/usuarios/status/?username=${username}&servidor=${e_servidor}${uuid_unidade ? "&unidade=" + uuid_unidade : "" }`, authHeader)).data
};

export const getCodigoEolUnidade = async (uuid_unidade) =>{
    return (await api.get(`/api/unidades/${uuid_unidade}`, authHeader)).data
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
    return (await api.put(`/api/usuarios/${usuario_id}/`, payload, authHeader)).data
};

export const deleteUsuario = async (usuario_id) => {
    return (await api.delete(`/api/usuarios/${usuario_id}`, authHeader))
};

export const getUsuariosFiltros = async (visao_selecionada, nome="", group="", tipo_de_usuario="") =>{
    return (await api.get(`/api/usuarios/?visao=${visao_selecionada}${nome ? '&search='+nome : ''}${group ? '&groups__id='+group : ''}${tipo_de_usuario ? '&servidor='+tipo_de_usuario : ''}`, authHeader)).data
};
