import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const getAtaParecerTecnico = async (uuid_ata) => {
    return (await api.get(`api/ata-parecer-tecnico/${uuid_ata}/`, authHeader)).data
}

export const getInfoContas = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`api/ata-parecer-tecnico/info-ata/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
}

export const getListaPresentesPadrao = async (dre_uuid, ata_uuid) => {
    return (await api.get(`api/ata-parecer-tecnico/membros-comissao-exame-contas/?dre=${dre_uuid}&ata=${ata_uuid}`, authHeader)).data
}

export const postEdicaoAtaParecerTecnico = async (ata_uuid, payload) => {
    return (await api.patch(`/api/ata-parecer-tecnico/${ata_uuid}/`, payload, authHeader)).data
};

export const getGerarAta = async (ata_uuid, dre_uuid, periodo_uuid) => {
    return (await api.get(`api/ata-parecer-tecnico/gerar-ata-parecer-tecnico/?ata=${ata_uuid}&dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
}

export const getStatusAta = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`api/ata-parecer-tecnico/status-ata/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
}

export const getDownloadAtaParecerTecnico = async (ata_uuid) => {
    return api
    .get(`api/ata-parecer-tecnico/download-ata-parecer-tecnico/?ata=${ata_uuid}`, {
        responseType: 'blob',
        timeout: 30000,
        headers: {
            'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const filename = "ata_parecer_tecnico.pdf"
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    }).catch(error => {
        return error.response;
    });
}