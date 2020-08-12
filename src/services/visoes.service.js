import {USUARIO_LOGIN} from "./auth.service";
import {redirect} from "../utils/redirect";

export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";

const getUsuarioLogin = () => {
    return localStorage.getItem(USUARIO_LOGIN)
};

const getDadosDoUsuarioLogado = () =>{
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO));
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_' + getUsuarioLogin() ) : null
};


const setDadosUsuariosLogados = async (resp)=>{

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let usuario_logado = getDadosDoUsuarioLogado();

    let novos_dados_do_usuario_logado = {
        ...todos_os_dados_usuario_logado,
        [`usuario_${getUsuarioLogin()}`]: {
        usuario_logado: {
            login: resp.login,
            nome:resp.nome
        },
        visoes:[
            {tipo:"escolas", label:"Escolas"},
            {tipo:"dres", label:"Dres"},
            {tipo:"sme", label:"SME"},
        ],
        visao_selecionada:{
            nome: usuario_logado ? usuario_logado.visao_selecionada.nome : "",
            //nome: "dres",
        },
        unidades:resp.unidades
    }
    };
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_do_usuario_logado ))
};

const alternaVisoes = (visao) =>{

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;
    let dados_usuario_logado = getDadosDoUsuarioLogado();

    if (dados_usuario_logado){
        let alternar_visao = {
            ...todos_os_dados_usuario_logado,
            [`usuario_${getUsuarioLogin()}`]: {
                ...dados_usuario_logado,
                visao_selecionada: {
                    nome: visao
                },
            }
        };
        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(alternar_visao ));
        redirectVisao(visao)
    }
};

const redirectVisao = (visao=null) =>{
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();
    if (visao === 'sme'){
        redirect('/prestacao-de-contas')
    }else if(visao === 'dres'){
        redirect('/dre-associacoes')
    }else if (visao==='escolas'){
        redirect('/dados-da-associacao')
    }else {
        if ( dados_usuario_logado.visoes.find(visao=> visao.tipo === 'sme')){
            redirect('/prestacao-de-contas')
        }else if (dados_usuario_logado.visoes.find(visao=> visao.tipo === 'dres')){
            redirect('/dre-associacoes')
        }else if (dados_usuario_logado.visoes.find(visao=> visao.tipo === 'escolas')){
            redirect('/dados-da-associacao')
        }else {
            redirect('/dados-da-associacao')
        }
    }
};

export const visoesService ={
    setDadosUsuariosLogados,
    alternaVisoes,
    getDadosDoUsuarioLogado,
    redirectVisao,
};

