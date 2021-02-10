import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

import Axios from "axios";

const authHeader = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

// ***** Cargas Associacoes *****
export const getTabelaArquivosDeCarga = async () => {
    return (await api.get(`/api/arquivos/tabelas/`, authHeader)).data
};

export const getArquivosDeCargaFiltros = async (tipo_carga, identificador, status, data_execucao) => {
    return (await api.get(`/api/arquivos/?tipo_carga=${tipo_carga}${identificador ? '&identificador='+ identificador : ''}${status ? '&status='+status : ''}${data_execucao ? '&data_execucao='+data_execucao : ''}`, authHeader)).data
};
export const postCreateArquivoDeCarga = async (payload) => {
    const formData = new FormData();
    formData.append("identificador", payload.identificador);
    formData.append("tipo_carga", payload.tipo_carga);
    formData.append("tipo_delimitador", payload.tipo_delimitador);
    formData.append("status", payload.status);
    formData.append("conteudo", payload.conteudo);
    return (await api.post(`/api/arquivos/`, formData, authHeader)).data
};
export const patchAlterarArquivoDeCarga = async (uuid_arquivo_de_carga, payload) => {
    const formData = new FormData();
    formData.append("identificador", payload.identificador);
    formData.append("tipo_delimitador", payload.tipo_delimitador);
    formData.append("conteudo", payload.conteudo);
    return (await api.patch(`/api/arquivos/${uuid_arquivo_de_carga}`, formData, authHeader)).data
};
export const deleteArquivoDeCarga = async (uuid_arquivo_de_carga) => {
    return (await api.delete(`/api/arquivos/${uuid_arquivo_de_carga}`, authHeader))
};

// export const getDownloadArquivoDeCarga = async (uuid_arquivo_de_carga) => {
//     return (await api.get(`/api/arquivos/${uuid_arquivo_de_carga}/download/`, authHeader)).data
// };

export const getDownloadArquivoDeCarga = async (uuid_arquivo_de_carga, nome_do_arquivo_com_extensao) => {
    return (await api
        .get(`/api/arquivos/${uuid_arquivo_de_carga}/download/`, {
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
};

// ***** Edição de Textos *****
export const patchAlterarFiqueDeOlhoPrestacoesDeContas = async (payload) => {
    return (await api.patch(`/api/prestacoes-contas/update-fique-de-olho/`, payload, authHeader)).data
};
export const patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre = async (payload) => {
    return (await api.patch(`/api/relatorios-consolidados-dre/update-fique-de-olho/`, payload, authHeader)).data
};

// ***** Estrutura *****
// Tags
export const getTodasTags = async () => {
    return (await api.get(`/api/tags/`, authHeader)).data
};
export const getFiltrosTags = async (nome, status) => {
    return (await api.get(`/api/tags/?nome=${nome}&status=${status}`, authHeader)).data
};
export const postCreateTag = async (payload) => {
    return (await api.post(`/api/tags/`, payload, authHeader)).data
};
export const patchAlterarTag = async (tag_uuid, payload) => {
    return (await api.patch(`/api/tags/${tag_uuid}/`, payload, authHeader)).data
};
export const deleteTag = async (tag_uuid) => {
    return (await api.delete(`/api/tags/${tag_uuid}/`, authHeader))
};

// Associacoes
export const getAssociacoes = async () => {
    return (await api.get(`/api/associacoes/`, authHeader)).data
};
export const getTabelaAssociacoes = async () => {
    return (await api.get(`/api/associacoes/tabelas/`, authHeader)).data
};
export const getFiltrosAssociacoes = async (tipo_unidade, unidade__dre__uuid, nome) => {
    return (await api.get(`/api/associacoes/?unidade__tipo_unidade=${tipo_unidade}&unidade__dre__uuid=${unidade__dre__uuid}&nome=${nome}`, authHeader)).data
};
export const getAssociacaoPorUuid = async (associacao_uuid) => {
    return (await api.get(`/api/associacoes/${associacao_uuid}/`, authHeader)).data
};
export const getUnidadePeloCodigoEol = async (codigo_eol_unidade) => {
    return (await api.get(`/api/associacoes/eol/?codigo_eol=${codigo_eol_unidade}`, authHeader)).data
};
export const postCriarAssociacao = async (payload) => {
    return (await api.post(`/api/associacoes/`, payload, authHeader)).data
};
export const patchUpdateAssociacao = async (associacao_uuid, payload) => {
    return (await api.patch(`/api/associacoes/${associacao_uuid}/`, payload, authHeader)).data
};
export const deleteAssociacao = async (associacao_uuid) => {
    return (await api.delete(`/api/associacoes/${associacao_uuid}/`, authHeader))
};


// Periodos
export const getTodosPeriodos = async () => {
    return (await api.get(`/api/periodos/`, authHeader)).data
};
export const getFiltrosPeriodos = async (referencia) => {
    return (await api.get(`/api/periodos/?referencia=${referencia}`, authHeader)).data
};
export const getDatasAtendemRegras = async (data_inicio_realizacao_despesas, data_fim_realizacao_despesas, periodo_anterior_uuid, periodo_uuid) => {
    return (await api.get(`/api/periodos/verificar-datas/?data_inicio_realizacao_despesas=${data_inicio_realizacao_despesas}&data_fim_realizacao_despesas=${data_fim_realizacao_despesas}&periodo_anterior_uuid=${periodo_anterior_uuid}${periodo_uuid ? '&periodo_uuid='+periodo_uuid : ''}`, authHeader)).data
};
export const getPeriodoPorUuid = async (periodo_uuid) => {
    return (await api.get(`/api/periodos/${periodo_uuid}/`, authHeader)).data
};
export const postCriarPeriodo = async (payload) => {
    return (await api.post(`/api/periodos/`, payload, authHeader)).data
};
export const patchUpdatePeriodo = async (periodo_uuid, payload) => {
    return (await api.patch(`/api/periodos/${periodo_uuid}/`, payload, authHeader)).data
};
export const deletePeriodo = async (periodo_uuid) => {
    return (await api.delete(`/api/periodos/${periodo_uuid}/`, authHeader))
};

// AcoesDasAssociacoes
export const getTodasAcoesDasAssociacoes = async () => {
    return (await api.get(`/api/acoes-associacoes/`, authHeader)).data
};

export const getListaDeAcoes = async () => {
    return (await api.get(`/api/acoes/`, authHeader)).data
};

export const getFiltros = async (nome='', acao__uuid, status) => {
    return (await api.get(`/api/acoes-associacoes/?nome=${nome}${acao__uuid ? '&acao__uuid='+acao__uuid : ''}${status ? '&status='+status : ''}`, authHeader)).data
};

export const postAddAcaoAssociacao = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/`, payload, authHeader)).data
};

export const putAtualizarAcaoAssociacao = async (acao_associacao_uuid, payload) => {
    return (await api.put(`/api/acoes-associacoes/${acao_associacao_uuid}/`, payload, authHeader)).data
};

export const deleteAcaoAssociacao = async (acao_associacao_uuid) => {
    return (await api.delete(`/api/acoes-associacoes/${acao_associacao_uuid}/`, authHeader))
};

export const getRateiosAcao = async (acao_associacao_uuid, associacao_uuid) => {
    return (await api.get(`api/rateios-despesas/?acao_associacao__uuid=${acao_associacao_uuid}&associacao__uuid=${associacao_uuid}`, authHeader)).data
};

export const getReceitasAcao = async (associacao_uuid, acao_associacao_uuid) => {
    return (await api.get(`api/receitas/?associacao__uuid=${associacao_uuid}&acao_associacao__uuid=${acao_associacao_uuid}`, authHeader)).data
};


export const getAcoesFiltradas = async (nome='') => {
    return (await api.get(`/api/acoes/?nome=${nome}`, authHeader)).data
};

export const postAddAcao = async (payload) => {
    return (await api.post(`/api/acoes/`, payload, authHeader)).data
};

export const putAtualizarAcao = async (acao_uuid, payload) => {
    return (await api.put(`/api/acoes/${acao_uuid}/`, payload, authHeader)).data
};

export const deleteAcao = async (acao_uuid) => {
    return (await api.delete(`/api/acoes/${acao_uuid}/`, authHeader))
};

export const getUnidadesPorAcao = async (acao_uuid, nome="") => {
    return (await api.get(`api/acoes-associacoes/?acao__uuid=${acao_uuid}&nome=${nome}`, authHeader)).data
};

export const getAcao = async (uuid='') => {
    return (await api.get(`/api/acoes/${uuid}/`, authHeader)).data
};

export const deleteAcoesAssociacoesEmLote = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/excluir-lote/`, payload, authHeader)).data
};

export const getAssociacoesNaoVinculadasAAcao = async (acao_uuid, nome="") => {
    if (nome === ""){
        return (await api.get(`api/acoes/${acao_uuid}/associacoes-nao-vinculadas/`, authHeader)).data
    }
    else {
        return (await api.get(`api/acoes/${acao_uuid}/associacoes-nao-vinculadas-por-nome/${nome}/`, authHeader)).data
    }

};

export const addAcoesAssociacoesEmLote = async (payload) => {
    return (await api.post(`/api/acoes-associacoes/incluir-lote/`, payload, authHeader)).data
};
