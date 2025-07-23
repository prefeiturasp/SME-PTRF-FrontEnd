import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostPrioridade } from "../usePostPrioridade";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { postPrioridade } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postPrioridade: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const mockOnClose = jest.fn();

describe("usePostPrioridades", () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("deve criar um registro com sucesso", async () => {
    const payload = {
      teste: "teste cadastro",
    };
    postPrioridade.mockResolvedValueOnce({ payload });

    const { result } = renderHook(
      () => usePostPrioridade(mockOnClose), { wrapper }
    );

    await act(async () => {
      result.current.mutationPost.mutate({ payload });
    });

    expect(postPrioridade).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Prioridade criada com sucesso."
    );
  });

  it("deve lidar com erro ao criar uma prioridade", async () => {
    postPrioridade.mockRejectedValueOnce(
      new Error("Error")
    );

    const { result } = renderHook(
      () => usePostPrioridade(mockOnClose), { wrapper }
    );

    const payload = {
      teste: "Teste",
    };

    await act(async () => {
      result.current.mutationPost.mutate({ payload });
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao criar a prioridade."
    );
  });
});
