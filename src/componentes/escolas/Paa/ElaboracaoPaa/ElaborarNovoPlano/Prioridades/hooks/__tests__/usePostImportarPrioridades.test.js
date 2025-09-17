import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostImportarPrioridades } from "../usePostImportarPrioridades";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { postImportarPrioridades } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  postImportarPrioridades: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const mockOnClose = jest.fn();

const params = {
  uuid_paa_atual: 'uuid-test',
  uuid_paa_anterior: 'uuid-test'
};

describe("usePostImportarPrioridadess", () => {
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

  it("deve importar as prioridades com sucesso", async () => {
    
    postImportarPrioridades.mockResolvedValueOnce(params);

    const { result } = renderHook(
      () => usePostImportarPrioridades(mockOnClose), { wrapper }
    );

    await act(async () => {
      result.current.mutationImportarPrioridades.mutate(params);
    });

    expect(postImportarPrioridades).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Prioridades importadas com sucesso."
    );
  });

  it("deve lidar com erro ao criar uma prioridade", async () => {
    postImportarPrioridades.mockRejectedValueOnce(
      new Error("Error")
    );

    const { result } = renderHook(
      () => usePostImportarPrioridades(mockOnClose), { wrapper }
    );

    await act(async () => {
      result.current.mutationImportarPrioridades.mutate(params);
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao importar prioridades."
    );
  });
});
