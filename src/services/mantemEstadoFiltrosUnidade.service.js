import {visoesService} from "./visoes.service";

export const ESTADO_FILTROS_UNIDADES = "ESTADO_FILTROS_UNIDADES";

const limpaEstadoFiltrosUnidadesUsuarioLogado = (usuario) =>{
  let estado_filtros_unidades = getEstadoFiltrosUnidades()
  let estado_filtros_unidades_update = {
      ...estado_filtros_unidades,
      [`usuario_${usuario}`]: {
          unidade_uuid: '',
          filtros_despesas: {
              filtrar_por_termo: '',
              aplicacao_recurso: '',
              acao_associacao: '',
              filtro_informacoes: [],
              conta_associacao: '',
              despesa_status: '',
              filtro_vinculo_atividades: [],
              fornecedor: '',
              data_inicio: '',
              data_fim: '',
          },
       }
    };
    localStorage.setItem(ESTADO_FILTROS_UNIDADES, JSON.stringify(estado_filtros_unidades_update));
}

const setEstadoFiltrosUnidadesUsuario = (usuario, objeto) => {
    const todos_estados_unidades = getTodosEstadosFiltrosUnidades();

    let estados_atualizados = {
        ...todos_estados_unidades,
        [`usuario_${usuario}`]: {
            ...todos_estados_unidades[`usuario_${usuario}`],
            filtros_despesas: {
                ...todos_estados_unidades[`usuario_${usuario}`]?.filtros_despesas,
                ...objeto.filtros_despesas,
            },
        },
    };

    localStorage.setItem(ESTADO_FILTROS_UNIDADES, JSON.stringify(estados_atualizados));
};


const getTodosEstadosFiltrosUnidades = () => {
    return localStorage.getItem(ESTADO_FILTROS_UNIDADES)
        ? JSON.parse(localStorage.getItem(ESTADO_FILTROS_UNIDADES))
        : {};
};

const getEstadoFiltrosUnidades = () => {
    const usuario = visoesService.getUsuarioLogin();
    const todos_estados = getTodosEstadosFiltrosUnidades();
    return todos_estados[`usuario_${usuario}`]?.filtros_despesas || {};
};

export const mantemEstadoFiltrosUnidade = {
    limpaEstadoFiltrosUnidadesUsuarioLogado,
    setEstadoFiltrosUnidadesUsuario,
    getEstadoFiltrosUnidades,
    getTodosEstadosFiltrosUnidades,
};