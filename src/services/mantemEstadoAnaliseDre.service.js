import {visoesService} from "./visoes.service";

export const ANALISE_DRE = "ANALISE_DRE";

const limpaAnaliseDreUsuarioLogado = (usuario) =>{
    let todas_analises_dre = getTodasAnaliseDre()
    let dados_analise_dre_update = {
        ...todas_analises_dre,
        [`usuario_${usuario}`]: {
            // Analise DRE
            analise_pc_uuid: '',
            conferencia_extrato_bancario: {
                conta_uuid: '',
            },
            conferencia_de_lancamentos: {
                conta_uuid: '',
                expanded: [],
                paginacao_atual: '',
            },
            conferencia_de_documentos: {
                expanded: [],
                paginacao_atual: '',
            }
        }
    };
    localStorage.setItem(ANALISE_DRE, JSON.stringify(dados_analise_dre_update));
}

const setAnaliseDrePorUsuario = (usuario, objeto) =>{
    let todas_analises_dre = getTodasAnaliseDre()
    // console.log("como q vem aqui", todas_analises_dre)
    let dados_analise_dre_update = {
        ...todas_analises_dre,
        [`usuario_${usuario}`]: objeto
    };
    localStorage.setItem(ANALISE_DRE, JSON.stringify(dados_analise_dre_update));
}


const setAnaliseDre = async () => {
    let todas_analises_dre = getTodasAnaliseDre();
    let analise_dre_usuario_logado = getAnaliseDreUsuarioLogado();

    let dados_analise_dre_update = {
        ...todas_analises_dre,
        [`usuario_${visoesService.getUsuarioLogin()}`]: {
            analise_pc_uuid: analise_dre_usuario_logado && analise_dre_usuario_logado.analise_pc_uuid ? analise_dre_usuario_logado.analise_pc_uuid : '',
            conferencia_extrato_bancario: {
                conta_uuid: analise_dre_usuario_logado && analise_dre_usuario_logado.conferencia_extrato_bancario && analise_dre_usuario_logado.conferencia_extrato_bancario.conta_uuid ? analise_dre_usuario_logado.conferencia_extrato_bancario.conta_uuid : '',
            },
            conferencia_de_lancamentos: {
                conta_uuid: analise_dre_usuario_logado && analise_dre_usuario_logado.conferencia_de_lancamentos && analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid ? analise_dre_usuario_logado.conferencia_de_lancamentos.conta_uuid : '',
                expanded: analise_dre_usuario_logado && analise_dre_usuario_logado.conferencia_de_lancamentos && analise_dre_usuario_logado.conferencia_de_lancamentos.expanded ? analise_dre_usuario_logado.conferencia_de_lancamentos.expanded : [],
                paginacao_atual: analise_dre_usuario_logado && analise_dre_usuario_logado.conferencia_de_lancamentos && analise_dre_usuario_logado.conferencia_de_lancamentos.paginacao_atual ? analise_dre_usuario_logado.conferencia_de_lancamentos.paginacao_atual : 0,
            },
            conferencia_de_documentos: {
                expanded: analise_dre_usuario_logado && analise_dre_usuario_logado.conferencia_de_documentos && analise_dre_usuario_logado.conferencia_de_documentos.expanded ? analise_dre_usuario_logado.conferencia_de_documentos.expanded : [],
                paginacao_atual: analise_dre_usuario_logado && analise_dre_usuario_logado.conferencia_de_documentos && analise_dre_usuario_logado.conferencia_de_documentos.paginacao_atual ? analise_dre_usuario_logado.conferencia_de_documentos.paginacao_atual : 0,
            }
        }
    }

    localStorage.setItem(ANALISE_DRE, JSON.stringify(dados_analise_dre_update));
}

const getAnaliseDreUsuarioLogado = () => {
    let analise_dre_usuario_logado = localStorage.getItem(ANALISE_DRE) ? JSON.parse(localStorage.getItem(ANALISE_DRE)) : null;
    // eslint-disable-next-line no-eval
    return analise_dre_usuario_logado ? eval('analise_dre_usuario_logado.usuario_' + visoesService.getUsuarioLogin()) : null;
}

const getTodasAnaliseDre = () => {
    let todas_analises_dre = localStorage.getItem(ANALISE_DRE) ? JSON.parse(localStorage.getItem(ANALISE_DRE)) : null;
    return todas_analises_dre;
}


export const mantemEstadoAnaliseDre = {
    limpaAnaliseDreUsuarioLogado,
    setAnaliseDre,
    setAnaliseDrePorUsuario,
    getTodasAnaliseDre,
    getAnaliseDreUsuarioLogado,
}