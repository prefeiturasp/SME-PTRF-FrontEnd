import { renderHook, act } from "@testing-library/react";
import { useDocumentoFinalPaa } from "../../hooks/useDocumentoFinalPaa";
import api from "../../../../../../services/api";

jest.mock("../../../../../../services/api", () => ({
    get: jest.fn(),
}));

jest.mock("../../../../../../services/auth.service", () => ({
    TOKEN_ALIAS: "auth_token",
}));

describe("useDocumentoFinalPaa", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.URL.createObjectURL = jest.fn(() => "blob:mock-url");
        window.URL.revokeObjectURL = jest.fn();
        localStorage.setItem("auth_token", "token-fake");
    });

    describe("estado inicial", () => {
        it("deve retornar visualizacaoEmAndamento como null", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(result.current.visualizacaoEmAndamento).toBeNull();
        });

        it("deve expor as funções de visualização e utilitários", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(typeof result.current.obterUrlDocumentoFinal).toBe("function");
            expect(typeof result.current.obterUrlArquivoAtaPaa).toBe("function");
            expect(typeof result.current.chaveVisualizacaoDocumento).toBe("function");
            expect(typeof result.current.revogarUrlDocumento).toBe("function");
        });
    });

    describe("obterUrlDocumentoFinal", () => {
        it("deve retornar null quando paaUuid não é fornecido", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            let url;

            await act(async () => {
                url = await result.current.obterUrlDocumentoFinal(undefined);
            });

            expect(url).toBeNull();
            expect(api.get).not.toHaveBeenCalled();
        });

        it("deve retornar null quando paaUuid é string vazia", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            let url;

            await act(async () => {
                url = await result.current.obterUrlDocumentoFinal("");
            });

            expect(url).toBeNull();
        });

        it("deve chamar api.get com a URL correta e retificacao=false", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: { "content-type": "application/pdf" },
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.obterUrlDocumentoFinal("paa-uuid-003");
            });

            expect(api.get).toHaveBeenCalledWith(
                "/api/paa/paa-uuid-003/documento-final/",
                expect.objectContaining({
                    responseType: "blob",
                    timeout: 30000,
                    params: { retificacao: "false" },
                })
            );
        });

        it("deve enviar retificacao=true quando o segundo argumento é true", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: { "content-type": "application/pdf" },
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.obterUrlDocumentoFinal("paa-uuid-003", true);
            });

            expect(api.get).toHaveBeenCalledWith(
                "/api/paa/paa-uuid-003/documento-final/",
                expect.objectContaining({
                    params: { retificacao: "true" },
                })
            );
        });

        it("deve retornar a URL do blob criada por createObjectURL", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: { "content-type": "application/pdf" },
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());
            let url;

            await act(async () => {
                url = await result.current.obterUrlDocumentoFinal("paa-uuid-003");
            });

            expect(window.URL.createObjectURL).toHaveBeenCalled();
            expect(url).toBe("blob:mock-url");
        });

        it("deve usar content-type do header da resposta ao criar o blob", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: { "content-type": "application/octet-stream" },
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.obterUrlDocumentoFinal("paa-uuid-003");
            });

            const blobArg = window.URL.createObjectURL.mock.calls[0][0];
            expect(blobArg.type).toBe("application/octet-stream");
        });

        it("deve usar application/pdf como content-type padrão quando header está ausente", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: {},
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.obterUrlDocumentoFinal("paa-uuid-003");
            });

            const blobArg = window.URL.createObjectURL.mock.calls[0][0];
            expect(blobArg.type).toBe("application/pdf");
        });

        it("deve resetar visualizacaoEmAndamento para null após sucesso", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: { "content-type": "application/pdf" },
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.obterUrlDocumentoFinal("paa-uuid-003");
            });

            expect(result.current.visualizacaoEmAndamento).toBeNull();
        });

        it("deve retornar null e resetar visualizacaoEmAndamento após erro", async () => {
            api.get.mockRejectedValueOnce(new Error("Falha API"));
            const { result } = renderHook(() => useDocumentoFinalPaa());
            let url;

            await act(async () => {
                url = await result.current.obterUrlDocumentoFinal("paa-uuid-003");
            });

            expect(url).toBeNull();
            expect(result.current.visualizacaoEmAndamento).toBeNull();
        });
    });

    describe("obterUrlArquivoAtaPaa", () => {
        it("deve retornar null quando ataUuid não é fornecido", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            let url;

            await act(async () => {
                url = await result.current.obterUrlArquivoAtaPaa(undefined);
            });

            expect(url).toBeNull();
            expect(api.get).not.toHaveBeenCalled();
        });

        it("deve chamar api.get no endpoint de download da ata", async () => {
            api.get.mockResolvedValueOnce({
                data: new ArrayBuffer(8),
                headers: { "content-type": "application/pdf" },
            });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.obterUrlArquivoAtaPaa("ata-uuid-001");
            });

            expect(api.get).toHaveBeenCalledWith(
                "/api/atas-paa/download-arquivo-ata-paa/?ata-paa-uuid=ata-uuid-001",
                expect.objectContaining({
                    responseType: "blob",
                    timeout: 30000,
                })
            );
        });
    });

    describe("revogarUrlDocumento", () => {
        it("deve chamar revokeObjectURL com a url fornecida", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            act(() => {
                result.current.revogarUrlDocumento("blob:alguma-url");
            });

            expect(window.URL.revokeObjectURL).toHaveBeenCalledWith("blob:alguma-url");
        });

        it("não deve chamar revokeObjectURL quando url é null", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            act(() => {
                result.current.revogarUrlDocumento(null);
            });

            expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
        });

        it("não deve chamar revokeObjectURL quando url é undefined", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            act(() => {
                result.current.revogarUrlDocumento(undefined);
            });

            expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
        });

        it("não deve chamar revokeObjectURL quando url é string vazia", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            act(() => {
                result.current.revogarUrlDocumento("");
            });

            expect(window.URL.revokeObjectURL).not.toHaveBeenCalled();
        });
    });
});
