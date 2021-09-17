import {ADD_DETALHAR_ACERTOS_DOCUMENTOS, LIMPAR_DETALHAR_ACERTOS_DOCUMENTOS} from "./actions";

const initialState = {
    documentos: []
}

export const DetalharAcertosDocumentos = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DETALHAR_ACERTOS_DOCUMENTOS:
            return{
                ...state,
                documentos: state.documentos.concat(action.payload)
            }
        case LIMPAR_DETALHAR_ACERTOS_DOCUMENTOS:
            return initialState
        default:
            return state

    }
}