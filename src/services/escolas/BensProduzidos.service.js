import api from "../api";
import { ASSOCIACAO_UUID, TOKEN_ALIAS } from "../auth.service.js";
import { addFiltersToQueryString } from "../../utils/Api.js";

const authHeader = () => ({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    "Content-Type": "application/json",
  },
});

export const getBemProduzido = async (uuid) => {
  return (await api.get(`api/bens-produzidos/${uuid}/`, authHeader())).data;
};

export const postBemProduzido = async (payload) => {
  return (
    await api.post(
      `api/bens-produzidos/`,
      { ...payload, associacao: localStorage.getItem(ASSOCIACAO_UUID) },
      authHeader()
    )
  ).data;
};

export const patchBemProduzido = async (uuid, payload) => {
  return (
    await api.patch(`api/bens-produzidos/${uuid}/`, payload, authHeader())
  ).data;
};

export const patchBemProduzidoRascunho = async (uuid, payload) => {
  return (
    await api.patch(
      `api/bens-produzidos-rascunho/${uuid}/`,
      payload,
      authHeader()
    )
  ).data;
};

export const postBemProduzidoRascunho = async (payload) => {
  return (
    await api.post(
      `api/bens-produzidos-rascunho/`,
      { ...payload, associacao: localStorage.getItem(ASSOCIACAO_UUID) },
      authHeader()
    )
  ).data;
};

export const postExluirDespesaBemProduzidoEmLote = async (uuid, payload) => {
  return (
    await api.post(
      `api/bens-produzidos/${uuid}/excluir-lote/`,
      payload,
      authHeader()
    )
  ).data;
};

export const getBemProduzidosComAdquiridos = async (filters, page) => {
  let queryString = `?associacao_uuid=${localStorage.getItem(
    ASSOCIACAO_UUID
  )}&page=${page}`;
  queryString = addFiltersToQueryString(queryString, filters);
  return (
    await api.get(
      `api/bens-produzidos-e-adquiridos/${queryString}`,
      authHeader()
    )
  ).data;
};

export const getTodosPeriodosComPC = async (referencia = "") => {
  return (
    await api.get(
      `/api/periodos/?referencia=${referencia}&somente_com_pcs_entregues=true&associacao_uuid=${localStorage.getItem(
        ASSOCIACAO_UUID
      )}`,
      authHeader()
    )
  ).data;
};

export const getExportarBensProduzidos = async () => {
  const queryString = `?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}`;

  return (
    await api.get(`api/bens-produzidos-e-adquiridos/exportar/${queryString}`, authHeader())
  ).data;
};