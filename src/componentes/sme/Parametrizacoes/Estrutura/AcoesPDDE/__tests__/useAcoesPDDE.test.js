import {act} from "react";
import { renderHook } from "@testing-library/react";
import { useAcoesPDDE } from "../hooks/useAcoesPDDE";
import { usePatchAcaoPDDE } from "../hooks/usePatchAcaoPDDE";
import { usePostAcaoPDDE } from "../hooks/usePostAcaoPDDE";
import { useGetAcoesPDDE } from "../hooks/useGetAcoesPDDE";
import { useGetCategorias } from "../hooks/useGetCategorias";
import { useDeleteAcao } from "../hooks/useDeleteAcaoPDDE";


jest.mock("../hooks/usePatchAcaoPDDE");
jest.mock("../hooks/usePostAcaoPDDE");
jest.mock("../hooks/useGetAcoesPDDE");
jest.mock("../hooks/useGetCategorias");
jest.mock("../hooks/useDeleteAcaoPDDE");


const mockPatchAcaoMutation = { mutate: jest.fn() };
const mockPostAcaoMutation = { mutate: jest.fn() };
const mockDeleteAcaoMutation = { mutate: jest.fn() };

describe("useAcoesPDDE", () => {
    beforeEach(() => {
        usePatchAcaoPDDE.mockReturnValue({ mutationPatch: mockPatchAcaoMutation });
        usePostAcaoPDDE.mockReturnValue({ mutationPost: mockPostAcaoMutation });
        useDeleteAcao.mockReturnValue({ mutationDelete: mockDeleteAcaoMutation });
        useGetAcoesPDDE.mockReturnValue({ isLoading: false, isError: false, data: [], error: "", refetch: jest.fn() });
        useGetCategorias.mockReturnValue({ isLoading: false, isError: false, data: [], error: "", refetch: jest.fn() });
    })

    it("deve abrir e fechar o modal de criar corretamente", () => {
        const { result } = renderHook(() => useAcoesPDDE());
        
        act(() => {
            result.current.handleOpenCreateModal();
        });
        expect(result.current.modalForm.open).toBe(true);
        
        act(() => {
            result.current.handleClose();
        });
        expect(result.current.modalForm.open).toBe(false);
    });

    it("deve abrir e fechar o modal de editar corretamente", () => {
        const { result } = renderHook(() => useAcoesPDDE());
        
        act(() => {
            result.current.handleOpenModalForm({categoria: ""});
        });
        expect(result.current.modalForm.open).toBe(true);
        expect(result.current.modalForm.operacao).toBe("edit");
        
        act(() => {
            result.current.handleClose();
        });
        expect(result.current.modalForm.open).toBe(false);
    });

    it("deve definir e limpar filtros corretamente", () => {
        const { result } = renderHook(() => useAcoesPDDE());
        
        act(() => {
            result.current.handleSubmitFiltros({filtrar_por_nome: "Nome 1"});
        });
        expect(result.current.stateFiltros.filtrar_por_nome).toBe("Nome 1");
        
        act(() => {
            result.current.limpaFiltros();
        });
        expect(result.current.stateFiltros.filtrar_por_nome).toBe("");
    });

    it("deve chamar a mutação de delete ao clicar no handleDelete", async () => {
        const { result } = renderHook(() => useAcoesPDDE());
        
        await act(async () => {
            await result.current.handleDelete("fake-uuid");
        });
        
        expect(mockDeleteAcaoMutation.mutate).toHaveBeenCalled();
        expect(mockDeleteAcaoMutation.mutate).toHaveBeenCalledWith("fake-uuid");
    });

    it("deve chamar a mutação de post", async () => {
        const { result } = renderHook(() => useAcoesPDDE());
        
        await act(async () => {
            await result.current.handleSubmitFormModal({
                nome: "Acao pdde 1",
                categoria: "Categoria pdde 1",
                aceita_capital: true,
                aceita_custeio: true,
                aceita_livre_aplicacao: true,
                operacao: "create",
                uuid: "",
            });
        });
        
        expect(mockPostAcaoMutation.mutate).toHaveBeenCalled();
    });

    it("deve chamar a mutação de patch", async () => {
        const { result } = renderHook(() => useAcoesPDDE());
        
        await act(async () => {
            await result.current.handleSubmitFormModal({
                nome: "Acao pdde 2",
                categoria: "Categoria pdde 1",
                aceita_capital: true,
                aceita_custeio: true,
                aceita_livre_aplicacao: true,
                operacao: "edit",
                uuid: "fake-uuid",
            });
        });
        
        expect(mockPatchAcaoMutation.mutate).toHaveBeenCalled();
    });

});
