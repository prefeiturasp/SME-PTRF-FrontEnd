import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeleteMandatoVacancia } from "../useDeleteMandatoVacancia";
import { deleteMandatoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    deleteMandatoVacancia: jest.fn(),
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

describe("useDeleteMandatoVacancia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve excluir um mandato e exibir toast de sucesso", async () => {
        deleteMandatoVacancia.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteMandatoVacancia(), { wrapper });

        await act(async () => {
            await result.current.mutationDelete.mutateAsync({ uuid: "mandato-1" });
        });

        expect(deleteMandatoVacancia).toHaveBeenCalledWith("mandato-1");
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Exclusão do período de mandato realizada com sucesso",
            "O período de mandato foi excluído com sucesso."
        );
    });

    it("não deve exibir toast quando a exclusão falhar", async () => {
        deleteMandatoVacancia.mockRejectedValueOnce({ response: { data: { mensagem: "Não é possível excluir" } } });

        const { result } = renderHook(() => useDeleteMandatoVacancia(), { wrapper });

        await act(async () => {
            await expect(
                result.current.mutationDelete.mutateAsync({ uuid: "mandato-1" })
            ).rejects.toBeTruthy();
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });
});
