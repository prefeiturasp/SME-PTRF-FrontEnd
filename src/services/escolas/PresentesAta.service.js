import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const getListaPresentesAgrupados = async (uuid_ata) => {
    return (await api.get(`api/presentes-ata/membros-e-nao-membros/?ata_uuid=${uuid_ata}`, authHeader)).data
}

export const getListaPresentes = async (uuid_ata) => {
    return (await api.get(`api/presentes-ata/?ata__uuid=${uuid_ata}`, authHeader)).data
}

export const getListaPresentesPadrao = async (uuid_ata) => {
    return (await api.get(`api/presentes-ata/padrao-de-presentes/?ata_uuid=${uuid_ata}`, authHeader)).data
}

export const getMembroPorIdentificador = async (uuid_ata, identificador) => {
    return (await api.get(`api/presentes-ata/get-nome-cargo-membro-associacao/?ata_uuid=${uuid_ata}&identificador=${identificador}`, authHeader)).data
}

export const postEdicaoAta = async (ata_uuid, payload) => {
    return (await api.patch(`/api/atas-associacao/${ata_uuid}/`, payload, authHeader)).data
};