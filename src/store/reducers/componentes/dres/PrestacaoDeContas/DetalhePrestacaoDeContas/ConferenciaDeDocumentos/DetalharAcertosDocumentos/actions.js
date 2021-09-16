export const ADD_DETALHAR_ACERTOS_DOCUMENTOS = 'ADD_DETALHAR_ACERTOS_DOCUMENTOS'
export const LIMPAR_DETALHAR_ACERTOS_DOCUMENTOS = 'LIMPAR_DETALHAR_ACERTOS_DOCUMENTOS'

export const addDetalharAcertosDocumentos = (payload) =>({
    type: ADD_DETALHAR_ACERTOS_DOCUMENTOS,
    payload,
})

export const limparDetalharAcertosDocumentos = (payload) => ({
  type: LIMPAR_DETALHAR_ACERTOS_DOCUMENTOS,
  payload,
})