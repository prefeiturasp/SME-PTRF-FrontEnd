import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}


export const getDownloadLauda = async (lauda_uuid, filename) => {
    return api
    .get(`api/consolidados-dre/download-lauda/?lauda=${lauda_uuid}`, {
        responseType: 'blob',
        timeout: 30000,
        headers: {
            'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
    }).catch(error => {
        return error.response;
    });
}