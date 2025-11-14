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
