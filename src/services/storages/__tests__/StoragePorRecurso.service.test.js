import { criarStoragePorRecurso } from '../StoragePorRecurso.service';
import { recursoSelecionadoStorageService } from '../RecursoSelecionado.storage.service';

jest.mock('../RecursoSelecionado.storage.service', () => ({
    recursoSelecionadoStorageService: { getRecursoSelecionado: jest.fn() },
}));

const KEY = 'TESTE_RECURSO';
const isLegadoFn = (parsed) => 'campoLegado' in parsed;

describe('criarStoragePorRecurso', () => {
    beforeEach(() => {
        localStorage.clear();
        recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue({ uuid: 'r1' });
    });

    it('funciona sem argumentos', () => {
        expect(() => criarStoragePorRecurso()).not.toThrow();
    });

    describe('sem isLegadoFn', () => {
        let storage;
        beforeEach(() => {
            storage = criarStoragePorRecurso({ storageKey: KEY });
        });

        it('getItem retorna null quando vazio', () => {
            expect(storage.getItem()).toBeNull();
        });

        it('setItem/getItem usam a chave do recurso selecionado', () => {
            storage.setItem({ a: 1 });
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ recurso_r1: { a: 1 } });
            expect(storage.getItem()).toEqual({ a: 1 });
        });

        it('isola dados por recurso', () => {
            storage.setItem({ a: 1 });
            recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue({ uuid: 'r2' });
            expect(storage.getItem()).toBeNull();
            storage.setItem({ b: 2 });
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({
                recurso_r1: { a: 1 },
                recurso_r2: { b: 2 },
            });
        });

        it.each([
            ['recurso nulo', null],
            ['recurso sem uuid', {}],
        ])('usa "sem_recurso" com %s', (_, recurso) => {
            recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue(recurso);
            storage.setItem({ a: 1 });
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ sem_recurso: { a: 1 } });
        });

        it('usa "sem_recurso" quando getRecursoSelecionado lança erro', () => {
            recursoSelecionadoStorageService.getRecursoSelecionado.mockImplementation(() => {
                throw new Error('falha');
            });
            storage.setItem({ a: 1 });
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ sem_recurso: { a: 1 } });
        });

        it('retorna null para JSON inválido', () => {
            localStorage.setItem(KEY, '{invalido');
            expect(storage.getItem()).toBeNull();
        });

        it('não trata formato plano como legado', () => {
            localStorage.setItem(KEY, JSON.stringify({ campoLegado: 1 }));
            expect(storage.getItem()).toBeNull();
        });

        it('removeItem apaga a chave quando não sobra nada', () => {
            storage.setItem({ a: 1 });
            storage.removeItem();
            expect(localStorage.getItem(KEY)).toBeNull();
        });

        it('removeItem mantém os demais recursos', () => {
            localStorage.setItem(KEY, JSON.stringify({ recurso_r1: { a: 1 }, recurso_r2: { b: 2 } }));
            storage.removeItem();
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ recurso_r2: { b: 2 } });
        });
    });

    describe('com isLegadoFn', () => {
        let storage;
        beforeEach(() => {
            storage = criarStoragePorRecurso({ storageKey: KEY, isLegadoFn });
        });

        it('getItem faz fallback para dados no formato legado', () => {
            localStorage.setItem(KEY, JSON.stringify({ campoLegado: 'x' }));
            expect(storage.getItem()).toEqual({ campoLegado: 'x' });
        });

        it('prefere o dado do recurso ao legado', () => {
            localStorage.setItem(KEY, JSON.stringify({ recurso_r1: { a: 1 } }));
            expect(storage.getItem()).toEqual({ a: 1 });
        });

        it('retorna null quando não há recurso nem legado', () => {
            localStorage.setItem(KEY, JSON.stringify({ recurso_r2: { a: 1 } }));
            expect(storage.getItem()).toBeNull();
        });

        it('setItem descarta o legado', () => {
            localStorage.setItem(KEY, JSON.stringify({ campoLegado: 'x' }));
            storage.setItem({ a: 1 });
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ recurso_r1: { a: 1 } });
        });

        it('removeItem descarta o legado e apaga a chave', () => {
            localStorage.setItem(KEY, JSON.stringify({ campoLegado: 'x' }));
            storage.removeItem();
            expect(localStorage.getItem(KEY)).toBeNull();
        });
    });
});
