import {USUARIO_LOGIN, ASSOCIACAO_UUID, ASSOCIACAO_TIPO_ESCOLA, ASSOCIACAO_NOME_ESCOLA, ASSOCIACAO_NOME} from "./auth.service";
import {redirect} from "../utils/redirect";

export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";

const getUsuarioLogin = () => {
    return localStorage.getItem(USUARIO_LOGIN)
};

const getDadosDoUsuarioLogado = () => {
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO));
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_' + getUsuarioLogin()) : null
};

const setDadosPrimeiroAcesso = async (resp) =>{

    let visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome;
    let usuario_logado = getDadosDoUsuarioLogado();

    if (usuario_logado && usuario_logado.associacao_selecionada.uuid){
        visao=usuario_logado.visao_selecionada.nome;
        uuid_unidade = usuario_logado.unidade_selecionada.uuid;
        uuid_associacao = usuario_logado.associacao_selecionada.uuid;
        nome_associacao = usuario_logado.associacao_selecionada.nome;
    }else {
        if (resp.visoes.find(visao=> visao === 'DRE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            visao="DRE";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.uuid;
            nome_associacao = unidade.nome;
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            visao="UE";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.associacao.uuid;
            nome_associacao = unidade.associacao.nome;
        }
    }

    if (usuario_logado && usuario_logado.unidade_selecionada.nome){
        unidade_nome = usuario_logado.unidade_selecionada.nome;
    }else{
        if (resp.visoes.find(visao=> visao === 'DRE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            unidade_nome = unidade.nome;
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            unidade_nome = unidade.nome;
        }
    }

    if (usuario_logado && usuario_logado.unidade_selecionada.tipo_unidade){
        unidade_tipo = usuario_logado.unidade_selecionada.tipo_unidade;
    }else {
        if (resp.visoes.find(visao=> visao === 'DRE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            unidade_tipo = unidade.tipo_unidade;
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            unidade_tipo = unidade.tipo_unidade;
        }
    }
    alternaVisoes(visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome)
};

const setDadosUsuariosLogados = async (resp) => {

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let usuario_logado = getDadosDoUsuarioLogado();

    let novos_dados_do_usuario_logado = {
        ...todos_os_dados_usuario_logado,
        [`usuario_${getUsuarioLogin()}`]: {

            usuario_logado: {
                login: resp.login,
                nome: resp.nome
            },
            visoes: resp.visoes,

            visao_selecionada: {
                nome: usuario_logado ? usuario_logado.visao_selecionada.nome : "",
            },
            unidades: resp.unidades,

            unidade_selecionada: {
                uuid: usuario_logado ? usuario_logado.unidade_selecionada.uuid : "",
                tipo_unidade: usuario_logado ? usuario_logado.unidade_selecionada.tipo_unidade : "",
                nome: usuario_logado ? usuario_logado.unidade_selecionada.nome : "",
            },

            associacao_selecionada: {
                uuid: usuario_logado ? usuario_logado.associacao_selecionada.uuid : "",
                nome: usuario_logado ? usuario_logado.associacao_selecionada.nome : "",
            },
        }
    };
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_do_usuario_logado))
};

const converteNomeVisao = (visao) => {
    if (visao !== "UE" && visao !== "DRE" && visao !== "SME"){
        return "UE"
    }else {
        return visao
    }
};

const alternaVisoes = (visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome) => {

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;
    let dados_usuario_logado = getDadosDoUsuarioLogado();

    if (dados_usuario_logado) {
        let alternar_visao = {
            ...todos_os_dados_usuario_logado,
            [`usuario_${getUsuarioLogin()}`]: {
                ...dados_usuario_logado,
                visao_selecionada: {
                    nome: converteNomeVisao(visao)
                },

                unidade_selecionada: {
                    uuid: uuid_unidade,
                    tipo_unidade:unidade_tipo,
                    nome:unidade_nome,
                },

                associacao_selecionada: {
                    uuid: uuid_associacao,
                    nome: nome_associacao,
                },
            }
        };
        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(alternar_visao));

        localStorage.setItem(ASSOCIACAO_UUID, uuid_associacao);
        localStorage.setItem(ASSOCIACAO_NOME,nome_associacao);
        localStorage.setItem(ASSOCIACAO_TIPO_ESCOLA, unidade_tipo);
        localStorage.setItem(ASSOCIACAO_NOME_ESCOLA, unidade_nome);
        redirectVisao(visao)
    }
};

const redirectVisao = (visao = null) => {

    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();
    if (visao === 'SME') {
        redirect('/prestacao-de-contas')
    } else if (visao === 'DRE') {
        redirect('/dre-associacoes')
    } else if (visao === 'UE') {
        redirect('/dados-da-associacao')
    } else {
        if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'SME')) {
            redirect('/prestacao-de-contas')
        } else if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'DRE')) {
            redirect('/dre-associacoes')
        } else if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'UE')) {
            redirect('/dados-da-associacao')
        } else {
            redirect('/dados-da-associacao')
        }
    }
};

const getItemUsuarioLogado = (indice) =>{
    let usuario_logado = getDadosDoUsuarioLogado();
    return eval('usuario_logado.' + indice)
};


export const visoesService = {
    setDadosUsuariosLogados,
    setDadosPrimeiroAcesso,
    converteNomeVisao,
    alternaVisoes,
    getDadosDoUsuarioLogado,
    redirectVisao,
    getItemUsuarioLogado,
};

