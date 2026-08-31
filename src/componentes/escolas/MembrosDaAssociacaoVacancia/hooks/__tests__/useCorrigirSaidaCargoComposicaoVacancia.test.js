import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useCorrigirSaidaCargoComposicaoVacancia } from "../useCorrigirSaidaCargoComposicaoVacancia";
import { patchCorrigirSaidaCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    patchCorrigirSaidaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useCorrigirSaidaCargoComposicaoVacancia", () => {
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
        patchCorrigirSaidaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useCorrigirSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCorrigirSaidaCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            data_saida: "2026-07-01",
        });

        await waitFor(() => {
            expect(patchCorrigirSaidaCargoComposicaoVacancia).toHaveBeenCalledWith(
                "cargo-1", "2026-07-01"
            );
        });
    });

    it("deve invalidar as queries e exibir toast de sucesso", async () => {
        patchCorrigirSaidaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useCorrigirSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCorrigirSaidaCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            data_saida: "2026-07-01",
        });

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
        });

        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, ["cargos-da-composicao-vacancia"]);
        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, ["status-cadastro-associacao"]);

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Data de saída corrigida com sucesso.",
            "A data de saída do membro foi atualizada."
        );
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir toast de erro e não invalidar queries quando a API falhar", async () => {
        const error = {
            response: { data: { mensagem: "Não é possível editar a data final do mandato." } },
        };

        patchCorrigirSaidaCargoComposicaoVacancia.mockRejectedValue(error);

        const { result } = renderHook(() => useCorrigirSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCorrigirSaidaCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            data_saida: "2026-07-01",
        });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao corrigir data de saída.",
                "Não é possível editar a data final do mandato."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
});
