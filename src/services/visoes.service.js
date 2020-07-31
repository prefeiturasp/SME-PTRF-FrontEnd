import {USUARIO_LOGIN} from "./auth.service";

export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";

const getUsuarioLogin = () => {
    return localStorage.getItem(USUARIO_LOGIN)
};

const getDadosDoUsuarioLogado = () =>{
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO));
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_'+getUsuarioLogin()) : null
};

const setDadosUsuariosLogados = async (resp)=>{
    //debugger
    let usuario_login = resp.login;

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let usuario_logado = getDadosDoUsuarioLogado()

    let novos_dados_do_usuario_logado = {
        ...todos_os_dados_usuario_logado,
        [`usuario_${usuario_login}`]:{
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
        unidades:[
            {nome:"Dre Ipiranga"},
            {nome:"Dre Butantã"},
        ]
    }
    };
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_do_usuario_logado ))
};

const alternaVisoes = (visao) =>{

    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;
    let dados_usuario_logado = getDadosDoUsuarioLogado();

    console.log("CLIQEI ", dados_usuario_logado);

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

        console.log("alternar_visao ", alternar_visao)

        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(alternar_visao ));
        window.location.reload()
    }

};

export const visoesService ={
    setDadosUsuariosLogados,
    getDadosDoUsuarioLogado,
};

