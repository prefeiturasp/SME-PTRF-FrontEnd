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
  uuid_paa_anterior: 'uuid-test',
  confirmar: 1
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

  it("executa mutate e chama postImportarPrioridades com parâmetros corretos", async () => {
    postImportarPrioridades.mockResolvedValue({ mensagem: "Importado!" });
    const onClose = jest.fn();

    const { result } = renderHook(() => usePostImportarPrioridades(onClose), {
      wrapper,
    });

    await act(async () => {
      result.current.mutationImportarPrioridades.mutate({
        uuid_paa_atual: "123",
        uuid_paa_anterior: "456",
        confirmar: 0,
      });
    });

    expect(postImportarPrioridades).toHaveBeenCalledWith("123", "456", 0);
  });

  it("onSuccess → chama toast, invalida queries e chama onClose", async () => {
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");
    postImportarPrioridades.mockResolvedValue({ mensagem: "Importado com sucesso" });
    const onClose = jest.fn();

    const { result } = renderHook(() => usePostImportarPrioridades(onClose), {
      wrapper,
    });

    await act(async () => {
      result.current.mutationImportarPrioridades.mutate(
        { uuid_paa_atual: "123", uuid_paa_anterior: "456", confirmar: 1 },
      );
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Importado com sucesso"
    );
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(["prioridades"]);
    expect(invalidateQueriesSpy).toHaveBeenCalledWith(["prioridades-resumo"]);
    expect(onClose).toHaveBeenCalled();
  });

  it("onSuccess sem mensagem → usa texto padrão", async () => {
    postImportarPrioridades.mockResolvedValue({});
    const onClose = jest.fn();

    const { result } = renderHook(() => usePostImportarPrioridades(onClose), {
      wrapper,
    });

    await act(async () => {
      result.current.mutationImportarPrioridades.mutate(
        { uuid_paa_atual: "1", uuid_paa_anterior: "2", confirmar: 1 },
      );
    });

    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Prioridades importadas com sucesso."
    );
  });

});
