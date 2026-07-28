import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useExcluirBemProduzido } from "../../hooks/UseExcluirBemProduzido";
import { useDeleteBemProduzido } from "../../hooks/useDeleteBemProduzido";

const mockNavigate = jest.fn();
const mockMutateAsync = jest.fn();
const mockConsoleError = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../hooks/useDeleteBemProduzido", () => ({
    useDeleteBemProduzido: jest.fn(),
}));

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
            mutations: {
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

describe("useExcluirBemProduzido", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useDeleteBemProduzido.mockReturnValue({
            mutationDelete: {
                mutateAsync: mockMutateAsync,
                isPending: false,
            },
        });
  });

    afterAll(() => {
        mockConsoleError.mockRestore();
    });

    it("deve retornar o estado de carregamento da mutation", () => {
        useDeleteBemProduzido.mockReturnValue({
            mutationDelete: {
                mutateAsync: mockMutateAsync,
                isPending: true,
            },
        });

        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
    });

    it("deve chamar a exclusão com o uuid informado", async () => {
        mockMutateAsync.mockResolvedValue({});

        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        await result.current.handleExcluirBem({
            uuid: "uuid-123",
        });

        expect(mockMutateAsync).toHaveBeenCalledTimes(1);
        expect(mockMutateAsync).toHaveBeenCalledWith("uuid-123");
    });

    it("deve navegar para a listagem após excluir o bem com sucesso", async () => {
        mockMutateAsync.mockResolvedValue({});

        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        await result.current.handleExcluirBem({
            uuid: "uuid-123",
        });

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith(
                "/lista-situacao-patrimonial"
            );
        });
    });

    it("deve executar o callback de sucesso quando informado", async () => {
        mockMutateAsync.mockResolvedValue({});

        const onSuccess = jest.fn();

        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        await result.current.handleExcluirBem({
            uuid: "uuid-123",
            onSuccess,
        });

        expect(onSuccess).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(
            "/lista-situacao-patrimonial"
        );
    });

    it("não deve executar callback quando onSuccess não for informado", async () => {
        mockMutateAsync.mockResolvedValue({});

        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        await expect(
            result.current.handleExcluirBem({
                uuid: "uuid-123",
            })
        ).resolves.toBeUndefined();

        expect(mockNavigate).toHaveBeenCalledWith(
            "/lista-situacao-patrimonial"
        );
    });

    it("não deve navegar quando ocorrer erro na exclusão", async () => {
        const error = new Error("Erro ao excluir");

        mockMutateAsync.mockRejectedValue(error);

        const onSuccess = jest.fn();

        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        await expect(
            result.current.handleExcluirBem({
                uuid: "uuid-123",
                onSuccess,
            })
        ).resolves.toBeUndefined();

        expect(onSuccess).not.toHaveBeenCalled();
        expect(mockNavigate).not.toHaveBeenCalled();
        expect(mockConsoleError).toHaveBeenCalledWith(error);
    });

    it("deve retornar isLoading como false quando a mutation não estiver pendente", () => {
        const { result } = renderHook(() => useExcluirBemProduzido(), {
            wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(false);
    });
});