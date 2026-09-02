import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MembrosDaAssociacaoVacancia } from "../index";
import { useGetMandatosAnterioresVacancia } from "../hooks/useGetMandatosAnterioresVacancia";

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

jest.mock("../pages/PaginaMandatoVigenteVacancia", () => ({
    PaginaMandatoVigenteVacancia: () => (
        <div data-testid="pagina-mandato-vigente-vacancia" />
    ),
}));

jest.mock("../pages/PaginaMandatoAnteriorVacancia", () => ({
    PaginaMandatoAnteriorVacancia: () => (
        <div data-testid="pagina-mandato-anterior-vacancia" />
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
});
