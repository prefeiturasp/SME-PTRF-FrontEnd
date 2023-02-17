import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";
import moment from "moment/moment";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

// Consolidado DRE

export const getConsolidadoDre = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`/api/consolidados-dre/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
};

export const getConsolidadoDrePorUuid = async (consolidado_uuid) => {
    return (await api.get(`/api/consolidados-dre/${consolidado_uuid}`, authHeader)).data
};

export const getConsolidadoDrePorUuidAtaDeParecerTecnico = async (ata_de_parecer_tecnico_uuid) => {
    return (await api.get(`/api/consolidados-dre/consolidado-dre-por-ata-uuid/?ata=${ata_de_parecer_tecnico_uuid}`, authHeader)).data
};


export const getConsolidadosDreJaPublicadosProximaPublicacao = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`/api/consolidados-dre/publicados-e-proxima-publicacao/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
};

export const getStatusConsolidadoDre = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`/api/consolidados-dre/status-consolidado-dre/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
};

export const postPublicarConsolidadoDre = async (payload) => {
    return (await api.post(`/api/consolidados-dre/publicar/`, payload, authHeader)).data
};

export const getStatusRelatorioConsolidadoDePublicacoesParciais = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`/api/consolidados-dre/retorna-status-relatorio-consolidado-de-publicacoes-parciais/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
};

export const postGerarPreviaConsolidadoDre = async (payload) => {
    return (await api.post(`/api/consolidados-dre/gerar-previa/`, payload, authHeader)).data
};

export const postCriarAtaAtrelarAoConsolidadoDre = async (payload) => {
    return (await api.post(`/api/consolidados-dre/criar-ata-e-atelar-ao-consolidado/`, payload, authHeader)).data
};

export const postMarcarComoPublicadoNoDiarioOficial = async (payload) => {
    return (await api.post(`/api/consolidados-dre/marcar-como-publicado-no-diario-oficial/`, payload, authHeader)).data
};

export const postDesmarcarComoPublicadoNoDiarioOficial = async (payload) => {
    return (await api.post(`/api/consolidados-dre/marcar-como-nao-publicado-no-diario-oficial/`, payload, authHeader)).data
};


export const getDownloadRelatorio = async (relatorio_uuid, versao) => {
    return api
        .get(`/api/consolidados-dre/${relatorio_uuid}/download-relatorio-consolidado`, {
            responseType: 'blob',
            timeout: 30000,
            headers: {
                'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
                'Content-Type': 'application/json',
            }
        })
        .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const filename = versao === "FINAL" ? 'relatorio_fisico_financeiro_dre.pdf' : versao === "CONSOLIDADA" ? "relatorio_fisico_financeiro_CONSOLIDADO_dre.pdf" : 'previa_relatorio_fisico_financeiro_dre.pdf'
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        }).catch(error => {
            return error.response;
        });
};

export const devolverConsolidado = async (consolidado_uuid, dataLimiteDevolucao) => {
    return (await api.patch(
        `/api/consolidados-dre/${consolidado_uuid}/devolver-consolidado/`,
        {data_limite: moment(dataLimiteDevolucao).format("YYYY-MM-DD")},
        authHeader)).data
};

// FIM Consolidado DRE

export const getFiqueDeOlhoRelatoriosConsolidados = async () => {
    return (await api.get(`/api/relatorios-consolidados-dre/fique-de-olho/`, authHeader)).data
};

export const getConsultarStatus = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/status-relatorio/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getTiposConta = async () => {
    return (await api.get(`/api/tipos-conta/`, authHeader)).data
};

export const getExecucaoFinanceira = async (dre_uuid, periodo_uuid, consolidado_dre_uuid='') => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-execucao-financeira/?dre=${dre_uuid}&periodo=${periodo_uuid}${consolidado_dre_uuid ? '&consolidado_dre=' + consolidado_dre_uuid : ""}`, authHeader)).data
};

export const getDevolucoesContaPtrf = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-devolucoes-conta/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getJustificativa = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/justificativas-relatorios-consolidados-dre/?dre__uuid=${dre_uuid}&periodo__uuid=${periodo_uuid}&tipo_conta__uuid=${conta_uuid}`, authHeader)).data
};

export const postJustificativa = async (payload) => {
    return (await api.post(`/api/justificativas-relatorios-consolidados-dre/`, payload, authHeader)).data
};

export const patchJustificativa = async (justificativa_uuid, payload) => {
    return (await api.patch(`/api/justificativas-relatorios-consolidados-dre/${justificativa_uuid}/`, payload, authHeader)).data
};

export const getDevolucoesAoTesouro = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-devolucoes-ao-tesouro/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getItensDashboard = async (uuid_periodo) => {
    return (await api.get(`/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&add_aprovadas_ressalva=SIM`, authHeader)).data
};

export const getItensDashboardComDreUuid = async (uuid_periodo, dre_uuid) => {
    return (await api.get(`/api/prestacoes-contas/dashboard/?periodo=${uuid_periodo}&dre_uuid=${dre_uuid}&add_aprovadas_ressalva=SIM`, authHeader)).data
};

export const getListaPrestacaoDeContasDaDre = async (dre_uuid, periodo_uuid, conta_uuid) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-execucao-financeira-unidades/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}`, authHeader)).data
};

export const getTiposDeUnidade = async () => {
    return (await api.get(`/api/associacoes/tabelas/`, authHeader)).data
};

export const getStatusPc = async () => {
    return (await api.get(`/api/prestacoes-contas/tabelas/`, authHeader)).data
};

export const getListaPrestacaoDeContasDaDreFiltros = async (dre_uuid, periodo_uuid, conta_uuid, nome, tipo_unidade, status) => {
    return (await api.get(`/api/relatorios-consolidados-dre/info-execucao-financeira-unidades/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}${nome ? '&nome='+nome : ''}${tipo_unidade ? '&tipo_unidade='+tipo_unidade : ''}${status ? '&status='+status : ''}`, authHeader)).data
};

export const putCriarEditarDeletarObservacaoDevolucaoContaPtrf = async (dre_uuid, periodo_uuid, conta_uuid, tipo_devolucao_uuid, payload) =>{
    return (await api.put(`/api/relatorios-consolidados-dre/update-observacao-devolucoes-a-conta/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}&tipo_devolucao=${tipo_devolucao_uuid}`, payload, authHeader)).data
};

export const putCriarEditarDeletarObservacaoDevolucaoTesouro = async (dre_uuid, periodo_uuid, conta_uuid, tipo_devolucao_uuid, payload) =>{
    return (await api.put(`/api/relatorios-consolidados-dre/update-observacao-devolucoes-ao-tesouro/?dre=${dre_uuid}&periodo=${periodo_uuid}&tipo_conta=${conta_uuid}&tipo_devolucao=${tipo_devolucao_uuid}`, payload, authHeader)).data
};

export const postGerarRelatorio = async (payload) => {
    return (await api.post(`/api/relatorios-consolidados-dre/gerar-relatorio/`, payload, authHeader)).data
};

export const postGerarPreviaRelatorio = async (payload) => {
    return (await api.post(`/api/relatorios-consolidados-dre/previa/`, payload, authHeader)).data
};

export const postGerarLauda = async (payload) => {
    return (await api.post(`/api/relatorios-consolidados-dre/gerar-lauda/`, payload, authHeader)).data
};

export const getListaAssociacoesNaoRegularizadas = async (dre_uuid) => {
    return (await api.get(`/api/associacoes/?unidade__dre__uuid=${dre_uuid}&status_regularidade=PENDENTE`, authHeader)).data
};

export const getStatusAta = async (dre_uuid, periodo_uuid) => {
    return (await api.get(`/api/ata-parecer-tecnico/status-ata/?dre=${dre_uuid}&periodo=${periodo_uuid}`, authHeader)).data
}

export const getTrilhaStatus = async (dre_uuid, uuid_periodo) => {
    return (await api.get(`/api/consolidados-dre/trilha-de-status/?dre=${dre_uuid}&periodo=${uuid_periodo}`, authHeader)).data
};

export const getPcsRetificaveis = async (consolidado_uuid) => {
    return (await api.get(`/api/consolidados-dre/${consolidado_uuid}/pcs-retificaveis/`, authHeader)).data
};

export const postRetificarPcs = async (consolidado_uuid, payload) => {
    return (await api.post(`/api/consolidados-dre/${consolidado_uuid}/retificar/`, payload, authHeader)).data
};

export const getPcsEmRetificacao = async (consolidado_uuid) => {
    return (await api.get(`/api/consolidados-dre/${consolidado_uuid}/pcs_em_retificacao/`, authHeader)).data
};

export const postDesfazerRetificacaoPcs = async (consolidado_uuid, payload) => {
    return (await api.post(`/api/consolidados-dre/${consolidado_uuid}/desfazer_retificacao/`, payload, authHeader)).data
};

export const updateRetificarPcs = async (consolidado_uuid, payload) => {
    return (await api.post(`/api/consolidados-dre/${consolidado_uuid}/update_retificacao/`, payload, authHeader)).data
};

export const patchMotivoRetificaoPcs = async (consolidado_uuid, payload) => {
    return (await api.patch(`/api/consolidados-dre/${consolidado_uuid}/update_motivo_retificacao/`, payload, authHeader)).data
};