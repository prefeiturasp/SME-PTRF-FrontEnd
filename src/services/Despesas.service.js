import api from './Api'

const authHeader = {
  'Content-Type': 'application/json'
}

export const deleteDespesa = async uuid => {
  return (await api.delete(`api/despesas/${uuid}/`, authHeader)).data
}
