import api from './api';
import {TOKEN_ALIAS} from "./auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getArquivosDownload = async () => {
    return (await api.get(`/api/arquivos-download/`, authHeader)).data
}

export const getArquivosDownloadFiltros = async(identificador="", status="", ultima_atualizacao="", visto="") => {
    return (await api.get(`/api/arquivos-download/?identificador=${identificador}&status=${status}&ultima_atualizacao=${ultima_atualizacao}&lido=${visto}`, authHeader)).data
}

export const getStatus = async() => {
    return (await api.get(`/api/arquivos-download/status/`, authHeader)).data
}

export const getDownloadArquivo = async (nome_do_arquivo_com_extensao, arquivo_download_uuid) => {
    return ( await api.get(`/api/arquivos-download/download-arquivo/?arquivo_download_uuid=${arquivo_download_uuid}`, {
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
            link.setAttribute('download', nome_do_arquivo_com_extensao);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            return error.response;
        })

    )
}

export const deleteArquivo = async (arquivo_download_uuid) => {
    return (await api.delete(`/api/arquivos-download/${arquivo_download_uuid}`, authHeader)).data
}


export const putMarcarDesmarcarLido = async (payload) => {
    return (await api.put(`/api/arquivos-download/marcar-lido/`, payload, authHeader)).data
}


export const getQuantidadeNaoLidas = async() => {
    return (await api.get(`/api/arquivos-download/quantidade-nao-lidos/`, authHeader)).data
}