import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useRegistrarSaidaCargoComposicaoVacancia } from "../useRegistrarSaidaCargoComposicaoVacancia";
import { postRegistrarSaidaCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    postRegistrarSaidaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useRegistrarSaidaCargoComposicaoVacancia", () => {
    let queryClient;
    let invalidateQueriesSpy;

    const createWrapper = () => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false },
            },
        });

        invalidateQueriesSpy = jest
            .spyOn(queryClient, "invalidateQueries")
            .mockResolvedValue(undefined);

        return ({ children }) => (
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve executar a mutation com uuid e data_saida", async () => {
        postRegistrarSaidaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useRegistrarSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationRegistrarSaidaCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            data_saida: "2026-06-01",
        });

        await waitFor(() => {
            expect(postRegistrarSaidaCargoComposicaoVacancia).toHaveBeenCalledWith(
                "cargo-1", "2026-06-01"
            );
        });
    });

    it("deve invalidar as queries e exibir toast de sucesso", async () => {
        postRegistrarSaidaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useRegistrarSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationRegistrarSaidaCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            data_saida: "2026-06-01",
        });

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
        });

        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, ["cargos-da-composicao-vacancia"]);
        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, ["status-cadastro-associacao"]);

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Saída registrada com sucesso.",
            "A saída do membro foi registrada com sucesso."
        );
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir toast de erro e não invalidar queries quando a API falhar", async () => {
        const error = {
            response: { data: { mensagem: "Não é possível registrar saída." } },
        };

        postRegistrarSaidaCargoComposicaoVacancia.mockRejectedValue(error);

        const { result } = renderHook(() => useRegistrarSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationRegistrarSaidaCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            data_saida: "2026-06-01",
        });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao registrar saída.",
                "Não é possível registrar saída."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
});
