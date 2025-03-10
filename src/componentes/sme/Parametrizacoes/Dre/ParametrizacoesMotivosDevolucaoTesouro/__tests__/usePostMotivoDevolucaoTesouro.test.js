import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { usePostMotivoDevolucaoTesouro } from "../hooks/usePostMotivoDevolucaoTesouro";
import { postMotivosDevolucaoTesouro } from "../../../../../../services/sme/Parametrizacoes.service";
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
  const { mutationPost } = usePostMotivoDevolucaoTesouro();

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

describe("Hook usePostMotivoDevolucaoTesouro", () => {
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
        postMotivosDevolucaoTesouro.mockResolvedValueOnce({});

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ nome: "Novo Motivo" }} />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Motivo"));

        await waitFor(() => {
            expect(screen.getByText("Criação concluída")).toBeInTheDocument();
            expect(postMotivosDevolucaoTesouro).toHaveBeenCalledWith({ nome: "Novo Motivo" });
            expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                "Inclusão do motivo de devolução ao tesouro realizada com sucesso",
                "O motivo de devolução ao tesouro foi adicionado com sucesso."
            );
        });
    });

    test("Lida com erro ao criar motivo", async () => {
        postMotivosDevolucaoTesouro.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao criar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ nome: "Novo Motivo" }} />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Motivo"));

        await waitFor(() => {
            expect(postMotivosDevolucaoTesouro).toHaveBeenCalledWith({ nome: "Novo Motivo" });
            /* expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao criar o motivo de devolução ao tesouro",
                "Erro ao criar"
            ); */
            expect(screen.getByText("Erro ao criar")).toBeInTheDocument();
        });
    });

    test("Lida com erro ao criar motivo sem a prop non_field_errors", async () => {
        postMotivosDevolucaoTesouro.mockRejectedValueOnce({
            response: { data: { error: "Erro ao criar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent payload={{ nome: "Novo Motivo" }} />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Criar Motivo"));

        await waitFor(() => {
            expect(postMotivosDevolucaoTesouro).toHaveBeenCalledWith({ nome: "Novo Motivo" });
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Erro ao criar o motivo de devolução ao tesouro',
                'Não foi possível criar o motivo de devolução ao tesouro'
            );
            expect(screen.getByText("Erro ao criar")).toBeInTheDocument();
        });
    });
});
