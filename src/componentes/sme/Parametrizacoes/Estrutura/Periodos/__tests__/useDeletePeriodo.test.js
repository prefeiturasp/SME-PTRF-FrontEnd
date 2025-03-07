import {act} from "react";
import { renderHook } from "@testing-library/react";
import { deletePeriodo } from "../../../../../../services/sme/Parametrizacoes.service";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeletePeriodo } from "../hooks/useDeletePeriodo";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    deletePeriodo: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useDeletePeriodo", () => {
    let queryClient;
    let setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
              queries: {
                retry: false, // Evita retries automáticos nos testes
              },
            },
          });
        setModalForm = jest.fn();
        setErroExclusaoNaoPermitida = jest.fn();
        setShowModalInfoExclusaoNaoPermitida = jest.fn();
    });

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it("deve deletar um período com sucesso", async () => {
        deletePeriodo.mockResolvedValueOnce();

        const { result } = renderHook(() => useDeletePeriodo(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-teste");
        });

        expect(deletePeriodo).toHaveBeenCalledWith("uuid-teste");
        expect(setModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Remoção do período efetuada com sucesso.", 
            "O período foi removido do sistema com sucesso."
        );
    });

    it("deve lidar com erro de exclusão não permitida", async () => {
        const erro = { response: { data: { mensagem: "Exclusão não permitida." } } };
        deletePeriodo.mockRejectedValueOnce(erro);

        const { result } = renderHook(() => useDeletePeriodo(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-teste");
        });

        expect(setErroExclusaoNaoPermitida).toHaveBeenCalledWith("Exclusão não permitida.");
        expect(setShowModalInfoExclusaoNaoPermitida).toHaveBeenCalledWith(true);
    });

    it("deve lidar com erro genérico na exclusão", async () => {
        deletePeriodo.mockRejectedValueOnce(new Error("Erro desconhecido"));

        const { result } = renderHook(() => useDeletePeriodo(setModalForm, setErroExclusaoNaoPermitida, setShowModalInfoExclusaoNaoPermitida), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-teste");
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Houve um erro ao tentar completar ação.");
    });
});