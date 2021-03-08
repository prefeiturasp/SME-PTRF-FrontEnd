import decode from "jwt-decode";
import api from './api';
import HTTP_STATUS from "http-status-codes";
import {DATA_HORA_USUARIO_LOGADO, visoesService} from "./visoes.service";
import moment from "moment";

export const TOKEN_ALIAS = "TOKEN";
export const DATA_LOGIN = "DATA_LOGIN";
export const USUARIO_NOME = "NOME";
export const ASSOCIACAO_UUID = "UUID";
export const ASSOCIACAO_NOME = "ASSO_NOME";
export const ASSOCIACAO_NOME_ESCOLA = "NOME_ESCOLA";
export const ASSOCIACAO_TIPO_ESCOLA = "TIPO_ESCOLA";
export const USUARIO_EMAIL = "EMAIL";
export const USUARIO_CPF = "CPF";
export const USUARIO_LOGIN = "LOGIN";
export const DADOS_DA_ASSOCIACAO = "DADOS_DA_ASSOCIACAO";

const authHeader = {
    'Content-Type': 'application/json'
};

const authHeaderAuthorization = {
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
};

const setDataLogin = async ()=>{
    let data_login = localStorage.getItem(DATA_LOGIN);
    if(data_login){
        const data_hora_atual = moment().format("YYYY-MM-DD HH:mm:ss");
        const now = moment(new Date().toISOString().slice(0,10)); // Data atual
        const past = moment(data_login); // Data do login
        const duration = moment.duration(now.diff(past)); // Calcula diferença entre datas
        const days = duration.asDays(); // Mostra a diferença em dias
        if (days >= 1){
            localStorage.removeItem('DADOS_USUARIO_LOGADO');
            localStorage.setItem(DATA_LOGIN, moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"));
            localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual);
            await logout();
        }
    }else {
        localStorage.setItem(DATA_LOGIN, moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"))
    }
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

            await setDataLogin();

            localStorage.setItem(TOKEN_ALIAS, resp.token);
            localStorage.setItem(
                USUARIO_NOME,
                resp.nome
            );
            localStorage.setItem(
                USUARIO_EMAIL,
                resp.email
            );
            localStorage.setItem(
                USUARIO_LOGIN,
                resp.login
            );
            localStorage.setItem(
                USUARIO_CPF,
                resp.cpf
            );
            localStorage.removeItem('medidorSenha');

            await visoesService.setDadosUsuariosLogados(resp);

            await visoesService.setDadosPrimeiroAcesso(resp);

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
    localStorage.removeItem('periodoPrestacaoDeConta');
    localStorage.removeItem('statusPrestacaoDeConta');
    localStorage.removeItem('contaPrestacaoDeConta');
    localStorage.removeItem('acaoLancamento');
    localStorage.removeItem('uuidAta');
    localStorage.removeItem('prestacao_de_contas_nao_apresentada');
    localStorage.removeItem(USUARIO_EMAIL);
    localStorage.removeItem(USUARIO_LOGIN);
    localStorage.removeItem(USUARIO_CPF);
    localStorage.removeItem(DADOS_DA_ASSOCIACAO);
    //window.location.reload();
    window.location.assign("/login")
};

export const esqueciMinhaSenha = async (payload, rf) => {
    return (await api.put(`/api/esqueci-minha-senha/${rf}/`, payload, authHeader)).data
};

export const redefinirMinhaSenha = async (payload) => {
    return (await api.post(`/api/redefinir-senha/`, payload, authHeader)).data
};

export const alterarMeuEmail = async (usuario, payload) => {
    return (await api.patch(`api/usuarios/${usuario}/altera-email/`, payload, authHeaderAuthorization))
};

export const alterarMinhaSenha = async (usuario, payload) => {
    return (await api.patch(`/api/usuarios/${usuario}/altera-senha/`, payload, authHeaderAuthorization))
};


export const authService = {
    login,
    logout,
    getToken,
    isLoggedIn,
    esqueciMinhaSenha,
};
