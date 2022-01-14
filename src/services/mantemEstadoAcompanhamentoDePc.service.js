import {visoesService} from "./visoes.service";

export const ACOMPANHAMENTO_DE_PC = "ACOMPANHAMENTO_DE_PC";

const limpaAcompanhamentoDePcUsuarioLogado = (usuario) =>{
    let todos_acompanhamentos_de_pc = getTodosAcompanhamentosDePc()
    let dados_acompanhamentos_de_pc_update = {
        ...todos_acompanhamentos_de_pc,
        [`usuario_${usuario}`]: {
            // Acompanhamento de PC de Contas
            prestacao_de_conta_uuid: '',
            conferencia_de_lancamentos: {
                conta_uuid: '',
                filtrar_por_acao: '',
                filtrar_por_lancamento: '',
                paginacao_atual: '',
            },
        }
    };
    localStorage.setItem(ACOMPANHAMENTO_DE_PC, JSON.stringify(dados_acompanhamentos_de_pc_update));
}

const setAcompanhamentoDePcPorUsuario = (usuario, objeto) =>{
    let todos_acompanhamentos_de_pc = getTodosAcompanhamentosDePc()
    let dados_acompanhamentos_de_pc_update = {
        ...todos_acompanhamentos_de_pc,
        [`usuario_${usuario}`]: objeto
    };
    localStorage.setItem(ACOMPANHAMENTO_DE_PC, JSON.stringify(dados_acompanhamentos_de_pc_update));
}

const setAcompanhamentoDePc = async () =>{
    let todos_acompanhamentos_de_pc = getTodosAcompanhamentosDePc()
    let acompanhamento_de_pc_usuario_logado = getAcompanhamentoDePcUsuarioLogado()

    let dados_acompanhamentos_de_pc_update = {
        ...todos_acompanhamentos_de_pc,
        [`usuario_${visoesService.getUsuarioLogin()}`]: {
            // Acompanhamento de PC de Contas
            prestacao_de_conta_uuid: acompanhamento_de_pc_usuario_logado && acompanhamento_de_pc_usuario_logado.prestacao_de_conta_uuid ? acompanhamento_de_pc_usuario_logado.prestacao_de_conta_uuid : '',
            conferencia_de_lancamentos: {
                conta_uuid:  acompanhamento_de_pc_usuario_logado && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.conta_uuid ? acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.conta_uuid : '',
                filtrar_por_acao: acompanhamento_de_pc_usuario_logado && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao ? acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao : '',
                filtrar_por_lancamento: acompanhamento_de_pc_usuario_logado && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento ? acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento : '',
                paginacao_atual: acompanhamento_de_pc_usuario_logado && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.paginacao_atual ? acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.paginacao_atual : 0,
            },
        }
    };
    localStorage.setItem(ACOMPANHAMENTO_DE_PC, JSON.stringify(dados_acompanhamentos_de_pc_update));
}

const getAcompanhamentoDePcUsuarioLogado = () => {
    let acompanhamento_de_pc_usuario_logado = localStorage.getItem(ACOMPANHAMENTO_DE_PC) ? JSON.parse(localStorage.getItem(ACOMPANHAMENTO_DE_PC)) : null;
    // eslint-disable-next-line no-eval
    return acompanhamento_de_pc_usuario_logado ? eval('acompanhamento_de_pc_usuario_logado.usuario_' + visoesService.getUsuarioLogin()) : null
};

const getTodosAcompanhamentosDePc = () =>{
    let todos_acompanhamentos_de_pc = localStorage.getItem(ACOMPANHAMENTO_DE_PC) ? JSON.parse(localStorage.getItem(ACOMPANHAMENTO_DE_PC)) : null;
    return todos_acompanhamentos_de_pc
}

export const mantemEstadoAcompanhamentoDePc = {
    limpaAcompanhamentoDePcUsuarioLogado,
    setAcompanhamentoDePc,
    setAcompanhamentoDePcPorUsuario,
    getTodosAcompanhamentosDePc,
    getAcompanhamentoDePcUsuarioLogado,
}