import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SuporteAsUnidades } from "../index";

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
        featureFlagAtiva: jest.fn(),
    },
    setarUnidadeProximoLoginAcessoSuporte: jest.fn(),
}));

jest.mock("../../../../services/auth.service", () => ({
    getUsuarioLogado: jest.fn(() => ({ login: "user_teste" })),
    viabilizarAcessoSuporte: jest.fn(),
    authService: {
        logout: jest.fn(),
    },
}));

jest.mock("../../BarraMensagem", () => ({
    barraMensagemCustom: {
        BarraMensagemAcertoExterno: jest.fn(),
    },
}));

jest.mock("../TextoExplicativoDaPagina", () => ({
    TextoExplicativo: ({ visao }) => <div data-testid="texto-explicativo" data-visao={visao} />,
}));

let capturedModalProps = null;
jest.mock("../ModalConfirmaInicioSuporte", () => ({
    ModalConfirmaInicioSuporte: (props) => {
        capturedModalProps = props;
        return <div data-testid="modal-confirma-inicio-suporte" data-show={props.show} />;
    },
}));

let capturedOnSelecionaUnidade = null;
jest.mock("../../EscolheUnidade", () => ({
    EscolheUnidade: ({ onSelecionaUnidade, dre_uuid, visao }) => {
        capturedOnSelecionaUnidade = onSelecionaUnidade;
        return (
            <div
                data-testid="escolhe-unidade"
                data-dre-uuid={dre_uuid}
                data-visao={visao}
            />
        );
    },
}));

import { visoesService, setarUnidadeProximoLoginAcessoSuporte } from "../../../../services/visoes.service";
import { getUsuarioLogado, viabilizarAcessoSuporte, authService } from "../../../../services/auth.service";
import { barraMensagemCustom } from "../../BarraMensagem";

describe("SuporteAsUnidades", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedModalProps = null;
        capturedOnSelecionaUnidade = null;
        visoesService.featureFlagAtiva.mockReturnValue(false);
        visoesService.getItemUsuarioLogado.mockReturnValue("");
        getUsuarioLogado.mockReturnValue({ login: "user_teste" });
        barraMensagemCustom.BarraMensagemAcertoExterno.mockReturnValue(
            <div data-testid="barra-mensagem-feature-flag" />
        );
    });

    it("deve renderizar TextoExplicativo com a visao correta", () => {
        render(<SuporteAsUnidades visao="UE" />);
        const texto = screen.getByTestId("texto-explicativo");
        expect(texto).toBeInTheDocument();
        expect(texto).toHaveAttribute("data-visao", "UE");
    });

    it("deve renderizar EscolheUnidade com a visao correta", () => {
        render(<SuporteAsUnidades visao="UE" />);
        const escolhe = screen.getByTestId("escolhe-unidade");
        expect(escolhe).toBeInTheDocument();
        expect(escolhe).toHaveAttribute("data-visao", "UE");
    });

    it("deve passar dre_uuid vazio para EscolheUnidade quando visao não é DRE", () => {
        render(<SuporteAsUnidades visao="UE" />);
        const escolhe = screen.getByTestId("escolhe-unidade");
        expect(escolhe).toHaveAttribute("data-dre-uuid", "");
        expect(visoesService.getItemUsuarioLogado).not.toHaveBeenCalled();
    });

    it("deve buscar dreUuid e passar para EscolheUnidade quando visao é DRE", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("dre-uuid-123");
        render(<SuporteAsUnidades visao="DRE" />);
        expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledWith("associacao_selecionada.uuid");
        const escolhe = screen.getByTestId("escolhe-unidade");
        expect(escolhe).toHaveAttribute("data-dre-uuid", "dre-uuid-123");
    });

    it("deve exibir barra de mensagem quando feature flag teste-flag está ativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);
        render(<SuporteAsUnidades visao="UE" />);
        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("teste-flag");
        expect(barraMensagemCustom.BarraMensagemAcertoExterno).toHaveBeenCalledWith(
            "Feature flag teste-flag ativa."
        );
        expect(screen.getByTestId("barra-mensagem-feature-flag")).toBeInTheDocument();
    });

    it("não deve exibir barra de mensagem quando feature flag teste-flag está inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);
        render(<SuporteAsUnidades visao="UE" />);
        expect(screen.queryByTestId("barra-mensagem-feature-flag")).not.toBeInTheDocument();
    });

    it("deve iniciar com o modal de confirmação fechado", () => {
        render(<SuporteAsUnidades visao="UE" />);
        expect(screen.getByTestId("modal-confirma-inicio-suporte")).toHaveAttribute("data-show", "false");
    });

    it("deve abrir o modal e definir a unidade selecionada ao selecionar uma unidade", () => {
        render(<SuporteAsUnidades visao="UE" />);
        act(() => {
            capturedOnSelecionaUnidade({ nome: "Escola Teste", codigo_eol: "000123" });
        });
        expect(screen.getByTestId("modal-confirma-inicio-suporte")).toHaveAttribute("data-show", "true");
    });

    it("deve montar o texto de confirmação com o nome da unidade selecionada", () => {
        render(<SuporteAsUnidades visao="UE" />);
        act(() => {
            capturedOnSelecionaUnidade({ nome: "Escola Teste", codigo_eol: "000123" });
        });
        expect(capturedModalProps.texto).toContain("Escola Teste");
    });

    it("deve fechar o modal ao chamar handleNaoConfirmaSuporte", () => {
        render(<SuporteAsUnidades visao="UE" />);
        act(() => {
            capturedOnSelecionaUnidade({ nome: "Escola Teste", codigo_eol: "000123" });
        });
        expect(screen.getByTestId("modal-confirma-inicio-suporte")).toHaveAttribute("data-show", "true");
        act(() => {
            capturedModalProps.handleNaoConfirmaSuporte();
        });
        expect(screen.getByTestId("modal-confirma-inicio-suporte")).toHaveAttribute("data-show", "false");
    });

    it("deve chamar viabilizarAcessoSuporte, setar unidade e efetuar logout ao confirmar suporte", async () => {
        viabilizarAcessoSuporte.mockResolvedValue({});
        const unidadeSelecionada = {
            nome: "Escola Teste",
            codigo_eol: "000123",
            visao: "UE",
            uuid: "uuid-unidade",
            associacao_uuid: "uuid-associacao",
            associacao_nome: "Associacao Teste",
            tipo_unidade: "EMEI",
        };

        render(<SuporteAsUnidades visao="UE" />);
        act(() => {
            capturedOnSelecionaUnidade(unidadeSelecionada);
        });

        await act(async () => {
            await capturedModalProps.handleConfirmaSuporte();
        });

        expect(viabilizarAcessoSuporte).toHaveBeenCalledWith("user_teste", { codigo_eol: "000123" });
        expect(setarUnidadeProximoLoginAcessoSuporte).toHaveBeenCalledWith(
            "UE",
            "uuid-unidade",
            "uuid-associacao",
            "Associacao Teste",
            "EMEI",
            "Escola Teste"
        );
        expect(authService.logout).toHaveBeenCalled();
    });

    it("deve fechar o modal após confirmar suporte com sucesso", async () => {
        viabilizarAcessoSuporte.mockResolvedValue({});
        render(<SuporteAsUnidades visao="UE" />);
        act(() => {
            capturedOnSelecionaUnidade({ nome: "Escola Teste", codigo_eol: "000123", visao: "UE" });
        });

        await act(async () => {
            await capturedModalProps.handleConfirmaSuporte();
        });

        expect(screen.getByTestId("modal-confirma-inicio-suporte")).toHaveAttribute("data-show", "false");
    });

    it("deve logar erro no console quando viabilizarAcessoSuporte falhar", async () => {
        const erro = new Error("Falha ao viabilizar acesso");
        viabilizarAcessoSuporte.mockRejectedValue(erro);
        const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

        render(<SuporteAsUnidades visao="UE" />);
        act(() => {
            capturedOnSelecionaUnidade({ nome: "Escola Teste", codigo_eol: "000123", visao: "UE" });
        });

        await act(async () => {
            await capturedModalProps.handleConfirmaSuporte();
        });

        expect(consoleErrorSpy).toHaveBeenCalledWith("Erro ao viabilizar acesso de suporte.", erro);
        expect(authService.logout).not.toHaveBeenCalled();

        consoleErrorSpy.mockRestore();
    });
});
