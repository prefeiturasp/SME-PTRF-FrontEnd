import { act } from "react";
import { renderHook } from "@testing-library/react";
import { usePatch } from "../hooks/usePatch";
import { patchExibirAcoesPTRFPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AcoesPTRFPaaContext } from "../context/index";
import { mockData } from "../__fixtures__/mockData";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    patchExibirAcoesPTRFPaa: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const contexto = {
  patchingLoadingUUID: null,
  setPatchingLoadingUUID: jest.fn()
}

describe("usePatch", () => {
    const queryClient =  new QueryClient()

    const wrapper = ({ children }) => (
        <QueryClientProvider client={queryClient}>
            <AcoesPTRFPaaContext.Provider value={contexto}>
                {children}
            </AcoesPTRFPaaContext.Provider>
        </QueryClientProvider>
    );

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve editar com sucesso", async () => {
        patchExibirAcoesPTRFPaa.mockResolvedValueOnce({});

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: mockData[0].uuid,
                payload: { exibir_paa: !mockData[0].exibir_paa },
            });
        });

        expect(patchExibirAcoesPTRFPaa).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Ação desabilitada",
            "A Ação PTRF foi desabilitada com sucesso!"
        );
    });

    it("deve exibir erro quando já existe um objetivo com o mesmo nome", async () => {
        patchExibirAcoesPTRFPaa.mockRejectedValueOnce({
            response: { data: { mensagem: "Error" } },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                UUID: "uuid-fake",
                payload: { exibir_paa: false },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Error"
        );
    });

    it("deve exibir mensagem genérica quando ocorre outro erro", async () => {
        patchExibirAcoesPTRFPaa.mockRejectedValueOnce({
            response: { data: {erro: 'Mensagem prop erro'} },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({
                uuid: "uuid-fake",
                payload: { exibir_paa: false },
            });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
            "Erro!", "Não foi possível alternar exibição da Ação PTRF no PAA."
        );
    });
});
