import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = () => ({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const atualizarInfoAta = async (uuid_ata, payload) => {
    return (await api.patch(`api/atas-associacao/${uuid_ata}/`, payload, authHeader()))
}

export const getTabelasAtas = async () => {
    return (await api.get(`api/atas-associacao/tabelas/`, authHeader())).data
}

export const getAtas = async (uuid_ata) => {
    return (await api.get(`api/atas-associacao/${uuid_ata}/`, authHeader())).data
}

export const getPreviaAta = async (uuid_associacao, uuid_periodo) => {
    return (await api.get(`api/previas-atas-associacao/${uuid_associacao}/`, authHeader())).data
}

export const getGerarAtaPdf = async (prestacao_conta_uuid, ata_uuid) => {
    return (await api.get(`api/atas-associacao/gerar-arquivo-ata/?prestacao-de-conta-uuid=${prestacao_conta_uuid}&ata-uuid=${ata_uuid}`, authHeader())).data
}

export const getDownloadAtaPdf = async (ata_uuid) => {
    return api
        .get(`api/atas-associacao/download-arquivo-ata/?ata-uuid=${ata_uuid}`, {
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ata.pdf`);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            return error.response;
        });
};

export const getRepassesPendentes = async (associacao_uuid, periodo_uuid) => {
    return (await api.get(`/api/associacoes/${associacao_uuid}/repasses-pendentes-por-periodo/?periodo_uuid=${periodo_uuid}`, authHeader())).data
}

export const getDespesasComPagamentoAntecipado = async (ata_uuid) => {
    return (await api.get(`/api/atas-associacao/ata-despesas-com-pagamento-antecipado/?ata-uuid=${ata_uuid}`, authHeader())).data
}

