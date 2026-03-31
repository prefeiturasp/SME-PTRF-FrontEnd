import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { BarraMensagemUnidadeEmSuporte } from "../index";
import { visoesService } from "../../../../services/visoes.service";
import { encerrarAcessoSuporte, authService } from "../../../../services/auth.service";
import { barraMensagemCustom } from "../../BarraMensagem";

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getDadosDoUsuarioLogado: jest.fn(),
    },
}));

jest.mock("../../../../services/auth.service", () => ({
    encerrarAcessoSuporte: jest.fn(),
    authService: {
        logout: jest.fn(),
    },
}));

jest.mock("../../BarraMensagem", () => ({
    barraMensagemCustom: {
        BarraMensagemSucessLaranja: jest.fn(),
    },
}));

let capturedHandleNao = null;
let capturedHandleSim = null;

jest.mock("../ModalConfirmaEncerramentoSuporte", () => ({
    ModalConfirmaEncerramentoSuporte: ({ show, handleNaoConfirmaEncerramentoSuporte, handleConfirmaEncerramentoSuporte }) => {
        capturedHandleNao = handleNaoConfirmaEncerramentoSuporte;
        capturedHandleSim = handleConfirmaEncerramentoSuporte;
        return show ? (
            <div data-testid="modal-confirmacao">
                <button data-testid="btn-nao" onClick={handleNaoConfirmaEncerramentoSuporte}>Não</button>
                <button data-testid="btn-sim" onClick={handleConfirmaEncerramentoSuporte}>Sim</button>
            </div>
        ) : null;
    },
}));

const DADOS_COM_SUPORTE = {
    usuario_logado: { login: "usuario.teste" },
    unidade_selecionada: { uuid: "uuid-unidade-123" },
    unidades: [
        { uuid: "uuid-unidade-123", acesso_de_suporte: true },
    ],
};

const DADOS_SEM_SUPORTE = {
    usuario_logado: { login: "usuario.teste" },
    unidade_selecionada: { uuid: "uuid-unidade-123" },
    unidades: [
        { uuid: "uuid-unidade-123", acesso_de_suporte: false },
    ],
};

describe("BarraMensagemUnidadeEmSuporte", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedHandleNao = null;
        capturedHandleSim = null;
        barraMensagemCustom.BarraMensagemSucessLaranja.mockReturnValue(
            <div data-testid="barra-suporte">Você está acessando essa unidade em MODO SUPORTE.</div>
        );
    });

    describe("verificaSeUnidadeEstaEmSuporte", () => {
        it("exibe a barra de mensagem quando a unidade está em modo suporte", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(barraMensagemCustom.BarraMensagemSucessLaranja).toHaveBeenCalled();
            });
            expect(screen.getByTestId("barra-suporte")).toBeInTheDocument();
        });

        it("não exibe a barra de mensagem quando a unidade não está em modo suporte", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_SEM_SUPORTE);

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(barraMensagemCustom.BarraMensagemSucessLaranja).not.toHaveBeenCalled();
            });
            expect(screen.queryByTestId("barra-suporte")).not.toBeInTheDocument();
        });

        it("não exibe a barra de mensagem quando dadosUsuarioLogado é null", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(null);

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(barraMensagemCustom.BarraMensagemSucessLaranja).not.toHaveBeenCalled();
            });
        });

        it("não exibe a barra quando a unidade selecionada não é encontrada na lista de unidades", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue({
                usuario_logado: { login: "usuario.teste" },
                unidade_selecionada: { uuid: "uuid-outro" },
                unidades: [
                    { uuid: "uuid-unidade-123", acesso_de_suporte: true },
                ],
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(barraMensagemCustom.BarraMensagemSucessLaranja).not.toHaveBeenCalled();
            });
        });

        it("chama BarraMensagemSucessLaranja com os argumentos corretos", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(barraMensagemCustom.BarraMensagemSucessLaranja).toHaveBeenCalledWith(
                    "Você está acessando essa unidade em MODO SUPORTE. Use o botão encerrar quando concluir o suporte.",
                    "Encerrar suporte",
                    expect.any(Function),
                    true
                );
            });
        });
    });

    describe("handleEncerrarSuporte", () => {
        it("exibe o modal de confirmação ao clicar em encerrar suporte", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);

            let capturedClickHandler = null;
            barraMensagemCustom.BarraMensagemSucessLaranja.mockImplementation((msg, txt, handler) => {
                capturedClickHandler = handler;
                return <button data-testid="btn-encerrar" onClick={handler}>{txt}</button>;
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(capturedClickHandler).not.toBeNull();
            });

            expect(screen.queryByTestId("modal-confirmacao")).not.toBeInTheDocument();

            act(() => {
                capturedClickHandler();
            });

            expect(screen.getByTestId("modal-confirmacao")).toBeInTheDocument();
        });
    });

    describe("handleNaoConfirmaEncerramentoSuporte", () => {
        it("fecha o modal ao clicar em Não", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);

            let capturedClickHandler = null;
            barraMensagemCustom.BarraMensagemSucessLaranja.mockImplementation((msg, txt, handler) => {
                capturedClickHandler = handler;
                return <button data-testid="btn-encerrar" onClick={handler}>{txt}</button>;
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => {
                expect(capturedClickHandler).not.toBeNull();
            });

            act(() => { capturedClickHandler(); });
            expect(screen.getByTestId("modal-confirmacao")).toBeInTheDocument();

            act(() => { fireEvent.click(screen.getByTestId("btn-nao")); });
            expect(screen.queryByTestId("modal-confirmacao")).not.toBeInTheDocument();
        });
    });

    describe("handleConfirmaEncerramentoSuporte", () => {
        it("chama encerrarAcessoSuporte com login e uuid corretos ao confirmar", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);
            encerrarAcessoSuporte.mockResolvedValue({});

            let capturedClickHandler = null;
            barraMensagemCustom.BarraMensagemSucessLaranja.mockImplementation((msg, txt, handler) => {
                capturedClickHandler = handler;
                return <button data-testid="btn-encerrar" onClick={handler}>{txt}</button>;
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => { expect(capturedClickHandler).not.toBeNull(); });

            act(() => { capturedClickHandler(); });

            await act(async () => {
                fireEvent.click(screen.getByTestId("btn-sim"));
            });

            expect(encerrarAcessoSuporte).toHaveBeenCalledWith(
                "usuario.teste",
                "uuid-unidade-123"
            );
        });

        it("chama authService.logout e remove DADOS_USUARIO_LOGADO do localStorage após confirmar", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);
            encerrarAcessoSuporte.mockResolvedValue({});

            const removeItemSpy = jest.spyOn(Storage.prototype, "removeItem");

            let capturedClickHandler = null;
            barraMensagemCustom.BarraMensagemSucessLaranja.mockImplementation((msg, txt, handler) => {
                capturedClickHandler = handler;
                return <button data-testid="btn-encerrar" onClick={handler}>{txt}</button>;
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => { expect(capturedClickHandler).not.toBeNull(); });

            act(() => { capturedClickHandler(); });

            await act(async () => {
                fireEvent.click(screen.getByTestId("btn-sim"));
            });

            expect(removeItemSpy).toHaveBeenCalledWith("DADOS_USUARIO_LOGADO");
            expect(authService.logout).toHaveBeenCalled();

            removeItemSpy.mockRestore();
        });

        it("oculta a barra de suporte e fecha o modal após encerrar com sucesso", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);
            encerrarAcessoSuporte.mockResolvedValue({});

            let capturedClickHandler = null;
            barraMensagemCustom.BarraMensagemSucessLaranja.mockImplementation((msg, txt, handler) => {
                capturedClickHandler = handler;
                return <div data-testid="barra-suporte"><button data-testid="btn-encerrar" onClick={handler}>{txt}</button></div>;
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => { expect(capturedClickHandler).not.toBeNull(); });

            act(() => { capturedClickHandler(); });

            await act(async () => {
                fireEvent.click(screen.getByTestId("btn-sim"));
            });

            expect(screen.queryByTestId("modal-confirmacao")).not.toBeInTheDocument();
            expect(screen.queryByTestId("barra-suporte")).not.toBeInTheDocument();
        });

        it("registra erro no console quando encerrarAcessoSuporte falha", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);
            const erro = new Error("Falha na requisição");
            encerrarAcessoSuporte.mockRejectedValue(erro);

            const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

            let capturedClickHandler = null;
            barraMensagemCustom.BarraMensagemSucessLaranja.mockImplementation((msg, txt, handler) => {
                capturedClickHandler = handler;
                return <button data-testid="btn-encerrar" onClick={handler}>{txt}</button>;
            });

            render(<BarraMensagemUnidadeEmSuporte />);

            await waitFor(() => { expect(capturedClickHandler).not.toBeNull(); });

            act(() => { capturedClickHandler(); });

            await act(async () => {
                fireEvent.click(screen.getByTestId("btn-sim"));
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith(
                "Erro ao encerrar acesso de suporte.",
                erro
            );

            consoleErrorSpy.mockRestore();
        });
    });

    describe("ModalConfirmaEncerramentoSuporte", () => {
        it("renderiza o modal oculto por padrão", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_COM_SUPORTE);

            render(<BarraMensagemUnidadeEmSuporte />);

            expect(screen.queryByTestId("modal-confirmacao")).not.toBeInTheDocument();
        });

        it("passa as props corretas para o modal", async () => {
            visoesService.getDadosDoUsuarioLogado.mockReturnValue(DADOS_SEM_SUPORTE);

            render(<BarraMensagemUnidadeEmSuporte />);

            expect(capturedHandleNao).toBeInstanceOf(Function);
            expect(capturedHandleSim).toBeInstanceOf(Function);
        });
    });
});
