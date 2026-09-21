import api from "./api";
import { TOKEN_ALIAS } from "./auth.service.js";

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

export const getFiqueDeOlho = async (tipo_texto, recurso_uuid) => {
    const params = new URLSearchParams();

    if (tipo_texto)
        params.append('tipo_texto', tipo_texto);
    if (recurso_uuid)
        params.append('recurso_uuid', recurso_uuid);

    return (await api.get(
        `/api/fique-de-olho/?${params.toString()}`,
        authHeader()
    )).data
};
