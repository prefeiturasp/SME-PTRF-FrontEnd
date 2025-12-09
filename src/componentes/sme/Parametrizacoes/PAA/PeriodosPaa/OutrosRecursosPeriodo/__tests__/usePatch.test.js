import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { usePatchOutroRecursoPeriodo } from "../hooks/usePatch";
import { patchOutroRecursoPeriodoPaa } from "../../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OutrosRecursosPeriodosPaaContext } from "../context/index";

jest.mock("../../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchOutroRecursoPeriodoPaa: jest.fn(),
}));

jest.mock("../../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchOutroRecursoPeriodo", () => {
    const setShowModalForm = jest.fn();
    const queryClient =  new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <OutrosRecursosPeriodosPaaContext.Provider value={{ setShowModalForm }}>
                {children}
            </OutrosRecursosPeriodosPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar com sucesso", async () => {
        patchOutroRecursoPeriodoPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchOutroRecursoPeriodo(), { wrapper });

        await act(async () => {
            result.current.mutateAsync({
                uuid: "uuid-fake",
                payload: { ativo: false },
            });
        });

        expect(patchOutroRecursoPeriodoPaa).toHaveBeenCalled();
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchOutroRecursoPeriodoPaa.mockRejectedValueOnce({
            response: { data: {mensagem: 'erro genérico'} },
        });

        const { result } = renderHook(() => usePatchOutroRecursoPeriodo(), { wrapper });

        try {
            await result.current.mutateAsync({
                uuid: "uuid-fake",
                payload: { ativo: true },
            });
        } catch (error) {
            expect(error.response.data.mensagem).toBe('erro genérico');
        }
    });
});
