import api from './Api'

const authHeader = {
  'Content-Type': 'application/json',
}

export const getVersaoApi = async () => {
  return (await api.get(`api/versao`, authHeader)).data['versao']
}
