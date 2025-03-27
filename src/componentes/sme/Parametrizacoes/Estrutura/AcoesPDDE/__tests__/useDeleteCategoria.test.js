import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { deleteAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { useDeleteCategoria } from "../hooks/useDeleteCategoriaAcaoPDDE";
import { categoriasPDDE as mockCategoriasPDDE } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deleteAcoesPDDECategorias: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeleteCategoriaAcaoPDDE", () => {
    let queryClient;

    queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false }, // Desativa retry apenas para esse teste
        },
    });

    const categorias = mockCategoriasPDDE;
    const stateFormCategoria = {id: "1", uuid: "fakw-uuid", nome: "Categoria 1"}
    const stateFormModal = {categoria: "2"}
    const setModalForm = jest.fn();
    const handleFecharFormCategoria = jest.fn();
    const setShowModalConfirmDeleteCategoria = jest.fn();

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve remover a categoria da ação pdde com sucesso", async () => {
        deleteAcoesPDDECategorias.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteCategoria({
            categorias,
            stateFormCategoria,
            setModalForm,
            stateFormModal,
            handleFecharFormCategoria,
            setShowModalConfirmDeleteCategoria
        }), { wrapper });

        await act(async () => {
            result.current.mutationDeleteCategoria.mutate({
                categoriaUuid: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                acaoUuid: "4d272c66-0d2a-4f77-9979-6afeaec39331"
            });
        });

        expect(deleteAcoesPDDECategorias).toHaveBeenCalledWith(
            "4d272c66-0d2a-4f77-9979-6afeaec39332",
            "4d272c66-0d2a-4f77-9979-6afeaec39331");
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso!", "A Categoria da Ação PDDE foi removida do sistema com sucesso."
        );
    });

    it("deve exibir erro ao falhar na remoção", async () => {
        deleteAcoesPDDECategorias.mockRejectedValueOnce(new Error("Erro ao deletar"));

        const { result } = renderHook(() => useDeleteCategoria(
            categorias,
            stateFormCategoria,
            setModalForm,
            stateFormModal,
            handleFecharFormCategoria,
            setShowModalConfirmDeleteCategoria
        ), { wrapper });

        await act(async () => {
            result.current.mutationDeleteCategoria.mutate({
                categoriaUuid: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                acaoUuid: "4d272c66-0d2a-4f77-9979-6afeaec39331"
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Houve um erro ao tentar completar ação."
        );
    });

    it("deve exibir erro ao falhar na remoção por estar associada a alguma ação", async () => {
        deleteAcoesPDDECategorias.mockRejectedValueOnce({response: { data: { mensagem: "Categoria associada a alguma ação" } }});

        const { result } = renderHook(() => useDeleteCategoria(
            categorias,
            stateFormCategoria,
            setModalForm,
            stateFormModal,
            handleFecharFormCategoria,
            setShowModalConfirmDeleteCategoria
        ), { wrapper });

        await act(async () => {
            result.current.mutationDeleteCategoria.mutate({
                categoriaUuid: "4d272c66-0d2a-4f77-9979-6afeaec39332",
                acaoUuid: "4d272c66-0d2a-4f77-9979-6afeaec39331"
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Ops!",
            "Categoria associada a alguma ação"
        );
    });
});
