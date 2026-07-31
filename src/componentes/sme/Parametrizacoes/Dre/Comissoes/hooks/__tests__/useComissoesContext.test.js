import { act, renderHook } from "@testing-library/react";
import { useComissoesContext } from "../useComissoesContext";
import { ComissoesProvider } from "../../context/Comissoes";

describe("useComissoesContext", () => {
  it("retorna o contexto dentro do provider", () => {
    const { result } = renderHook(() => useComissoesContext(), {
      wrapper: ComissoesProvider,
    });
    expect(result.current).toHaveProperty("filter");
    expect(result.current).toHaveProperty("handleOpenCreateModal");
    expect(result.current).toHaveProperty("handleCloseModalForm");
  });

  it("handleOpenCreateModal e handleCloseModalForm alteram o form", () => {
    const { result } = renderHook(() => useComissoesContext(), {
      wrapper: ComissoesProvider,
    });

    act(() => {
      result.current.handleOpenCreateModal();
    });
    expect(result.current.stateFormModal.isOpen).toBe(true);

    act(() => {
      result.current.handleCloseModalForm();
    });
    expect(result.current.stateFormModal.isOpen).toBe(false);
  });

  it("handleOpenModalConfirmacaoExclusao e close atualizam estado", () => {
    const { result } = renderHook(() => useComissoesContext(), {
      wrapper: ComissoesProvider,
    });

    act(() => {
      result.current.handleOpenModalConfirmacaoExclusao("uuid-x");
    });
    expect(result.current.showModalConfirmacaoExclusao).toEqual({
      is_open: true,
      uuid: "uuid-x",
    });

    act(() => {
      result.current.handleCloseModalConfirmacaoExclusao();
    });
    expect(result.current.showModalConfirmacaoExclusao).toEqual({
      is_open: false,
      uuid: "",
    });
  });
});
