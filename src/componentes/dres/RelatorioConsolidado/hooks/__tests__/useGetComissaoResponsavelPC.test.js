import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetComissaoResponsavelPC } from "../useGetComissaoResponsavelPC";
import { getComissaoResponsavelPC } from "../../../../../services/dres/Comissoes.service";

jest.mock("../../../../../services/dres/Comissoes.service", () => ({
  getComissaoResponsavelPC: jest.fn(),
}));

const wrapper = ({ children }) => {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("useGetComissaoResponsavelPC", () => {
  it("busca a comissão quando há recurso_uuid", async () => {
    getComissaoResponsavelPC.mockResolvedValue({ uuid: "com1" });
    const { result } = renderHook(() => useGetComissaoResponsavelPC({ recurso_uuid: "r1" }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getComissaoResponsavelPC).toHaveBeenCalledWith("r1");
    expect(result.current.data).toEqual({ uuid: "com1" });
    expect(result.current.isError).toBe(false);
  });

  it("não chama a API sem recurso_uuid", async () => {
    const { result } = renderHook(() => useGetComissaoResponsavelPC({ recurso_uuid: null }), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(getComissaoResponsavelPC).not.toHaveBeenCalled();
    expect(result.current.data).toEqual({});
  });

  it("expõe erro", async () => {
    getComissaoResponsavelPC.mockRejectedValue(new Error("falha"));
    const { result } = renderHook(() => useGetComissaoResponsavelPC({ recurso_uuid: "r1" }), { wrapper });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe("falha");
    expect(typeof result.current.refetch).toBe("function");
  });
});
