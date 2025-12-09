import api from "../api";
import { TOKEN_ALIAS } from "../auth.service.js";

const authHeader = () => ({
    headers: {
        Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        "Content-Type": "application/json",
    },
});

export const getTabelasAtasPaa = async () => {
    return (await api.get(`api/atas-paa/tabelas/`, authHeader())).data;
};

export const getAtaPaa = async (uuid_ata) => {
    return (await api.get(`api/atas-paa/${uuid_ata}/`, authHeader())).data;
};

export const iniciarAtaPaa = async (paa_uuid) => {
    if (!paa_uuid) {
        throw new Error("É necessário informar o uuid do PAA para iniciar a ata.");
    }
    return (await api.get(`api/atas-paa/iniciar-ata/?paa_uuid=${paa_uuid}`, authHeader())).data;
};

export const obterUrlAtaPaa = async (ata_paa_uuid) => {
    if (!ata_paa_uuid) {
        return null;
    }
    
    try {
        const response = await api.get(`/api/atas-paa/download-arquivo-ata-paa/?ata-paa-uuid=${ata_paa_uuid}`, {
            responseType: "blob",
            timeout: 30000,
            ...authHeader()
        });
        const contentType = response?.headers?.["content-type"] || "application/pdf";
        const blob = new Blob([response.data], { type: contentType });
        return window.URL.createObjectURL(blob);
    } catch (error) {
        console.error("Erro ao visualizar a ata PAA:", error);
        return null;
    }
};
