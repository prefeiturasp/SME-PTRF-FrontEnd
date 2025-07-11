import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatchRepasse } from "../hooks/usePatchRepasse";
import { patchRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RepassesContext } from "../context/Repasse";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchRepasse: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchRepasse", () => {
    const setShowModalForm = jest.fn();
    const queryClient =  new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <RepassesContext.Provider value={{ setShowModalForm}}>
                {children}
            </RepassesContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar um registro com sucesso", async () => {
        patchRepasse.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatchRepasse(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid_repasse: "uuid-fake",
                payload: { nome: "Novo Registro" },
            });
        });

        expect(patchRepasse).toHaveBeenCalledWith("uuid-fake", { nome: "Novo Registro" });
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição do repasse realizada com sucesso",
            "O repasse foi editado com sucesso."
        );
    });
});
