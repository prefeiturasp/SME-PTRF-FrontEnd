import { waitFor, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePatch } from "../hooks/usePatch";
import { patchEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock('../../../../../../services/sme/Parametrizacoes.service', () => ({
    patchEspecificacoesMateriaisServicos: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const queryClient = new QueryClient();

describe("Hook usePatch", () => {

    it('deve chamar a mutação com sucesso', async () => {
        patchEspecificacoesMateriaisServicos.mockResolvedValue({ data: { sucesso: true } });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationPatch.mutateAsync({ payload: { nome: 'Material Teste' } });
        });

        expect(patchEspecificacoesMateriaisServicos).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Edição da especificação realizada com sucesso",
            "A especificação foi editada com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        patchEspecificacoesMateriaisServicos.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro" } },
        });

        const { result } = renderHook(() => usePatch(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationPatch.mutateAsync({ nome: 'Material Teste' });
        });

        expect(patchEspecificacoesMateriaisServicos).toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalled();
    });

});
