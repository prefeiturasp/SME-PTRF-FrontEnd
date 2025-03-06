import { waitFor, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePost } from "../hooks/usePost";
import { postEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock('../../../../../../services/sme/Parametrizacoes.service', () => ({
    postEspecificacoesMateriaisServicos: jest.fn(),
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

describe("Hook usePost", () => {

    it('deve chamar a mutação com sucesso', async () => {
        postEspecificacoesMateriaisServicos.mockResolvedValue({ data: { sucesso: true } });

        const { result } = renderHook(() => usePost(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationPost.mutateAsync({ payload: { nome: 'Material Teste' } });
        });

        expect(postEspecificacoesMateriaisServicos).toHaveBeenCalledWith({ nome: 'Material Teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Inclusão da especificação realizada com sucesso",
            "A especificação foi adicionada com sucesso."
        );

    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        postEspecificacoesMateriaisServicos.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro ao deletar" } },
        });

        const { result } = renderHook(() => usePost(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationPost.mutateAsync({ nome: 'Material Teste' });
        });

        expect(postEspecificacoesMateriaisServicos).toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao criar a especificação", "Erro ao deletar");
    });

});
