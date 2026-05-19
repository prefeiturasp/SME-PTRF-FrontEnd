import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});


/**
 * Extrai o nome do arquivo enviado em Content-Disposition (ex.: Django FileResponse).
 * @param {string|undefined} header
 */
function nomeArquivoContentDisposition(header) {
    if (!header || typeof header !== 'string') {
        return null;
    }
    const utfMatch = header.match(/filename\*=UTF-8''([^;\s]+)|filename\*=([^']*)''([^;\s]+)/i);
    if (utfMatch) {
        const raw = utfMatch[1] || utfMatch[3];
        try {
            return decodeURIComponent(raw);
        } catch (e) {
            return raw;
        }
    }
    const asciiMatch = header.match(/filename="((?:[^"\\]|\\.)*)"|filename=([^;\n]+)/i);
    if (asciiMatch) {
        const raw = (asciiMatch[1] || asciiMatch[2] || '').trim();
        return raw.replace(/^["']|["']$/g, '');
    }
    return null;
}


export const getDownloadLauda = async (lauda_uuid, filenameFallback = 'Lauda.pdf') => {
    return api
    .get(`api/consolidados-dre/download-lauda/?lauda=${lauda_uuid}`, {
        responseType: 'blob',
        timeout: 30000,
        ...authHeader()
    })
    .then((response) => {
        const disposition = response.headers?.['content-disposition']
            ?? response.headers?.['Content-Disposition'];
        const filename = nomeArquivoContentDisposition(disposition) || filenameFallback;
        const blob = response.data instanceof Blob ? response.data : new Blob([response.data]);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        if (typeof link.remove === 'function') {
            link.remove();
        }
        window.URL.revokeObjectURL(url);
    }).catch(error => {
        return error.response;
    });
}