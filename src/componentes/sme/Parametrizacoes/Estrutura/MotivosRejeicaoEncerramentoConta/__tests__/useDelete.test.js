import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { useDeleteMotivoRejeicao } from "../hooks/useDeleteMotivoRejeicao";
import { deleteMotivoRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import userEvent from "@testing-library/user-event";

jest.mock("../../../../../../services/MotivosRejeicaoEncerramentoConta.service");
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

const TestComponent = ({ uuidMotivoRejeicao }) => {
  const { mutationDelete } = useDeleteMotivoRejeicao();

  return (
      <div>
          <button onClick={() => mutationDelete.mutate(uuidMotivoRejeicao)}>
              Excluir Motivo
          </button>
          {mutationDelete.isPending && <p>Excluindo...</p>}
          {mutationDelete.isError && <p>Erro ao excluir</p>}
          {mutationDelete.isSuccess && <p>Exclusão concluída</p>}
      </div>
  );
};

describe("Hook useDeleteMotivoRejeicao", () => {
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
        deleteMotivoRejeicaoEncerramentoConta.mockResolvedValueOnce({});
  
        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoRejeicao="1234" />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );
  
        userEvent.click(screen.getByText("Excluir Motivo"));

        await waitFor(() => {
            expect(screen.getByText("Exclusão concluída")).toBeInTheDocument();
            expect(deleteMotivoRejeicaoEncerramentoConta).toHaveBeenCalledWith("1234");
            expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Exclusão do motivo de rejeição de encerramento de conta realizada com sucesso",
                "O motivo de rejeição foi excluído com sucesso."
            );
        });
    });

    test("Lida com erro ao excluir motivo", async () => {
        deleteMotivoRejeicaoEncerramentoConta.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao excluir" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoRejeicao="1234" />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Excluir Motivo"));

        await waitFor(() => {
            expect(deleteMotivoRejeicaoEncerramentoConta).toHaveBeenCalledWith("1234");
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao apagar o motivo de rejeição",
                "Não foi possível apagar o motivo de rejeição"
            );
            expect(screen.getByText("Erro ao excluir")).toBeInTheDocument();
        });
    });
    test("Lida com erro ao excluir motivo sem prop mensagem", async () => {
        deleteMotivoRejeicaoEncerramentoConta.mockRejectedValueOnce({
            response: { data: { detail: "Erro ao excluir" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoRejeicao="1234" />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Excluir Motivo"));

        await waitFor(() => {
            expect(deleteMotivoRejeicaoEncerramentoConta).toHaveBeenCalledWith("1234");
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao apagar o motivo de rejeição",
                "Não foi possível apagar o motivo de rejeição"
            );
            expect(screen.getByText("Erro ao excluir")).toBeInTheDocument();
        });
    });
});
