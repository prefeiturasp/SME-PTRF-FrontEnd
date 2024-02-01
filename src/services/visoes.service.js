import {
    USUARIO_LOGIN,
    ASSOCIACAO_UUID,
    ASSOCIACAO_TIPO_ESCOLA,
    ASSOCIACAO_NOME_ESCOLA,
    ASSOCIACAO_NOME,
    authService, DATA_LOGIN, PERIODO_RELATORIO_CONSOLIDADO_DRE
} from "./auth.service";
import {redirect} from "../utils/redirect";
import moment from "moment";
import {ACOMPANHAMENTO_DE_PC} from "./mantemEstadoAcompanhamentoDePc.service";
import { ANALISE_DRE } from './mantemEstadoAnaliseDre.service';
import { ACOMPANHAMENTO_PC_UNIDADE } from "./mantemEstadoAcompanhamentoDePcUnidadeEducacional.service";

export const DADOS_USUARIO_LOGADO = "DADOS_USUARIO_LOGADO";
export const DADOS_USUARIO_LOGADO_NORMAL = "DADOS_USUARIO_LOGADO_NORMAL";
export const DADOS_USUARIO_LOGADO_SUPORTE = "DADOS_USUARIO_LOGADO_SUPORTE";
export const DATA_HORA_USUARIO_LOGADO = "DATA_HORA_USUARIO_LOGADO";
export const ACESSO_MODO_SUPORTE = "ACESSO_MODO_SUPORTE";
export const VISOES =  {
    UE: 'UE',
    DRE: 'DRE',
    SME: 'SME',
};

const forcarNovoLogin = ()=>{
    const data_hora_atual = moment().format("YYYY-MM-DD HH:mm:ss");
    const data_hora_localstorage = localStorage.getItem(DATA_HORA_USUARIO_LOGADO);
    if(data_hora_localstorage){
        const diferenca = moment(data_hora_atual).diff(moment(data_hora_localstorage), 'minutes');
        if (diferenca >= 1440){ // Equivale a 24 horas
            localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual);
            localStorage.removeItem('DADOS_USUARIO_LOGADO');
            localStorage.removeItem(ACOMPANHAMENTO_DE_PC);
            localStorage.removeItem(ACOMPANHAMENTO_PC_UNIDADE);
            localStorage.removeItem(ANALISE_DRE);
            localStorage.removeItem(PERIODO_RELATORIO_CONSOLIDADO_DRE);
            localStorage.setItem(DATA_LOGIN, moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD"));
            authService.logout();
        }else if (diferenca >= 600 && diferenca <= 1339){ // Equivale a 10 horas e menos que 24 horas
            localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual);
            authService.logout();
        }
    }else {
        localStorage.setItem(DATA_HORA_USUARIO_LOGADO, data_hora_atual)
    }
};

const getUsuarioLogin = () => {
    return localStorage.getItem(USUARIO_LOGIN)
};

const getDadosDoUsuarioLogado = () => {
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO));
    // eslint-disable-next-line no-eval
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_' + getUsuarioLogin()) : null
};

const getDadosDoUsuarioLogadoNormal = () => {
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO_NORMAL));
    // eslint-disable-next-line no-eval
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_' + getUsuarioLogin()) : null
};

const getDadosDoUsuarioLogadoSuporte = () => {
    let dados_usuario_logado = JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO_SUPORTE));
    // eslint-disable-next-line no-eval
    return dados_usuario_logado ? eval('dados_usuario_logado.usuario_' + getUsuarioLogin()) : null
};

const setDadosDoUsuarioLogado = (dados_usuario_logado) => {
    let dados_usuario_logado_atual = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let dados_usuario_logado_update = {
        ...dados_usuario_logado_atual,
        [`usuario_${getUsuarioLogin()}`]: {
            ...dados_usuario_logado,
        }
    };
    localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(dados_usuario_logado_update));
};

const salva_dados_ultimo_acesso = (
    {
        visao, visao_acesso_normal, visao_suporte, 
        uuid_unidade, uuid_unidade_normal, uuid_unidade_suporte,
        unidade_tipo, unidade_tipo_normal, unidade_tipo_suporte, 
        unidade_nome, unidade_nome_normal, unidade_nome_suporte, 
        uuid_associacao, uuid_associacao_normal, uuid_associacao_suporte, 
        nome_associacao, nome_associacao_normal, nome_associacao_suporte,
        atualizar_dados_alternancia_unidade = false
    }) => {

    let acesso_suporte = localStorage.getItem(ACESSO_MODO_SUPORTE)

    let visao_selecionada_nome, unidade_selecionada_uuid, unidade_selecionada_tipo, unidade_selecionada_nome, associacao_selecionada_uuid, associacao_selecionada_nome;

    if (acesso_suporte === "true") {
        visao_selecionada_nome = atualizar_dados_alternancia_unidade ? visao : visao_suporte;
        unidade_selecionada_uuid = atualizar_dados_alternancia_unidade ? uuid_unidade : uuid_unidade_suporte;
        unidade_selecionada_tipo = atualizar_dados_alternancia_unidade ? unidade_tipo : unidade_tipo_suporte;
        unidade_selecionada_nome = atualizar_dados_alternancia_unidade ? unidade_nome : unidade_nome_suporte;
        associacao_selecionada_uuid = atualizar_dados_alternancia_unidade ? uuid_associacao : uuid_associacao_suporte;
        associacao_selecionada_nome = atualizar_dados_alternancia_unidade ? nome_associacao : nome_associacao_suporte;
    } else if(acesso_suporte === "false") {
        visao_selecionada_nome = atualizar_dados_alternancia_unidade ? visao : visao_acesso_normal;
        unidade_selecionada_uuid = atualizar_dados_alternancia_unidade ? uuid_unidade : uuid_unidade_normal;
        unidade_selecionada_tipo = atualizar_dados_alternancia_unidade ? unidade_tipo : unidade_tipo_normal;
        unidade_selecionada_nome = atualizar_dados_alternancia_unidade ? unidade_nome : unidade_nome_normal;
        associacao_selecionada_uuid = atualizar_dados_alternancia_unidade ? uuid_associacao : uuid_associacao_normal;
        associacao_selecionada_nome = atualizar_dados_alternancia_unidade ? nome_associacao : nome_associacao_normal;
    }

    let dados_do_ultimo_acesso = {
        [`usuario_${getUsuarioLogin()}`]: {
            visao_selecionada: {
                nome: visao_selecionada_nome
            },
            unidade_selecionada: { 
                uuid: unidade_selecionada_uuid,
                tipo_unidade: unidade_selecionada_tipo,
                nome: unidade_selecionada_nome,
            },

            associacao_selecionada: {
                uuid: associacao_selecionada_uuid,
                nome: associacao_selecionada_nome,
            },
        }
    };

    if (acesso_suporte === "true") {
        localStorage.setItem(DADOS_USUARIO_LOGADO_SUPORTE, JSON.stringify(dados_do_ultimo_acesso));
    } else if(acesso_suporte === "false") {
        localStorage.setItem(DADOS_USUARIO_LOGADO_NORMAL, JSON.stringify(dados_do_ultimo_acesso));
    }
}

const setDadosPrimeiroAcesso = async (resp, suporte) =>{
    
    // Dados visão acesso atual
    let visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome, notificar_devolucao_referencia, notificar_devolucao_pc_uuid, notificacao_uuid;

    // Dados visão de acesso normal
    let visao_acesso_normal, uuid_unidade_normal, uuid_associacao_normal, nome_associacao_normal, unidade_tipo_normal, unidade_nome_normal;

    // Dados visão de acesso suporte
    let visao_suporte, uuid_unidade_suporte, uuid_associacao_suporte, nome_associacao_suporte, unidade_tipo_suporte, unidade_nome_suporte;

    let usuario_logado = getDadosDoUsuarioLogado();
    let dados_acesso_normal = getDadosDoUsuarioLogadoNormal();
    let dados_acesso_suporte = getDadosDoUsuarioLogadoSuporte();

    const temAcessoAUnidadeSelecionada = () => {
        return !!usuario_logado.unidades.find(unidade => unidade.uuid === usuario_logado.unidade_selecionada.uuid)
    };

    if (usuario_logado && usuario_logado.associacao_selecionada.uuid && temAcessoAUnidadeSelecionada() ){
        visao = usuario_logado.visao_selecionada.nome;
        uuid_unidade = usuario_logado.unidade_selecionada.uuid;
        uuid_associacao = usuario_logado.associacao_selecionada.uuid;
        nome_associacao = usuario_logado.associacao_selecionada.nome;

        // Atualiza as variáveis de informação sobre devolução de PC com as informações da lista de unidades.
        let unidade_update = resp.unidades.find(unidade => unidade.uuid === uuid_unidade);
        if (unidade_update) {
            notificar_devolucao_referencia = unidade_update.notificar_devolucao_referencia;
            notificar_devolucao_pc_uuid = unidade_update.notificar_devolucao_pc_uuid;
            notificacao_uuid = unidade_update.notificacao_uuid;
        } else {
            notificar_devolucao_referencia = usuario_logado.unidade_selecionada.notificar_devolucao_referencia;
            notificar_devolucao_pc_uuid = usuario_logado.unidade_selecionada.notificar_devolucao_pc_uuid;
            notificacao_uuid = usuario_logado.unidade_selecionada.notificacao_uuid;
        }

        if (suporte) {
            visao_suporte = visao;
            uuid_unidade_suporte = uuid_unidade;
            uuid_associacao_suporte = uuid_associacao;
            nome_associacao_suporte = nome_associacao;

            visao_acesso_normal = dados_acesso_normal ? dados_acesso_normal.visao_selecionada.nome : '';
            uuid_unidade_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.uuid : '';
            uuid_associacao_normal = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.uuid : '';
            nome_associacao_normal = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.nome : '';
        } else {
            visao_suporte = dados_acesso_suporte ? dados_acesso_suporte.visao_selecionada.nome : "";
            uuid_unidade_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.uuid : "";
            uuid_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.uuid : "";
            nome_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.nome : "";

            visao_acesso_normal = visao;
            uuid_unidade_normal =  uuid_unidade;
            uuid_associacao_normal = uuid_associacao;
            nome_associacao_normal = nome_associacao;
        }

    }else {
        if (resp.visoes.find(visao=> visao === 'SME') && resp.unidades.find(unidade => unidade.tipo_unidade === "SME")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "SME");
            visao="SME";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.uuid;
            nome_associacao = unidade.nome;
            notificar_devolucao_referencia = null;
            notificar_devolucao_pc_uuid = null;
            notificacao_uuid = null;

            uuid_unidade_normal = uuid_unidade;
            uuid_associacao_normal = uuid_associacao;
            nome_associacao_normal = nome_associacao;

            uuid_unidade_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.uuid : "";
            uuid_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.uuid : "";
            nome_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.nome : "";

        }else if (resp.visoes.find(visao=> visao === 'DRE') && resp.unidades.find(unidade => unidade.tipo_unidade === "DRE")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            visao="DRE";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.uuid;
            nome_associacao = unidade.nome;
            notificar_devolucao_referencia = null;
            notificar_devolucao_pc_uuid = null;
            notificacao_uuid = null;

            if (suporte) {
                uuid_unidade_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.uuid : "";
                uuid_associacao_normal = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.uuid : "";
                nome_associacao_normal = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.nome : "";

                uuid_unidade_suporte = uuid_unidade;
                uuid_associacao_suporte = uuid_associacao;
                nome_associacao_suporte = nome_associacao;
            } else {
                uuid_unidade_normal = uuid_unidade;
                uuid_associacao_normal = uuid_associacao;
                nome_associacao_normal = nome_associacao;

                uuid_unidade_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.uuid : "";
                uuid_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.uuid : "";
                nome_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.nome : "";
            }

        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            visao="UE";
            uuid_unidade = unidade.uuid;
            uuid_associacao = unidade.associacao.uuid;
            nome_associacao = unidade.associacao.nome;
            notificar_devolucao_referencia = unidade.notificar_devolucao_referencia;
            notificar_devolucao_pc_uuid = unidade.notificar_devolucao_pc_uuid;
            notificacao_uuid = unidade.notificacao_uuid;

            if (suporte) {
                uuid_unidade_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.uuid : "";
                uuid_associacao_normal = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.uuid : "";
                nome_associacao_normal = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.nome : "";

                uuid_unidade_suporte = uuid_unidade;
                uuid_associacao_suporte = uuid_associacao;
                nome_associacao_suporte = nome_associacao;
            } else {
                uuid_unidade_normal = uuid_unidade;
                uuid_associacao_normal = uuid_associacao;
                nome_associacao_normal = nome_associacao;

                uuid_unidade_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.uuid : "";
                uuid_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.uuid : "";
                nome_associacao_suporte = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.nome : "";
            }
        }
    }

    if (usuario_logado && usuario_logado.unidade_selecionada.nome && temAcessoAUnidadeSelecionada()){
        unidade_nome = usuario_logado.unidade_selecionada.nome;

        if (suporte) {
            unidade_nome_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.nome : "";
            unidade_nome_suporte = unidade_nome;
        } else {
            unidade_nome_normal = unidade_nome;
            unidade_nome_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.nome : "";
        }
    }else{
        if (resp.visoes.find(visao=> visao === 'SME') && resp.unidades.find(unidade => unidade.tipo_unidade === "SME")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "SME");
            unidade_nome = unidade.nome;

            unidade_nome_normal = unidade_nome;
            unidade_nome_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.nome : "";

        }else if (resp.visoes.find(visao=> visao === 'DRE') && resp.unidades.find(unidade => unidade.tipo_unidade === "DRE")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            unidade_nome = unidade.nome;

            if (suporte) {
                unidade_nome_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.nome : "";
                unidade_nome_suporte = unidade_nome;
            } else {
                unidade_nome_normal = unidade_nome;
                unidade_nome_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.nome : "";
            }
        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            unidade_nome = unidade.nome;

            if (suporte) {
                unidade_nome_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.nome : "";
                unidade_nome_suporte = unidade_nome;
            } else {
                unidade_nome_normal = unidade_nome;
                unidade_nome_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.nome : "";
            }
        }
    }

    if (usuario_logado && usuario_logado.unidade_selecionada.tipo_unidade && temAcessoAUnidadeSelecionada()){
        unidade_tipo = usuario_logado.unidade_selecionada.tipo_unidade;

        unidade_tipo_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.tipo_unidade : "";
        unidade_tipo_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.tipo_unidade : "";
    }else {
        if (resp.visoes.find(visao=> visao === 'SME') && resp.unidades.find(unidade => unidade.tipo_unidade === "SME")){
            unidade_tipo = "SME";

            unidade_tipo_normal = unidade_tipo;
            unidade_tipo_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.tipo_unidade : "";
        }else if (resp.visoes.find(visao=> visao === 'DRE') && resp.unidades.find(unidade => unidade.tipo_unidade === "DRE")){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade === "DRE");
            unidade_tipo = unidade.tipo_unidade;

            if (suporte) {
                unidade_tipo_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.tipo : "";
                unidade_tipo_suporte = unidade_tipo;
            } else {
                unidade_tipo_normal = unidade_tipo;
                unidade_tipo_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.tipo : "";
            }

        }else if (resp.visoes.find(visao=> visao === 'UE')){
            let unidade = resp.unidades.find(unidade => unidade.tipo_unidade !== "DRE");
            unidade_tipo = unidade.tipo_unidade;

            if (suporte) {
                unidade_tipo_normal = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.tipo : "";
                unidade_tipo_suporte = unidade_tipo;
            } else {
                unidade_tipo_normal = unidade_tipo;
                unidade_tipo_suporte = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.tipo : "";
            }
        }
    }

    salva_dados_ultimo_acesso({
        visao, visao_acesso_normal, visao_suporte, 
        uuid_unidade, uuid_unidade_normal, uuid_unidade_suporte,
        unidade_tipo, unidade_tipo_normal, unidade_tipo_suporte, 
        unidade_nome, unidade_nome_normal, unidade_nome_suporte, 
        uuid_associacao, uuid_associacao_normal, uuid_associacao_suporte, 
        nome_associacao, nome_associacao_normal, nome_associacao_suporte, 
        notificar_devolucao_referencia, 
        notificar_devolucao_pc_uuid, 
        notificacao_uuid, 
        atualizar_dados_alternancia_unidade: false
    })
    
    alternaVisoes(visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome, notificar_devolucao_referencia, notificar_devolucao_pc_uuid, notificacao_uuid)
};

const getPermissoes = (permissao) =>{

    if (permissao && authService.isLoggedIn()){
        let permissoes = getItemUsuarioLogado('permissoes');
        let result = permissao.filter(item => permissoes.indexOf(item) > -1);
        // let tem_acesso = result.length === permissao.length;
        // Alterado para conceder acesso se tiver ao menos uma das permissões da lista passada.
        // Anteriormente estava exigindo que tivesse todas as permissões passadas na lista o que quebrava o acesso ao perfil de acessos
        let tem_acesso = result.length > 0;
        return tem_acesso
    }

};
const featureFlagAtiva = (featureFlag) => {
  if (!featureFlag || !authService.isLoggedIn()) {
    return false;
  }

  const featureFlagsAtivas = getItemUsuarioLogado('feature_flags');
  return featureFlagsAtivas.includes(featureFlag);
};



const setDadosUsuariosLogados = async (resp, suporte) => {
    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;

    let usuario_logado = getDadosDoUsuarioLogado();
    
    let visao_selecionada_nome, unidade_selecionada_uuid, unidade_selecionada_tipo_unidade, unidade_selecionada_nome, associacao_selecionada_uuid, associacao_selecionada_nome;

    let dados_acesso_normal = getDadosDoUsuarioLogadoNormal();
    let dados_acesso_suporte = getDadosDoUsuarioLogadoSuporte();

    if (suporte) {
        visao_selecionada_nome = dados_acesso_suporte ? dados_acesso_suporte.visao_selecionada.nome : ""
        unidade_selecionada_uuid = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.uuid : ""
        unidade_selecionada_tipo_unidade = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.tipo_unidade : ""
        unidade_selecionada_nome = dados_acesso_suporte ? dados_acesso_suporte.unidade_selecionada.nome : ""
        associacao_selecionada_uuid = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.uuid : ""
        associacao_selecionada_nome = dados_acesso_suporte ? dados_acesso_suporte.associacao_selecionada.nome : ""
    } else {
        visao_selecionada_nome = dados_acesso_normal ? dados_acesso_normal.visao_selecionada.nome : ""
        unidade_selecionada_uuid = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.uuid : ""
        unidade_selecionada_tipo_unidade = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.tipo_unidade : ""
        unidade_selecionada_nome = dados_acesso_normal ? dados_acesso_normal.unidade_selecionada.nome : ""
        associacao_selecionada_uuid = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.uuid : ""
        associacao_selecionada_nome = dados_acesso_normal ? dados_acesso_normal.associacao_selecionada.nome : ""
    }

    let novos_dados_do_usuario_logado = {
        ...todos_os_dados_usuario_logado,
        [`usuario_${getUsuarioLogin()}`]: {

            usuario_logado: {
                login: resp.login,
                nome: resp.nome
            },
            visoes: resp.visoes,

            visao_selecionada: {
                nome: visao_selecionada_nome,
            },
            unidades: resp.unidades,

            unidade_selecionada: {
                uuid: unidade_selecionada_uuid,
                tipo_unidade: unidade_selecionada_tipo_unidade,
                nome: unidade_selecionada_nome,
                notificar_devolucao_referencia: usuario_logado ? usuario_logado.unidade_selecionada.notificar_devolucao_referencia : "",
                notificar_devolucao_pc_uuid: usuario_logado ? usuario_logado.unidade_selecionada.notificar_devolucao_pc_uuid : "",
                notificacao_uuid: usuario_logado ? usuario_logado.unidade_selecionada.notificacao_uuid : "",

            },

            associacao_selecionada: {
                uuid: associacao_selecionada_uuid,
                nome: associacao_selecionada_nome,
            },

            permissoes: resp.permissoes ? resp.permissoes : [],

            feature_flags: resp.feature_flags ? resp.feature_flags : []
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

const alternaVisoes = (visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome, notificar_devolucao_referencia, notificar_devolucao_pc_uuid, notificacao_uuid) => {

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
                    notificar_devolucao_referencia:notificar_devolucao_referencia,
                    notificar_devolucao_pc_uuid:notificar_devolucao_pc_uuid,
                    notificacao_uuid: notificacao_uuid,
                },

                associacao_selecionada: {
                    uuid: uuid_associacao,
                    nome: nome_associacao,
                },
            }
        };

        salva_dados_ultimo_acesso({
            visao, 
            uuid_unidade,
            unidade_tipo,
            unidade_nome,
            uuid_associacao,
            nome_associacao,
            notificar_devolucao_referencia, 
            notificar_devolucao_pc_uuid, 
            notificacao_uuid, 
            atualizar_dados_alternancia_unidade: true
        })
        

        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(alternar_visao));
        localStorage.setItem(ASSOCIACAO_UUID, uuid_associacao);
        localStorage.setItem(ASSOCIACAO_NOME,nome_associacao);
        localStorage.setItem(ASSOCIACAO_TIPO_ESCOLA, unidade_tipo);
        localStorage.setItem(ASSOCIACAO_NOME_ESCOLA, unidade_nome);
        localStorage.removeItem('periodoConta');
        localStorage.removeItem('acaoLancamento');
        localStorage.removeItem('periodoPrestacaoDeConta');
        localStorage.removeItem('statusPrestacaoDeConta');
        localStorage.removeItem('contaPrestacaoDeConta');
        localStorage.removeItem('uuidPrestacaoConta');
        localStorage.removeItem('uuidAta');
        localStorage.removeItem('prestacao_de_contas_nao_apresentada');
        localStorage.removeItem(PERIODO_RELATORIO_CONSOLIDADO_DRE);

        localStorage.setItem("NOTIFICAR_DEVOLUCAO_REFERENCIA", notificar_devolucao_referencia)

        redirectVisao(visao)
    }
};


export const setarUnidadeProximoLoginAcessoSuporte = (visao, uuid_unidade, uuid_associacao, nome_associacao, unidade_tipo, unidade_nome) => {
    let todos_os_dados_usuario_logado = localStorage.getItem(DADOS_USUARIO_LOGADO) ? JSON.parse(localStorage.getItem(DADOS_USUARIO_LOGADO)) : null;
    let dados_usuario_logado = getDadosDoUsuarioLogado();

    if (dados_usuario_logado) {
        let novos_dados_usuario_logado = {
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
                    notificar_devolucao_referencia:null,
                    notificar_devolucao_pc_uuid:null,
                    notificacao_uuid: null,
                },

                associacao_selecionada: {
                    uuid: unidade_tipo === "DRE" ? uuid_unidade: uuid_associacao,
                    nome: unidade_tipo === "DRE" ? unidade_nome: nome_associacao,
                },
            }
        };
        localStorage.setItem(DADOS_USUARIO_LOGADO, JSON.stringify(novos_dados_usuario_logado));
    }
};


const redirectVisao = (visao = null) => {
    let dados_usuario_logado = visoesService.getDadosDoUsuarioLogado();
    if (visao === 'SME') {
        redirect('/painel-parametrizacoes')
    } else if (visao === 'DRE') {
        redirect('/dre-dashboard')
    } else if (visao === 'UE') {
        redirect('/dados-da-associacao')
    } else {
        if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'SME')) {
            redirect('/painel-parametrizacoes')
        } else if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'DRE')) {
            redirect('/dre-dashboard')
        } else if (dados_usuario_logado.visoes.find(visao => visao.tipo === 'UE')) {
            redirect('/dados-da-associacao')
        } else {
            redirect('/dados-da-associacao')
        }
    }
};

const getItemUsuarioLogado = (indice) =>{
    let usuario_logado = getDadosDoUsuarioLogado();
    // eslint-disable-next-line no-eval
    return eval('usuario_logado.' + indice)
};


export const visoesService = {
    forcarNovoLogin,
    setDadosUsuariosLogados,
    getPermissoes,
    setDadosPrimeiroAcesso,
    converteNomeVisao,
    alternaVisoes,
    getDadosDoUsuarioLogado,
    setDadosDoUsuarioLogado,
    redirectVisao,
    getItemUsuarioLogado,
    getUsuarioLogin,
    featureFlagAtiva,
    VISOES
};
