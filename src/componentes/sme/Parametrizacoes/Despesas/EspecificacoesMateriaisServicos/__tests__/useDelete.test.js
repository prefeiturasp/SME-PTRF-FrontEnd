import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useDelete } from "../hooks/useDelete";
import { deleteEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
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

const TestComponent = ({ uuid }) => {
  const { mutationDelete } = useDelete();

  return (
      <div>
          <button onClick={() => mutationDelete.mutate(uuid)}>
              Excluir especificação
          </button>
          {mutationDelete.isLoading && <p>Excluindo...</p>}
          {mutationDelete.isError && <p>Erro ao excluir</p>}
          {mutationDelete.isSuccess && <p>Exclusão concluída</p>}
      </div>
  );
};

describe("Hook useDelete", () => {
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
        deleteEspecificacoesMateriaisServicos.mockResolvedValueOnce(Promise.resolve());
        jest.spyOn(queryClient, "invalidateQueries").mockResolvedValueOnce();

        render(
            <QueryClientProvider client={queryClient}>
                <MateriaisServicosContext.Provider value={mockContextValue}>
                    <TestComponent uuid="1234" />
                </MateriaisServicosContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Excluir especificação"));

        await waitFor(() => {
            expect(deleteEspecificacoesMateriaisServicos).toHaveBeenCalledWith("1234");
            expect(screen.getByText("Exclusão concluída")).toBeInTheDocument();
            expect(queryClient.invalidateQueries).toHaveBeenCalledWith(["especificacoes-materiais-servicos-list"]);
        
            expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Exclusão de especificação realizada com sucesso",
                "A especificação foi excluída com sucesso."
            );
        });
    });

    test("Lida com erro ao Excluir especificação", async () => {
        deleteEspecificacoesMateriaisServicos.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao excluir" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MateriaisServicosContext.Provider value={mockContextValue}>
                    <TestComponent uuid="1234" />
                </MateriaisServicosContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Excluir especificação"));

        await waitFor(() => {
            expect(deleteEspecificacoesMateriaisServicos).toHaveBeenCalledWith("1234");
            expect(screen.getByText("Erro ao excluir")).toBeInTheDocument();
        }); 
    });
});
