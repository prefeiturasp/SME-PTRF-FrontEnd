import { waitFor, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostPaa } from "../hooks/usePostPaa";
import { postPaa } from "../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock('../../../../../services/sme/Parametrizacoes.service', () => ({
    postPaa: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const queryClient = new QueryClient();

describe("Hook usePost", () => {

    it('deve chamar a mutação com sucesso', async () => {
        postPaa.mockResolvedValue({ data: { sucesso: true } });

        const { result } = renderHook(() => usePostPaa(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationPost.mutateAsync({ payload: { associacao: 'fake-uuid' } });
        });

        expect(postPaa).toHaveBeenCalledWith({ associacao: 'fake-uuid' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Sucesso.",
            "O PAA foi adicionado ao sistema com sucesso."
        );

    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        postPaa.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });

        const { result } = renderHook(() => usePostPaa(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationPost.mutateAsync({ associacao: 'fake-uuid' });
        });

        expect(postPaa).toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Não foi possível criar o PAA");
    });

});
