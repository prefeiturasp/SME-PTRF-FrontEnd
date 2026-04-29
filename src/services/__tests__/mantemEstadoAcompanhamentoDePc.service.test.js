import {
    mantemEstadoAcompanhamentoDePc,
    ACOMPANHAMENTO_DE_PC,
} from '../mantemEstadoAcompanhamentoDePc.service';
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

const DEFAULT_USER_STATE = {
    prestacao_de_conta_uuid: '',
    conferencia_de_lancamentos: {
        conta_uuid: '',
        filtrar_por_acao: '',
        filtrar_por_lancamento: '',
        paginacao_atual: 0,
        filtrar_por_data_inicio: '',
        filtrar_por_data_fim: '',
        filtrar_por_nome_fornecedor: '',
        filtrar_por_numero_de_documento: '',
        filtrar_por_tipo_de_documento: '',
        filtrar_por_tipo_de_pagamento: '',
        filtrar_por_conferencia: [],
        filtrar_por_informacao: [],
        ordenamento_tabela_lancamentos: [],
        ordenar_por_imposto: false,
    },
    conferencia_despesas_periodos_anteriores: {
        conta_uuid: '',
        filtrar_por_acao: '',
        filtrar_por_lancamento: '',
        paginacao_atual: 0,
        filtrar_por_data_inicio: '',
        filtrar_por_data_fim: '',
        filtrar_por_nome_fornecedor: '',
        filtrar_por_numero_de_documento: '',
        filtrar_por_tipo_de_documento: '',
        filtrar_por_tipo_de_pagamento: '',
        filtrar_por_conferencia: [],
        filtrar_por_informacao: [],
        ordenamento_tabela_lancamentos: [],
        ordenar_por_imposto: false,
    },
};

const setUserState = (state) => {
    localStorageMock.setItem(
        ACOMPANHAMENTO_DE_PC,
        JSON.stringify({ [`usuario_${testUser}`]: state })
    );
};

describe('mantemEstadoAcompanhamentoDePc', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        visoesService.getUsuarioLogin.mockReturnValue(testUser);
    });

    describe('getTodosAcompanhamentosDePc', () => {
        it('retorna null quando localStorage está vazio', () => {
            expect(mantemEstadoAcompanhamentoDePc.getTodosAcompanhamentosDePc()).toBeNull();
        });

        it('retorna o objeto completo do localStorage', () => {
            const data = { [`usuario_${testUser}`]: { prestacao_de_conta_uuid: 'uuid-1' } };
            localStorageMock.setItem(ACOMPANHAMENTO_DE_PC, JSON.stringify(data));
            expect(mantemEstadoAcompanhamentoDePc.getTodosAcompanhamentosDePc()).toEqual(data);
        });
    });

    describe('getAcompanhamentoDePcUsuarioLogado', () => {
        it('retorna null quando localStorage está vazio', () => {
            expect(mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado()).toBeNull();
        });

        it('retorna os dados do usuário logado', () => {
            const userState = { prestacao_de_conta_uuid: 'uuid-123' };
            setUserState(userState);
            expect(mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado()).toEqual(userState);
        });

        it('retorna undefined quando outro usuário está no localStorage mas não o logado', () => {
            localStorageMock.setItem(
                ACOMPANHAMENTO_DE_PC,
                JSON.stringify({ usuario_outroUsuario: { prestacao_de_conta_uuid: 'outro' } })
            );
            expect(mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado()).toBeUndefined();
        });
    });

    describe('limpaAcompanhamentoDePcUsuarioLogado', () => {
        it('redefine o estado do usuário para os valores padrão', () => {
            setUserState({ prestacao_de_conta_uuid: 'uuid-existente' });
            mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado(testUser);
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`]).toEqual(DEFAULT_USER_STATE);
        });

        it('preserva dados de outros usuários ao limpar', () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ACOMPANHAMENTO_DE_PC,
                JSON.stringify({
                    [`usuario_${otherUser}`]: { prestacao_de_conta_uuid: 'outro-uuid' },
                    [`usuario_${testUser}`]: { prestacao_de_conta_uuid: 'meu-uuid' },
                })
            );
            mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado(testUser);
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${otherUser}`]).toEqual({ prestacao_de_conta_uuid: 'outro-uuid' });
        });

        it('funciona quando localStorage está vazio (spreads null sem erros)', () => {
            expect(() =>
                mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado(testUser)
            ).not.toThrow();
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`]).toEqual(DEFAULT_USER_STATE);
        });
    });

    describe('setAcompanhamentoDePcPorUsuario', () => {
        it('atualiza o estado do usuário com o objeto fornecido', () => {
            setUserState(DEFAULT_USER_STATE);
            mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePcPorUsuario(testUser, {
                prestacao_de_conta_uuid: 'uuid-novo',
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].prestacao_de_conta_uuid).toBe('uuid-novo');
        });

        it('mescla com os dados existentes do usuário', () => {
            setUserState({ ...DEFAULT_USER_STATE, prestacao_de_conta_uuid: 'uuid-antigo' });
            mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePcPorUsuario(testUser, {
                conferencia_de_lancamentos: { conta_uuid: 'conta-123' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].prestacao_de_conta_uuid).toBe('uuid-antigo');
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.conta_uuid).toBe('conta-123');
        });

        it('preserva dados de outros usuários', () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ACOMPANHAMENTO_DE_PC,
                JSON.stringify({
                    [`usuario_${otherUser}`]: { prestacao_de_conta_uuid: 'outro' },
                    [`usuario_${testUser}`]: DEFAULT_USER_STATE,
                })
            );
            mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePcPorUsuario(testUser, {
                prestacao_de_conta_uuid: 'meu-uuid',
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${otherUser}`]).toEqual({ prestacao_de_conta_uuid: 'outro' });
        });
    });

    describe('setAcompanhamentoDePc', () => {
        it('cria estado padrão para o usuário logado quando localStorage está vazio', async () => {
            await mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePc();
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].prestacao_de_conta_uuid).toBe('');
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.conta_uuid).toBe('');
        });

        it('preserva prestacao_de_conta_uuid existente', async () => {
            setUserState({ ...DEFAULT_USER_STATE, prestacao_de_conta_uuid: 'uuid-preservado' });
            await mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePc();
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].prestacao_de_conta_uuid).toBe('uuid-preservado');
        });

        it('preserva conta_uuid da conferencia_de_lancamentos existente', async () => {
            setUserState({
                ...DEFAULT_USER_STATE,
                conferencia_de_lancamentos: {
                    ...DEFAULT_USER_STATE.conferencia_de_lancamentos,
                    conta_uuid: 'conta-preservada',
                    filtrar_por_acao: 'acao-preservada',
                },
            });
            await mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePc();
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.conta_uuid).toBe('conta-preservada');
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.filtrar_por_acao).toBe('acao-preservada');
        });

        it('preserva conta_uuid da conferencia_despesas_periodos_anteriores existente', async () => {
            setUserState({
                ...DEFAULT_USER_STATE,
                conferencia_despesas_periodos_anteriores: {
                    ...DEFAULT_USER_STATE.conferencia_despesas_periodos_anteriores,
                    conta_uuid: 'conta-despesas',
                    paginacao_atual: 3,
                },
            });
            await mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePc();
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].conferencia_despesas_periodos_anteriores.conta_uuid).toBe('conta-despesas');
            expect(stored[`usuario_${testUser}`].conferencia_despesas_periodos_anteriores.paginacao_atual).toBe(3);
        });

        it('usa valores padrão quando campos da conferencia estão ausentes', async () => {
            setUserState({ prestacao_de_conta_uuid: '' });
            await mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePc();
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.conta_uuid).toBe('');
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.filtrar_por_conferencia).toEqual([]);
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.ordenar_por_imposto).toBe(false);
        });
    });

    describe('setOrdenamentoTabelaLancamentos', () => {
        it('atualiza o ordenamento quando o usuário tem estado salvo', () => {
            setUserState(DEFAULT_USER_STATE);
            const novoOrdenamento = [{ field: 'data', order: 1 }];
            mantemEstadoAcompanhamentoDePc.setOrdenamentoTabelaLancamentos(testUser, novoOrdenamento);
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC));
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.ordenamento_tabela_lancamentos).toEqual(novoOrdenamento);
        });

        it('não altera o localStorage quando o usuário não tem estado salvo', () => {
            mantemEstadoAcompanhamentoDePc.setOrdenamentoTabelaLancamentos(testUser, [{ field: 'data', order: 1 }]);
            expect(localStorageMock.getItem(ACOMPANHAMENTO_DE_PC)).toBeNull();
        });
    });
});
