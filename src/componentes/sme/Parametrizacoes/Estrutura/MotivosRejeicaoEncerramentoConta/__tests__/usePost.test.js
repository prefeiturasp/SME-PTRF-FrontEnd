import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { usePostMotivoRejeicao } from "../hooks/usePostMotivoRejeicao";
import { postMotivosRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
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

const TestComponent = ({ payload }) => {
  const { mutationPost } = usePostMotivoRejeicao();

  return (
      <div>
          <button onClick={() => mutationPost.mutate({ payload })}>
              Criar Motivo
          </button>
          {mutationPost.isLoading && <p>Criando...</p>}
          {mutationPost.isError && <p>Erro ao criar</p>}
          {mutationPost.isSuccess && <p>Criação concluída</p>}
      </div>
  );
};

describe("Hook usePostMotivoRejeicao", () => {
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
        postMotivosRejeicaoEncerramentoConta.mockResolvedValue({});

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ nome: "Novo Motivo" }} />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Motivo"));

        await waitFor(() => {
            expect(screen.getByText("Criação concluída")).toBeInTheDocument();
            expect(postMotivosRejeicaoEncerramentoConta).toHaveBeenCalledWith({ nome: "Novo Motivo" });
            expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Inclusão do motivo de rejeição de encerramento de conta realizada com sucesso",
                "O motivo de rejeição foi adicionado com sucesso."
            );
        });
    });

    test("Lida com erro ao criar motivo", async () => {
        postMotivosRejeicaoEncerramentoConta.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao criar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ nome: "Novo Motivo" }} />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Motivo"));

        await waitFor(() => {
            expect(postMotivosRejeicaoEncerramentoConta).toHaveBeenCalledWith({ nome: "Novo Motivo" });
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao criar o motivo de rejeição",
                "Não foi possível criar o motivo de rejeição"
            );
            expect(screen.getByText("Erro ao criar")).toBeInTheDocument();
        });
    });

    test("Lida com erro ao criar motivo sem a prop non_field_errors", async () => {
        postMotivosRejeicaoEncerramentoConta.mockRejectedValueOnce({
            response: { data: { error: "Erro ao criar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ nome: "Novo Motivo" }} />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Motivo"));

        await waitFor(() => {
            expect(postMotivosRejeicaoEncerramentoConta).toHaveBeenCalledWith({ nome: "Novo Motivo" });
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao criar o motivo de rejeição",
                "Não foi possível criar o motivo de rejeição"
            );
            expect(screen.getByText("Erro ao criar")).toBeInTheDocument();
        });
    });
});
