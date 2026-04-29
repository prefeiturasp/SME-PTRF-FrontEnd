import {
    mantemEstadoFiltrosUnidade,
    ESTADO_FILTROS_UNIDADES,
    deleteEstadoFiltrosUnidades,
} from '../mantemEstadoFiltrosUnidade.service';
import { visoesService } from '../visoes.service';

const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = (value || '').toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

jest.mock('../visoes.service', () => ({
    visoesService: { getUsuarioLogin: jest.fn() },
}));

const testUser = 'testuser123';

const DEFAULT_FILTROS_DESPESAS = {
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
};

const DEFAULT_FILTROS_RECEITAS = {
    filtrar_por_termo: '',
    tipo_receita: '',
    acao_associacao: '',
    conta_associacao: '',
    data_inicio: '',
    data_fim: '',
};

const setUserState = (state) => {
    localStorageMock.setItem(
        ESTADO_FILTROS_UNIDADES,
        JSON.stringify({ [`usuario_${testUser}`]: state })
    );
};

describe('mantemEstadoFiltrosUnidade', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        visoesService.getUsuarioLogin.mockReturnValue(testUser);
    });

    describe('getTodosEstadosFiltrosUnidades', () => {
        it('retorna objeto vazio quando localStorage está vazio', () => {
            expect(mantemEstadoFiltrosUnidade.getTodosEstadosFiltrosUnidades()).toEqual({});
        });

        it('retorna o objeto completo do localStorage', () => {
            const data = { [`usuario_${testUser}`]: { filtros_despesas: DEFAULT_FILTROS_DESPESAS } };
            localStorageMock.setItem(ESTADO_FILTROS_UNIDADES, JSON.stringify(data));
            expect(mantemEstadoFiltrosUnidade.getTodosEstadosFiltrosUnidades()).toEqual(data);
        });
    });

    describe('limpaEstadoFiltrosUnidadesUsuarioLogado', () => {
        it('define o estado padrão para o usuário e remove dados anteriores', () => {
            localStorageMock.setItem(ESTADO_FILTROS_UNIDADES, '{"dados":"antigos"}');
            mantemEstadoFiltrosUnidade.limpaEstadoFiltrosUnidadesUsuarioLogado(testUser);
            const stored = JSON.parse(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES));
            expect(stored[`usuario_${testUser}`]).toEqual({
                unidade_uuid: '',
                filtros_despesas: DEFAULT_FILTROS_DESPESAS,
                filtros_receitas: DEFAULT_FILTROS_RECEITAS,
            });
        });

        it('não preserva dados anteriores de outros usuários (substitui completamente)', () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ESTADO_FILTROS_UNIDADES,
                JSON.stringify({ [`usuario_${otherUser}`]: { filtros_despesas: {} } })
            );
            mantemEstadoFiltrosUnidade.limpaEstadoFiltrosUnidadesUsuarioLogado(testUser);
            const stored = JSON.parse(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES));
            expect(stored[`usuario_${otherUser}`]).toBeUndefined();
        });

        it('funciona quando localStorage está vazio', () => {
            expect(() =>
                mantemEstadoFiltrosUnidade.limpaEstadoFiltrosUnidadesUsuarioLogado(testUser)
            ).not.toThrow();
            expect(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES)).not.toBeNull();
        });
    });

    describe('setEstadoFiltrosUnidadesUsuario', () => {
        it('mescla filtros_despesas com os valores existentes', () => {
            setUserState({
                filtros_despesas: { ...DEFAULT_FILTROS_DESPESAS, filtrar_por_termo: 'escola' },
                filtros_receitas: DEFAULT_FILTROS_RECEITAS,
            });
            mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario(testUser, {
                filtros_despesas: { filtrar_por_termo: 'nova escola', acao_associacao: 'acao-1' },
                filtros_receitas: {},
            });
            const stored = JSON.parse(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES));
            expect(stored[`usuario_${testUser}`].filtros_despesas.filtrar_por_termo).toBe('nova escola');
            expect(stored[`usuario_${testUser}`].filtros_despesas.acao_associacao).toBe('acao-1');
        });

        it('mescla filtros_receitas com os valores existentes', () => {
            setUserState({
                filtros_despesas: DEFAULT_FILTROS_DESPESAS,
                filtros_receitas: { ...DEFAULT_FILTROS_RECEITAS, tipo_receita: 'tipo-1' },
            });
            mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario(testUser, {
                filtros_despesas: {},
                filtros_receitas: { tipo_receita: 'tipo-2', acao_associacao: 'acao-receita' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES));
            expect(stored[`usuario_${testUser}`].filtros_receitas.tipo_receita).toBe('tipo-2');
            expect(stored[`usuario_${testUser}`].filtros_receitas.acao_associacao).toBe('acao-receita');
        });

        it('preserva dados de outros usuários ao atualizar', () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ESTADO_FILTROS_UNIDADES,
                JSON.stringify({
                    [`usuario_${otherUser}`]: { filtros_despesas: { filtrar_por_termo: 'outro' } },
                    [`usuario_${testUser}`]: { filtros_despesas: DEFAULT_FILTROS_DESPESAS, filtros_receitas: DEFAULT_FILTROS_RECEITAS },
                })
            );
            mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario(testUser, {
                filtros_despesas: { filtrar_por_termo: 'meu' },
                filtros_receitas: {},
            });
            const stored = JSON.parse(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES));
            expect(stored[`usuario_${otherUser}`].filtros_despesas.filtrar_por_termo).toBe('outro');
        });

        it('funciona quando localStorage está vazio (retorna {} do getTodosEstadosFiltrosUnidades)', () => {
            expect(() =>
                mantemEstadoFiltrosUnidade.setEstadoFiltrosUnidadesUsuario(testUser, {
                    filtros_despesas: { filtrar_por_termo: 'escola' },
                    filtros_receitas: {},
                })
            ).not.toThrow();
            const stored = JSON.parse(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES));
            expect(stored[`usuario_${testUser}`].filtros_despesas.filtrar_por_termo).toBe('escola');
        });
    });

    describe('getEstadoDespesasFiltrosUnidades', () => {
        it('retorna objeto vazio quando localStorage está vazio', () => {
            expect(mantemEstadoFiltrosUnidade.getEstadoDespesasFiltrosUnidades()).toEqual({});
        });

        it('retorna os filtros de despesas do usuário logado', () => {
            setUserState({
                filtros_despesas: { ...DEFAULT_FILTROS_DESPESAS, filtrar_por_termo: 'escola' },
                filtros_receitas: DEFAULT_FILTROS_RECEITAS,
            });
            expect(mantemEstadoFiltrosUnidade.getEstadoDespesasFiltrosUnidades()).toEqual({
                ...DEFAULT_FILTROS_DESPESAS,
                filtrar_por_termo: 'escola',
            });
        });

        it('retorna objeto vazio quando o usuário logado não tem estado salvo', () => {
            localStorageMock.setItem(
                ESTADO_FILTROS_UNIDADES,
                JSON.stringify({ usuario_outroUsuario: { filtros_despesas: { filtrar_por_termo: 'outro' } } })
            );
            expect(mantemEstadoFiltrosUnidade.getEstadoDespesasFiltrosUnidades()).toEqual({});
        });
    });

    describe('getEstadoReceitasFiltrosUnidades', () => {
        it('retorna objeto vazio quando localStorage está vazio', () => {
            expect(mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades()).toEqual({});
        });

        it('retorna os filtros de receitas do usuário logado', () => {
            setUserState({
                filtros_despesas: DEFAULT_FILTROS_DESPESAS,
                filtros_receitas: { ...DEFAULT_FILTROS_RECEITAS, tipo_receita: 'tipo-x' },
            });
            expect(mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades()).toEqual({
                ...DEFAULT_FILTROS_RECEITAS,
                tipo_receita: 'tipo-x',
            });
        });

        it('retorna objeto vazio quando o usuário logado não tem estado salvo', () => {
            localStorageMock.setItem(
                ESTADO_FILTROS_UNIDADES,
                JSON.stringify({ usuario_outroUsuario: { filtros_receitas: { tipo_receita: 'outro' } } })
            );
            expect(mantemEstadoFiltrosUnidade.getEstadoReceitasFiltrosUnidades()).toEqual({});
        });
    });

    describe('deleteEstadoFiltrosUnidades', () => {
        it('remove a chave ESTADO_FILTROS_UNIDADES do localStorage via objeto exportado', () => {
            localStorageMock.setItem(ESTADO_FILTROS_UNIDADES, '{"dados":"existentes"}');
            mantemEstadoFiltrosUnidade.deleteEstadoFiltrosUnidades();
            expect(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES)).toBeNull();
        });

        it('remove a chave via export nomeado', () => {
            localStorageMock.setItem(ESTADO_FILTROS_UNIDADES, '{"dados":"existentes"}');
            deleteEstadoFiltrosUnidades();
            expect(localStorageMock.getItem(ESTADO_FILTROS_UNIDADES)).toBeNull();
        });

        it('não lança erro quando localStorage já está vazio', () => {
            expect(() => mantemEstadoFiltrosUnidade.deleteEstadoFiltrosUnidades()).not.toThrow();
        });
    });
});
