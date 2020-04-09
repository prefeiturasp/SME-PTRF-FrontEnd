import api from './Api'

const authHeader = {
    'Content-Type': 'application/json'
}

export const getListaRateiosDespesas = async uuid => {
    return (await api.get('api/rateios-despesas/', authHeader)).data
}


export const filtroPorPalavra = async (palavra) => {
    return (await api.get(`api/rateios-despesas/?search=${palavra}`, authHeader)).data
}
