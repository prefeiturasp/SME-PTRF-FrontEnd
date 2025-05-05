import { renderHook, act } from "@testing-library/react";
import { useCarregaPrestacaoDeContasPorUuid } from "../useCarregaPrestacaoDeContasPorUuid";
import * as service from "../../../../services/dres/PrestacaoDeContas.service";

describe("useCarregaPrestacaoDeContasPorUuid", () => {
  it("carrega e retorna os dados da prestação de contas", async () => {
    const mockUuid = "1234-5678";
    const mockData = { id: 1, descricao: "Prestação de Contas Teste" };

    jest
      .spyOn(service, "getPrestacaoDeContasDetalhe")
      .mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useCarregaPrestacaoDeContasPorUuid(mockUuid)
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(service.getPrestacaoDeContasDetalhe).toHaveBeenCalledWith(mockUuid);
    expect(result.current).toEqual(mockData);
  });

  it("não chama setState se o componente for desmontado antes da resposta", async () => {
    const mockUuid = "uuid-mockado";

    let resolvePromise;
    const mockPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    jest
      .spyOn(service, "getPrestacaoDeContasDetalhe")
      .mockReturnValue(mockPromise);

    const { unmount } = renderHook(() =>
      useCarregaPrestacaoDeContasPorUuid(mockUuid)
    );

    unmount();
    await act(async () => {
      resolvePromise({ id: 2, descricao: "Depois da desmontagem" });
    });
  });
});
