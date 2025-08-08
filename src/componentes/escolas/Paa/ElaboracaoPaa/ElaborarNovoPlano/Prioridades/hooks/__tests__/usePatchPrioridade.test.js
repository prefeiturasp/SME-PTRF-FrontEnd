import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchPrioridade } from "../usePatchPrioridade";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { patchPrioridade } from "../../../../../../../../services/escolas/Paa.service";

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  patchPrioridade: jest.fn(),
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const mockOnClose = jest.fn();

describe("usePatchPrioridades", () => {
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

  it("deve editar um registro com sucesso", async () => {
      const payload = {
        uuid: "UUID-1234",
      };
    patchPrioridade.mockResolvedValueOnce({ uuid: payload.uuid });

    const { result } = renderHook(
      () => usePatchPrioridade(mockOnClose), { wrapper }
    );


    await act(async () => {
      result.current.mutationPatch.mutate({ uuid: payload.uuid, payload });
    });

    expect(patchPrioridade).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
      "Prioridade alterada com sucesso."
    );
  });

  it("deve lidar com erro ao editar uma prioridade", async () => {
    patchPrioridade.mockRejectedValueOnce(
      new Error("Error")
    );

    const { result } = renderHook(
      () => usePatchPrioridade(mockOnClose), { wrapper }
    );

    const payload = {
      uuid: "UUID-1234",
    };

    await act(async () => {
      result.current.mutationPatch.mutate({ uuid: payload.uuid, payload });
    });

    expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
      "Houve um erro ao alterar a prioridade."
    );
  });
});
