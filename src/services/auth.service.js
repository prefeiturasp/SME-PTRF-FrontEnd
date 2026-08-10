import api, { registerUnauthorizedHandler } from './api';
import HTTP_STATUS from "http-status-codes";
import {DATA_HORA_USUARIO_LOGADO, visoesService} from "./visoes.service";
import {mantemEstadoAcompanhamentoDePc as meapcservice} from "./mantemEstadoAcompanhamentoDePc.service";
import {mantemEstadoAcompanhamentoDePcUnidade as meapcserviceUnidadeEducacional} from "./mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";
import { mantemEstadoAnaliseDre as meapcserviceAnaliseDre} from './mantemEstadoAnaliseDre.service';
import {ACOMPANHAMENTO_DE_PC} from "./mantemEstadoAcompanhamentoDePc.service";
import {ACOMPANHAMENTO_PC_UNIDADE} from "./mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";
import { ANALISE_DRE } from './mantemEstadoAnaliseDre.service';
import moment from "moment";
import { STORAGE_KEY_PERIODO_CONTA_GERACAO_DOCUMENTOS } from './storages/GeracaoDeDocumentos.storage.service';

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
export const USUARIO_INFO_PERDEU_ACESSO = "INFO_PERDEU_ACESSO";
export const DADOS_DA_ASSOCIACAO = "DADOS_DA_ASSOCIACAO";
export const PERIODO_RELATORIO_CONSOLIDADO_DRE = "PERIODO_RELATORIO_CONSOLIDADO_DRE";
export const PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO = "PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO"
export const ACESSO_MODO_SUPORTE = "ACESSO_MODO_SUPORTE";
export const RECURSO_SELECIONADO = "RECURSO_SELECIONADO";
// Token de longa duração (X(h), definido em backend) usado para renovar o access token sem novo login.
export const REFRESH_TOKEN_ALIAS = "REFRESH_TOKEN";

const authHeader = {
    'Content-Type': 'application/json'
};

const authHeaderAuthorization = ()=>({
    headers: {
        'Authorization': `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
        'Content-Type': 'application/json'
    }
});

const setDataLogin = async ()=>{
    let data_login = localStorage.getItem(DATA_LOGIN);
    if(data_login){
        const data_hora_atual = moment().format("YYYY-MM-DD HH:mm:ss");
        const now = moment(new Date().toISOString().slice(0,10)); // Data atual
        const past = moment(data_login); // Data do login
        const duration = moment.duration(now.diff(past)); // Calcula diferença entre datas
        const days = duration.asDays(); // Mostra a diferença em dias
        if (days >= 1){
            // Limpa caches de estado que podem carregar dados de um dia anterior.
            // Não chama logout() aqui: o usuário acaba de autenticar com sucesso,
            // redirecionar seria descartar o token recém-obtido do servidor.
            localStorage.removeItem('DADOS_USUARIO_LOGADO');
            localStorage.removeItem(ACOMPANHAMENTO_DE_PC);
            localStorage.removeItem(ACOMPANHAMENTO_PC_UNIDADE);
            localStorage.removeItem(ANALISE_DRE);
            localStorage.removeItem(PERIODO_RELATORIO_CONSOLIDADO_DRE);
            localStorage.removeItem(PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO);
            localStorage.setItem(DATA_LOGIN, moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"));
            localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual);
        }
    }else {
        localStorage.setItem(DATA_LOGIN, moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"))
    }
};

const login = async (login, senha, suporte=false) => {
    let payload = {
        login: login,
        senha: senha,
        suporte: suporte
    };

    try {
        const response = (await api.post('api/login', payload, authHeader));
        const resp = response.data;

        if (response.status === HTTP_STATUS.OK) {
            if (resp.detail) {
                return resp
            }

            await setDataLogin();

            localStorage.setItem(ACESSO_MODO_SUPORTE, suporte ? true : false);

            localStorage.setItem(TOKEN_ALIAS, resp.token);
            if (resp.refresh) {
                localStorage.setItem(REFRESH_TOKEN_ALIAS, resp.refresh);
            }
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

            if(resp.info_perdeu_acesso !== undefined){
                localStorage.setItem(
                    USUARIO_INFO_PERDEU_ACESSO,
                    JSON.stringify(resp.info_perdeu_acesso)
                );
            }

            localStorage.removeItem('medidorSenha');

            await meapcservice.setAcompanhamentoDePc()

            await meapcserviceUnidadeEducacional.setAcompanhamentoPcUnidadePorUsuario()

            await meapcserviceAnaliseDre.setAnaliseDre()

            await visoesService.setDadosUsuariosLogados(resp, suporte);

            await visoesService.setDadosPrimeiroAcesso(resp, suporte);

            window.location.href = "/";
        } 
    } catch (error) {
        console.log("Erro ao efetuar o login ", error.response?.data)
        return error.response?.data;
    }
};

const isLoggedIn = () => {
    const token = localStorage.getItem(TOKEN_ALIAS);
    return !!token;
};

const getToken = () => {
    let token = localStorage.getItem(TOKEN_ALIAS);
    if (token) {
      return token;
    }
};

const limparStorageAoTrocarRecurso = () => {
    // Limpar dados do storage ao trocar recurso para que não sejam 
    // carregados dados inconsistentes ao recurso selecionado
    localStorage.removeItem('periodoConta');
    localStorage.removeItem('uuidPrestacaoConta');
    localStorage.removeItem('periodoPrestacaoDeConta');
    localStorage.removeItem('statusPrestacaoDeConta');
    localStorage.removeItem('contaPrestacaoDeConta');
    localStorage.removeItem('acaoLancamento');
    localStorage.removeItem('uuidAta');
    localStorage.removeItem('prestacao_de_contas_nao_apresentada');
    localStorage.removeItem(PERIODO_RELATORIO_CONSOLIDADO_DRE);
    localStorage.removeItem(PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO);
};

const STORAGE_KEYS_SESSAO = [
    TOKEN_ALIAS,
    REFRESH_TOKEN_ALIAS,
    USUARIO_NOME,
    USUARIO_EMAIL,
    USUARIO_LOGIN,
    USUARIO_CPF,
    ASSOCIACAO_UUID,
    ASSOCIACAO_NOME,
    ASSOCIACAO_NOME_ESCOLA,
    ASSOCIACAO_TIPO_ESCOLA,
    DADOS_DA_ASSOCIACAO,
    PERIODO_RELATORIO_CONSOLIDADO_DRE,
    PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO,
    STORAGE_KEY_PERIODO_CONTA_GERACAO_DOCUMENTOS,
    'periodoConta',
    'uuidPrestacaoConta',
    'periodoPrestacaoDeConta',
    'statusPrestacaoDeConta',
    'contaPrestacaoDeConta',
    'acaoLancamento',
    'uuidAta',
    'prestacao_de_contas_nao_apresentada',
];

const limparStorageSessao = () => {
    STORAGE_KEYS_SESSAO.forEach(key => localStorage.removeItem(key));
};

const logout = () => {
    limparStorageSessao();
    window.location.assign("/login");
};

registerUnauthorizedHandler(logout);

const logoutToSuporte = () => {
    // Remove também DADOS_USUARIO_LOGADO, mantido pelo logout normal
    // para permitir restaurar a sessão do usuário original ao retornar do suporte.
    localStorage.removeItem('DADOS_USUARIO_LOGADO');
    limparStorageSessao();
    window.location.assign("/login-suporte");
};


export const esqueciMinhaSenha = async (payload, rf) => {
    return (await api.put(`/api/esqueci-minha-senha/${rf}/`, payload, authHeader)).data
};

export const redefinirMinhaSenha = async (payload) => {
    return (await api.post(`/api/redefinir-senha/`, payload, authHeader)).data
};

export const alterarMeuEmail = async (usuario, payload) => {
    return (await api.patch(`api/usuarios/${usuario}/altera-email/`, payload, authHeaderAuthorization()))
};

export const alterarMinhaSenha = async (usuario, payload) => {
    return (await api.patch(`/api/usuarios/${usuario}/altera-senha/`, payload, authHeaderAuthorization()))
};

export const authService = {
    login,
    setDataLogin,
    logout,
    logoutToSuporte,
    getToken,
    isLoggedIn,
    esqueciMinhaSenha,
    limparStorageAoTrocarRecurso
};


export const getUsuarioLogado = () => {
    return {
        login: localStorage.getItem(USUARIO_LOGIN),
        nome: localStorage.getItem(USUARIO_NOME)
    }
}

export const viabilizarAcessoSuporte = async (usuario, payload) => {
    return (await api.post(`api/usuarios/${usuario}/viabilizar-acesso-suporte/`, payload, authHeaderAuthorization()))
};

export const getUnidadesEmSuporte = async (usuario, page=1) => {
    return (await api.get(`/api/usuarios/${usuario}/unidades-em-suporte/?page=${page}`, authHeaderAuthorization())).data
  }

export const encerrarAcessoSuporte = async (usuario, unidade_suporte_uuid) => {
    return (await api.post(`api/usuarios/${usuario}/encerrar-acesso-suporte/`, {unidade_suporte_uuid}, authHeaderAuthorization()))
};

export const encerrarAcessoSuporteEmLote = async (usuario, unidade_suporte_uuids = []) => {
    return (await api.post(`api/usuarios/${usuario}/encerrar-acesso-suporte-em-lote/`, {unidade_suporte_uuids}, authHeaderAuthorization()))
};
