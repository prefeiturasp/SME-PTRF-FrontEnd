import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { usePatchStatusPresidente } from "../usePatchStatusPresidente";
import { patchStatusPresidenteAssociacao } from "../../../../../services/escolas/Associacao.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/escolas/Associacao.service", () => ({
    patchStatusPresidenteAssociacao: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomError: jest.fn(),
    },
}));

describe("usePatchStatusPresidente", () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve chamar patchStatusPresidenteAssociacao com os parâmetros corretos", async () => {
        patchStatusPresidenteAssociacao.mockResolvedValue({
            sucesso: true,
        });

        const { result } = renderHook(
            () => usePatchStatusPresidente(),
            {
                wrapper: createWrapper(),
            }
        );

        await result.current.mutationPatchStatusPresidenteAssociacao.mutateAsync({
            uuidAssociacao: "assoc-1",
            payload: {
                presidente: true,
            },
        });

        expect(patchStatusPresidenteAssociacao).toHaveBeenCalledWith(
            "assoc-1",
            {
                presidente: true,
            }
        );

        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir toast quando ocorrer erro", async () => {
        const erro = {
            response: {
                status: 500,
            },
        };

        patchStatusPresidenteAssociacao.mockRejectedValue(erro);

        const { result } = renderHook(
            () => usePatchStatusPresidente(),
            {
                wrapper: createWrapper(),
            }
        );

        await expect(
            result.current.mutationPatchStatusPresidenteAssociacao.mutateAsync({
                uuidAssociacao: "assoc-1",
                payload: {},
            })
        ).rejects.toEqual(erro);

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao alterar Status Presidente da Associacao",
                "Não foi possível alterar o Status do Presidente da Associacao "
            );
        });
    });
});