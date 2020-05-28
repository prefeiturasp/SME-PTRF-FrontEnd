import decode from "jwt-decode";
import api from './Api';
import HTTP_STATUS from "http-status-codes";

export const TOKEN_ALIAS = "TOKEN";
export const USUARIO_NOME = "NOME";
export const ASSOCIACAO_UUID = "UUID";
export const ASSOCIACAO_NOME = "ASSO_NOME";

const authHeader = {
    'Content-Type': 'application/json'
}

const login = async (login, senha) => {
    let payload = {
        login: login,
        senha: senha
    }

    try {
        const response = (await api.post('api/login', payload, authHeader))
        const resp = response.data
        if (response.status === HTTP_STATUS.OK) {
            if (resp.detail) {
                return "Usuário não autorizado!"
            }
            localStorage.setItem(TOKEN_ALIAS, resp.token);
            localStorage.setItem(
                USUARIO_NOME,
                resp.nome
            )
            localStorage.setItem(
                ASSOCIACAO_UUID,
                resp.associacao.uuid
            )
            localStorage.setItem(
                ASSOCIACAO_NOME,
                resp.associacao.nome
            )
            const decoded = decode(resp.token);
            window.location.href = "/";
        } 
    } catch (error) {
        console.log('ERROR');
        console.log(error.response.data);
        return error.response.data.data.detail;
    }
};

const isLoggedIn = () => {
    const token = localStorage.getItem(TOKEN_ALIAS);
    if (token) {
      return true;
    }
    return false;
  };

const getToken = () => {
    let token = localStorage.getItem(TOKEN_ALIAS);
    if (token) {
      return token;
    }
  };
  

const logout = () => {
    localStorage.removeItem(TOKEN_ALIAS);
    localStorage.removeItem(USUARIO_NOME);
    localStorage.removeItem(ASSOCIACAO_UUID);
    localStorage.removeItem(ASSOCIACAO_NOME);
    localStorage.removeItem(ASSOCIACAO_NOME);
    localStorage.removeItem('periodoConta');
    localStorage.removeItem('uuidPrestacaoConta');
    //window.location.reload();
    window.location.assign("/login")
};


export const authService = {
    login,
    logout,
    getToken,
    isLoggedIn,
};
