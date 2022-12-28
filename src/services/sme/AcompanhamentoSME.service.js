import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
}

export const getResumoDRE = async (dre__uuid="", periodo_uuid="",  nome="", tipo_unidade='', devolucao_tesouro='', status='') => {
    return (await api.get(`/api/prestacoes-contas/todos-os-status/?associacao__unidade__dre__uuid=${dre__uuid}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${tipo_unidade ? '&tipo_unidade=' + tipo_unidade : ''}${devolucao_tesouro ? '&devolucao_tesouro=' + devolucao_tesouro : ''}${status ? '&status=' + status : ''}`, authHeader)).data
};

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

export const getResumoConsolidado = (analise_uuid) => {
    return api.get(`/api/analises-consolidados-dre/${analise_uuid}/`, authHeader)
}

export const gerarPreviaRelatorioDevolucaoAcertosSme = async (uuid) => {    
    if(uuid){
      return (await api.get(`/api/analises-consolidados-dre/previa-relatorio-devolucao-acertos/?analise_consolidado_uuid=${uuid}`,authHeader)).data
    }
  }

export const verificarStatusGeracaoDevolucaoAcertosSme = async (uuid) => {
    return (await api.get(`/api/analises-consolidados-dre/status-info_relatorio_devolucao_acertos/?analise_consolidado_uuid=${uuid}`,authHeader)).data
}

export const downloadDocumentPdfDevolucaoAcertos = async (analise_atual_uuid) => {
    return api
        .get(`/api/analises-consolidados-dre/download-documento-pdf_devolucao_acertos/?analise_consolidado_uuid=${analise_atual_uuid}`, {
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
            link.setAttribute('download', `relatorio_dos_acertos.pdf`);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            return error.response;
        });
  }