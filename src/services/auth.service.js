import decode from "jwt-decode";
import api from './Api';
import HTTP_STATUS from "http-status-codes";

export const TOKEN_ALIAS = "TOKEN";
export const USUARIO_NOME = "NOME";
export const ASSOCIACAO_UUID = "UUID";
export const ASSOCIACAO_NOME = "ASSO_NOME";
export const ASSOCIACAO_NOME_ESCOLA = "NOME_ESCOLA";
export const ASSOCIACAO_TIPO_ESCOLA = "TIPO_ESCOLA";


const authHeader = {
    'Content-Type': 'application/json'
};

const login = async (login, senha) => {
    let payload = {
        login: login,
        senha: senha
    };

    try {
        const response = (await api.post('api/login', payload, authHeader));
        const resp = response.data;
        if (response.status === HTTP_STATUS.OK) {
            if (resp.detail) {
                return "RF incorreto"
            }
            localStorage.setItem(TOKEN_ALIAS, resp.token);
            localStorage.setItem(
                USUARIO_NOME,
                resp.nome
            );
            localStorage.setItem(
                ASSOCIACAO_UUID,
                resp.associacao.uuid
            );
            localStorage.setItem(
                ASSOCIACAO_NOME,
                resp.associacao.nome
            );
            localStorage.setItem(
                ASSOCIACAO_NOME_ESCOLA,
                resp.associacao.nome_escola
            );
            localStorage.setItem(
                ASSOCIACAO_TIPO_ESCOLA,
                resp.associacao.tipo_escola
            );

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
    localStorage.removeItem(ASSOCIACAO_NOME_ESCOLA);
    localStorage.removeItem(ASSOCIACAO_TIPO_ESCOLA);
    localStorage.removeItem('periodoConta');
    localStorage.removeItem('uuidPrestacaoConta');
    localStorage.removeItem('acaoLancamento');
    localStorage.removeItem('uuidAta');
    //window.location.reload();
    window.location.assign("/login")
};

export const esqueciMinhaSenha = async (payload, rf) => {
    return (await api.put(`/api/esqueci-minha-senha/${rf}/`, payload, authHeader)).data
};

export const redefinirMinhaSenha = async (payload) => {
    return (await api.post(`/api/redefinir-senha/`, payload, authHeader)).data
};


export const authService = {
    login,
    logout,
    getToken,
    isLoggedIn,
    esqueciMinhaSenha,
};
