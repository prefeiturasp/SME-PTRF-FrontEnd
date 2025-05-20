import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCarregaRepassesPendentesPorPeriodoAteAgora } from '../useCarregaRepassesPendentesPorPeriodoAteAgora';
import { getRepassesPendentes } from "../../../services/escolas/AtasAssociacao.service";


jest.mock("../../../services/escolas/AtasAssociacao.service", () => ({
  getRepassesPendentes: jest.fn(),
}));

const renderCustomHook = (assoc, per) => {
    return renderHook(() => useCarregaRepassesPendentesPorPeriodoAteAgora(assoc, per), {
        wrapper: ({ children }) => (
            <QueryClientProvider client={new QueryClient()}>
                {children}
            </QueryClientProvider>
        ),
    });
};

describe('useCarregaRepassesPendentesPorPeriodoAteAgora', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve chamar com parâmetros', async () => {
      getRepassesPendentes.mockResolvedValue();
      renderCustomHook('assoc-uuid', 'periodo-uuid');
  
      expect(getRepassesPendentes).toHaveBeenCalledWith('assoc-uuid', 'periodo-uuid');
    });

});