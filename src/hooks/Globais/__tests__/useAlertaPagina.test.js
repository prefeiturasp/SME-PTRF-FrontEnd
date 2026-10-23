import { renderHook, waitFor } from '@testing-library/react';
import { useAlertaPagina, deveConsultarAlerta } from '../useAlertaPagina';
import { authService } from '../../../services/auth.service';
import { visoesService } from '../../../services/visoes.service';
import { getAlertaVigente } from '../../../services/AlertasPaginas.service';
import { alertaPaginaStorageService } from '../../../services/storages/AlertaPagina.storage.service';
import { ModalAlertaPagina } from '../../../componentes/Globais/Modal/ModalAlertaPagina';
import { useRecursoSelecionadoContext } from '../../../context/RecursoSelecionado';

const mockDispatch = jest.fn();
let mockPathname = '/';

jest.mock('react-redux', () => ({ useDispatch: () => mockDispatch }));
jest.mock('react-router-dom', () => ({ useLocation: () => ({ pathname: mockPathname }) }));
jest.mock('../../../services/auth.service', () => ({ authService: { isLoggedIn: jest.fn() } }));
jest.mock('../../../services/visoes.service', () => ({ visoesService: { getItemUsuarioLogado: jest.fn() } }));
jest.mock('../../../services/AlertasPaginas.service');
jest.mock('../../../services/storages/AlertaPagina.storage.service', () => ({
    alertaPaginaStorageService: { alertaJaVisto: jest.fn(), marcarAlertaComoVisto: jest.fn() },
}));
jest.mock('../../../componentes/Globais/Modal/ModalAlertaPagina', () => ({ ModalAlertaPagina: jest.fn() }));
jest.mock('../../../context/RecursoSelecionado', () => ({ useRecursoSelecionadoContext: jest.fn() }));

const alerta = { uuid: 'a1', texto: '<p>x</p>', chave: 'a1:2026-11-15' };
const dadosUsuario = {
    'visao_selecionada.nome': 'UE',
    'unidade_selecionada.uuid': 'uni-1',
    'usuario_logado.login': '123',
};

describe('useAlertaPagina', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        mockPathname = '/';
        authService.isLoggedIn.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockImplementation((caminho) => dadosUsuario[caminho]);
        useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: 'rec-1' },
            mostrarOverlaySelecionarRecursos: false,
        });
        getAlertaVigente.mockResolvedValue({ alerta });
        alertaPaginaStorageService.alertaJaVisto.mockReturnValue(false);
    });

    it('abre o modal quando há alerta ainda não visto', async () => {
        renderHook(() => useAlertaPagina());

        await waitFor(() => expect(ModalAlertaPagina).toHaveBeenCalledTimes(1));
        expect(getAlertaVigente).toHaveBeenCalledWith('rec-1', 'uni-1');
        expect(ModalAlertaPagina).toHaveBeenCalledWith(
            expect.objectContaining({ dispatch: mockDispatch, textoHtml: '<p>x</p>' }),
        );
    });

    it('marca como visto ao fechar o modal', async () => {
        renderHook(() => useAlertaPagina());
        await waitFor(() => expect(ModalAlertaPagina).toHaveBeenCalled());

        ModalAlertaPagina.mock.calls[0][0].onFechar();

        expect(alertaPaginaStorageService.marcarAlertaComoVisto).toHaveBeenCalledWith('123', alerta.chave);
    });

    it('não abre o modal quando o alerta já foi visto', async () => {
        alertaPaginaStorageService.alertaJaVisto.mockReturnValue(true);

        renderHook(() => useAlertaPagina());

        await waitFor(() => expect(getAlertaVigente).toHaveBeenCalled());
        expect(ModalAlertaPagina).not.toHaveBeenCalled();
    });

    it('não abre o modal quando a API não retorna alerta', async () => {
        getAlertaVigente.mockResolvedValue({ alerta: null });

        renderHook(() => useAlertaPagina());

        await waitFor(() => expect(getAlertaVigente).toHaveBeenCalled());
        expect(ModalAlertaPagina).not.toHaveBeenCalled();
    });

    it('não propaga erro da API', async () => {
        const erroConsole = jest.spyOn(console, 'error').mockImplementation(() => {});
        getAlertaVigente.mockRejectedValue(new Error('falha'));

        renderHook(() => useAlertaPagina());

        await waitFor(() => expect(erroConsole).toHaveBeenCalled());
        expect(ModalAlertaPagina).not.toHaveBeenCalled();
        erroConsole.mockRestore();
    });

    it('consulta apenas uma vez para o mesmo usuário, unidade e recurso', async () => {
        const { rerender } = renderHook(() => useAlertaPagina());
        await waitFor(() => expect(getAlertaVigente).toHaveBeenCalledTimes(1));

        rerender();

        expect(getAlertaVigente).toHaveBeenCalledTimes(1);
    });

    it.each([
        ['usuário deslogado', () => authService.isLoggedIn.mockReturnValue(false)],
        ['visão diferente de UE', () => { dadosUsuario['visao_selecionada.nome'] = 'DRE'; }],
        ['overlay de seleção de recurso ativo', () => useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: { uuid: 'rec-1' }, mostrarOverlaySelecionarRecursos: true })],
        ['sem recurso selecionado', () => useRecursoSelecionadoContext.mockReturnValue({
            recursoSelecionado: null, mostrarOverlaySelecionarRecursos: false })],
        ['rota de seleção de recurso', () => { mockPathname = '/seleciona-recurso'; }],
    ])('não consulta a API: %s', async (_descricao, preparar) => {
        preparar();

        renderHook(() => useAlertaPagina());

        await Promise.resolve();
        expect(getAlertaVigente).not.toHaveBeenCalled();
        dadosUsuario['visao_selecionada.nome'] = 'UE';
    });
});

describe('deveConsultarAlerta', () => {
    const base = {
        logado: true, visao: 'UE', recursoUuid: 'r', unidadeUuid: 'u', mostrarOverlay: false, pathname: '/',
    };

    it('retorna true quando todas as condições são atendidas', () => {
        expect(deveConsultarAlerta(base)).toBe(true);
    });

    it.each([
        { logado: false }, { visao: 'SME' }, { recursoUuid: undefined }, { unidadeUuid: undefined },
        { mostrarOverlay: true }, { pathname: '/login' },
    ])('retorna false para %o', (alteracao) => {
        expect(deveConsultarAlerta({ ...base, ...alteracao })).toBe(false);
    });
});