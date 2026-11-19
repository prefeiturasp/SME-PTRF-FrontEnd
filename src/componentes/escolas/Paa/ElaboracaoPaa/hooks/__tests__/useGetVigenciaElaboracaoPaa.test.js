import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useGetVigenciaElaboracaoPaa } from "../useGetVigenciaElaboracaoPaa";
import { buscarVigenciaCompleta } from "../../utils/buscarVigenciaCompleta";

jest.mock("../../utils/buscarVigenciaCompleta", () => ({ buscarVigenciaCompleta: jest.fn() }));

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    {children}
  </QueryClientProvider>
);

describe("useGetVigenciaElaboracaoPaa", () => {
  beforeEach(() => jest.clearAllMocks());

  it("não busca sem associação", () => {
    const { result } = renderHook(() => useGetVigenciaElaboracaoPaa(null), { wrapper });

    expect(buscarVigenciaCompleta).not.toHaveBeenCalled();
    expect(result.current.vigencia).toBeUndefined();
  });

  it("busca a vigência completa da associação", async () => {
    const vigencia = { hoje: "2026-10-28", periodos: [] };
    buscarVigenciaCompleta.mockResolvedValue(vigencia);

    const { result } = renderHook(() => useGetVigenciaElaboracaoPaa("assoc-1"), { wrapper });

    await waitFor(() => expect(result.current.vigencia).toEqual(vigencia));
    expect(buscarVigenciaCompleta).toHaveBeenCalledWith("assoc-1");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it("informa o erro da busca", async () => {
    buscarVigenciaCompleta.mockRejectedValue(new Error("falha"));

    const { result } = renderHook(() => useGetVigenciaElaboracaoPaa("assoc-1"), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.vigencia).toBeUndefined();
  });
});
