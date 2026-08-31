import { renderHook, waitFor } from "@testing-library/react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";

import { useEditarOcupanteCargoComposicaoVacancia } from "../useEditarOcupanteCargoComposicaoVacancia";
import { patchEditarOcupanteCargoComposicaoVacancia } from "../../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    patchEditarOcupanteCargoComposicaoVacancia: jest.fn(),
}));

jest.mock("../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

describe("useEditarOcupanteCargoComposicaoVacancia", () => {
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

    it("deve executar a mutation com uuid e payload", async () => {
        const payload = { ocupante_do_cargo: { nome: "Novo Nome" } };
        patchEditarOcupanteCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useEditarOcupanteCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationEditarOcupanteCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            payload,
        });

        await waitFor(() => {
            expect(patchEditarOcupanteCargoComposicaoVacancia).toHaveBeenCalledWith("cargo-1", payload);
        });
    });

    it("deve invalidar a lista de cargos e exibir toast de sucesso", async () => {
        patchEditarOcupanteCargoComposicaoVacancia.mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useEditarOcupanteCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationEditarOcupanteCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            payload: {},
        });

        await waitFor(() => {
            expect(invalidateQueriesSpy).toHaveBeenCalledWith(["cargos-da-composicao-vacancia"]);
        });

        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            "Membro alterado.",
            "Os dados do membro foram atualizados com sucesso."
        );
        expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
    });

    it("deve exibir toast de erro e não invalidar queries quando a API falhar", async () => {
        const error = { response: { data: { mensagem: "Não é possível editar um cargo vago." } } };
        patchEditarOcupanteCargoComposicaoVacancia.mockRejectedValue(error);

        const { result } = renderHook(() => useEditarOcupanteCargoComposicaoVacancia(), {
            wrapper: createWrapper(),
        });

        result.current.mutationEditarOcupanteCargoComposicaoVacancia.mutate({
            uuid: "cargo-1",
            payload: {},
        });

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao alterar membro.",
                "Não é possível editar um cargo vago."
            );
        });

        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });
});
