import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SuporteAsUnidadesV2 } from "../SuporteAsUnidadesV2";

const mockMutate = jest.fn();

jest.mock("../useAdicionarSuporte", () => ({
    useAdicionarSuporte: () => ({
        mutationAdicionarSuporte: { mutate: mockMutate },
    }),
}));

jest.mock("react-redux", () => ({
    useDispatch: () => jest.fn(),
}));

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(),
        featureFlagAtiva: jest.fn(),
    },
}));

jest.mock("../../../../services/auth.service", () => ({
    getUsuarioLogado: jest.fn(() => ({ login: "user_teste" })),
}));

jest.mock("../../BarraMensagem", () => ({
    barraMensagemCustom: {
        BarraMensagemAcertoExterno: jest.fn(),
    },
}));

jest.mock("../../Modal/ModalConfirm", () => ({
    ModalConfirm: jest.fn(),
}));

jest.mock("../TextoExplicativoDaPagina", () => ({
    TextoExplicativo: ({ visao }) => <div data-testid="texto-explicativo" data-visao={visao} />,
}));

jest.mock("../components/UnidadesEmSuporte/ListaUnidadesEmSuporte", () => ({
    UnidadesEmSuporte: () => <div data-testid="unidades-em-suporte" />,
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

import { visoesService } from "../../../../services/visoes.service";
import { getUsuarioLogado } from "../../../../services/auth.service";
import { ModalConfirm } from "../../Modal/ModalConfirm";
import { barraMensagemCustom } from "../../BarraMensagem";

describe("SuporteAsUnidadesV2", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedOnSelecionaUnidade = null;
        visoesService.featureFlagAtiva.mockReturnValue(false);
        visoesService.getItemUsuarioLogado.mockReturnValue("");
        getUsuarioLogado.mockReturnValue({ login: "user_teste" });
        barraMensagemCustom.BarraMensagemAcertoExterno.mockReturnValue(
            <div data-testid="barra-mensagem-feature-flag" />
        );
    });

    it("deve renderizar TextoExplicativo com visao correta", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        const texto = screen.getByTestId("texto-explicativo");
        expect(texto).toBeInTheDocument();
        expect(texto).toHaveAttribute("data-visao", "UE");
    });

    it("deve renderizar UnidadesEmSuporte", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        expect(screen.getByTestId("unidades-em-suporte")).toBeInTheDocument();
    });

    it("deve renderizar o título de vincular unidades de suporte", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        expect(screen.getByText("Vincular unidades de suporte")).toBeInTheDocument();
    });

    it("deve renderizar EscolheUnidade com visao correta", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        const escolhe = screen.getByTestId("escolhe-unidade");
        expect(escolhe).toBeInTheDocument();
        expect(escolhe).toHaveAttribute("data-visao", "UE");
    });

    it("deve passar dre_uuid vazio para EscolheUnidade quando visao não é DRE", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        const escolhe = screen.getByTestId("escolhe-unidade");
        expect(escolhe).toHaveAttribute("data-dre-uuid", "");
        expect(visoesService.getItemUsuarioLogado).not.toHaveBeenCalled();
    });

    it("deve buscar dreUuid e passar para EscolheUnidade quando visao é DRE", () => {
        visoesService.getItemUsuarioLogado.mockReturnValue("dre-uuid-123");
        render(<SuporteAsUnidadesV2 visao="DRE" />);
        expect(visoesService.getItemUsuarioLogado).toHaveBeenCalledWith("associacao_selecionada.uuid");
        const escolhe = screen.getByTestId("escolhe-unidade");
        expect(escolhe).toHaveAttribute("data-dre-uuid", "dre-uuid-123");
    });

    it("deve exibir barra de mensagem quando feature flag teste-flag está ativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);
        render(<SuporteAsUnidadesV2 visao="UE" />);
        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("teste-flag");
        expect(barraMensagemCustom.BarraMensagemAcertoExterno).toHaveBeenCalledWith(
            "Feature flag teste-flag ativa."
        );
        expect(screen.getByTestId("barra-mensagem-feature-flag")).toBeInTheDocument();
    });

    it("não deve exibir barra de mensagem quando feature flag teste-flag está inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);
        render(<SuporteAsUnidadesV2 visao="UE" />);
        expect(screen.queryByTestId("barra-mensagem-feature-flag")).not.toBeInTheDocument();
    });

    it("deve chamar ModalConfirm ao selecionar unidade", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        capturedOnSelecionaUnidade({ nome: "Escola Teste PROFA.", codigo_eol: "000123" });
        expect(ModalConfirm).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Confirmação de acesso de suporte",
                cancelText: "Não",
                confirmText: "Sim",
                confirmButtonClass: "btn-danger",
                dataQa: "modal-confirmar-acesso-suporte",
            })
        );
    });

    it("deve incluir o nome da unidade na mensagem do modal", () => {
        render(<SuporteAsUnidadesV2 visao="UE" />);
        capturedOnSelecionaUnidade({ nome: "Escola Teste PROFA.", codigo_eol: "000123" });
        const chamada = ModalConfirm.mock.calls[0][0];
        expect(chamada.message).toContain("Escola Teste PROFA.");
    });

    it("deve chamar mutationAdicionarSuporte.mutate ao confirmar modal", () => {
        ModalConfirm.mockImplementationOnce(({ onConfirm }) => { onConfirm(); });
        render(<SuporteAsUnidadesV2 visao="UE" />);
        capturedOnSelecionaUnidade({ nome: "Escola Teste", codigo_eol: "000123" });
        expect(mockMutate).toHaveBeenCalledWith({
            usuario: "user_teste",
            payload: { codigo_eol: "000123" },
        });
    });

    it("deve usar login do usuário logado ao confirmar suporte", () => {
        getUsuarioLogado.mockReturnValue({ login: "outro_usuario" });
        ModalConfirm.mockImplementationOnce(({ onConfirm }) => { onConfirm(); });
        render(<SuporteAsUnidadesV2 visao="UE" />);
        capturedOnSelecionaUnidade({ nome: "Escola X", codigo_eol: "999" });
        expect(mockMutate).toHaveBeenCalledWith(
            expect.objectContaining({ usuario: "outro_usuario" })
        );
    });
});
