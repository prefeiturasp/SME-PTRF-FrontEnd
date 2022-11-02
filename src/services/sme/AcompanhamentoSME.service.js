import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const detalhamentoConsolidadoDRE = (uuid_consolidado) => {
    return api.get(`/api/consolidados-dre/detalhamento/?uuid=${uuid_consolidado}`, authHeader)
}

export const detalhamentoConferenciaDocumentos = (uuid_consolidado, uuid_analise_atual=null) => {
    return api.get(`/api/consolidados-dre/detalhamento-conferencia-documentos/?uuid=${uuid_consolidado}${uuid_analise_atual ? "&analise_atual="+uuid_analise_atual : ''}`, authHeader)
}

export const deleteReabreConsolidadoDRE = (uuid_consolidado) => {
    return api.delete(`/api/consolidados-dre/reabrir-consolidado/?uuid=${uuid_consolidado}`, authHeader)
}

export const getTodosOsResponsaveis = async (visao='SME') => {
    return (await api.get(`/api/usuarios/usuarios-servidores-por-visao/?visao=${visao}`, authHeader)).data
}

export const postAnalisarRelatorio = async (payload) => {
    return await api.post(`/api/consolidados-dre/analisar/`, payload , authHeader)
}

export const postMarcarComoPublicadoNoDiarioOficial = async (payload) => {
    return await api.post(`/api/consolidados-dre/marcar-como-publicado-no-diario-oficial/`, payload , authHeader)
}

export const postMarcarComoAnalisado= async (payload) => {
    return await api.post(`/api/consolidados-dre/marcar-como-analisado/`, payload , authHeader)
}

export const gravarAcertosDocumentos = (payload) => {
    return api.post(`/api/analises-documentos-consolidados-dre/gravar-acerto/`, payload, authHeader)
}

export const marcarAcertosDocumentosComoCorreto = (payload) => {
    return api.patch(`/api/analises-documentos-consolidados-dre/marcar-como-correto/`, payload, authHeader)
}

export const marcarAcertosDocumentosComoNaoCorreto = (payload) => {
    return api.patch(`/api/analises-documentos-consolidados-dre/marcar-como-nao-conferido/`, payload, authHeader)
}

export const downloadDocumentoRelatorio = (documento) => {
    return api.get(`/api/analises-documentos-consolidados-dre/download-documento/?tipo_documento=${documento.tipo_documento}&documento_uuid=${documento.uuid}`, {
        responseType: 'blob',
        timeout: 30000,
        ...authHeader
    })
}