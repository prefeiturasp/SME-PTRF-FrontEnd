import api from "../api";
import { TOKEN_ALIAS } from "../auth.service.js";
import { ASSOCIACAO_UUID } from "../auth.service";
import { addFiltersToQueryString } from "../../utils/Api.js";

const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const deleteDespesa = async (uuid) => {
  return (await api.delete(`api/despesas/${uuid}/`, authHeader())).data;
};

export const getDespesasTabelas = async (associacao_uuid = null) => {
  return (
    await api.get(
      `api/despesas/tabelas/?associacao_uuid=${
        associacao_uuid
          ? associacao_uuid
          : localStorage.getItem(ASSOCIACAO_UUID)
      }`,
      authHeader()
    )
  ).data;
};

export const getEspecificacoesCapital = async () => {
  return (
    await api.get(`api/especificacoes/?aplicacao_recurso=CAPITAL`, authHeader())
  ).data;
};

export const getEspecificacoesCusteio = async (id_tipo_custeio) => {
  return (
    await api.get(
      `api/especificacoes/?aplicacao_recurso=CUSTEIO&tipo_custeio=${id_tipo_custeio}`,
      authHeader()
    )
  ).data;
};

export const getDespesa = async (idDespesa) => {
  return (await api.get(`api/despesas/${idDespesa}`, authHeader())).data;
};

export const getListaDespesas = async () => {
  return (
    await api.get(
      `api/despesas/?associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
      authHeader()
    )
  ).data;
};

export const getListaDespesasPaginacao = async (page) => {
  return (
    await api.get(
      `api/despesas/?associacao__uuid=${localStorage.getItem(
        ASSOCIACAO_UUID
      )}&page=${page}`,
      authHeader()
    )
  ).data;
};

export const getListaDespesasComFiltros = async (filters, page) => {
  let queryString = `?associacao__uuid=${localStorage.getItem(
    ASSOCIACAO_UUID
  )}&page=${page}`;
  queryString = addFiltersToQueryString(queryString, filters);
  return (await api.get(`api/despesas/${queryString}`, authHeader())).data;
};

export const getListaDespesasSituacaoPatrimonial = async (filters, page) => {
  let queryString = `?associacao__uuid=${localStorage.getItem(
    ASSOCIACAO_UUID
  )}&page=${page}`;
  queryString = addFiltersToQueryString(queryString, filters);
  return (
    await api.get(
      `api/despesa-situacao-patrimonial/${queryString}`,
      authHeader()
    )
  ).data;
};

export const ordenacaoDespesas = async (
  palavra,
  aplicacao_recurso,
  acao_associacao__uuid,
  despesa__status,
  fornecedor,
  data_inicio,
  data_fim,
  conta_associacao__uuid,
  filtro_vinculo_atividades,
  filtro_informacoes,
  ordenar_por_numero_do_documento = "",
  ordenar_por_data_especificacao = "",
  ordenar_por_valor = "",
  ordenarPorImposto = false
) => {
  return (
    await api.get(
      `api/despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&rateios__acao_associacao__uuid=${acao_associacao__uuid}&status=${despesa__status}&fornecedor=${fornecedor}${
        data_inicio ? "&data_inicio=" + data_inicio : ""
      }${
        data_fim ? "&data_fim=" + data_fim : ""
      }&rateios__conta_associacao__uuid=${conta_associacao__uuid}&filtro_vinculo_atividades=${filtro_vinculo_atividades}&filtro_informacoes=${filtro_informacoes}&associacao__uuid=${localStorage.getItem(
        ASSOCIACAO_UUID
      )}${
        ordenar_por_numero_do_documento
          ? "&ordenar_por_numero_do_documento=" +
            ordenar_por_numero_do_documento
          : ""
      }${
        ordenar_por_data_especificacao
          ? "&ordenar_por_data_especificacao=" + ordenar_por_data_especificacao
          : ""
      }${ordenar_por_valor ? "&ordenar_por_valor=" + ordenar_por_valor : ""}${
        ordenarPorImposto ? "&ordenar_por_imposto=" + ordenarPorImposto : ""
      }`,
      authHeader()
    )
  ).data;
};

export const ordenacaoDespesasPaginacao = async (
  palavra,
  aplicacao_recurso,
  acao_associacao__uuid,
  despesa__status,
  fornecedor,
  data_inicio,
  data_fim,
  conta_associacao__uuid,
  filtro_vinculo_atividades,
  filtro_informacoes,
  ordenar_por_numero_do_documento = "",
  ordenar_por_data_especificacao = "",
  ordenar_por_valor = "",
  ordenarPorImposto = false,
  page
) => {
  return (
    await api.get(
      `api/despesas/?search=${palavra}&aplicacao_recurso=${aplicacao_recurso}&rateios__acao_associacao__uuid=${acao_associacao__uuid}&status=${despesa__status}&fornecedor=${fornecedor}${
        data_inicio ? "&data_inicio=" + data_inicio : ""
      }${
        data_fim ? "&data_fim=" + data_fim : ""
      }&rateios__conta_associacao__uuid=${conta_associacao__uuid}&filtro_vinculo_atividades=${filtro_vinculo_atividades}&filtro_informacoes=${filtro_informacoes}&associacao__uuid=${localStorage.getItem(
        ASSOCIACAO_UUID
      )}${
        ordenar_por_numero_do_documento
          ? "&ordenar_por_numero_do_documento=" +
            ordenar_por_numero_do_documento
          : ""
      }${
        ordenar_por_data_especificacao
          ? "&ordenar_por_data_especificacao=" + ordenar_por_data_especificacao
          : ""
      }${ordenar_por_valor ? "&ordenar_por_valor=" + ordenar_por_valor : ""}${
        ordenarPorImposto ? "&ordenar_por_imposto=" + ordenarPorImposto : ""
      }&page=${page}`,
      authHeader()
    )
  ).data;
};

export const criarDespesa = async (payload) => {
  return api
    .post("api/despesas/", payload, authHeader())
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const alterarDespesa = async (payload, idDespesa) => {
  return api
    .put(`api/despesas/${idDespesa}/`, payload, authHeader())
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error.response;
    });
};

export const getNomeRazaoSocial = async (cpf_cnpj) => {
  if (cpf_cnpj) {
    return (
      await api.get(
        `/api/fornecedores/?uuid=&cpf_cnpj=${cpf_cnpj}`,
        authHeader()
      )
    ).data;
  } else {
    return "";
  }
};

export const getDespesaCadastrada = async (
  tipo_documento,
  numero_documento,
  cpf_cnpj_fornecedor,
  despesa_uuid = null
) => {
  return (
    await api.get(
      `api/despesas/ja-lancada/?tipo_documento=${tipo_documento}&numero_documento=${numero_documento}&cpf_cnpj_fornecedor=${cpf_cnpj_fornecedor}${
        despesa_uuid ? "&despesa_uuid=" + despesa_uuid : ""
      }&associacao__uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`,
      authHeader()
    )
  ).data;
};

export const patchAtrelarSaidoDoRecurso = async (
  receita_uuid,
  despesa_uuid
) => {
  return (
    await api.patch(
      `api/receitas/${receita_uuid}/atrelar-saida-recurso/?despesa_uuid=${despesa_uuid}`,
      {},
      authHeader()
    )
  ).data;
};

export const getMotivosPagamentoAntecipado = async () => {
  return (await api.get(`api/motivos-pagamento-antecipado/`, authHeader()))
    .data;
};

export const getTagInformacao = async () => {
  return (await api.get(`api/despesas/tags-informacoes/`, authHeader())).data;
};

export const marcarLancamentoAtualizado = async (uuid_analise_lancamento) => {
  return (
    await api.post(
      `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-atualizado/`,
      {},
      authHeader()
    )
  ).data;
};

export const marcarLancamentoExcluido = async (uuid_analise_lancamento) => {
  return (
    await api.post(
      `/api/analises-lancamento-prestacao-conta/${uuid_analise_lancamento}/marcar-lancamento-excluido/`,
      {},
      authHeader()
    )
  ).data;
};

export const marcarGastoIncluido = async (payload) => {
  return (
    await api.post(
      `/api/analises-documento-prestacao-conta/marcar-como-gasto-incluido/`,
      payload,
      authHeader()
    )
  ).data;
};

export const getValidarDataDaDespesa = async (
  associacao_uuid,
  data_da_depesa
) => {
  return (
    await api.get(
      `/api/despesas/validar-data-da-despesa?associacao_uuid=${associacao_uuid}&data=${data_da_depesa}`,
      authHeader()
    )
  ).data;
};
