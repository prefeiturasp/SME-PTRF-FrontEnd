import { mantemEstadoAnaliseDre, ANALISE_DRE } from '../mantemEstadoAnaliseDre.service';
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
    analise_pc_uuid: '',
    conferencia_extrato_bancario: { conta_uuid: '' },
    conferencia_de_lancamentos: { conta_uuid: '', expanded: [], paginacao_atual: '' },
    conferencia_de_despesas_periodos_anteriores: { conta_uuid: '', expanded: [], paginacao_atual: '' },
    conferencia_de_documentos: { expanded: [], paginacao_atual: '' },
};

const setUserState = (state) => {
    localStorageMock.setItem(
        ANALISE_DRE,
        JSON.stringify({ [`usuario_${testUser}`]: state })
    );
};

describe('mantemEstadoAnaliseDre', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        visoesService.getUsuarioLogin.mockReturnValue(testUser);
    });

    describe('getTodasAnaliseDre', () => {
        it('retorna null quando localStorage está vazio', () => {
            expect(mantemEstadoAnaliseDre.getTodasAnaliseDre()).toBeNull();
        });

        it('retorna o objeto completo do localStorage', () => {
            const data = { [`usuario_${testUser}`]: DEFAULT_USER_STATE };
            localStorageMock.setItem(ANALISE_DRE, JSON.stringify(data));
            expect(mantemEstadoAnaliseDre.getTodasAnaliseDre()).toEqual(data);
        });
    });

    describe('getAnaliseDreUsuarioLogado', () => {
        it('retorna null quando localStorage está vazio', () => {
            expect(mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado()).toBeNull();
        });

        it('retorna os dados do usuário logado', () => {
            setUserState(DEFAULT_USER_STATE);
            expect(mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado()).toEqual(DEFAULT_USER_STATE);
        });

        it('retorna undefined quando o usuário logado não está no localStorage', () => {
            localStorageMock.setItem(
                ANALISE_DRE,
                JSON.stringify({ usuario_outroUsuario: DEFAULT_USER_STATE })
            );
            expect(mantemEstadoAnaliseDre.getAnaliseDreUsuarioLogado()).toBeUndefined();
        });
    });

    describe('limpaAnaliseDreUsuarioLogado', () => {
        it('redefine o estado do usuário para os valores padrão', () => {
            setUserState({ analise_pc_uuid: 'uuid-existente' });
            mantemEstadoAnaliseDre.limpaAnaliseDreUsuarioLogado(testUser);
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`]).toEqual(DEFAULT_USER_STATE);
        });

        it('preserva dados de outros usuários ao limpar', () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ANALISE_DRE,
                JSON.stringify({
                    [`usuario_${otherUser}`]: { analise_pc_uuid: 'outro-uuid' },
                    [`usuario_${testUser}`]: { analise_pc_uuid: 'meu-uuid' },
                })
            );
            mantemEstadoAnaliseDre.limpaAnaliseDreUsuarioLogado(testUser);
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${otherUser}`]).toEqual({ analise_pc_uuid: 'outro-uuid' });
        });

        it('funciona quando localStorage está vazio', () => {
            expect(() =>
                mantemEstadoAnaliseDre.limpaAnaliseDreUsuarioLogado(testUser)
            ).not.toThrow();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`]).toEqual(DEFAULT_USER_STATE);
        });
    });

    describe('setAnaliseDrePorUsuario', () => {
        it('define o estado do usuário com o objeto fornecido (substitui completamente)', () => {
            setUserState(DEFAULT_USER_STATE);
            const novoObjeto = { analise_pc_uuid: 'uuid-novo', campo_extra: 'valor' };
            mantemEstadoAnaliseDre.setAnaliseDrePorUsuario(testUser, novoObjeto);
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`]).toEqual(novoObjeto);
        });

        it('preserva dados de outros usuários', () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ANALISE_DRE,
                JSON.stringify({
                    [`usuario_${otherUser}`]: { analise_pc_uuid: 'outro' },
                    [`usuario_${testUser}`]: DEFAULT_USER_STATE,
                })
            );
            mantemEstadoAnaliseDre.setAnaliseDrePorUsuario(testUser, { analise_pc_uuid: 'novo' });
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${otherUser}`]).toEqual({ analise_pc_uuid: 'outro' });
        });

        it('funciona quando localStorage está vazio (spreads null sem erros)', () => {
            expect(() =>
                mantemEstadoAnaliseDre.setAnaliseDrePorUsuario(testUser, { analise_pc_uuid: 'uuid' })
            ).not.toThrow();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`]).toEqual({ analise_pc_uuid: 'uuid' });
        });
    });

    describe('setAnaliseDre', () => {
        it('cria estado padrão para o usuário logado quando localStorage está vazio', async () => {
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`]).toEqual({
                analise_pc_uuid: '',
                conferencia_extrato_bancario: { conta_uuid: '' },
                conferencia_de_lancamentos: { conta_uuid: '', expanded: [], paginacao_atual: 0 },
                conferencia_de_despesas_periodos_anteriores: { conta_uuid: '', expanded: [], paginacao_atual: 0 },
                conferencia_de_documentos: { expanded: [], paginacao_atual: 0 },
            });
        });

        it('preserva analise_pc_uuid existente', async () => {
            setUserState({ ...DEFAULT_USER_STATE, analise_pc_uuid: 'uuid-preservado' });
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`].analise_pc_uuid).toBe('uuid-preservado');
        });

        it('preserva conta_uuid da conferencia_extrato_bancario', async () => {
            setUserState({
                ...DEFAULT_USER_STATE,
                conferencia_extrato_bancario: { conta_uuid: 'conta-extrato' },
            });
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`].conferencia_extrato_bancario.conta_uuid).toBe('conta-extrato');
        });

        it('preserva conta_uuid, expanded e paginacao_atual da conferencia_de_lancamentos', async () => {
            setUserState({
                ...DEFAULT_USER_STATE,
                conferencia_de_lancamentos: {
                    conta_uuid: 'conta-lancamentos',
                    expanded: ['item-1', 'item-2'],
                    paginacao_atual: 5,
                },
            });
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            const conf = stored[`usuario_${testUser}`].conferencia_de_lancamentos;
            expect(conf.conta_uuid).toBe('conta-lancamentos');
            expect(conf.expanded).toEqual(['item-1', 'item-2']);
            expect(conf.paginacao_atual).toBe(5);
        });

        it('preserva dados da conferencia_de_despesas_periodos_anteriores', async () => {
            setUserState({
                ...DEFAULT_USER_STATE,
                conferencia_de_despesas_periodos_anteriores: {
                    conta_uuid: 'conta-despesas',
                    expanded: ['desp-1'],
                    paginacao_atual: 2,
                },
            });
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            const conf = stored[`usuario_${testUser}`].conferencia_de_despesas_periodos_anteriores;
            expect(conf.conta_uuid).toBe('conta-despesas');
            expect(conf.expanded).toEqual(['desp-1']);
            expect(conf.paginacao_atual).toBe(2);
        });

        it('preserva expanded e paginacao_atual da conferencia_de_documentos', async () => {
            setUserState({
                ...DEFAULT_USER_STATE,
                conferencia_de_documentos: {
                    expanded: ['doc-1', 'doc-2'],
                    paginacao_atual: 3,
                },
            });
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            const conf = stored[`usuario_${testUser}`].conferencia_de_documentos;
            expect(conf.expanded).toEqual(['doc-1', 'doc-2']);
            expect(conf.paginacao_atual).toBe(3);
        });

        it('usa valores padrão (vazio/zero) quando campos estão ausentes', async () => {
            setUserState({ analise_pc_uuid: '' });
            await mantemEstadoAnaliseDre.setAnaliseDre();
            const stored = JSON.parse(localStorageMock.getItem(ANALISE_DRE));
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.expanded).toEqual([]);
            expect(stored[`usuario_${testUser}`].conferencia_de_lancamentos.paginacao_atual).toBe(0);
            expect(stored[`usuario_${testUser}`].conferencia_extrato_bancario.conta_uuid).toBe('');
        });
    });
});
