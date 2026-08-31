import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useCancelarSaidaCargoComposicaoVacancia } from "../useCancelarSaidaCargoComposicaoVacancia";
import { patchCancelarSaidaCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    patchCancelarSaidaCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useCancelarSaidaCargoComposicaoVacancia", () => {
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
        patchCancelarSaidaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useCancelarSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCancelarSaidaCargoComposicaoVacancia.mutate({ uuid: "cargo-1" });

        await waitFor(() => {
            expect(patchCancelarSaidaCargoComposicaoVacancia).toHaveBeenCalledWith("cargo-1");
        });
    });

    it("deve invalidar as queries e exibir toast de sucesso", async () => {
        patchCancelarSaidaCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useCancelarSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCancelarSaidaCargoComposicaoVacancia.mutate({ uuid: "cargo-1" });

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
        });

        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, ["cargos-da-composicao-vacancia"]);
        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, ["status-cadastro-associacao"]);

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Saída cancelada com sucesso.",
            "O membro voltou a ocupar o cargo normalmente."
        );
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir toast de erro e não invalidar queries quando a API falhar", async () => {
        const error = {
            response: { data: { mensagem: "Já existe um sucessor direto." } },
        };

        patchCancelarSaidaCargoComposicaoVacancia.mockRejectedValue(error);

        const { result } = renderHook(() => useCancelarSaidaCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationCancelarSaidaCargoComposicaoVacancia.mutate({ uuid: "cargo-1" });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao cancelar saída.",
                "Já existe um sucessor direto."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
});
