import { act } from "react";
import { renderHook } from "@testing-library/react";
import { useProgramasPDDE } from "../hooks/useProgramasPDDE";
import { useGetProgramasPDDE } from "../hooks/useGetProgramasPDDE";
import { usePostProgramaPDDE } from "../hooks/usePostProgramaPDDE";
import { usePatchProgramaPDDE } from "../hooks/usePatchProgramaPDDE";
import { useDeleteProgramaPDDE } from "../hooks/useDeleteProgramaPDDE";
import { programasPDDE } from "../__fixtures__/mockData";

jest.mock("../hooks/useGetProgramasPDDE");
jest.mock("../hooks/usePostProgramaPDDE");
jest.mock("../hooks/usePatchProgramaPDDE");
jest.mock("../hooks/useDeleteProgramaPDDE");
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(() => true),
}));

const mockPost = { mutate: jest.fn() };
const mockPatch = { mutate: jest.fn() };
const mockDelete = { mutate: jest.fn() };

describe("useProgramasPDDE", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGetProgramasPDDE.mockReturnValue({ isLoading: false, data: programasPDDE });
        usePostProgramaPDDE.mockReturnValue({ mutationPost: mockPost });
        usePatchProgramaPDDE.mockReturnValue({ mutationPatch: mockPatch });
        useDeleteProgramaPDDE.mockReturnValue({ mutationDelete: mockDelete });
    });

    it("deve abrir o modal de criação e fechar", () => {
        const { result } = renderHook(() => useProgramasPDDE());

        act(() => result.current.handleOpenCreateModal());
        expect(result.current.modalForm.open).toBe(true);
        expect(result.current.modalForm.operacao).toBe("create");

        act(() => result.current.handleClose());
        expect(result.current.modalForm.open).toBe(false);
    });

    it("deve abrir o modal de edição com os dados do programa", () => {
        const { result } = renderHook(() => useProgramasPDDE());

        act(() => result.current.handleOpenModalForm(programasPDDE.results[0]));
        expect(result.current.modalForm).toMatchObject({
            nome: "Equidade",
            uuid: programasPDDE.results[0].uuid,
            pode_ser_excluida: false,
            operacao: "edit",
            open: true,
        });
    });

    it("deve chamar post ao salvar um novo programa com nome sem espaços nas pontas", () => {
        const { result } = renderHook(() => useProgramasPDDE());

        act(() => result.current.handleSubmitFormModal({ nome: "  Novo  ", uuid: "" }));
        expect(mockPost.mutate).toHaveBeenCalledWith({ payload: { nome: "Novo" } });
        expect(mockPatch.mutate).not.toHaveBeenCalled();
    });

    it("deve chamar patch ao salvar um programa existente", () => {
        const { result } = renderHook(() => useProgramasPDDE());

        act(() => result.current.handleSubmitFormModal({ nome: "Renomeado", uuid: "uuid-1" }));
        expect(mockPatch.mutate).toHaveBeenCalledWith({ uuid: "uuid-1", payload: { nome: "Renomeado" } });
    });

    it("deve chamar delete com o uuid", () => {
        const { result } = renderHook(() => useProgramasPDDE());

        act(() => result.current.handleDelete("uuid-1"));
        expect(mockDelete.mutate).toHaveBeenCalledWith("uuid-1");
    });

    it("deve aplicar e limpar filtros voltando para a primeira página", () => {
        const { result } = renderHook(() => useProgramasPDDE());

        act(() => result.current.setCurrentPage(3));
        act(() => result.current.handleSubmitFiltros({ filtrar_por_nome: "Quali" }));
        expect(result.current.stateFiltros.filtrar_por_nome).toBe("Quali");
        expect(useGetProgramasPDDE).toHaveBeenLastCalledWith({ filtrar_por_nome: "Quali" }, 1, 20);

        act(() => result.current.limpaFiltros());
        expect(result.current.stateFiltros.filtrar_por_nome).toBe("");
    });
});
