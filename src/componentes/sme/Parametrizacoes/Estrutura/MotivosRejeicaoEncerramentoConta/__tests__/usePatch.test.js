import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
import { usePatchMotivoRejeicao } from "../hooks/usePatchMotivoRejeicao";
import { patchMotivosRejeicaoEncerramentoConta } from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
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

const TestComponent = ({ uuidMotivoRejeicao, payload }) => {
  const { mutationPatch } = usePatchMotivoRejeicao();

  return (
      <div>
          <button onClick={() => mutationPatch.mutate({ uuidMotivoRejeicao, payload })}>
              Atualizar Motivo
          </button>
          {mutationPatch.isLoading && <p>Atualizando...</p>}
          {mutationPatch.isError && <p>Erro ao atualizar</p>}
          {mutationPatch.isSuccess && <p>Atualização concluída</p>}
      </div>
  );
};

describe("Hook usePatchMotivoRejeicao", () => {
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
      patchMotivosRejeicaoEncerramentoConta.mockResolvedValueOnce({});
  
      render(
          <QueryClientProvider client={queryClient}>
              <MotivosRejeicaoContext.Provider value={mockContextValue}>
                  <TestComponent uuidMotivoRejeicao="1234" payload={{ nome: "Novo Nome" }} />
              </MotivosRejeicaoContext.Provider>
          </QueryClientProvider>
      );
  
      userEvent.click(screen.getByText("Atualizar Motivo"));

      await waitFor(() => {
          expect(screen.getByText("Atualização concluída")).toBeInTheDocument();
          expect(patchMotivosRejeicaoEncerramentoConta).toHaveBeenCalledWith("1234", { nome: "Novo Nome" });
          expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
          expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
              "Edição do motivo de rejeição de encerramento de conta realizada com sucesso",
              "O motivo de rejeição foi editado com sucesso."
          );
      });
    });

    test("Lida com erro ao atualizar motivo", async () => {
        patchMotivosRejeicaoEncerramentoConta.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao atualizar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoRejeicao="1234" payload={{ nome: "Novo Nome" }} />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Atualizar Motivo"));

        await waitFor(() => {
            expect(patchMotivosRejeicaoEncerramentoConta).toHaveBeenCalledWith("1234", { nome: "Novo Nome" });
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao atualizar o motivo de rejeição",
                "Não foi possível atualizar o motivo de rejeição"
            );
            expect(screen.getByText("Erro ao atualizar")).toBeInTheDocument();
        });
    });

    test("Lida com erro ao atualizar motivo sem a prop non_fields_errors", async () => {
        patchMotivosRejeicaoEncerramentoConta.mockRejectedValueOnce({
            response: { data: { error: "Erro ao atualizar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MotivosRejeicaoContext.Provider value={mockContextValue}>
                    <TestComponent uuidMotivoRejeicao="1234" payload={{ nome: "Novo Nome" }} />
                </MotivosRejeicaoContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Atualizar Motivo"));

        await waitFor(() => {
            expect(patchMotivosRejeicaoEncerramentoConta).toHaveBeenCalledWith("1234", { nome: "Novo Nome" });
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao atualizar o motivo de rejeição",
                "Não foi possível atualizar o motivo de rejeição"
            );
            expect(screen.getByText("Erro ao atualizar")).toBeInTheDocument();
        });
    });
});
