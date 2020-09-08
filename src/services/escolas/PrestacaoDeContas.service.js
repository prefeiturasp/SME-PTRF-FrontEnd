import api from '../api'
import { TOKEN_ALIAS } from '../auth.service'

const authHeader = {
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    'Content-Type': 'application/json',
  },
};

// Prestação de Contas


export const getPeriodosNaoFuturos = async () => {
  return(await api.get('/api/periodos/lookup-until-now/', authHeader)).data
};

export const getStatus = async (periodo_uuid, conta_uuid) => {
  return (
    await api.get(
      `/api/prestacoes-contas/por-conta-e-periodo/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`,
      authHeader
    )
  ).data
};

export const getIniciarPrestacaoDeContas = async (conta_uuid, periodo_uuid) => {
  return (
    await api.post(
      `/api/prestacoes-contas/iniciar/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`,
      authHeader
    )
  ).data
};

export const getReabrirPeriodo = async (uuid, payload) => {
  return await api.patch(
    `/api/prestacoes-contas/${uuid}/revisar/`,
    payload,
    authHeader
  )
};

// Detalhe Prestação de Contas
export const getDespesasPrestacaoDeContas = async (periodo_uuid, conta_uuid, acao_associacao_uuid, conferido) => {
  return (await api.get(`/api/conciliacoes/despesas/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&acao_associacao=${acao_associacao_uuid}&conferido=${conferido}`, authHeader)).data
};

export const getReceitasPrestacaoDeContas = async (periodo_uuid, conta_uuid, acao_associacao_uuid, conferido) => {
  return ( await api.get(`/api/conciliacoes/receitas/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&acao_associacao=${acao_associacao_uuid}&conferido=${conferido}`,authHeader)).data
};

export const getConciliarReceita = async (receita_uuid, periodo_uuid) => {
  return (await api.patch(`/api/receitas/${receita_uuid}/conciliar/?periodo=${periodo_uuid}`, authHeader)).data
};

export const getDesconciliarReceita = async (receita_uuid, periodo_uuid) => {
  return (await api.patch(`/api/receitas/${receita_uuid}/desconciliar/?periodo=${periodo_uuid}`, authHeader)).data
};

export const getConciliarDespesa = async (rateio_uuid, periodo_uuid) => {
  return (await api.patch(`/api/rateios-despesas/${rateio_uuid}/conciliar/?periodo=${periodo_uuid}`, authHeader)).data
};

export const getDesconciliarDespesa = async (rateio_uuid, periodo_uuid) => {
  return (await api.patch(`/api/rateios-despesas/${rateio_uuid}/desconciliar/?periodo=${periodo_uuid}`, authHeader)).data
};

export const getObservacoes = async (periodo_uuid, conta_uuid) => {
  return (await api.get(`/api/conciliacoes/observacoes/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}`,authHeader)).data
};

export const getSalvarPrestacaoDeConta = async (periodo_uuid, conta_uuid, payload) => {
  return (await api.patch(`/api/conciliacoes/salvar-observacoes/`, payload, authHeader)).data
};

export const getDataPreenchimentoAta = async (uuidPrestacaoDeContas) => {
    return (await api.get(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/ata/`,authHeader)).data
};

export const getIniciarAta = async (uuidPrestacaoDeContas) => {
    return (await api.post(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/iniciar-ata/`,authHeader)).data
};

export const getInfoAta = async () => {
    return (await api.get(`/api/prestacoes-contas/${localStorage.getItem("uuidPrestacaoConta")}/info-para-ata/`,authHeader)).data
};
export const getConcluirPrestacaoDeConta = async (
  uuidPrestacaoDeContas,
  payload
) => {
  return (
    await api.patch(
      `/api/prestacoes-contas/${uuidPrestacaoDeContas}/concluir/`,
      payload,
      authHeader
    )
  ).data
};


export const getFiqueDeOlho = async () => {
  return (await api.get(`/api/prestacoes-contas/fique-de-olho/`,authHeader)).data
};
