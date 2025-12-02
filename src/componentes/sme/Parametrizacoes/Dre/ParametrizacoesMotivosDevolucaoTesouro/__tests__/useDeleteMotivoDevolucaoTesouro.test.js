import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { useDeleteMotivoDevolucaoTesouro } from "../hooks/useDeleteMotivoDevolucaoTesouro";
import { deleteMotivoDevolucaoTesouro } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../../../services/sme/Parametrizacoes.service");
jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const TestComponent = ({ uuidMotivoDevolucaoTesouro }) => {
  const { mutationDelete } = useDeleteMotivoDevolucaoTesouro();

  return (
      <div>
          <button onClick={() => mutationDelete.mutate(uuidMotivoDevolucaoTesouro)}>
              Excluir Motivo
          </button>
          {mutationDelete.isPending && <p>Excluindo...</p>}
          {mutationDelete.isError && <p>Erro ao excluir</p>}
          {mutationDelete.isSuccess && <p>Exclusão concluída</p>}
      </div>
  );
};

describe("Hook useDeleteMotivoDevolucaoTesouro", () => {
    let mockContextValue;

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();

        mockContextValue = {
            setShowModalForm: jest.fn(),
            setBloquearBtnSalvarForm: jest.fn(),
        };
    });

    test("Realiza a exclusão com sucesso", async () => {
        deleteMotivoDevolucaoTesouro.mockResolvedValueOnce({});
  
        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoDevolucaoTesouro="1234" />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );
  
        userEvent.click(screen.getByText("Excluir Motivo"));

        await waitFor(() => {
            expect(screen.getByText("Exclusão concluída")).toBeInTheDocument();
            expect(deleteMotivoDevolucaoTesouro).toHaveBeenCalledWith("1234");
            expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Exclusão do motivo de devolução ao tesouro realizada com sucesso",
                "O motivo de devolução ao tesouro foi excluído com sucesso."
            );
        });
    });

    test("Lida com erro ao excluir motivo", async () => {
        deleteMotivoDevolucaoTesouro.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao excluir" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoDevolucaoTesouro="1234" />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Excluir Motivo"));

        await waitFor(() => {
            expect(deleteMotivoDevolucaoTesouro).toHaveBeenCalledWith("1234");
            /* expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao apagar o motivo de devolução ao tesouro",
                "Erro ao excluir"
            ); */
            expect(screen.getByText("Erro ao excluir")).toBeInTheDocument();
        });
    });
    test("Lida com erro ao excluir motivo sem prop mensagem", async () => {
        deleteMotivoDevolucaoTesouro.mockRejectedValueOnce({
            response: { data: { detail: "Erro ao excluir" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoDevolucaoTesouro="1234" />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Excluir Motivo"));

        await waitFor(() => {
            expect(deleteMotivoDevolucaoTesouro).toHaveBeenCalledWith("1234");
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao apagar o motivo devolução ao tesouro",
                "Não foi possível apagar o motivo de devolução ao tesouro"
            );
            expect(screen.getByText("Erro ao excluir")).toBeInTheDocument();
        });
    });
});
