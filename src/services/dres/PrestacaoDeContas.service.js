import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';
import {ASSOCIACAO_UUID} from "../auth.service";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

export const getPrestacoesDeContas = async (periodo_uuid="",  nome="", associacao__unidade__tipo_unidade='', status="", tecnico_uuid="", data_inicio="", data_fim="") => {
    return (await api.get(`/api/prestacoes-contas/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${associacao__unidade__tipo_unidade ? '&associacao__unidade__tipo_unidade=' + associacao__unidade__tipo_unidade : ''}${status ? '&status=' + status : ''}${tecnico_uuid ? '&tecnico=' + tecnico_uuid : ''}${data_inicio ? '&data_inicio='+data_inicio : ''}${data_fim ? '&data_fim='+data_fim : ''}`, authHeader)).data
};

export const getPrestacoesDeContasNaoRecebidaNaoGerada = async (periodo_uuid="",  nome="", tipo_unidade='') => {
    return (await api.get(`/api/prestacoes-contas/nao-recebidas/?associacao__unidade__dre__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo__uuid=${periodo_uuid}${nome ? '&nome=' + nome : ''}${tipo_unidade ? '&tipo_unidade=' + tipo_unidade : ''}`, authHeader)).data
};

export const getQtdeUnidadesDre = async () => {
    return (await api.get(`/api/dres/${localStorage.getItem(ASSOCIACAO_UUID)}/qtd-unidades/`, authHeader)).data
};

export const getTabelasPrestacoesDeContas = async () => {
    return (await api.get(`/api/prestacoes-contas/tabelas/`, authHeader)).data
};

export const getPrestacaoDeContasDetalhe = async (prestacao_conta_uuid) => {
    return (await api.get(`/api/prestacoes-contas/${prestacao_conta_uuid}/`, authHeader)).data
};

export const getReceberPrestacaoDeContas = async (prestacao_conta_uuid, payload) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/receber/`, payload, authHeader)).data
};

export const getReabrirPrestacaoDeContas = async (prestacao_conta_uuid) => {
    return (await api.delete(`/api/prestacoes-contas/${prestacao_conta_uuid}/reabrir/`, authHeader))
};

export const getListaDeCobrancas = async (prestacao_conta_uuid) => {
    return (await api.get(`/api/cobrancas-prestacoes-contas/?prestacao_conta__uuid=${prestacao_conta_uuid}&tipo=RECEBIMENTO`, authHeader)).data
};

export const getListaDeCobrancasPcNaoApresentada = async (associacao_uuid, periodo_uuid) => {
    return (await api.get(`/api/cobrancas-prestacoes-contas/?associacao__uuid=${associacao_uuid}&periodo__uuid=${periodo_uuid}&tipo=RECEBIMENTO`, authHeader)).data
};

export const getAddCobranca = async (payload) => {
    return (await api.post(`/api/cobrancas-prestacoes-contas/`, payload, authHeader)).data
};

export const getDeletarCobranca = async (cobranca_prestacao_recebimento_uuid) => {
    return (await api.delete(`/api/cobrancas-prestacoes-contas/${cobranca_prestacao_recebimento_uuid}/`, authHeader))
};

export const getDesfazerRecebimento = async (prestacao_conta_uuid) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-recebimento/`, {}, authHeader)).data
};

export const getAnalisarPrestacaoDeContas = async (prestacao_conta_uuid) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/analisar/`, {}, authHeader)).data
};

export const getDesfazerAnalise = async (prestacao_conta_uuid) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-analise/`, {}, authHeader)).data
};

export const getSalvarAnalise = async (prestacao_conta_uuid, payload) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/salvar-analise/`, payload, authHeader)).data
};

export const getInfoAta = async (prestacao_conta_uuid) => {
    return (await api.get(`/api/prestacoes-contas/${prestacao_conta_uuid}/info-para-ata/`,authHeader)).data
};

export const getConcluirAnalise = async (prestacao_conta_uuid, payload) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/concluir-analise/`, payload, authHeader)).data
};

export const getListaDeCobrancasDevolucoes = async (prestacao_conta_uuid, devolucao_uuid) => {
    return (await api.get(`/api/cobrancas-prestacoes-contas/?prestacao_conta__uuid=${prestacao_conta_uuid}&tipo=DEVOLUCAO&devolucao_prestacao__uuid=${devolucao_uuid}`, authHeader)).data
};

export const getAddCobrancaDevolucoes = async (payload) => {
    return (await api.post(`/api/cobrancas-prestacoes-contas/`, payload, authHeader)).data
};

export const getDesfazerConclusaoAnalise = async (prestacao_conta_uuid) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/desfazer-conclusao-analise/`, {}, authHeader)).data
};

export const getDespesasPorFiltros = async (associacao_uuid, cpf_cnpj_fornecedor='', tipo_documento__id='', numero_documento='') => {
    return (await api.get(`/api/despesas/?associacao__uuid=${associacao_uuid}&cpf_cnpj_fornecedor=${cpf_cnpj_fornecedor}&tipo_documento__id=${tipo_documento__id}&numero_documento=${numero_documento}`, authHeader)).data
};

export const getTiposDevolucao = async () => {
    return (await api.get(`/api/tipos-devolucao-ao-tesouro/`, authHeader)).data
};

export const getComentariosDeAnalise = async (prestacao_uuid) => {
    return (await api.get(`/api/comentarios-de-analises/?prestacao_conta__uuid=${prestacao_uuid}`, authHeader)).data
};

export const criarComentarioDeAnalise = async (payload) => {
    return (await api.post(`/api/comentarios-de-analises/`, payload, authHeader)).data
};

export const editarComentarioDeAnalise = async (comentario_uuid, payload) => {
    return (await api.patch(`/api/comentarios-de-analises/${comentario_uuid}/`, payload, authHeader)).data
};

export const deleteComentarioDeAnalise = async (comentario_uuid) => {
    return (await api.delete(`/api/comentarios-de-analises/${comentario_uuid}/`, authHeader))
};

export const getReordenarComentarios = async (payload) => {
    return (await api.patch(`/api/comentarios-de-analises/reordenar-comentarios/`, payload, authHeader)).data
};

export const getSalvarDevoulucoesAoTesouro = async (prestacao_conta_uuid, payload) => {
    return (await api.patch(`/api/prestacoes-contas/${prestacao_conta_uuid}/salvar-devolucoes-ao-tesouro/`, payload, authHeader)).data
};

