import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCarregaTabelaReceita } from '../useCarregaTabelaReceita';
import { getTabelasReceita } from '../../../services/escolas/Receitas.service';

jest.mock('../../../services/escolas/Receitas.service');

describe('useCarregaTabelaReceita', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const queryClient = new QueryClient()
      const wrapper = ({ children }) => (
          <QueryClientProvider client={queryClient}>
                  {children}
          </QueryClientProvider>
      );

  it('deve carregar a tabela de receitas com sucesso', async () => {
    getTabelasReceita.mockResolvedValue();

    renderHook(() => useCarregaTabelaReceita());

    expect(getTabelasReceita).toHaveBeenCalled();
  });

  it('deve logar erro no console se a requisição falhar', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const mockError = new Error('Erro ao buscar tabela');

    getTabelasReceita.mockRejectedValue(mockError);

    renderHook(() => useCarregaTabelaReceita());
    const { result } = renderHook(() => useCarregaTabelaReceita(), { wrapper });
    expect(result.current).toEqual([]);

    consoleSpy.mockRestore();
  });

});
