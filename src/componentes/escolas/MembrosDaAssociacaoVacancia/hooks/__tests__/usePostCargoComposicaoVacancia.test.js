import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { usePostCargoComposicaoVacancia } from "../usePostCargoComposicaoVacancia";
import { postCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    postCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("usePostCargoComposicaoVacancia", () => {
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

    it("deve executar a mutation com o payload informado", async () => {
        const payload = { cargo_associacao: "TESOUREIRO" };

        postCargoComposicaoVacancia.mockResolvedValue({ data: payload });

        const { result } = renderHook(() => usePostCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationPostCargoComposicaoVacancia.mutate({ payload });

        await waitFor(() => {
            expect(postCargoComposicaoVacancia).toHaveBeenCalledWith(payload);
        });
    });

    it("deve invalidar as queries e exibir toast de sucesso", async () => {
        const payload = { cargo_associacao: "TESOUREIRO" };

        postCargoComposicaoVacancia.mockResolvedValue({ data: payload });

        const { result } = renderHook(() => usePostCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationPostCargoComposicaoVacancia.mutate({ payload });

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledTimes(2);
        });

        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(1, ["cargos-da-composicao-vacancia"]);
        expect(invalidateQueriesSpy).toHaveBeenNthCalledWith(2, ["status-cadastro-associacao"]);

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Membro adicionado.",
            "O membro foi adicionado com sucesso."
        );
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir a mensagem de erro da v2 e não invalidar queries", async () => {
        const error = {
            response: {
                data: { mensagem: "Já existe um ocupante ativo para este cargo." },
            },
        };

        postCargoComposicaoVacancia.mockRejectedValue(error);

        const { result } = renderHook(() => usePostCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationPostCargoComposicaoVacancia.mutate({ payload: {} });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao criar Cargo da Composição.",
                "Já existe um ocupante ativo para este cargo."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
});
