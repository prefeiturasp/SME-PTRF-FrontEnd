export const ADD_DETALHAR_ACERTOS = 'ADD_DETALHAR_ACERTOS'
export const LIMPAR_DETALHAR_ACERTOS = 'LIMPAR_DETALHAR_ACERTOS'

export const addDetalharAcertos = (payload) =>({
    type: ADD_DETALHAR_ACERTOS,
    payload,
})

export const limparDetalharAcertos = (payload) =>({
    type: LIMPAR_DETALHAR_ACERTOS,
    payload,
})