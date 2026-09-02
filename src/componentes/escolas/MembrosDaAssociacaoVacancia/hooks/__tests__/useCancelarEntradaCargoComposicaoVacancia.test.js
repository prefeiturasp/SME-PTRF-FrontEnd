import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useCancelarEntradaCargoComposicaoVacancia } from "../useCancelarEntradaCargoComposicaoVacancia";
import { patchCancelarEntradaCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    patchCancelarEntradaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useCancelarEntradaCargoComposicaoVacancia", () => {
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

    it("deve executar a mutation com o uuid informado", async () => {
        patchCancelarEntradaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useCancelarEntradaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCancelarEntradaCargoComposicaoVacancia.mutate({ uuid: "cargo-1" });

        await waitFor(() => {
            expect(patchCancelarEntradaCargoComposicaoVacancia).toHaveBeenCalledWith("cargo-1");
        });
    });

    it("deve invalidar as queries e exibir toast de sucesso", async () => {
        patchCancelarEntradaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useCancelarEntradaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCancelarEntradaCargoComposicaoVacancia.mutate({ uuid: "cargo-1" });

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
        });

        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, ["cargos-da-composicao-vacancia"]);
        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, ["status-cadastro-associacao"]);

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Entrada cancelada com sucesso.",
            "O ocupante do cargo foi removido."
        );
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir toast de erro e não invalidar queries quando a API falhar", async () => {
        const error = {
            response: { data: { mensagem: "O registro informado não está ocupado e vigente." } },
        };

        patchCancelarEntradaCargoComposicaoVacancia.mockRejectedValue(error);

        const { result } = renderHook(() => useCancelarEntradaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCancelarEntradaCargoComposicaoVacancia.mutate({ uuid: "cargo-1" });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao cancelar entrada.",
                "O registro informado não está ocupado e vigente."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
});
