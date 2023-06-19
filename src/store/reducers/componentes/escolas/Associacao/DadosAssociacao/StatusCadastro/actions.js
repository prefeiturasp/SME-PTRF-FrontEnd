export const SET_STATUS_CADASTRO = 'SET_STATUS_CADASTRO';
export const RESET_STATUS_CADASTRO = 'RESET_STATUS_CADASTRO';

export const setStatusCadastro = (payload) =>({
    type: SET_STATUS_CADASTRO,
    payload,
});

export const resetStatusCadastro = () =>({
    type: RESET_STATUS_CADASTRO
});