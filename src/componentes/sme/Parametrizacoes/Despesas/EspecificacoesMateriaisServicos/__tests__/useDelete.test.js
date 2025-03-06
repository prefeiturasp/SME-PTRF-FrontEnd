import { waitFor, renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDelete } from "../hooks/useDelete";
import { deleteEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock('../../../../../../services/sme/Parametrizacoes.service', () => ({
    deleteEspecificacoesMateriaisServicos: jest.fn(),
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

describe("Hook useDelete", () => {

    it('deve chamar a mutação com sucesso', async () => {
        deleteEspecificacoesMateriaisServicos.mockResolvedValue({ data: { sucesso: true } });

        const { result } = renderHook(() => useDelete(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationDelete.mutateAsync("uuid");
        });

        expect(deleteEspecificacoesMateriaisServicos).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Exclusão de especificação realizada com sucesso",
            "A especificação foi excluída com sucesso."
        );
    });

    it("deve exibir mensagem de erro quando a API retorna uma mensagem de erro", async () => {
        deleteEspecificacoesMateriaisServicos.mockRejectedValueOnce({
            response: { data: { mensagem: "Erro" } },
        });

        const { result } = renderHook(() => useDelete(), { wrapper });

        await waitFor(async () => {
            await result.current.mutationDelete.mutateAsync({ nome: 'Material Teste' });
        });

        expect(deleteEspecificacoesMateriaisServicos).toHaveBeenCalled();
        expect(toastCustom.ToastCustomError).toHaveBeenCalled();
    });
});
