import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { usePatchMandato } from "../hooks/usePatchMandato";
import { patchMandato } from "../../../../services/Mandatos.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MandatosContext } from "../context/Mandatos";


// Mockando serviços externos
jest.mock("../../../../services/Mandatos.service", () => ({
    patchMandato: jest.fn(),
}));

jest.mock("../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn()
    },
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false } // Desativa retry apenas para esse teste
    }
})
const mockContextValue = {
    setShowModalForm: jest.fn(),
    setShowModalInfo: jest.fn(),
    setTextoModalInfo: jest.fn(),
    setTituloModalInfo: jest.fn(),
    setBloquearBtnSalvarForm: jest.fn(),
    setForceLoading: jest.fn()
};

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient} >
        <MandatosContext.Provider value={mockContextValue}>{children}</MandatosContext.Provider>
    </QueryClientProvider>
);

describe("usePostMandato", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve atualizar um mandato", async () => {
        patchMandato.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchMandato(), { wrapper });
        await act(async () => {
            await result.current.mutationPatch.mutateAsync({
                uuidMandato: "fake-uuid",
                payload: {nome: "Novo Mandato"}});
        });

        expect(patchMandato).toHaveBeenCalledWith("fake-uuid", {nome: "Novo Mandato"});
        expect(mockContextValue.setForceLoading).toHaveBeenCalledWith(false);
        expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockContextValue.setShowModalInfo).toHaveBeenCalledWith(false);
        expect(mockContextValue.setTextoModalInfo).toHaveBeenCalledWith("");
        expect(mockContextValue.setTituloModalInfo).toHaveBeenCalledWith("");
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição do período de mandato realizada com sucesso",
            "O período de mandato foi editado com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        patchMandato.mockRejectedValueOnce({
                response: { data: { detail: "Erro" } },
            });
    
            const { result } = renderHook(() => usePatchMandato(), { wrapper });
    
            await waitFor(async () => {
                await result.current.mutationPatch.mutateAsync({payload: {nome: "Novo Mandato"}});
            });

            expect(mockContextValue.setShowModalInfo).toHaveBeenCalledWith(true);
            expect(mockContextValue.setTituloModalInfo).toHaveBeenCalledWith("Erro ao editar período de mandato");
            expect(mockContextValue.setTextoModalInfo).toHaveBeenCalledWith("Erro");
        });
});
