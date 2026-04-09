import { renderHook, act, waitFor } from "@testing-library/react";
import { useDocumentoFinalPaa } from "../../hooks/useDocumentoFinalPaa";
import {
    getStatusGeracaoDocumentoPaa,
    getDownloadArquivoFinal,
} from "../../../../../../services/escolas/Paa.service";
import api from "../../../../../../services/api";

jest.mock("../../../../../../services/escolas/Paa.service", () => ({
    getStatusGeracaoDocumentoPaa: jest.fn(),
    getDownloadArquivoFinal: jest.fn(),
}));

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
        it("deve retornar statusDocumento como objeto vazio", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(result.current.statusDocumento).toEqual({});
        });

        it("deve retornar statusCarregando como objeto vazio", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(result.current.statusCarregando).toEqual({});
        });

        it("deve retornar downloadEmAndamento como null", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(result.current.downloadEmAndamento).toBeNull();
        });

        it("deve retornar visualizacaoEmAndamento como null", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(result.current.visualizacaoEmAndamento).toBeNull();
        });

        it("deve expor todas as funções", () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());
            expect(typeof result.current.carregarStatusDocumento).toBe("function");
            expect(typeof result.current.baixarDocumentoFinal).toBe("function");
            expect(typeof result.current.obterUrlDocumentoFinal).toBe("function");
            expect(typeof result.current.revogarUrlDocumento).toBe("function");
        });
    });

    describe("carregarStatusDocumento", () => {
        it("não deve chamar o serviço quando paaUuid não é fornecido", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento(undefined);
            });

            expect(getStatusGeracaoDocumentoPaa).not.toHaveBeenCalled();
        });

        it("não deve chamar o serviço quando paaUuid é string vazia", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("");
            });

            expect(getStatusGeracaoDocumentoPaa).not.toHaveBeenCalled();
        });

        it("deve chamar getStatusGeracaoDocumentoPaa com o uuid correto", async () => {
            getStatusGeracaoDocumentoPaa.mockResolvedValueOnce({ status: "GERADO" });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("paa-uuid-001");
            });

            expect(getStatusGeracaoDocumentoPaa).toHaveBeenCalledWith("paa-uuid-001");
        });

        it("deve definir statusDocumento[paaUuid] com o resultado do serviço", async () => {
            const mockStatus = { status: "GERADO", mensagem: "Ok" };
            getStatusGeracaoDocumentoPaa.mockResolvedValueOnce(mockStatus);
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("paa-uuid-001");
            });

            expect(result.current.statusDocumento["paa-uuid-001"]).toEqual(mockStatus);
        });

        it("deve definir statusCarregando como false após sucesso", async () => {
            getStatusGeracaoDocumentoPaa.mockResolvedValueOnce({ status: "GERADO" });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("paa-uuid-001");
            });

            expect(result.current.statusCarregando["paa-uuid-001"]).toBe(false);
        });

        it("deve acumular status de múltiplos uuids", async () => {
            getStatusGeracaoDocumentoPaa
                .mockResolvedValueOnce({ status: "GERADO" })
                .mockResolvedValueOnce({ status: "PENDENTE" });
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("uuid-1");
                await result.current.carregarStatusDocumento("uuid-2");
            });

            expect(result.current.statusDocumento["uuid-1"]).toEqual({ status: "GERADO" });
            expect(result.current.statusDocumento["uuid-2"]).toEqual({ status: "PENDENTE" });
        });

        it("deve definir statusCarregando como false após erro", async () => {
            getStatusGeracaoDocumentoPaa.mockRejectedValueOnce(new Error("Falha"));
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("paa-uuid-001");
            });

            expect(result.current.statusCarregando["paa-uuid-001"]).toBe(false);
        });

        it("não deve atualizar statusDocumento quando ocorre erro", async () => {
            getStatusGeracaoDocumentoPaa.mockRejectedValueOnce(new Error("Falha"));
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.carregarStatusDocumento("paa-uuid-001");
            });

            expect(result.current.statusDocumento["paa-uuid-001"]).toBeUndefined();
        });
    });

    describe("baixarDocumentoFinal", () => {
        it("não deve chamar o serviço quando paaUuid não é fornecido", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.baixarDocumentoFinal(undefined);
            });

            expect(getDownloadArquivoFinal).not.toHaveBeenCalled();
        });

        it("não deve chamar o serviço quando paaUuid é string vazia", async () => {
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.baixarDocumentoFinal("");
            });

            expect(getDownloadArquivoFinal).not.toHaveBeenCalled();
        });

        it("deve chamar getDownloadArquivoFinal com o uuid correto", async () => {
            getDownloadArquivoFinal.mockResolvedValueOnce();
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.baixarDocumentoFinal("paa-uuid-002");
            });

            expect(getDownloadArquivoFinal).toHaveBeenCalledWith("paa-uuid-002");
        });

        it("deve resetar downloadEmAndamento para null após sucesso", async () => {
            getDownloadArquivoFinal.mockResolvedValueOnce();
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.baixarDocumentoFinal("paa-uuid-002");
            });

            expect(result.current.downloadEmAndamento).toBeNull();
        });

        it("deve resetar downloadEmAndamento para null após erro", async () => {
            getDownloadArquivoFinal.mockRejectedValueOnce(new Error("Erro download"));
            const { result } = renderHook(() => useDocumentoFinalPaa());

            await act(async () => {
                await result.current.baixarDocumentoFinal("paa-uuid-002");
            });

            expect(result.current.downloadEmAndamento).toBeNull();
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

        it("deve chamar api.get com a URL correta", async () => {
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
