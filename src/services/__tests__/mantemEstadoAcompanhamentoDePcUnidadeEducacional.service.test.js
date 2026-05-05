import {
    mantemEstadoAcompanhamentoDePcUnidade,
    ACOMPANHAMENTO_PC_UNIDADE,
} from '../mantemEstadoAcompanhamentoDePcUnidadeEducacional.service';
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
const DEFAULT_STATE = {
    filtra_por_termo: '',
    filtra_por_tipo_unidade: '',
    filtra_por_devolucao_tesouro: '',
    filtra_por_status: '',
    paginacao_atual: '',
};

describe('mantemEstadoAcompanhamentoDePcUnidade', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.clear();
        visoesService.getUsuarioLogin.mockReturnValue(testUser);
    });

    describe('limpaAcompanhamentoPcUnidadeUsuarioLogado', () => {
        it('remove a chave ACOMPANHAMENTO_PC_UNIDADE do localStorage', () => {
            localStorageMock.setItem(ACOMPANHAMENTO_PC_UNIDADE, '{"dados":"existentes"}');
            mantemEstadoAcompanhamentoDePcUnidade.limpaAcompanhamentoPcUnidadeUsuarioLogado(testUser);
            expect(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE)).toBeNull();
        });

        it('não lança erro quando localStorage já está vazio', () => {
            expect(() =>
                mantemEstadoAcompanhamentoDePcUnidade.limpaAcompanhamentoPcUnidadeUsuarioLogado(testUser)
            ).not.toThrow();
        });
    });

    describe('setAcompanhamentoPcUnidadePorUsuario', () => {
        it('cria estado padrão para o usuário logado quando localStorage está vazio', async () => {
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, { 'dre-1': {} });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${testUser}`]).toEqual(DEFAULT_STATE);
        });

        it('cria estado padrão quando objeto é undefined, mesmo com localStorage existente', async () => {
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({ [`usuario_${testUser}`]: { 'dre-1': { filtra_por_termo: 'escola' } } })
            );
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, undefined);
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${testUser}`]).toEqual(DEFAULT_STATE);
        });

        it('adiciona novo dre_uuid quando ele ainda não existe na lista do usuário', async () => {
            const dreUuid = 'dre-uuid-001';
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({ [`usuario_${testUser}`]: {} })
            );
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, {
                [dreUuid]: { filtra_por_termo: 'escola' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${testUser}`][dreUuid]).toEqual({ filtra_por_termo: 'escola' });
        });

        it('usa {} como fallback quando localStorage tem dados mas o usuário atual não tem entrada', async () => {
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({ usuario_outroUsuario: { 'dre-x': { filtra_por_termo: 'outro' } } })
            );
            const dreUuid = 'dre-novo';
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, {
                [dreUuid]: { filtra_por_termo: 'escola' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${testUser}`][dreUuid]).toEqual({ filtra_por_termo: 'escola' });
        });

        it('mescla (merge) os dados quando o dre_uuid já existe na lista do usuário', async () => {
            const dreUuid = 'dre-uuid-001';
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({
                    [`usuario_${testUser}`]: {
                        [dreUuid]: { filtra_por_termo: 'escola', filtra_por_status: 'ativo' },
                    },
                })
            );
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, {
                [dreUuid]: { filtra_por_termo: 'nova escola' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${testUser}`][dreUuid]).toEqual({
                filtra_por_termo: 'nova escola',
                filtra_por_status: 'ativo',
            });
        });

        it('preserva dados de outros uuids na mesma lista ao mesclar', async () => {
            const dreUuid1 = 'dre-uuid-001';
            const dreUuid2 = 'dre-uuid-002';
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({
                    [`usuario_${testUser}`]: {
                        [dreUuid1]: { filtra_por_termo: 'escola 1' },
                        [dreUuid2]: { filtra_por_termo: 'escola 2' },
                    },
                })
            );
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, {
                [dreUuid1]: { filtra_por_termo: 'atualizado' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${testUser}`][dreUuid2]).toEqual({ filtra_por_termo: 'escola 2' });
        });

        it('preserva dados de outros usuários ao salvar', async () => {
            const otherUser = 'outroUsuario';
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({
                    [`usuario_${otherUser}`]: { 'dre-x': { filtra_por_termo: 'outro' } },
                    [`usuario_${testUser}`]: {},
                })
            );
            await mantemEstadoAcompanhamentoDePcUnidade.setAcompanhamentoPcUnidadePorUsuario(testUser, {
                'nova-dre': { filtra_por_termo: 'teste' },
            });
            const stored = JSON.parse(localStorageMock.getItem(ACOMPANHAMENTO_PC_UNIDADE));
            expect(stored[`usuario_${otherUser}`]).toEqual({ 'dre-x': { filtra_por_termo: 'outro' } });
        });
    });

    describe('getAcompanhamentoDePcUnidadeUsuarioLogado', () => {
        it('retorna null quando localStorage está vazio', () => {
            expect(mantemEstadoAcompanhamentoDePcUnidade.getAcompanhamentoDePcUnidadeUsuarioLogado('dre-uuid')).toBeNull();
        });

        it('retorna o estado do dre_uuid para o usuário logado', () => {
            const dreUuid = 'dre-uuid-001';
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({
                    [`usuario_${testUser}`]: {
                        [dreUuid]: { filtra_por_termo: 'escola', filtra_por_status: 'ativo' },
                    },
                })
            );
            const result = mantemEstadoAcompanhamentoDePcUnidade.getAcompanhamentoDePcUnidadeUsuarioLogado(dreUuid);
            expect(result).toEqual({ filtra_por_termo: 'escola', filtra_por_status: 'ativo' });
        });

        it('retorna null quando o dre_uuid não existe para o usuário', () => {
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({
                    [`usuario_${testUser}`]: { 'outro-uuid': { filtra_por_termo: 'escola' } },
                })
            );
            expect(mantemEstadoAcompanhamentoDePcUnidade.getAcompanhamentoDePcUnidadeUsuarioLogado('inexistente')).toBeNull();
        });

        it('retorna null quando não há dados para o usuário logado', () => {
            localStorageMock.setItem(
                ACOMPANHAMENTO_PC_UNIDADE,
                JSON.stringify({ usuario_outroUsuario: {} })
            );
            expect(mantemEstadoAcompanhamentoDePcUnidade.getAcompanhamentoDePcUnidadeUsuarioLogado('dre-uuid')).toBeNull();
        });
    });
});
