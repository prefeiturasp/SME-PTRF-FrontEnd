import {act} from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import { patchUpdatePeriodo } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePatchPeriodo } from "../hooks/usePatchPeriodo";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchUpdatePeriodo: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchPeriodo", () => {
    const setModalForm = jest.fn();
    const queryClient =  new QueryClient({
        defaultOptions: {
            queries: { retry: false } // Desativa retry apenas para esse teste
        }
    })
    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve atualizar o período com sucesso", async () => {
        patchUpdatePeriodo.mockResolvedValueOnce({});
        const { result } = renderHook(() => usePatchPeriodo(setModalForm), {wrapper});
        console.log(result)
        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "d9bc43e3-cfd5-4969-bada-af78d96e8faf",
                payload: { referencia: "2025.1" },
            });
        });

        expect(patchUpdatePeriodo).toHaveBeenCalledWith("d9bc43e3-cfd5-4969-bada-af78d96e8faf", { referencia: "2025.1" });
        expect(setModalForm).toHaveBeenCalledWith({ open: false });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Edição do período realizado com sucesso.");
    });

    it("deve exibir erro ao falhar na atualização", async () => {
        patchUpdatePeriodo.mockRejectedValueOnce(new Error("Erro ao atualizar"));
        const { result } = renderHook(() => usePatchPeriodo(setModalForm), {wrapper});

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "d9bc43e3-cfd5-4969-bada-af78d96e8faf",
                payload: { referencia: "2025.1" },
            })
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao atualizar período", "Não foi possível atualizar o período");
    });
});
