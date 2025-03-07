import {act} from "react";
import { renderHook } from "@testing-library/react";
import { usePeriodos } from "../hooks/usePeriodos";
import { usePatchPeriodo } from "../hooks/usePatchPeriodo";
import { useGetPeriodos } from "../hooks/useGetPeriodos";
import { useDeletePeriodo } from "../hooks/useDeletePeriodo";
import { usePostPeriodo } from "../hooks/usePostPeriodo";
import { getDatasAtendemRegras } from "../../../../../../services/sme/Parametrizacoes.service";

jest.mock("../hooks/usePatchPeriodo");
jest.mock("../hooks/usePostPeriodo");
jest.mock("../hooks/useGetPeriodos");
jest.mock("../hooks/useDeletePeriodo");
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    getDatasAtendemRegras: jest.fn()
}));

const mockPatchMutation = { mutate: jest.fn() };
const mockPostMutation = { mutate: jest.fn() };
const mockDeleteMutation = { mutate: jest.fn() };

describe("usePeriodos", () => {
    beforeEach(() => {
        usePatchPeriodo.mockReturnValue({ mutationPatch: mockPatchMutation });
        usePostPeriodo.mockReturnValue({ mutationPost: mockPostMutation });
        useDeletePeriodo.mockReturnValue({ mutationDelete: mockDeleteMutation });
        useGetPeriodos.mockReturnValue({ isLoading: false, data: [], count: 0, refetch: jest.fn() });
    })

    it("deve abrir e fechar o modal de criar corretamente", () => {
        const { result } = renderHook(() => usePeriodos());
        
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
        const { result } = renderHook(() => usePeriodos());
        
        act(() => {
            result.current.handleOpenModalForm();
        });
        expect(result.current.modalForm.open).toBe(true);
        expect(result.current.modalForm.operacao).toBe("edit");
        
        act(() => {
            result.current.handleClose();
        });
        expect(result.current.modalForm.open).toBe(false);
    });

    it("deve definir e limpar filtros corretamente", () => {
        const { result } = renderHook(() => usePeriodos());
        
        act(() => {
            result.current.handleChangeFiltros("filtrar_por_referencia", "2023");
        });
        expect(result.current.stateFiltros.filtrar_por_referencia).toBe("2023");
        
        act(() => {
            result.current.limpaFiltros();
        });
        expect(result.current.stateFiltros.filtrar_por_referencia).toBe("");
    });

    it("deve chamar a mutação de delete ao clicar no handleDelete", async () => {
        const { result } = renderHook(() => usePeriodos());
        
        await act(async () => {
            await result.current.handleDelete("fake-uuid");
        });
        
        expect(mockDeleteMutation.mutate).toHaveBeenCalled();
        expect(mockDeleteMutation.mutate).toHaveBeenCalledWith("fake-uuid");
    });

    it("deve chamar a mutação de post quando as datas atenderem as regras", async () => {
        getDatasAtendemRegras.mockResolvedValue({ valido: true });
        
        const { result } = renderHook(() => usePeriodos());
        
        await act(async () => {
            await result.current.handleSubmitFormModal({
                referencia: "2023-01",
                data_prevista_repasse: "2023-02-01",
                data_inicio_realizacao_despesas: "2023-01-01",
                data_fim_realizacao_despesas: "2023-01-31",
                operacao: "create",
                uuid: "",
            });
        });
        
        expect(mockPostMutation.mutate).toHaveBeenCalled();
    });

    it("deve chamar a mutação de patch quando as datas atenderem as regras", async () => {
        getDatasAtendemRegras.mockResolvedValue({ valido: true });
        
        const { result } = renderHook(() => usePeriodos());
        
        await act(async () => {
            await result.current.handleSubmitFormModal({
                referencia: "2023-01",
                data_prevista_repasse: "2023-02-01",
                data_inicio_realizacao_despesas: "2023-01-01",
                data_fim_realizacao_despesas: "2023-01-31",
                operacao: "edit",
                uuid: "fake-uuid",
            });
        });
        
        expect(mockPatchMutation.mutate).toHaveBeenCalled();
    });

    it("deve chamar o setErroDatasAtendemRegrasMock quando as datas não atenderem as regras", async () => {
        const retornoInvalidoMock = { valido: false, mensagem: "Datas não atendem as regras" }
        getDatasAtendemRegras.mockResolvedValue(retornoInvalidoMock);
        
        const { result } = renderHook(() => usePeriodos());
        
        await act(async () => {
            await result.current.handleSubmitFormModal({
                referencia: "2023-01",
                data_prevista_repasse: "2023-02-01",
                data_inicio_realizacao_despesas: "2023-01-01",
                data_fim_realizacao_despesas: "2023-01-31",
                operacao: "create",
                uuid: "",
            });
        });

        expect(result.current.erroDatasAtendemRegras).toBe(retornoInvalidoMock.mensagem);
    });
    
});
