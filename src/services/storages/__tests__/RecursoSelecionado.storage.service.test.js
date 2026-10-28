import {
    recursoSelecionadoStorageService as service,
    STORAGE_KEY_RECURSO_SELECIONADO_POR_UNIDADE as KEY,
} from '../RecursoSelecionado.storage.service';
import { visoesService } from '../../visoes.service';

jest.mock('../../visoes.service', () => ({
    visoesService: { getDadosDoUsuarioLogado: jest.fn() },
}));

describe('recursoSelecionadoStorageService', () => {
    beforeEach(() => {
        localStorage.clear();
        visoesService.getDadosDoUsuarioLogado.mockReturnValue({
            unidade_selecionada: { uuid: 'u1' },
            usuario_logado: { login: 'user1' },
        });
    });

    it('expõe a chave de storage esperada', () => {
        expect(KEY).toBe('RECURSO_SELECIONADO_POR_UNIDADE');
    });

    it('getRecursoSelecionado retorna null quando vazio', () => {
        expect(service.getRecursoSelecionado()).toBeNull();
    });

    it('set/get do recurso selecionado', () => {
        service.setRecursoSelecionado({ uuid: 'r1' });
        expect(service.getRecursoSelecionado()).toMatchObject({ uuid: 'r1' });
        expect(service.getRecursoSelecionado().ultimoAcesso).toEqual(expect.any(Number));
    });

    it('getRecursoSelecionadoWithParameters busca por unidade e login', () => {
        service.setRecursoSelecionado({ uuid: 'r1' });
        expect(service.getRecursoSelecionadoWithParameters('u1', 'user1')).toMatchObject({ uuid: 'r1' });
        expect(service.getRecursoSelecionadoWithParameters('u1', 'outro')).toBeNull();
    });

    it('removeRecursoSelecionado remove o item', () => {
        service.setRecursoSelecionado({ uuid: 'r1' });
        service.removeRecursoSelecionado();
        expect(service.getRecursoSelecionado()).toBeNull();
        expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('deleteRecursoSelecionadoStorage apaga todo o storage', () => {
        service.setRecursoSelecionado({ uuid: 'r1' });
        service.deleteRecursoSelecionadoStorage();
        expect(localStorage.getItem(KEY)).toBeNull();
    });

    it('clearAutomaticallyDataExpiredRecursoSelecionado remove itens expirados', () => {
        const velho = Date.now() - 31 * 24 * 60 * 60 * 1000;
        localStorage.setItem(KEY, JSON.stringify({ unidade_x_y: { uuid: 'r0', ultimoAcesso: velho } }));
        service.clearAutomaticallyDataExpiredRecursoSelecionado();
        expect(JSON.parse(localStorage.getItem(KEY))).toEqual({});
    });
});
