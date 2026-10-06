import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MembrosDaAssociacaoVacancia } from "../index";
import { useGetMandatosAnterioresVacancia } from "../hooks/useGetMandatosAnterioresVacancia";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        featureFlagAtiva: jest.fn(),
    },
}));

const mockRetornaMenuAtualizadoPorStatusCadastro = jest.fn();

jest.mock("../../Associacao/UrlsMenuInterno", () => ({
    UrlsMenuInterno: [{ label: "Inicial" }],
    retornaMenuAtualizadoPorStatusCadastro: (...args) =>
        mockRetornaMenuAtualizadoPorStatusCadastro(...args),
}));

jest.mock("../../../Globais/MenuInterno", () => ({
    MenuInterno: ({ caminhos_menu_interno }) => (
        <div data-testid="menu-interno">
            {JSON.stringify(caminhos_menu_interno)}
        </div>
    ),
}));

jest.mock("../hooks/useGetStatusCadastroAssociacao", () => ({
    useGetStatusCadastroAssociacao: () => mockUseGetStatusCadastroAssociacao(),
}));

const mockUseGetStatusCadastroAssociacao = jest.fn();

jest.mock("../hooks/useGetMandatosAnterioresVacancia");

jest.mock("../../Associacao/ExportaDadosAssociacao", () => ({
    ExportaDadosDaAsssociacao: () => (
        <div>Exportar dados da associação</div>
    ),
}));

jest.mock("../pages/PaginaMandatoVigenteVacancia", () => ({
    PaginaMandatoVigenteVacancia: ({ onComposicaoAtualChange }) => {
        const React = require("react");
        React.useEffect(() => {
            onComposicaoAtualChange?.(true);
        }, [onComposicaoAtualChange]);
        return (
            <div data-testid="pagina-mandato-vigente-vacancia">
                <button type="button" onClick={() => onComposicaoAtualChange?.(false)}>
                    ver composicao anterior
                </button>
            </div>
        );
    },
}));

jest.mock("../pages/PaginaMandatoAnteriorVacancia", () => ({
    PaginaMandatoAnteriorVacancia: () => (
        <div data-testid="pagina-mandato-anterior-vacancia" />
    ),
}));

jest.mock("../components/FiqueDeOlhoMembroAssociação", () => ({
    FiqueDeOlhoMembroAssociacao: () => (
        <div data-testid="fique-de-olho-membro-associacao" />
    ),
}));

describe("MembrosDaAssociacaoVacancia", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseGetStatusCadastroAssociacao.mockReturnValue({
            data_status_cadastro_associacao: { status: "COMPLETO" },
        });
        mockRetornaMenuAtualizadoPorStatusCadastro.mockReturnValue([
            { label: "Menu atualizado" },
        ]);
        useGetMandatosAnterioresVacancia.mockReturnValue({ data: [] });
        visoesService.featureFlagAtiva.mockReturnValue(false);
    });

    it("deve renderizar o FiqueDeOlhoMembroAssociacao quando a flag historico-de-membros-v2 estiver ativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(true);

        render(<MembrosDaAssociacaoVacancia />);

        expect(visoesService.featureFlagAtiva).toHaveBeenCalledWith("historico-de-membros-v2");
        expect(screen.getByTestId("fique-de-olho-membro-associacao")).toBeInTheDocument();
    });

    it("não deve renderizar o FiqueDeOlhoMembroAssociacao quando a flag historico-de-membros-v2 estiver inativa", () => {
        visoesService.featureFlagAtiva.mockReturnValue(false);

        render(<MembrosDaAssociacaoVacancia />);

        expect(screen.queryByTestId("fique-de-olho-membro-associacao")).not.toBeInTheDocument();
    });

    it("deve renderizar o MenuInterno com o menu atualizado", () => {
        render(<MembrosDaAssociacaoVacancia />);

        expect(mockRetornaMenuAtualizadoPorStatusCadastro).toHaveBeenCalledWith({
            status: "COMPLETO",
        });
        expect(screen.getByTestId("menu-interno")).toHaveTextContent("Menu atualizado");
    });

    it("deve renderizar a página de mandato vigente (v2) por padrão", () => {
        render(<MembrosDaAssociacaoVacancia />);

        expect(screen.getByTestId("pagina-mandato-vigente-vacancia")).toBeInTheDocument();
    });

    it("não deve exibir a aba de mandatos anteriores quando não houver mandatos anteriores", () => {
        useGetMandatosAnterioresVacancia.mockReturnValue({ data: [] });

        render(<MembrosDaAssociacaoVacancia />);

        expect(screen.queryByText("Mandatos anteriores")).not.toBeInTheDocument();
    });

    it("deve exibir a aba de mandatos anteriores quando houver mandatos anteriores", () => {
        useGetMandatosAnterioresVacancia.mockReturnValue({ data: [{ uuid: "mandato-1" }] });

        render(<MembrosDaAssociacaoVacancia />);

        expect(screen.getByText("Mandatos anteriores")).toBeInTheDocument();
    });

    it("deve alternar para a página de mandatos anteriores ao clicar na aba", () => {
        useGetMandatosAnterioresVacancia.mockReturnValue({ data: [{ uuid: "mandato-1" }] });

        render(<MembrosDaAssociacaoVacancia />);

        expect(screen.queryByTestId("pagina-mandato-anterior-vacancia")).not.toBeInTheDocument();

        fireEvent.click(screen.getByText("Mandatos anteriores"));

        expect(screen.getByTestId("pagina-mandato-anterior-vacancia")).toBeInTheDocument();
        expect(screen.queryByTestId("pagina-mandato-vigente-vacancia")).not.toBeInTheDocument();
    });

    it("deve exibir a exportação na composição atual do mandato vigente", () => {
        render(<MembrosDaAssociacaoVacancia />);

        expect(screen.getByText("Exportar dados da associação")).toBeInTheDocument();
    });

    it("não deve exibir a exportação nas demais composições do mandato vigente", () => {
        render(<MembrosDaAssociacaoVacancia />);

        fireEvent.click(screen.getByText("ver composicao anterior"));

        expect(screen.queryByText("Exportar dados da associação")).not.toBeInTheDocument();
    });

    it("não deve exibir a exportação nos mandatos anteriores", () => {
        useGetMandatosAnterioresVacancia.mockReturnValue({ data: [{ uuid: "mandato-1" }] });

        render(<MembrosDaAssociacaoVacancia />);

        fireEvent.click(screen.getByText("Mandatos anteriores"));

        expect(screen.queryByText("Exportar dados da associação")).not.toBeInTheDocument();
    });
});
