import { conciliacaoStorageService } from '../Conciliacao.storage.service';
import { recursoSelecionadoStorageService, STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE } from '../RecursoSelecionado.storage.service';

jest.mock('../../auth.service', () => ({
    RECURSO_SELECIONADO: 'RECURSO_SELECIONADO',
}));

const STORAGE_KEY = 'PERIODO_CONTA_CONCILIACAO';

const setRecurso = (uuid) =>
    recursoSelecionadoStorageService.setRecursoSelecionado({ uuid, nome: `Recurso ${uuid}` });

describe('conciliacaoStorageService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe('sem recurso selecionado no storage', () => {
        it('getPeriodoConta retorna null quando storage está vazio', () => {
            expect(conciliacaoStorageService.getPeriodoConta()).toBeNull();
        });

        it('setPeriodoConta salva os dados sob a chave "sem_recurso"', () => {
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p1', conta: 'c1' });

            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(raw.sem_recurso).toEqual({ periodo: 'p1', conta: 'c1' });
        });

        it('getPeriodoConta retorna os dados salvos em "sem_recurso"', () => {
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p1', conta: 'c1' });
            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p1', conta: 'c1' });
        });

        it('getPeriodoConta retorna null quando não há dado para "sem_recurso"', () => {
            setRecurso('recurso-x');
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-x', conta: 'c-x' });

            // Remove o recurso para simular sessão sem recurso
            localStorage.removeItem(STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE);

            // Não há dado em "sem_recurso", portanto retorna null
            expect(conciliacaoStorageService.getPeriodoConta()).toBeNull();
        });
    });

    describe('com recurso selecionado no storage', () => {
        beforeEach(() => {
            setRecurso('recurso-1');
        });

        it('setPeriodoConta salva sob a chave "recurso_{uuid}"', () => {
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p2', conta: 'c2' });

            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(raw['recurso_recurso-1']).toEqual({ periodo: 'p2', conta: 'c2' });
        });

        it('getPeriodoConta retorna os dados do recurso ativo', () => {
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p2', conta: 'c2' });
            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p2', conta: 'c2' });
        });

        it('dados de recursos diferentes são isolados entre si', () => {
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-r1', conta: 'c-r1' });

            setRecurso('recurso-2');
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-r2', conta: 'c-r2' });

            // Recurso 2 vê seus próprios dados
            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p-r2', conta: 'c-r2' });

            // Recurso 1 vê seus próprios dados
            setRecurso('recurso-1');
            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p-r1', conta: 'c-r1' });
        });

        it('getPeriodoConta retorna null quando o recurso ativo não tem dados salvos', () => {
            // Salva dado para recurso-1
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p1', conta: 'c1' });

            // Troca para recurso sem dados
            setRecurso('recurso-sem-dados');
            expect(conciliacaoStorageService.getPeriodoConta()).toBeNull();
        });

        it('setPeriodoConta atualiza somente o recurso ativo sem afetar outros', () => {
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-r1', conta: 'c-r1' });

            setRecurso('recurso-2');
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-r2', conta: 'c-r2' });

            // Atualiza recurso 2
            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-r2-novo', conta: 'c-r2-novo' });

            // Recurso 1 permanece inalterado
            setRecurso('recurso-1');
            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p-r1', conta: 'c-r1' });
        });
    });

    describe('compatibilidade com formato legado (flat {periodo, conta})', () => {
        it('getPeriodoConta lê o formato legado quando não há dado no formato novo', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ periodo: 'p-legado', conta: 'c-legado' }));

            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p-legado', conta: 'c-legado' });
        });

        it('ao escrever no novo formato, remove a chave legado do storage', () => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ periodo: 'p-legado', conta: 'c-legado' }));

            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-novo', conta: 'c-novo' });

            const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
            expect(raw.legado).toBeUndefined();
            expect(raw.periodo).toBeUndefined();
            expect(raw.conta).toBeUndefined();
        });

        it('com recurso ativo, dados do recurso têm prioridade sobre o formato legado', () => {
            setRecurso('recurso-1');
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({ periodo: 'p-legado', conta: 'c-legado' })
            );

            conciliacaoStorageService.setPeriodoConta({ periodo: 'p-recurso', conta: 'c-recurso' });

            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p-recurso', conta: 'c-recurso' });
        });

        it('getPeriodoConta usa legado como fallback quando recurso ativo não tem dados', () => {
            setRecurso('recurso-1');
            // Storage em formato legado, sem chave do recurso
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ periodo: 'p-legado', conta: 'c-legado' }));

            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p-legado', conta: 'c-legado' });
        });
    });

    describe('resiliência a dados inválidos', () => {
        it('getPeriodoConta retorna null quando o storage tem JSON inválido', () => {
            localStorage.setItem(STORAGE_KEY, 'isso-nao-e-json');
            expect(conciliacaoStorageService.getPeriodoConta()).toBeNull();
        });

        it('getPeriodoConta não lança exceção com JSON inválido no storage', () => {
            localStorage.setItem(STORAGE_KEY, 'isso-nao-e-json');
            expect(() => conciliacaoStorageService.getPeriodoConta()).not.toThrow();
        });

        it('getPeriodoConta não lança exceção quando STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE tem JSON inválido', () => {
            localStorage.setItem(STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE, 'nao-e-json');

            expect(() => conciliacaoStorageService.getPeriodoConta()).not.toThrow();
        });

        it('setPeriodoConta funciona normalmente mesmo quando o storage tem JSON inválido', () => {
            localStorage.setItem(STORAGE_KEY, 'nao-e-json');
            expect(() =>
                conciliacaoStorageService.setPeriodoConta({ periodo: 'p1', conta: 'c1' })
            ).not.toThrow();
            expect(conciliacaoStorageService.getPeriodoConta()).toEqual({ periodo: 'p1', conta: 'c1' });
        });
    });
});
