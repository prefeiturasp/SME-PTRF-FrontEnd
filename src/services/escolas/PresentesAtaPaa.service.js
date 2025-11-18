import api from "../api";
import { TOKEN_ALIAS } from "../auth.service.js";

const authHeader = () => ({
    headers: {
        Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        "Content-Type": "application/json",
    },
});

export const getListaPresentesPaa = async (uuid_ata) => {
    return (await api.get(`api/presentes-ata-paa/?ata_paa__uuid=${uuid_ata}`, authHeader())).data;
};

export const getListaPresentesPadraoPaa = async (uuid_ata) => {
    return (await api.get(`api/presentes-ata-paa/padrao-de-presentes/?ata_paa_uuid=${uuid_ata}`, authHeader())).data;
};

export const getMembroPorIdentificadorPaa = async (uuid_ata, identificador, data) => {
    return (await api.get(`api/presentes-ata-paa/get-nome-cargo-membro-associacao/?ata_paa_uuid=${uuid_ata}&identificador=${identificador}&data=${data}`, authHeader())).data;
};

export const getProfessorGremioInfo = async (rf) => {
    return (await api.get(`api/presentes-ata-paa/buscar-informacao-professor-gremio/?rf=${rf}`, authHeader())).data;
};

export const postEdicaoAtaPaa = async (ata_uuid, payload) => {
    return (await api.patch(`/api/atas-paa/${ata_uuid}/`, payload, authHeader())).data;
};

export const getParticipantesOrdenadosPorCargoPaa = async (uuid_ata) => {
    return (await api.get(`api/presentes-ata-paa/get-participantes-ordenados-por-cargo/?ata_paa_uuid=${uuid_ata}`, authHeader())).data;
};
