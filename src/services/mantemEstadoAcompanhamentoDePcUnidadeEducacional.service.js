import {visoesService} from "./visoes.service";

export const ACOMPANHAMENTO_PC_UNIDADE = "ACOMPANHAMENTO_PC_UNIDADE";

const limpaAcompanhamentoPcUnidadeUsuarioLogado = (usuario) => {
    localStorage.removeItem(ACOMPANHAMENTO_PC_UNIDADE);
}

const setAcompanhamentoPcUnidadePorUsuario = async (usuario, objeto) => {
    let todos_acompanhamentos_pc_unidade = getTodosAcompanhamentosPcUnidade();
    let dados_acompanhamentos_pc_unidade_update = null;

    if (!localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE) || objeto === undefined) {
        dados_acompanhamentos_pc_unidade_update = {
            [`usuario_${
                    visoesService.getUsuarioLogin()
                }`]: {
                filtra_por_termo: '',
                filtra_por_tipo_unidade: '',
                filtra_por_devolucao_tesouro: '',
                filtra_por_status: '',
                paginacao_atual: '',
                paginacao_atual: ''
            }
        }
    } else {
        const uuidsDocumentos = Object.keys(todos_acompanhamentos_pc_unidade[`usuario_${usuario}`] ?? {});
        if (uuidsDocumentos.includes(Object.keys(objeto)[0])) {
            const updateDocuments = Object.entries(todos_acompanhamentos_pc_unidade[`usuario_${usuario}`]).reduce((acumulador, [uuid, valor]) => {
                if (uuid === Object.keys(objeto)[0]) {
                    acumulador[uuid] = {
                        ...valor,
                        ...objeto[uuid]
                    };
                } else {
                    acumulador[uuid] = valor;
                }
                return acumulador;
            }, {})
            dados_acompanhamentos_pc_unidade_update = {
                ... todos_acompanhamentos_pc_unidade ?? {},
                [`usuario_${usuario}`]: {
                    ... todos_acompanhamentos_pc_unidade ?. [`usuario_${usuario}`] ?? {},
                    ... updateDocuments
                }
            };
        } else {
            dados_acompanhamentos_pc_unidade_update = {
                ... todos_acompanhamentos_pc_unidade ?? {},
                [`usuario_${usuario}`]: {
                    ... todos_acompanhamentos_pc_unidade ?. [`usuario_${usuario}`] ?? {},
                    ...objeto
                }
            };
        }
    }
    localStorage.setItem(ACOMPANHAMENTO_PC_UNIDADE, JSON.stringify(dados_acompanhamentos_pc_unidade_update));
}

const getAcompanhamentoDePcUnidadeUsuarioLogado = (dre__uuid) => {
    let acompanhamento_de_pc_unidade_usuario_logado = localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE) && localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE) !== undefined ? JSON.parse(localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE)) : null;
    // eslint-disable-next-line no-eval
    const filtro_de_usuario_logado = acompanhamento_de_pc_unidade_usuario_logado ? eval('acompanhamento_de_pc_unidade_usuario_logado.usuario_' + visoesService.getUsuarioLogin()) : null
    return filtro_de_usuario_logado ?. [dre__uuid] ?? null
};

const getTodosAcompanhamentosPcUnidade = () => {
    let todos_acompanhamentos_de_pc_unidade = localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE) && localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE) !== undefined ? JSON.parse(localStorage.getItem(ACOMPANHAMENTO_PC_UNIDADE)) : null;
    return todos_acompanhamentos_de_pc_unidade
}

export const mantemEstadoAcompanhamentoDePcUnidade = {
    limpaAcompanhamentoPcUnidadeUsuarioLogado,
    setAcompanhamentoPcUnidadePorUsuario,
    getAcompanhamentoDePcUnidadeUsuarioLogado
}
