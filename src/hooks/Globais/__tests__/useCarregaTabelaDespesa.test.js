import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCarregaTabelaDespesa } from '../useCarregaTabelaDespesa';
import { visoesService } from '../../../services/visoes.service';
import {getDespesasTabelas} from "../../../services/escolas/Despesas.service";

jest.mock('../../../services/visoes.service');

jest.mock("../../../services/escolas/Despesas.service", () => ({
  getDespesasTabelas: jest.fn(),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
const prestacaoDeContas = {
    associacao: {
      uuid: 'abc-123'
    }
  };
  
describe('useCarregaTabelaDespesa', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve chamar getDespesasTabelas com o uuid da associacao se prestacaoDeContas estiver completa', async () => {
      getDespesasTabelas.mockResolvedValue({dados: []});
    
      const { result } = renderHook(() => useCarregaTabelaDespesa(prestacaoDeContas), { wrapper: createWrapper() });
  
      await waitFor(() => {
        expect(getDespesasTabelas).toHaveBeenCalledTimes(1);
        expect(getDespesasTabelas).toHaveBeenCalledWith('abc-123');
        expect(result.current).toEqual({dados: []});
      });
  
    });
  
    it('deve chamar getDespesasTabelas sem parâmetro se prestacaoDeContas estiver null ou incompleta', async () => {
      getDespesasTabelas.mockResolvedValue([]);
  
      const { result }  = renderHook(() => useCarregaTabelaDespesa({}), { wrapper: createWrapper() });
  
      await waitFor(() => {
        expect(getDespesasTabelas).toHaveBeenCalled();
        expect(result.current).toEqual([]);
      });
    });
  
    it('deve retornar lista vazia inicialmente', async () => {
      getDespesasTabelas.mockResolvedValue([]);
      const { result } = renderHook(() => useCarregaTabelaDespesa({}), { wrapper: createWrapper() });
      await waitFor(() => {
        expect(result.current).toEqual([]);
      });
    });

});