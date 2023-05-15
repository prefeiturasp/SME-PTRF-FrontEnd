import api from '../api'
import { TOKEN_ALIAS } from '../auth.service.js';

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
    if (payload.conteudo){
        formData.append("conteudo", payload.conteudo);
    }
    return (await api.patch(`/api/arquivos/${uuid_arquivo_de_carga}/`, formData, authHeader)).data
};
export const deleteArquivoDeCarga = async (uuid_arquivo_de_carga) => {
    return (await api.delete(`/api/arquivos/${uuid_arquivo_de_carga}`, authHeader))
};
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

export const postProcessarArquivoDeCarga = async (uuid_arquivo_de_carga) => {
    return (await api.post(`/api/arquivos/${uuid_arquivo_de_carga}/processar/`, {}, authHeader)).data
};
export const getDownloadModeloArquivoDeCarga = async (tipo_arquivo_de_carga) => {
    return (await api
        .get(`/api/modelos-cargas/${tipo_arquivo_de_carga}/download/`, {
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
            link.setAttribute('download', 'Modelo_Carga_Associacoes.xlsx');
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
export const getFiltrosAssociacoes = async (tipo_unidade, unidade__dre__uuid, nome, informacoes) => {
    return (await api.get(`/api/associacoes/?unidade__tipo_unidade=${tipo_unidade}&unidade__dre__uuid=${unidade__dre__uuid}&nome=${nome}&filtro_informacoes=${informacoes}`, authHeader)).data
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
export const getAcoesAssociacao = async (associacao_uuid) => {
    return (await api.get(`api/acoes-associacoes/?associacao__uuid=${associacao_uuid}`, authHeader)).data
};
export const getContasAssociacao = async (associacao_uuid) => {
    return (await api.get(`api/associacoes/${associacao_uuid}/contas/`, authHeader)).data
};
export const validarDataDeEncerramento = async (associacao_uuid, data_de_encerramento, periodo_inicial) => {
    return (await api.get(`api/associacoes/${associacao_uuid}/validar-data-de-encerramento/?data_de_encerramento=${data_de_encerramento}&periodo_inicial=${periodo_inicial}`, authHeader)).data
};




// Periodos
export const getTodosPeriodos = async () => {
    return (await api.get(`/api/periodos/`, authHeader)).data
};
export const getPeriodoPorReferencia = async (referencia) => {
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

export const getListaDeAcertosLancamentos = async () => {
    return (await api.get(`/api/tipos-acerto-lancamento/`, authHeader)).data
};

export const getListaDeAcertosDocumentos = async () => {
    return (await api.get(`/api/tipos-acerto-documento/`, authHeader)).data
};

export const getTabelaCategoria = async () => {
    return (await api.get(`api/tipos-acerto-lancamento/tabelas/`, authHeader)).data
};

export const getTabelaDocumento = async () => {
    return (await api.get(`api/tipos-acerto-documento/tabelas/`, authHeader)).data
};

export const getTabelaCategoriaDocumentos = async () => {
    return (await api.get(`api/tipos-acerto-documento/tabelas/`, authHeader)).data
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

export const putAtualizarAcertosLancamentos = async (acerto_lancamento_uuid, payload) => {
    return (await api.patch(`/api/tipos-acerto-lancamento/${acerto_lancamento_uuid}/`, payload, authHeader)).data
};

export const putAtualizarAcertosDocumentos = async (acerto_lancamento_uuid, payload) => {
    return (await api.patch(`/api/tipos-acerto-documento/${acerto_lancamento_uuid}/`, payload, authHeader)).data
};

export const deleteAcaoAssociacao = async (acao_associacao_uuid) => {
    return (await api.delete(`/api/acoes-associacoes/${acao_associacao_uuid}/`, authHeader))
};

export const getAcoesFiltradas = async (nome='') => {
    return (await api.get(`/api/acoes/?nome=${nome}`, authHeader)).data
};

export const getAcertosLancamentosFiltrados = async (nome='', categoria='', ativo='') => {
    return (await api.get(`/api/tipos-acerto-lancamento/?nome=${nome}${categoria ? '&categoria='+ categoria : ''}${ativo ? '&ativo='+ ativo : ''}`, authHeader)).data
};

export const getAcertosDocumentosFiltrados = async (nome='', categoria='', ativo='', documento_relacionado='',) => {
    return (await api.get(`/api/tipos-acerto-documento/?nome=${nome}${categoria ? '&categoria='+ categoria : ''}${ativo ? '&ativo='+ ativo : ''}${documento_relacionado ? '&documento_relacionado='+ documento_relacionado : ''}`, authHeader)).data
};

export const postAddAcao = async (payload) => {
    return (await api.post(`/api/acoes/`, payload, authHeader)).data
};

export const postAddAcertosLancamentos = async (payload) => {
    return (await api.post(`/api/tipos-acerto-lancamento/`, payload, authHeader)).data
};

export const postAddAcertosDocumentos = async (payload) => {
    return (await api.post(`/api/tipos-acerto-documento/`, payload, authHeader)).data
};

export const putAtualizarAcao = async (acao_uuid, payload) => {
    return (await api.put(`/api/acoes/${acao_uuid}/`, payload, authHeader)).data
};

export const deleteAcao = async (acao_uuid) => {
    return (await api.delete(`/api/acoes/${acao_uuid}/`, authHeader))
};

export const deleteAcertosLancamentos = async (lancamento_uuid) => {
    return (await api.delete(`/api/tipos-acerto-lancamento/${lancamento_uuid}/`, authHeader))
};

export const deleteAcertosDocumentos = async (documento_uuid) => {
    return (await api.delete(`/api/tipos-acerto-documento/${documento_uuid}/`, authHeader))
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


// Tipos de Custeio
export const getTodosTiposDeCusteio = async () => {
    return (await api.get(`/api/tipos-custeio/`, authHeader)).data
};
export const getFiltrosTiposDeCusteio = async (nome, status) => {
    return (await api.get(`/api/tipos-custeio/?nome=${nome}`, authHeader)).data
};
export const postCreateTipoDeCusteio = async (payload) => {
    return (await api.post(`/api/tipos-custeio/`, payload, authHeader)).data
};
export const patchAlterarTipoDeCusteio = async (tag_uuid, payload) => {
    return (await api.patch(`/api/tipos-custeio/${tag_uuid}/`, payload, authHeader)).data
};
export const deleteTipoDeCusteio = async (tag_uuid) => {
    return (await api.delete(`/api/tipos-custeio/${tag_uuid}/`, authHeader))
};

// Fornecedores
export const getFornecedores = async () => {
    return (await api.get(`/api/fornecedores/`, authHeader)).data
};
export const getFiltrosFornecedores = async (nome, cpf_cnpj) => {
    return (await api.get(`/api/fornecedores/?nome=${nome}&cpf_cnpj=${cpf_cnpj}`, authHeader)).data
};
export const postCreateFornecedor = async (payload) => {
    return (await api.post(`/api/fornecedores/`, payload, authHeader)).data
};
export const patchAlterarFornecedor = async (fornecedores_id, payload) => {
    return (await api.patch(`/api/fornecedores/${fornecedores_id}/`, payload, authHeader)).data
};
export const deleteFornecedor = async (fornecedores_id) => {
    return (await api.delete(`/api/fornecedores/${fornecedores_id}/`, authHeader))
};

// Motivos estorno
export const getMotivosEstorno = async () => {
    return (await api.get(`/api/motivos-estorno/`, authHeader)).data
};

export const getFiltrosMotivosEstorno = async (motivo) => {
    return (await api.get(`/api/motivos-estorno/?motivo=${motivo}`, authHeader)).data
};

export const postCreateMotivoEstorno = async (payload) => {
    return (await api.post(`/api/motivos-estorno/`, payload, authHeader)).data
};

export const patchAlterarMotivoEstorno = async (motivo_uuid, payload) => {
    return (await api.patch(`/api/motivos-estorno/${motivo_uuid}/`, payload, authHeader)).data
};

export const deleteMotivoEstorno = async (motivo_uuid) => {
    return (await api.delete(`/api/motivos-estorno/${motivo_uuid}/`, authHeader))
};
