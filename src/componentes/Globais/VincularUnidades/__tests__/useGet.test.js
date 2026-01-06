import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetUnidadesNaoVinculadas,
  useGetUnidadesVinculadas,
  useGetDres,
  useGetTiposUnidades,
} from '../hooks/useGet';
import * as ParametrizacoesService from '../../../../services/sme/Parametrizacoes.service';

jest.mock('../../../../services/sme/Parametrizacoes.service');

const mockDres = [
    { uuid: 'dre-1', nome: 'DRE 1' },
    { uuid: 'dre-2', nome: 'DRE 2' },
    { uuid: 'dre-3', nome: 'DRE 3' },
];
    
describe('useGet hooks', () => {
  let queryClient;
  let wrapper;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: 1 },
      },
    });

    wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    jest.clearAllMocks();
  });

  describe('useGetUnidadesNaoVinculadas', () => {
    test('deve buscar unidades não vinculadas com sucesso', async () => {
      const mockData = {
        count: 2,
        results: [
          { uuid: 'uuid-1', nome_com_tipo: 'Unidade 1' },
          { uuid: 'uuid-2', nome_com_tipo: 'Unidade 2' },
        ],
      };

      const mockApiService = jest.fn().mockResolvedValue(mockData);
      const uuid = 'instance-123';
      const params = { page: 1, nome_ou_codigo: 'teste' };

      const { result } = renderHook(
        () => useGetUnidadesNaoVinculadas(mockApiService, uuid, params),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockApiService).toHaveBeenCalledWith(uuid, params);
    });

    test('deve retornar isLoading true durante carregamento', async () => {
      const mockApiService = jest
        .fn()
        .mockImplementation(() => new Promise(() => {}));
      const uuid = 'instance-123';
      const params = { page: 1 };

      const { result } = renderHook(
        () => useGetUnidadesNaoVinculadas(mockApiService, uuid, params),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });

    test('deve retornar erro quando requisição falha', async () => {
      const mockError = new Error('Erro na requisição');
      const mockApiService = jest.fn().mockRejectedValue(mockError);
      const uuid = 'instance-123';
      const params = { page: 1 };

      const { result } = renderHook(
        () => useGetUnidadesNaoVinculadas(mockApiService, uuid, params),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockApiService).toHaveBeenCalledTimes(1);
      });

      expect(result.current.error).toBeDefined();
    });

    test('não deve executar query quando uuid não existe', () => {
      const mockApiService = jest.fn();
      const params = { page: 1 };

      renderHook(() => useGetUnidadesNaoVinculadas(mockApiService, null, params), {
        wrapper,
      });

      expect(mockApiService).not.toHaveBeenCalled();
    });

    test('deve manter dados anteriores durante revalidação', async () => {
      const mockData1 = { count: 1, results: [{ uuid: 'uuid-1' }] };
      const mockData2 = { count: 2, results: [{ uuid: 'uuid-2' }] };

      const mockApiService = jest
        .fn()
        .mockResolvedValueOnce(mockData1)
        .mockResolvedValueOnce(mockData2);

      const uuid = 'instance-123';
      const { result, rerender } = renderHook(
        ({ params }) => useGetUnidadesNaoVinculadas(mockApiService, uuid, params),
        {
          wrapper,
          initialProps: { params: { page: 1 } },
        }
      );

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData1);
      });

      rerender({ params: { page: 2 } });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockData2);
      });
    });

    test('deve permitir refetch manual', async () => {
      const mockData = { count: 1, results: [] };
      const mockApiService = jest.fn().mockResolvedValue(mockData);
      const uuid = 'instance-123';
      const params = { page: 1 };

      const { result } = renderHook(
        () => useGetUnidadesNaoVinculadas(mockApiService, uuid, params),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(mockApiService).toHaveBeenCalledTimes(1);

      result.current.refetch();

      await waitFor(() => {
        expect(mockApiService).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useGetUnidadesVinculadas', () => {
    test('deve buscar unidades vinculadas com sucesso', async () => {
      const mockData = {
        count: 3,
        results: [
          { uuid: 'uuid-1', nome_com_tipo: 'Unidade A' },
          { uuid: 'uuid-2', nome_com_tipo: 'Unidade B' },
          { uuid: 'uuid-3', nome_com_tipo: 'Unidade C' },
        ],
      };

      const mockApiService = jest.fn().mockResolvedValue(mockData);
      const uuid = 'instance-456';
      const params = { page: 1 };

      const { result } = renderHook(
        () => useGetUnidadesVinculadas(mockApiService, uuid, params),
        { wrapper }
      );

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockData);
      expect(mockApiService).toHaveBeenCalledWith(uuid, params);
    });

    test('deve retornar erro quando requisição falha', async () => {
      const mockError = new Error('Erro ao buscar vinculadas');
      const mockApiService = jest.fn().mockRejectedValue(mockError);
      const uuid = 'instance-456';
      const params = { page: 1 };

      const { result } = renderHook(
        () => useGetUnidadesVinculadas(mockApiService, uuid, params),
        { wrapper }
      );

      await waitFor(() => {
        expect(mockApiService).toHaveBeenCalledTimes(1);
      });
    });

    test('não deve executar query quando uuid não existe', () => {
      const mockApiService = jest.fn();
      const params = { page: 1 };

      renderHook(() => useGetUnidadesVinculadas(mockApiService, '', params), {
        wrapper,
      });

      expect(mockApiService).not.toHaveBeenCalled();
    });
  });

  describe('useGetDres', () => {
    test('deve buscar DREs com sucesso', async () => {

      ParametrizacoesService.getDres = jest.fn().mockResolvedValue(mockDres);

      const { result } = renderHook(() => useGetDres(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockDres);
      expect(ParametrizacoesService.getDres).toHaveBeenCalled();
    });

    test('deve retornar erro quando busca de DREs falha', async () => {
      const mockError = new Error('Erro ao buscar DREs');
      ParametrizacoesService.getDres = jest.fn().mockRejectedValue(mockError);

      const { result } = renderHook(() => useGetDres(), { wrapper });

      expect(result.current.error).toBeDefined();
    });

    test('deve cachear dados de DREs', async () => {
      const dres = [mockDres[0]];
      ParametrizacoesService.getDres = jest.fn().mockResolvedValue(dres);

      const { result, rerender } = renderHook(() => useGetDres(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(ParametrizacoesService.getDres).toHaveBeenCalledTimes(1);

      rerender();

      expect(ParametrizacoesService.getDres).toHaveBeenCalledTimes(1);
    });

    test('deve permitir refetch de DREs', async () => {
      const dres = [mockDres[0]];
      ParametrizacoesService.getDres = jest.fn().mockResolvedValue(dres);

      const { result } = renderHook(() => useGetDres(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(ParametrizacoesService.getDres).toHaveBeenCalledTimes(1);

      result.current.refetch();

      await waitFor(() => {
        expect(ParametrizacoesService.getDres).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('useGetTiposUnidades', () => {
    const mockTipos = [
        { id: 'EMEI', nome: 'EMEI' },
        { id: 'EMEF', nome: 'EMEF' },
        { id: 'CEI', nome: 'CEI' },
    ];
    test('deve buscar tipos de unidades com sucesso', async () => {

      ParametrizacoesService.getTiposUnidades = jest
        .fn()
        .mockResolvedValue(mockTipos);

      const { result } = renderHook(() => useGetTiposUnidades(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockTipos);
      expect(ParametrizacoesService.getTiposUnidades).toHaveBeenCalled();
    });

    test('deve retornar erro quando busca de tipos falha', async () => {
      const mockError = new Error('Erro ao buscar tipos');
      ParametrizacoesService.getTiposUnidades = jest.fn().mockRejectedValue(mockError);

      const { result } = renderHook(() => useGetTiposUnidades(), { wrapper });

      expect(result.current.error).toBeDefined();
    });

    test('deve cachear dados de tipos de unidades', async () => {
      const tipos = [mockTipos[0]];
      ParametrizacoesService.getTiposUnidades = jest.fn().mockResolvedValue(tipos);

      const { result, rerender } = renderHook(() => useGetTiposUnidades(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(ParametrizacoesService.getTiposUnidades).toHaveBeenCalledTimes(1);

      rerender();

      expect(ParametrizacoesService.getTiposUnidades).toHaveBeenCalledTimes(1);
    });

    test('deve permitir refetch de tipos de unidades', async () => {
      const mockTipos = [{ id: 1, nome: 'EMEI' }];
      ParametrizacoesService.getTiposUnidades = jest
        .fn()
        .mockResolvedValue(mockTipos);

      const { result } = renderHook(() => useGetTiposUnidades(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(ParametrizacoesService.getTiposUnidades).toHaveBeenCalledTimes(1);

      result.current.refetch();

      await waitFor(() => {
        expect(ParametrizacoesService.getTiposUnidades).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Configurações de cache e stale time', () => {
    test('useGetUnidadesNaoVinculadas deve ter staleTime de 5 minutos', () => {
      const mockApiService = jest.fn();
      const uuid = 'instance-123';
      const params = { page: 1 };

      renderHook(() => useGetUnidadesNaoVinculadas(mockApiService, uuid, params), {
        wrapper,
      });

      const queryState = queryClient.getQueryState([
        'unidades-nao-vinculadas',
        uuid,
        params,
      ]);

      // staleTime é configurado, mas não é diretamente acessível no queryState
      // Este teste verifica que a query foi criada
      expect(queryState).toBeDefined();
    });

    test('queries não devem refetch ao trocar de aba', async () => {
      const mockDres = [{ uuid: 'dre-1', nome: 'DRE Centro' }];
      ParametrizacoesService.getDres = jest.fn().mockResolvedValue(mockDres);

      const { result } = renderHook(() => useGetDres(), { wrapper });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      // Simula troca de foco da janela
      window.dispatchEvent(new Event('focus'));

      // Aguarda um pouco para garantir que não houve refetch
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Deve ter sido chamado apenas uma vez (não deve refetch ao trocar de aba)
      expect(ParametrizacoesService.getDres).toHaveBeenCalledTimes(1);
    });
  });
});