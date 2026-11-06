import {
    notificaDevolucaoPCStorageService as service,
    STORAGE_KEY_NOTIFICAR_DEVOLUCAO_REFERENCIA as KEY,
} from '../NotificarDevolucao.storage.service';
import { visoesService } from '../../visoes.service';
import { recursoSelecionadoStorageService } from '../RecursoSelecionado.storage.service';

jest.mock('../../visoes.service', () => ({
    visoesService: {
        getDadosDoUsuarioLogado: jest.fn(),
        setDadosDoUsuarioLogado: jest.fn(),
    },
}));

jest.mock('../RecursoSelecionado.storage.service', () => ({
    recursoSelecionadoStorageService: { getRecursoSelecionado: jest.fn() },
}));

const criarDados = () => ({
    unidade_selecionada: {
        uuid: 'u1',
        notificar_devolucao_por_recurso: {
            recurso_r1: { notificar_devolucao_referencia: '2024.1' },
            recurso_r2: { notificar_devolucao_referencia: '2024.2' },
        },
    },
    unidades: [
        {
            uuid: 'u1',
            notificar_devolucao_por_recurso: {
                recurso_r1: { notificar_devolucao_referencia: '2024.1' },
                recurso_r2: { notificar_devolucao_referencia: '2024.2' },
            },
        },
        { uuid: 'u2', notificar_devolucao_por_recurso: { recurso_r1: { x: 1 } } },
    ],
});

describe('notificaDevolucaoPCStorageService', () => {
    beforeEach(() => {
        localStorage.clear();
        recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue({ uuid: 'r1' });
        visoesService.getDadosDoUsuarioLogado.mockReturnValue(criarDados());
    });

    describe('removerNotificacaoPorRecursoLidaLocalStorage', () => {
        it('não faz nada sem recurso selecionado', () => {
            recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue(null);
            localStorage.setItem(KEY, '2024.1');

            service.removerNotificacaoPorRecursoLidaLocalStorage();

            expect(visoesService.setDadosDoUsuarioLogado).not.toHaveBeenCalled();
            expect(localStorage.getItem(KEY)).toBe('2024.1');
        });

        it('remove a notificação do recurso da unidade selecionada e persiste', () => {
            localStorage.setItem(KEY, '2024.1');

            service.removerNotificacaoPorRecursoLidaLocalStorage();

            const salvo = visoesService.setDadosDoUsuarioLogado.mock.calls[0][0];
            expect(salvo.unidade_selecionada.notificar_devolucao_por_recurso).toEqual({
                recurso_r2: { notificar_devolucao_referencia: '2024.2' },
            });
            expect(salvo.unidades[0].notificar_devolucao_por_recurso).toEqual({
                recurso_r2: { notificar_devolucao_referencia: '2024.2' },
            });
            expect(salvo.unidades[1].notificar_devolucao_por_recurso).toEqual({ recurso_r1: { x: 1 } });
            expect(localStorage.getItem(KEY)).toBeNull();
        });
    });

    describe('atualizaNotificarDevolucaoLocalStorage', () => {
        it('salva a referência do recurso', () => {
            service.atualizaNotificarDevolucaoLocalStorage('r1', {
                recurso_r1: { notificar_devolucao_referencia: '2024.1' },
            });
            expect(localStorage.getItem(KEY)).toBe('2024.1');
        });

        it('salva "null" quando o recurso não possui notificação', () => {
            service.atualizaNotificarDevolucaoLocalStorage('r9', { recurso_r1: {} });
            expect(localStorage.getItem(KEY)).toBe('null');
        });

        it('salva "null" quando não há mapa de notificações', () => {
            service.atualizaNotificarDevolucaoLocalStorage('r1', undefined);
            expect(localStorage.getItem(KEY)).toBe('null');
        });
    });

    describe('retornaNotificarDevolucaoUnidadeRecursoSelecionado', () => {
        it('retorna a notificação do recurso selecionado', () => {
            expect(service.retornaNotificarDevolucaoUnidadeRecursoSelecionado()).toEqual({
                notificar_devolucao_referencia: '2024.1',
            });
        });

        it('retorna undefined quando o recurso não está no mapa', () => {
            recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue({ uuid: 'r9' });
            expect(service.retornaNotificarDevolucaoUnidadeRecursoSelecionado()).toBeUndefined();
        });

        it('retorna {} sem recurso selecionado', () => {
            recursoSelecionadoStorageService.getRecursoSelecionado.mockReturnValue(null);
            expect(service.retornaNotificarDevolucaoUnidadeRecursoSelecionado()).toEqual({});
        });

        it('retorna {} quando a unidade não possui notificar_devolucao_por_recurso', () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue({ unidade_selecionada: { uuid: 'u1' } });
            expect(service.retornaNotificarDevolucaoUnidadeRecursoSelecionado()).toEqual({});
        });
    });
});
