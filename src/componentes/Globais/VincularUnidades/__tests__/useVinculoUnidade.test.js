import { renderHook, act, waitFor } from '@testing-library/react';
import {
  useVincularUnidade,
  useVincularUnidadeEmLote,
  useDesvincularUnidade,
  useDesvincularUnidadeEmLote,
} from '../hooks/useVinculoUnidade';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { toastCustom } from '../../../Globais/ToastCustom';
import { CustomModalConfirm } from '../../../Globais/Modal/CustomModalConfirm';
import { useDispatch } from 'react-redux';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

jest.mock("../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../Globais/Modal/CustomModalConfirm", () => ({
  CustomModalConfirm: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false, // 🔥 importante
      },
    },
  });

  jest.spyOn(queryClient, 'invalidateQueries');

  return {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    ),
    queryClient,
  };
};


describe('Hooks de vínculo/desvínculo de unidade', () => {
  const dispatchMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(dispatchMock);
  });

  test('useVincularUnidade - sucesso', async () => {
    const apiService = jest.fn().mockResolvedValue({ mensagem: 'ok' });
    const onSuccess = jest.fn();

    const { wrapper, queryClient } = createWrapper();

    const { result } = renderHook(
      () => useVincularUnidade(apiService, onSuccess),
      { wrapper }
    );

    act(() => {
      result.current.mutate({ uuid: '123', unidade_uuid: 'u1' });
    });

    await waitFor(() => {
      expect(apiService).toHaveBeenCalledWith('123', 'u1');
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['unidades-vinculadas', '123'] })
    );

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  test('useVincularUnidade - erro', async () => {
    const apiService = jest.fn().mockRejectedValue({
      response: { data: { mensagem: 'Erro' } },
    });

    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useVincularUnidade(apiService),
      { wrapper }
    );

    act(() => {
      result.current.mutate({ uuid: '123', unidade_uuid: 'u1' });
    });

    await waitFor(() => {
      expect(CustomModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erro ao vincular unidade',
          dataQa: 'modal-vincular-unidade',
          dispatch: dispatchMock,
        })
      );
    });
  });

  test('useVincularUnidadeEmLote - sucesso', async () => {
    const apiService = jest.fn().mockResolvedValue({});
    const onSuccess = jest.fn();

    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useVincularUnidadeEmLote(apiService, onSuccess),
      { wrapper }
    );

    act(() => {
      result.current.mutate({ uuid: '123', unidade_uuids: ['u1', 'u2'] });
    });

    await waitFor(() => {
      expect(apiService).toHaveBeenCalledWith('123', {
        unidade_uuids: ['u1', 'u2'],
      });
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  test('useDesvincularUnidade - erro 404 invalida cache', async () => {
    const apiService = jest.fn().mockRejectedValue({
      response: { status: 404 },
    });

    const { wrapper, queryClient } = createWrapper();

    const { result } = renderHook(
      () => useDesvincularUnidade(apiService),
      { wrapper }
    );

    act(() => {
      result.current.mutate({ uuid: '123', unidade_uuid: 'u1' });
    });

    await waitFor(() => {
      expect(CustomModalConfirm).toHaveBeenCalled();
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: ['unidades-vinculadas', '123'] })
    );
  });

  test('useDesvincularUnidadeEmLote - erro genérico', async () => {
    const apiService = jest.fn().mockRejectedValue({
      response: { data: 'Erro inesperado' },
    });

    const { wrapper } = createWrapper();

    const { result } = renderHook(
      () => useDesvincularUnidadeEmLote(apiService),
      { wrapper }
    );

    act(() => {
      result.current.mutate({ uuid: '123', unidade_uuids: ['u1'] });
    });

    await waitFor(() => {
      expect(CustomModalConfirm).toHaveBeenCalledWith(
        expect.objectContaining({
          dataQa: 'modal-erro-desvincular-unidade-em-lote',
        })
      );
    });
  });
});
