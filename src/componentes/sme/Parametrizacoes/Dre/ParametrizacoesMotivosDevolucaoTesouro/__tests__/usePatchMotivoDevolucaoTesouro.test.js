import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { usePatchMotivoDevolucaoTesouro } from "../hooks/usePatchMotivoDevolucaoTesouro";
import { patchMotivosDevolucaoTesouro } from "../../../../../../services/sme/Parametrizacoes.service";
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

const TestComponent = ({ uuidMotivoDevolucaoTesouro, payload }) => {
  const { mutationPatch } = usePatchMotivoDevolucaoTesouro();

  return (
      <div>
          <button onClick={() => mutationPatch.mutate({ uuidMotivoDevolucaoTesouro, payload })}>
              Atualizar Motivo
          </button>
          {mutationPatch.isLoading && <p>Atualizando...</p>}
          {mutationPatch.isError && <p>Erro ao atualizar</p>}
          {mutationPatch.isSuccess && <p>Atualização concluída</p>}
      </div>
  );
};

describe("Hook usePatchMotivoDevolucaoTesouro", () => {
    let mockContextValue;

    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();

        mockContextValue = {
            setShowModalForm: jest.fn(),
            setBloquearBtnSalvarForm: jest.fn(),
        };
    });

    test("Realiza a atualização com sucesso", async () => {
      patchMotivosDevolucaoTesouro.mockResolvedValueOnce({});
  
      render(
          <QueryClientProvider client={queryClient}>
              <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                  <TestComponent uuidMotivoDevolucaoTesouro="1234" payload={{ nome: "Novo Nome" }} />
              </MotivosDevolucaoTesouroContext.Provider>
          </QueryClientProvider>
      );
  
      userEvent.click(screen.getByText("Atualizar Motivo"));

      await waitFor(() => {
          expect(screen.getByText("Atualização concluída")).toBeInTheDocument();
          expect(patchMotivosDevolucaoTesouro).toHaveBeenCalledWith("1234", { nome: "Novo Nome" });
          expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
          expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
              "Edição do motivo de devolução ao tesouro realizada com sucesso",
              "O motivo de devolução ao tesouro foi editado com sucesso."
          );
      });
    });

    test("Lida com erro ao atualizar motivo", async () => {
        patchMotivosDevolucaoTesouro.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao atualizar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoDevolucaoTesouro="1234" payload={{ nome: "Novo Nome" }} />
                </MotivosDevolucaoTesouroContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Atualizar Motivo"));

        await waitFor(() => {
            expect(patchMotivosDevolucaoTesouro).toHaveBeenCalledWith("1234", { nome: "Novo Nome" });
            /* expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao atualizar o motivo de devolução ao tesouro",
                "Erro ao atualizar"
            ); */
            expect(screen.getByText("Erro ao atualizar")).toBeInTheDocument();
        });
    });
});
