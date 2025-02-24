import { render, screen, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { usePatch } from "../hooks/usePatch";
import { patchEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
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

const TestComponent = ({ uuid, payload }) => {
  const { mutationPatch } = usePatch();

  return (
      <div>
          <button onClick={() => mutationPatch.mutate({ uuid, payload })}>
              Atualizar Especificação
          </button>
          {mutationPatch.isLoading && <p>Atualizando...</p>}
          {mutationPatch.isError && <p>Erro ao atualizar</p>}
          {mutationPatch.isSuccess && <p>Atualização concluída</p>}
      </div>
  );
};

describe("Hook usePatch", () => {
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
      patchEspecificacoesMateriaisServicos.mockResolvedValueOnce({});

      render(
          <QueryClientProvider client={queryClient}>
              <MateriaisServicosContext.Provider value={mockContextValue}>
                  <TestComponent uuid="1234" payload={{ descricao: "Novo Nome" }} />
              </MateriaisServicosContext.Provider>
          </QueryClientProvider>
      );

      userEvent.click(screen.getByText("Atualizar Especificação"));

      await waitFor(() => {
          expect(screen.getByText("Atualização concluída")).toBeInTheDocument();
          expect(patchEspecificacoesMateriaisServicos).toHaveBeenCalledWith("1234", { descricao: "Novo Nome" });
          expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
          expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
              "Edição da especificação realizada com sucesso",
              "A especificação foi editada com sucesso."
          );
      });
    });

    test("Lida com erro ao atualizar Especificação", async () => {
        patchEspecificacoesMateriaisServicos.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro ao atualizar" } },
        });

        render(
            <QueryClientProvider client={queryClient}>
                <MateriaisServicosContext.Provider value={mockContextValue}>
                    <TestComponent uuid="1234" payload={{ descricao: "Novo Nome" }} />
                </MateriaisServicosContext.Provider>
            </QueryClientProvider>
        );

        userEvent.click(screen.getByText("Atualizar Especificação"));

        await waitFor(() => {
            expect(patchEspecificacoesMateriaisServicos).toHaveBeenCalledWith("1234", { descricao: "Novo Nome" });
            expect(screen.getByText("Erro ao atualizar")).toBeInTheDocument();
        });
    });
});
