import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCarregaTabelaDespesa } from '../useCarregaTabelaDespesa';
import { visoesService } from '../../../services/visoes.service';
import {getDespesasTabelas} from "../../../services/escolas/Despesas.service";

jest.mock('../../../services/visoes.service');

jest.mock("../../../services/escolas/Despesas.service", () => ({
  getDespesasTabelas: jest.fn(),
}));

describe('useCarregaTabelaDespesa', () => {
    const queryClient = new QueryClient()
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve chamar getDespesasTabelas com o uuid da associacao se prestacaoDeContas estiver completa', async () => {
      getDespesasTabelas.mockResolvedValue();
  
      const prestacaoDeContas = {
        associacao: {
          uuid: 'abc-123'
        }
      };
  
      renderHook(() => useCarregaTabelaDespesa(prestacaoDeContas));
  
      expect(getDespesasTabelas).toHaveBeenCalledWith('abc-123');
    });
  
    it('deve chamar getDespesasTabelas sem parâmetro se prestacaoDeContas estiver null ou incompleta', async () => {
      getDespesasTabelas.mockResolvedValue();
  
      renderHook(() => useCarregaTabelaDespesa(null));
  
      expect(getDespesasTabelas).toHaveBeenCalledWith();
    });
  
    it('deve retornar lista vazia inicialmente', () => {
      const { result } = renderHook(() =>
        useCarregaTabelaDespesa(null)
      );
      expect(result.current).toEqual([]);
    });

});