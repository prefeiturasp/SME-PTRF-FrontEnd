
export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";

const setDadosUsuariosLogados = async (resp)=>{
    //debugger
    let usuario_login = resp.login
    console.log("user login ", usuario_login)
    let dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let novos_dados_do_usuario_logado = {
        ...dados_usuario_logado,
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
            //nome: dados_usuario_logado ? dados_usuario_logado.visao_selecionada.nome : "",
            nome: "dres",
        },
        unidades:[
            {nome:"Dre Ipiranga"},
            {nome:"Dre Butantã"},
        ]
    }
    }
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_do_usuario_logado ))
};

const alternaVisoes = (visao) =>{

    console.log("CLIQEI")
    let dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    if (dados_usuario_logado){
        let alternar_visao = {
            ...dados_usuario_logado,
            visao_selecionada:{
                nome:visao
            },
        };
        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(alternar_visao ))
        window.location.reload()
    }

};

export const visoesService ={
    setDadosUsuariosLogados,
    alternaVisoes,
};

