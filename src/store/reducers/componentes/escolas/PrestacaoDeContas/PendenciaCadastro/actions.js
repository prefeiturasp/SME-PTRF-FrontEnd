export const SET_PERSISTENTE_URL_VOLTAR = 'SET_PERSISTENTE_URL_VOLTAR';
export const RESET_URL_VOLTAR = 'RESET_URL_VOLTAR';

export const setPersistenteUrlVoltar = (payload) =>({
    type: SET_PERSISTENTE_URL_VOLTAR,
    payload,
});

export const resetUrlVoltar = () =>({
    type: RESET_URL_VOLTAR
});