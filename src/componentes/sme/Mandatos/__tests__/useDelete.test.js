import { act } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { useDeleteMandato } from "../hooks/useDeleteMandato";
import {deleteMandato} from "../../../../services/Mandatos.service";
import {toastCustom} from "../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MandatosContext, MandatosProvider  } from "../context/Mandatos";
import { ModalInfo } from "../../../Globais/Modal/ModalInfo";

// Mockando serviços externos
jest.mock("../../../../services/Mandatos.service", () => ({
    deleteMandato: jest.fn(),
}));

jest.mock("../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

jest.mock("../../../Globais/Modal/ModalInfo", () => ({
    ModalInfo: jest.fn()
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(() => ({})), // Mock do estado do Redux
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: { retry: false } // Desativa retry apenas para esse teste
    }
})
const mockContextValue = {
    setShowModalForm: jest.fn()
};

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient} >
        <MandatosContext.Provider value={mockContextValue}>{children}</MandatosContext.Provider>
    </QueryClientProvider>
);

describe("useDeleteMandato", () => {
    const setShowModalForm = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve deletar um mandato", async () => {
        deleteMandato.mockResolvedValueOnce({});

        const { result } = renderHook(() => useDeleteMandato(), { wrapper });
        await act(async () => {
            await result.current.mutationDelete.mutateAsync({uuid: "uuid-fake"});
        });

        expect(deleteMandato).toHaveBeenCalledWith("uuid-fake");
        expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Exclusão do período de mandato realizada com sucesso",
            "O período de mandato foi excluído com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deleteMandato.mockRejectedValueOnce({
                response: { data: { mensagem: "Erro" } },
            });
    
            const { result } = renderHook(() => useDeleteMandato(), { wrapper });
    
            await waitFor(async () => {
                await result.current.mutationDelete.mutateAsync({uuid: "uuid-fake"});
            });
    
            expect(deleteMandato).toHaveBeenCalled();
            expect(ModalInfo).toHaveBeenCalled();
        });
});