import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetAssociacoes } from "../hooks/useGetAssociacoes";
import { getAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
  getAssociacoes: jest.fn(),
}));

describe("useGetAssociacoes", () => {
  const renderCustomHook = (filters) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    return renderHook(() => useGetAssociacoes({ filters }), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      ),
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("busca associações pelo recurso", async () => {
    const data = [{ uuid: "associacao-1" }];
    getAssociacoes.mockResolvedValue(data);

    const { result } = renderCustomHook({
      recurso_uuid: "recurso-1",
      is_required_recurso_uuid: true,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getAssociacoes).toHaveBeenCalledWith("recurso-1");
    expect(result.current.data).toEqual(data);
  });

  it("retorna lista vazia quando recurso é obrigatório e não foi informado", async () => {
    const { result } = renderCustomHook({
      recurso_uuid: "",
      is_required_recurso_uuid: true,
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(getAssociacoes).not.toHaveBeenCalled();
    expect(result.current.data).toEqual([]);
  });
});
