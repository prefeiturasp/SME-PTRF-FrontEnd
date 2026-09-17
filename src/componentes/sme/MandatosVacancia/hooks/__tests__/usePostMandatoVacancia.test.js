import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePostMandatoVacancia } from "../usePostMandatoVacancia";
import { postMandatoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    postMandatoVacancia: jest.fn(),
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

describe("usePostMandatoVacancia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve criar um mandato e exibir toast de sucesso", async () => {
        postMandatoVacancia.mockResolvedValueOnce({ uuid: "mandato-1" });

        const { result } = renderHook(() => usePostMandatoVacancia(), { wrapper });

        await act(async () => {
            await result.current.mutationPost.mutateAsync({
                payload: { referencia_mandato: "2023 a 2025" },
            });
        });

        expect(postMandatoVacancia).toHaveBeenCalledWith({ referencia_mandato: "2023 a 2025" });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão do período de mandato realizada com sucesso",
            "O período de mandato foi adicionado ao sistema com sucesso."
        );
    });

    it("não deve exibir toast quando a criação falhar", async () => {
        postMandatoVacancia.mockRejectedValueOnce({ response: { data: { detail: "Erro" } } });

        const { result } = renderHook(() => usePostMandatoVacancia(), { wrapper });

        await act(async () => {
            await expect(
                result.current.mutationPost.mutateAsync({ payload: {} })
            ).rejects.toBeTruthy();
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
});
