import { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import {
    postProgramaPDDE,
    patchProgramaPDDE,
    deleteProgramaPDDE,
} from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { usePostProgramaPDDE } from "../hooks/usePostProgramaPDDE";
import { usePatchProgramaPDDE } from "../hooks/usePatchProgramaPDDE";
import { useDeleteProgramaPDDE } from "../hooks/useDeleteProgramaPDDE";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({
    postProgramaPDDE: jest.fn(),
    patchProgramaPDDE: jest.fn(),
    deleteProgramaPDDE: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
        ToastCustomSuccess: jest.fn(),
        ToastCustomError: jest.fn(),
    },
}));

const criarWrapper = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
    const spyInvalidate = jest.spyOn(queryClient, "invalidateQueries");
    const wrapper = ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    return { wrapper, spyInvalidate };
};

describe("usePostProgramaPDDE", () => {
    beforeEach(() => jest.clearAllMocks());

    it("deve criar o programa, invalidar a listagem e fechar o modal", async () => {
        postProgramaPDDE.mockResolvedValueOnce({});
        const onSuccess = jest.fn();
        const { wrapper, spyInvalidate } = criarWrapper();
        const { result } = renderHook(() => usePostProgramaPDDE(onSuccess), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({ payload: { nome: "Novo" } });
        });

        expect(postProgramaPDDE).toHaveBeenCalledWith({ nome: "Novo" });
        expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["programas-pdde"] });
        expect(onSuccess).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso.", "O Programa foi adicionado ao sistema com sucesso.");
    });

    it("deve informar nome duplicado", async () => {
        postProgramaPDDE.mockRejectedValueOnce({ response: { data: { erro: "Duplicated" } } });
        const onSuccess = jest.fn();
        const { wrapper } = criarWrapper();
        const { result } = renderHook(() => usePostProgramaPDDE(onSuccess), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({ payload: { nome: "Qualidade" } });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Programa já existe.");
        expect(onSuccess).not.toHaveBeenCalled();
    });

    it("deve exibir erro genérico", async () => {
        postProgramaPDDE.mockRejectedValueOnce(new Error("falha"));
        const { wrapper } = criarWrapper();
        const { result } = renderHook(() => usePostProgramaPDDE(jest.fn()), { wrapper });

        await act(async () => {
            result.current.mutationPost.mutate({ payload: { nome: "X" } });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Não foi possível criar o Programa.");
    });
});

describe("usePatchProgramaPDDE", () => {
    beforeEach(() => jest.clearAllMocks());

    it("deve atualizar o programa e invalidar programas e ações", async () => {
        patchProgramaPDDE.mockResolvedValueOnce({});
        const onSuccess = jest.fn();
        const { wrapper, spyInvalidate } = criarWrapper();
        const { result } = renderHook(() => usePatchProgramaPDDE(onSuccess), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({ uuid: "uuid-1", payload: { nome: "Renomeado" } });
        });

        expect(patchProgramaPDDE).toHaveBeenCalledWith("uuid-1", { nome: "Renomeado" });
        expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["programas-pdde"] });
        expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["acoes-pdde"] });
        expect(onSuccess).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso.", "Edição do Programa realizada com sucesso.");
    });

    it("deve informar nome duplicado", async () => {
        patchProgramaPDDE.mockRejectedValueOnce({ response: { data: { erro: "Duplicated" } } });
        const { wrapper } = criarWrapper();
        const { result } = renderHook(() => usePatchProgramaPDDE(jest.fn()), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({ uuid: "uuid-1", payload: { nome: "Equidade" } });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Programa já existe.");
    });

    it("deve exibir erro genérico", async () => {
        patchProgramaPDDE.mockRejectedValueOnce(new Error("falha"));
        const { wrapper } = criarWrapper();
        const { result } = renderHook(() => usePatchProgramaPDDE(jest.fn()), { wrapper });

        await act(async () => {
            result.current.mutationPatch.mutate({ uuid: "uuid-1", payload: { nome: "X" } });
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Não foi possível atualizar o Programa.");
    });
});

describe("useDeleteProgramaPDDE", () => {
    beforeEach(() => jest.clearAllMocks());

    it("deve excluir o programa", async () => {
        deleteProgramaPDDE.mockResolvedValueOnce({});
        const onSuccess = jest.fn();
        const { wrapper, spyInvalidate } = criarWrapper();
        const { result } = renderHook(() => useDeleteProgramaPDDE(onSuccess), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-1");
        });

        expect(deleteProgramaPDDE).toHaveBeenCalledWith("uuid-1");
        expect(spyInvalidate).toHaveBeenCalledWith({ queryKey: ["programas-pdde"] });
        expect(onSuccess).toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith("Sucesso.", "O Programa foi removido do sistema com sucesso.");
    });

    it("deve exibir toast com a mensagem do backend quando a exclusão não é permitida (programa com vínculos)", async () => {
        const mensagem = "Não é possível excluir. Este programa ainda está vinculado a alguma ação.";
        deleteProgramaPDDE.mockRejectedValueOnce({ response: { data: { erro: "ProtectedError", mensagem } } });
        const onSuccess = jest.fn();
        const { wrapper } = criarWrapper();
        const { result } = renderHook(() => useDeleteProgramaPDDE(onSuccess), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-1");
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", mensagem);
        expect(onSuccess).not.toHaveBeenCalled();
        expect(toastCustom.ToastCustomSuccess).not.toHaveBeenCalled();
    });

    it("deve exibir erro genérico", async () => {
        deleteProgramaPDDE.mockRejectedValueOnce(new Error("falha"));
        const { wrapper } = criarWrapper();
        const { result } = renderHook(() => useDeleteProgramaPDDE(jest.fn()), { wrapper });

        await act(async () => {
            result.current.mutationDelete.mutate("uuid-1");
        });

        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Ops!", "Não foi possível excluir o Programa.");
    });
});
