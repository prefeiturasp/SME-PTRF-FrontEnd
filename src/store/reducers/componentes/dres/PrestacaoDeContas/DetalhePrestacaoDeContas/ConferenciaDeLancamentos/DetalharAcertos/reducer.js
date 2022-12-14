import {ADD_DETALHAR_ACERTOS, LIMPAR_DETALHAR_ACERTOS, ORIGEM_PAGINA} from "./actions";

const initialState = {
    lancamentos_para_acertos: []
}

export const DetalharAcertos = (state = initialState, action) => {
    switch (action.type) {
        case ADD_DETALHAR_ACERTOS:
            return{
                ...state,
                lancamentos_para_acertos: state.lancamentos_para_acertos.concat(action.payload)
            }
        case LIMPAR_DETALHAR_ACERTOS:
            return initialState
        case ORIGEM_PAGINA:
            return{
                ...state,
                origem: action.payload
            }
        default:
            return state
    }
}