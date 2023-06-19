import {SET_PERSISTENTE_URL_VOLTAR, RESET_URL_VOLTAR} from "./actions";

const initialState = {
    popTo: ''
}

export const PendenciaCadastro = (state = initialState, action) => {
    switch (action.type) {
        case SET_PERSISTENTE_URL_VOLTAR:
            return{
                ...state,
                popTo: action.payload
            }
        case RESET_URL_VOLTAR:
            return{
                ...initialState
            }            
        default:
            return state
    }
}