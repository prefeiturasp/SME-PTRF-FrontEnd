import React from 'react';
import { waitFor, renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
    usePostPaaGeracaoDocumentoPrevia,
    usePostPaaGeracaoDocumentoFinal,
    usePostPaaGeracaoDocumentoPreviaRetificacao,
    usePostPaaGeracaoDocumentoFinalRetificacao,
} from '../usePostPaaGeracaoDocumento';
import {
    postGerarDocumentoPreviaPaa,
    postGerarDocumentoFinalPaa,
    postGerarDocumentoPreviaRetificacaoPaa,
    postGerarDocumentoFinalRetificacaoPaa,
} from '../../../../../../../../services/escolas/Paa.service';
import { toastCustom } from '../../../../../../../Globais/ToastCustom';

jest.mock('../../../../../../../../services/escolas/Paa.service', () => ({
    postGerarDocumentoPreviaPaa: jest.fn(),
    postGerarDocumentoFinalPaa: jest.fn(),
    postGerarDocumentoPreviaRetificacaoPaa: jest.fn(),
    postGerarDocumentoFinalRetificacaoPaa: jest.fn(),
}));

jest.mock('../../../../../../../Globais/ToastCustom', () => ({
    toastCustom: {
        ToastCustomError: jest.fn(),
    },
}));

const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

afterAll(() => {
    mockConsoleError.mockRestore();
});

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    return ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

// usePostPaaGeracaoDocumentoPreviaRetificacao

describe('usePostPaaGeracaoDocumentoPreviaRetificacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna objeto de mutação com mutate e isPending', () => {
        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        expect(typeof result.current.mutate).toBe('function');
        expect(result.current.isPending).toBe(false);
    });

    it('chama postGerarDocumentoPreviaRetificacaoPaa com o uuid correto', async () => {
        postGerarDocumentoPreviaRetificacaoPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(postGerarDocumentoPreviaRetificacaoPaa).toHaveBeenCalledWith(
            'uuid-previa-retif-123'
        );
    });

    it('chama onSuccessGerarDocumentoRetificacao após sucesso', async () => {
        postGerarDocumentoPreviaRetificacaoPaa.mockResolvedValueOnce({ ok: true });
        const onSuccess = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: onSuccess,
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    it('exibe toast com mensagem do servidor quando error.response.data.mensagem existe', async () => {
        const error = { response: { data: { mensagem: 'Erro específico do servidor' } } };
        postGerarDocumentoPreviaRetificacaoPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Erro específico do servidor'
        );
    });

    it('exibe mensagem de fallback quando error.response.data existe mas sem mensagem', async () => {
        const error = { response: { data: {} } };
        postGerarDocumentoPreviaRetificacaoPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Falha ao gerar o documento prévia de retificação.'
        );
    });

    it('exibe toast genérico quando não há error.response.data', async () => {
        const error = new Error('Network Error');
        postGerarDocumentoPreviaRetificacaoPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Ops! Houve um erro ao tentar gerar o documento prévia de retificação.'
        );
    });

    it('registra o erro no console quando a mutação falha', async () => {
        const error = new Error('Falha de rede');
        postGerarDocumentoPreviaRetificacaoPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoPreviaRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Erro ao gerar documento prévia de retificação do PAA:',
            error
        );
    });

    it('funciona sem callback — padrão não causa erro', async () => {
        postGerarDocumentoPreviaRetificacaoPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPreviaRetificacao({}),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-retif-123');
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
});

// usePostPaaGeracaoDocumentoFinalRetificacao

describe('usePostPaaGeracaoDocumentoFinalRetificacao', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna objeto de mutação com mutate, mutateAsync e isPending', () => {
        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        expect(typeof result.current.mutate).toBe('function');
        expect(typeof result.current.mutateAsync).toBe('function');
        expect(result.current.isPending).toBe(false);
    });

    it('chama postGerarDocumentoFinalRetificacaoPaa com uuid e payload corretos', async () => {
        postGerarDocumentoFinalRetificacaoPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(postGerarDocumentoFinalRetificacaoPaa).toHaveBeenCalledWith(
            'uuid-final-retif-456',
            { confirmar: 0 }
        );
    });

    it('chama onSuccessGerarDocumentoRetificacao após sucesso', async () => {
        postGerarDocumentoFinalRetificacaoPaa.mockResolvedValueOnce({ ok: true });
        const onSuccess = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: onSuccess,
                    onErrorGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    it('chama onErrorGerarDocumentoRetificacao quando error.response.data tem mensagem', async () => {
        const errorData = { mensagem: 'Há pendências obrigatórias' };
        const error = { response: { data: errorData } };
        postGerarDocumentoFinalRetificacaoPaa.mockRejectedValueOnce(error);
        const onError = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: onError,
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(onError).toHaveBeenCalledWith(errorData);
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it('chama onErrorGerarDocumentoRetificacao quando error.response.data tem confirmar', async () => {
        const errorData = { confirmar: true, mensagem: 'Confirme para continuar' };
        const error = { response: { data: errorData } };
        postGerarDocumentoFinalRetificacaoPaa.mockRejectedValueOnce(error);
        const onError = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: onError,
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(onError).toHaveBeenCalledWith(errorData);
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it('exibe toast genérico quando erro não tem response.data relevante', async () => {
        const error = new Error('Network Error');
        postGerarDocumentoFinalRetificacaoPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Ops! Houve um erro ao tentar gerar o documento final de retificação.'
        );
    });

    it('registra o erro no console quando a mutação falha', async () => {
        const error = new Error('Falha de rede');
        postGerarDocumentoFinalRetificacaoPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Erro ao gerar documento final de retificaçãodo PAA:',
            error
        );
    });

    it('funciona sem callbacks — padrões não causam erro', async () => {
        postGerarDocumentoFinalRetificacaoPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoFinalRetificacao({}),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-retif-456', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('suporta mutateAsync para uso com await', async () => {
        postGerarDocumentoFinalRetificacaoPaa.mockResolvedValueOnce({ documento: 'gerado' });

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinalRetificacao({
                    onSuccessGerarDocumentoRetificacao: jest.fn(),
                    onErrorGerarDocumentoRetificacao: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        let resolved;
        await act(async () => {
            resolved = await result.current.mutateAsync({
                uuid: 'uuid-final-retif-456',
                payload: { confirmar: 1 },
            });
        });

        expect(resolved).toEqual({ documento: 'gerado' });
        expect(postGerarDocumentoFinalRetificacaoPaa).toHaveBeenCalledWith(
            'uuid-final-retif-456',
            { confirmar: 1 }
        );
    });
});

// usePostPaaGeracaoDocumentoPrevia

describe('usePostPaaGeracaoDocumentoPrevia', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna objeto de mutação com mutate e isPending', () => {
        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: jest.fn() }),
            { wrapper: createWrapper() }
        );

        expect(typeof result.current.mutate).toBe('function');
        expect(result.current.isPending).toBe(false);
    });

    it('chama postGerarDocumentoPreviaPaa com o uuid correto', async () => {
        postGerarDocumentoPreviaPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: jest.fn() }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(postGerarDocumentoPreviaPaa).toHaveBeenCalledWith('uuid-previa-orig-111');
    });

    it('chama onSuccessGerarDocumento após sucesso', async () => {
        postGerarDocumentoPreviaPaa.mockResolvedValueOnce({ ok: true });
        const onSuccess = jest.fn();

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: onSuccess }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    it('exibe toast com mensagem do servidor quando error.response.data.mensagem existe', async () => {
        const error = { response: { data: { mensagem: 'Erro específico do servidor' } } };
        postGerarDocumentoPreviaPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: jest.fn() }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Erro específico do servidor'
        );
    });

    it('exibe mensagem de fallback quando error.response.data existe mas sem mensagem', async () => {
        const error = { response: { data: {} } };
        postGerarDocumentoPreviaPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: jest.fn() }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Falha ao gerar o documento prévia.'
        );
    });

    it('exibe toast genérico quando não há error.response.data', async () => {
        const error = new Error('Network Error');
        postGerarDocumentoPreviaPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: jest.fn() }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Ops! Houve um erro ao tentar gerar o documento prévia.'
        );
    });

    it('registra o erro no console quando a mutação falha', async () => {
        const error = new Error('Falha de rede');
        postGerarDocumentoPreviaPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({ onSuccessGerarDocumento: jest.fn() }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Erro ao gerar documento prévia do PAA:',
            error
        );
    });

    it('funciona sem callback — padrão não causa erro', async () => {
        postGerarDocumentoPreviaPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoPrevia({}),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate('uuid-previa-orig-111');
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });
});

// usePostPaaGeracaoDocumentoFinal

describe('usePostPaaGeracaoDocumentoFinal', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('retorna objeto de mutação com mutate, mutateAsync e isPending', () => {
        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        expect(typeof result.current.mutate).toBe('function');
        expect(typeof result.current.mutateAsync).toBe('function');
        expect(result.current.isPending).toBe(false);
    });

    it('chama postGerarDocumentoFinalPaa com uuid e payload corretos', async () => {
        postGerarDocumentoFinalPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(postGerarDocumentoFinalPaa).toHaveBeenCalledWith(
            'uuid-final-orig-222',
            { confirmar: 0 }
        );
    });

    it('chama onSuccessGerarDocumento após sucesso', async () => {
        postGerarDocumentoFinalPaa.mockResolvedValueOnce({ ok: true });
        const onSuccess = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: onSuccess,
                    onErrorGerarDocumento: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });

    it('chama onErrorGerarDocumento quando error.response.data tem mensagem', async () => {
        const errorData = { mensagem: 'Há pendências obrigatórias' };
        const error = { response: { data: errorData } };
        postGerarDocumentoFinalPaa.mockRejectedValueOnce(error);
        const onError = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: onError,
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(onError).toHaveBeenCalledWith(errorData);
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it('chama onErrorGerarDocumento quando error.response.data tem confirmar', async () => {
        const errorData = { confirmar: true, mensagem: 'Confirme para continuar' };
        const error = { response: { data: errorData } };
        postGerarDocumentoFinalPaa.mockRejectedValueOnce(error);
        const onError = jest.fn();

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: onError,
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(onError).toHaveBeenCalledWith(errorData);
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it('exibe toast genérico quando erro não tem response.data relevante', async () => {
        const error = new Error('Network Error');
        postGerarDocumentoFinalPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            'Erro!',
            'Ops! Houve um erro ao tentar gerar o documento final.'
        );
    });

    it('registra o erro no console quando a mutação falha', async () => {
        const error = new Error('Falha de rede');
        postGerarDocumentoFinalPaa.mockRejectedValueOnce(error);

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isError).toBe(true));

        expect(mockConsoleError).toHaveBeenCalledWith(
            'Erro ao gerar documento final do PAA:',
            error
        );
    });

    it('funciona sem callbacks — padrões não causam erro', async () => {
        postGerarDocumentoFinalPaa.mockResolvedValueOnce({ ok: true });

        const { result } = renderHook(
            () => usePostPaaGeracaoDocumentoFinal({}),
            { wrapper: createWrapper() }
        );

        act(() => {
            result.current.mutate({ uuid: 'uuid-final-orig-222', payload: { confirmar: 0 } });
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
    });

    it('suporta mutateAsync para uso com await', async () => {
        postGerarDocumentoFinalPaa.mockResolvedValueOnce({ documento: 'gerado' });

        const { result } = renderHook(
            () =>
                usePostPaaGeracaoDocumentoFinal({
                    onSuccessGerarDocumento: jest.fn(),
                    onErrorGerarDocumento: jest.fn(),
                }),
            { wrapper: createWrapper() }
        );

        let resolved;
        await act(async () => {
            resolved = await result.current.mutateAsync({
                uuid: 'uuid-final-orig-222',
                payload: { confirmar: 1 },
            });
        });

        expect(resolved).toEqual({ documento: 'gerado' });
        expect(postGerarDocumentoFinalPaa).toHaveBeenCalledWith(
            'uuid-final-orig-222',
            { confirmar: 1 }
        );
    });
});
