import api from "./Api";
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}


export const getPeriodos = async () => {
    return (await api.get(`/api/periodos/lookup/`, authHeader)).data
}