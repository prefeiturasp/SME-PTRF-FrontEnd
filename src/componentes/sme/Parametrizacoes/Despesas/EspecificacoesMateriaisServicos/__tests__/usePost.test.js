import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { usePost } from "../hooks/usePost";
import { postEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
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

const TestComponent = ({ payload }) => {
  const { mutationPost } = usePost();

  return (
      <div>
          <button onClick={() => mutationPost.mutate({ payload })}>
              Criar Especificação
          </button>
          {mutationPost.isLoading && <p>Criando...</p>}
          {mutationPost.isError && <p>Erro ao criar</p>}
          {mutationPost.isSuccess && <p>Criação concluída</p>}
      </div>
  );
};

describe("Hook usePost", () => {
    let mockContextValue;

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();

        mockContextValue = {
            setShowModalForm: jest.fn(),
            setBloquearBtnSalvarForm: jest.fn(),
        };
    });

    test("Realiza a criação com sucesso", async () => {
        postEspecificacoesMateriaisServicos.mockResolvedValueOnce({ descricao: "Novo registro"});

        render(
            <QueryClientProvider client={queryClient}>
                <MateriaisServicosContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ descricao: "Novo registro" }} />
                </MateriaisServicosContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Especificação"));

        await waitFor(() => {
            expect(screen.getByText("Criação concluída")).toBeInTheDocument();
            expect(postEspecificacoesMateriaisServicos).toHaveBeenCalledWith({ descricao: "Novo registro" });
            expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Inclusão da especificação realizada com sucesso",
                "a especificação foi adicionada com sucesso."
            );
        });
    });

    test("Lida com erro ao criar Especificação", async () => {
        postEspecificacoesMateriaisServicos.mockRejectedValue({
            response: { data: { non_field_errors: "Erro ao criar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MateriaisServicosContext.Provider value={mockContextValue}>
                    <TestComponent payload={{  }} />
                </MateriaisServicosContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Especificação"));

        await waitFor(() => {
            expect(postEspecificacoesMateriaisServicos).toHaveBeenCalledWith({ });
            expect(screen.getByText("Erro ao criar")).toBeInTheDocument();
        });
    });
});
