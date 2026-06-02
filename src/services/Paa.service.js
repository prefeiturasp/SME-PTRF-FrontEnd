import api from './api/index.js';
import { TOKEN_ALIAS } from './auth.service.js';

const authHeader = () => ({
    headers: {
        Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json',
    },
});

export const downloadDocumentoFinalPaa = async (paaUuid, opts = {}) => {
    const requestConfig = {
        responseType: 'blob',
        timeout: 30000,
        ...authHeader(),
    };
    if (opts.retificacao !== undefined) {
        requestConfig.params = { retificacao: opts.retificacao ? 'true' : 'false' };
    }
    const response = await api.get(`api/paa/${paaUuid}/documento-final/`, requestConfig);

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `plano_anual_${paaUuid}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export const getDownloadAtaPaa = async (ata_paa_uuid) => {
    return await api
        .get(`/api/atas-paa/download-arquivo-ata-paa/?ata-paa-uuid=${ata_paa_uuid}`, {
            responseType: 'blob',
            timeout: 30000,
            ...authHeader(),
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Ata_Apresentacao_PAA.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        })
        .catch((error) => {
            return error.response;
        });
};
