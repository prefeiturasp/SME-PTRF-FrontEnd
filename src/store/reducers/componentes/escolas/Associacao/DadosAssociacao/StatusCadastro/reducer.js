import {SET_STATUS_CADASTRO, RESET_STATUS_CADASTRO} from "./actions";

const initialState = {}

export const DadosAssociacao = (state = initialState, action) => {
    switch (action.type) {
        case SET_STATUS_CADASTRO:
            return{
                ...state,
                ...action.payload
            }
        case RESET_STATUS_CADASTRO:
            return{
                ...initialState
            }            
        default:
            return state
    }
}