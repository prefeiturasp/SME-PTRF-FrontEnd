import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePatchMandatoVacancia } from "../usePatchMandatoVacancia";
import { patchMandatoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    patchMandatoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: { ToastCustomSuccess: jest.fn() },
}));

const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe("usePatchMandatoVacancia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um mandato e exibir toast de sucesso", async () => {
        patchMandatoVacancia.mockResolvedValueOnce({ uuid: "mandato-1" });

        const { result } = renderHook(() => usePatchMandatoVacancia(), { wrapper });

        await act(async () => {
            await result.current.mutationPatch.mutateAsync({
                uuidMandato: "mandato-1",
                payload: { referencia_mandato: "2023 a 2025 editado" },
            });
        });

        expect(patchMandatoVacancia).toHaveBeenCalledWith("mandato-1", { referencia_mandato: "2023 a 2025 editado" });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição do período de mandato realizada com sucesso",
            "O período de mandato foi editado com sucesso."
        );
    });

    it("não deve exibir toast quando a edição falhar", async () => {
        patchMandatoVacancia.mockRejectedValueOnce({ response: { data: { detail: "Erro" } } });

        const { result } = renderHook(() => usePatchMandatoVacancia(), { wrapper });

        await act(async () => {
            await expect(
                result.current.mutationPatch.mutateAsync({ uuidMandato: "mandato-1", payload: {} })
            ).rejects.toBeTruthy();
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
});
