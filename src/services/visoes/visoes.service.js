export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";

const setDadosUsuariosLogados = async (resp)=>{
    let visao_selecionada = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let dados_do_usuario_logado = {
        usuario_logado: {
            login: resp.login,
            nome:resp.nome
        },
        visoes:[
            {tipo:"escolas"},
            {tipo:"dres"},
            {tipo:"sme"},
        ],
        visao_selecionada:{
            nome: visao_selecionada ? visao_selecionada.visao_selecionada.nome : "",
        },
        unidades:[
            {nome:"Dre Ipiranga"},
            {nome:"Dre Butantã"},
        ]
    };

    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(dados_do_usuario_logado ))
};

export const visoesService ={
    setDadosUsuariosLogados,
};

