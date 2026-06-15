import { renderHook, act } from '@testing-library/react';
import { usePollingStatusDocumento } from '../usePollingStatusDocumento';

// mock de useGetStatusGeracaoDocumentoPaa
const mockRefetch = jest.fn();
let mockData = undefined;
let mockIsFetching = false;

jest.mock('../useGetStatusGeracaoDocumentoPaa', () => ({
    useGetStatusGeracaoDocumentoPaa: () => ({
        data: mockData,
        isFetching: mockIsFetching,
        refetch: mockRefetch,
    }),
}));

describe('usePollingStatusDocumento', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockData = undefined;
        mockIsFetching = false;
        mockRefetch.mockResolvedValue({});
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    // shape retornada
    it('retorna statusDocumento, isLoadingStatusDocumento e iniciarPolling', () => {
        const { result } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        expect(result.current.statusDocumento).toBeUndefined();
        expect(result.current.isLoadingStatusDocumento).toBe(false);
        expect(typeof result.current.iniciarPolling).toBe('function');
    });

    it('expõe statusDocumento retornado pelo useGetStatusGeracaoDocumentoPaa', () => {
        mockData = { status: 'CONCLUIDO', versao: 'PREVIA' };

        const { result } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        expect(result.current.statusDocumento).toEqual({ status: 'CONCLUIDO', versao: 'PREVIA' });
    });

    it('expõe isLoadingStatusDocumento mapeado de isFetching', () => {
        mockIsFetching = true;

        const { result } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        expect(result.current.isLoadingStatusDocumento).toBe(true);
    });

    // efeito de status
    it('chama onConcluidoFinal quando status=CONCLUIDO e versao=FINAL', () => {
        mockData = { status: 'CONCLUIDO', versao: 'FINAL' };
        const onConcluidoFinal = jest.fn();

        renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid', onConcluidoFinal })
        );

        expect(onConcluidoFinal).toHaveBeenCalledTimes(1);
    });

    it('não chama onConcluidoFinal quando versao não é FINAL', () => {
        mockData = { status: 'CONCLUIDO', versao: 'PREVIA' };
        const onConcluidoFinal = jest.fn();

        renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid', onConcluidoFinal })
        );

        expect(onConcluidoFinal).not.toHaveBeenCalled();
    });

    it('não chama onConcluidoFinal quando status é EM_PROCESSAMENTO (mesmo com versao FINAL)', () => {
        mockData = { status: 'EM_PROCESSAMENTO', versao: 'FINAL' };
        const onConcluidoFinal = jest.fn();

        renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid', onConcluidoFinal })
        );

        expect(onConcluidoFinal).not.toHaveBeenCalled();
    });

    it('não chama onConcluidoFinal quando statusDocumento é undefined', () => {
        mockData = undefined;
        const onConcluidoFinal = jest.fn();

        renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid', onConcluidoFinal })
        );

        expect(onConcluidoFinal).not.toHaveBeenCalled();
    });

    it('funciona sem onConcluidoFinal — parâmetro é opcional', () => {
        mockData = { status: 'CONCLUIDO', versao: 'FINAL' };

        expect(() =>
            renderHook(() => usePollingStatusDocumento({ paaUuid: 'test-uuid' }))
        ).not.toThrow();
    });

    // iniciarPolling
    it('iniciarPolling chama refetchStatusDoc imediatamente', async () => {
        const { result } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        await act(async () => {
            await result.current.iniciarPolling();
        });

        expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('iniciarPolling agenda setInterval que chama refetch repetidamente a cada 5 s', async () => {
        jest.useFakeTimers();

        const { result } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        await act(async () => {
            await result.current.iniciarPolling();
        });

        // 1 chamada inicial (do refetch direto)
        expect(mockRefetch).toHaveBeenCalledTimes(1);

        // Dispara o setTimeout (2000 ms) que configura o setInterval
        act(() => {
            jest.advanceTimersByTime(2000);
        });

        // 1ª iteração do setInterval (5000 ms)
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        expect(mockRefetch).toHaveBeenCalledTimes(2);

        // 2ª iteração do setInterval
        act(() => {
            jest.advanceTimersByTime(5000);
        });
        expect(mockRefetch).toHaveBeenCalledTimes(3);
    });

    it('novo iniciarPolling cancela o polling anterior antes de iniciar o novo', async () => {
        jest.useFakeTimers();

        const { result } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        // 1º polling
        await act(async () => {
            await result.current.iniciarPolling();
        });

        // 2º polling — deve cancelar o 1º
        await act(async () => {
            await result.current.iniciarPolling();
        });

        // 2 refetches (um de cada chamada a iniciarPolling)
        expect(mockRefetch).toHaveBeenCalledTimes(2);

        // Avança 2000 + 5000 ms: setInterval deve disparar apenas 1 vez (apenas do 2º polling)
        act(() => {
            jest.advanceTimersByTime(7000);
        });

        expect(mockRefetch).toHaveBeenCalledTimes(3);
    });

    // cleanup na desmontagem
    it('cancela os timers ao desmontar o hook', async () => {
        jest.useFakeTimers();

        const { result, unmount } = renderHook(() =>
            usePollingStatusDocumento({ paaUuid: 'test-uuid' })
        );

        await act(async () => {
            await result.current.iniciarPolling();
        });

        const callsAntesDesmontagem = mockRefetch.mock.calls.length;

        unmount();

        // Avança o tempo — refetch não deve ser chamado mais vezes após desmontagem
        act(() => {
            jest.advanceTimersByTime(15000);
        });

        expect(mockRefetch).toHaveBeenCalledTimes(callsAntesDesmontagem);
    });
});
