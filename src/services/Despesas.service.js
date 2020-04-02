import api from './Api'

const authHeader = {
  'Content-Type': 'application/json'
}

export const deleteDespesa = async uuid => {
  return (await api.delete(`api/despesas/${uuid}/`, authHeader)).data
}

export const getDespesasTabelas = async () => {
  return (await api.get(`api/despesas/tabelas/`, authHeader)).data
}

export const getEspecificacaoMaterialServico = async (aplicacao_recurso, tipo_custeio) => {
  return (await api.get(`api/especificacoes/?aplicacao_recurso=${aplicacao_recurso}&tipo_custeio=${tipo_custeio}`, authHeader)).data
}
