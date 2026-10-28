import { criarStoragePorUnidade } from '../StoragePorUnidade.service';
import { visoesService } from '../../visoes.service';

jest.mock('../../visoes.service', () => ({
    visoesService: { getDadosDoUsuarioLogado: jest.fn() },
}));

const KEY = 'TESTE_UNIDADE';
const DAY = 24 * 60 * 60 * 1000;

const logar = (unidadeUuid = 'u1', login = 'user1') =>
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
        unidade_selecionada: { uuid: unidadeUuid },
        usuario_logado: { login },
    });

describe('criarStoragePorUnidade', () => {
    let storage;

    beforeEach(() => {
        localStorage.clear();
        storage = criarStoragePorUnidade({ storageKey: KEY });
        logar();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('funciona sem argumentos', () => {
        expect(() => criarStoragePorUnidade()).not.toThrow();
    });

    describe('getItem', () => {
        it('retorna null quando não há dados', () => {
            expect(storage.getItem()).toBeNull();
        });

        it('retorna o item da unidade/usuário atual', () => {
            localStorage.setItem(KEY, JSON.stringify({ unidade_u1_user1: { a: 1 } }));
            expect(storage.getItem()).toEqual({ a: 1 });
        });

        it('retorna null para JSON inválido', () => {
            localStorage.setItem(KEY, '{invalido');
            expect(storage.getItem()).toBeNull();
        });

        it('usa a chave "sem_unidade" quando não há login', () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue({
                unidade_selecionada: { uuid: 'u1' },
                usuario_logado: {},
            });
            localStorage.setItem(KEY, JSON.stringify({ sem_unidade: { x: 1 } }));
            expect(storage.getItem()).toEqual({ x: 1 });
        });

        it('usa a chave "sem_unidade" quando não há uuid da unidade', () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue({
                unidade_selecionada: {},
                usuario_logado: { login: 'user1' },
            });
            localStorage.setItem(KEY, JSON.stringify({ sem_unidade: { x: 2 } }));
            expect(storage.getItem()).toEqual({ x: 2 });
        });

        it('usa a chave "sem_unidade" quando o serviço lança erro', () => {
            visoesService.getDadosDoUsuarioLogado.mockImplementation(() => {
                throw new Error('falha');
            });
            localStorage.setItem(KEY, JSON.stringify({ sem_unidade: { x: 3 } }));
            expect(storage.getItem()).toEqual({ x: 3 });
        });

        it('usa a chave "sem_unidade" quando não há unidade_selecionada', () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue({});
            localStorage.setItem(KEY, JSON.stringify({ sem_unidade: { x: 4 } }));
            expect(storage.getItem()).toEqual({ x: 4 });
        });
    });

    describe('getItemWithParameters', () => {
        it('retorna o item da unidade/usuário informados', () => {
            localStorage.setItem(KEY, JSON.stringify({ unidade_u9_outro: { b: 2 } }));
            expect(storage.getItemWithParameters('u9', 'outro')).toEqual({ b: 2 });
        });

        it('retorna null quando não existe', () => {
            expect(storage.getItemWithParameters('u9', 'outro')).toBeNull();
        });
    });

    describe('setItem', () => {
        it('salva o valor com ultimoAcesso', () => {
            jest.spyOn(Date, 'now').mockReturnValue(1000);
            storage.setItem({ a: 1 });
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({
                unidade_u1_user1: { a: 1, ultimoAcesso: 1000 },
            });
        });

        it('preserva outras unidades e descarta a chave "legado"', () => {
            localStorage.setItem(KEY, JSON.stringify({ legado: { z: 1 }, unidade_u2_user2: { k: 1 } }));
            storage.setItem({ a: 1 });
            const salvo = JSON.parse(localStorage.getItem(KEY));
            expect(salvo.legado).toBeUndefined();
            expect(salvo.unidade_u2_user2).toEqual({ k: 1 });
            expect(salvo.unidade_u1_user1.a).toBe(1);
        });
    });

    describe('removeItem', () => {
        it('remove a chave do localStorage quando não sobra nada', () => {
            storage.setItem({ a: 1 });
            storage.removeItem();
            expect(localStorage.getItem(KEY)).toBeNull();
        });

        it('mantém os itens das outras unidades', () => {
            localStorage.setItem(KEY, JSON.stringify({
                unidade_u1_user1: { a: 1 },
                unidade_u2_user2: { b: 2 },
                legado: { c: 3 },
            }));
            storage.removeItem();
            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({ unidade_u2_user2: { b: 2 } });
        });
    });

    describe('deleteStorage', () => {
        it('remove toda a chave do localStorage', () => {
            storage.setItem({ a: 1 });
            storage.deleteStorage();
            expect(localStorage.getItem(KEY)).toBeNull();
        });
    });

    describe('clearAutomaticallyDataExpired', () => {
        it('remove itens com último acesso há mais de 30 dias', () => {
            const now = 100 * DAY;
            jest.spyOn(Date, 'now').mockReturnValue(now);
            localStorage.setItem(KEY, JSON.stringify({
                velho: { ultimoAcesso: now - 31 * DAY },
                novo: { ultimoAcesso: now - 1 * DAY },
                semAcesso: { x: 1 },
            }));

            storage.clearAutomaticallyDataExpired();

            expect(JSON.parse(localStorage.getItem(KEY))).toEqual({
                novo: { ultimoAcesso: now - 1 * DAY },
                semAcesso: { x: 1 },
            });
        });

        it('não escreve no localStorage quando nada expirou', () => {
            const now = 100 * DAY;
            jest.spyOn(Date, 'now').mockReturnValue(now);
            const original = JSON.stringify({ novo: { ultimoAcesso: now - DAY } });
            localStorage.setItem(KEY, original);
            const setSpy = jest.spyOn(Storage.prototype, 'setItem');

            storage.clearAutomaticallyDataExpired();

            expect(setSpy).not.toHaveBeenCalled();
            expect(localStorage.getItem(KEY)).toBe(original);
        });

        it('não faz nada quando o storage está vazio', () => {
            expect(() => storage.clearAutomaticallyDataExpired()).not.toThrow();
            expect(localStorage.getItem(KEY)).toBeNull();
        });
    });
});
