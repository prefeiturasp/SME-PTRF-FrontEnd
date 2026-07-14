import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import {MembrosDaAssociacao} from "../index";
import {ExportaDadosAssociacaoContext} from "../../Associacao/ExportaDadosAssociacao/context/ExportaDadosAssociacao";

const mockRetornaMenuAtualizadoPorStatusCadastro = jest.fn();

jest.mock("../../Associacao/UrlsMenuInterno", () => ({
    UrlsMenuInterno: [{label: "Inicial"}],
    retornaMenuAtualizadoPorStatusCadastro: (...args) =>
        mockRetornaMenuAtualizadoPorStatusCadastro(...args),
}));

jest.mock("../../../Globais/MenuInterno", () => ({
    MenuInterno: ({caminhos_menu_interno}) => (
        <div data-testid="menu-interno">
            {JSON.stringify(caminhos_menu_interno)}
        </div>
    ),
}));

jest.mock("../pages/PaginaMandatoVigente", () => ({
    PaginaMandatoVigente: () => (
        <div data-testid="pagina-mandato-vigente">
            Página mandato vigente
        </div>
    ),
}));

jest.mock("../pages/PaginaMandatosAnteriores", () => ({
    PaginaMandatosAnteriores: () => (
        <div data-testid="pagina-mandatos-anteriores">
            Página mandatos anteriores
        </div>
    ),
}));

jest.mock("../../Associacao/ExportaDadosAssociacao", () => ({
    ExportaDadosDaAsssociacao: () => (
        <div data-testid="exporta-dados">
            Exportar dados
        </div>
    ),
}));

jest.mock("../context/MembrosDaAssociacao", () => ({
    MembrosDaAssociacaoProvider: ({children}) => <>{children}</>,
}));

const mockUseGetStatusCadastroAssociacao = jest.fn();

jest.mock("../hooks/useGetStatusCadastroAssociacao", () => ({
    useGetStatusCadastroAssociacao: () =>
        mockUseGetStatusCadastroAssociacao(),
}));

const mockUseGetMandatosAnteriores = jest.fn();

jest.mock("../hooks/useGetMandatosAnteriores", () => ({
    useGetMandatosAnteriores: () =>
        mockUseGetMandatosAnteriores(),
}));

describe("MembrosDaAssociacao", () => {

    const renderComponent = ({
        exibeComponent = true,
        countMandatos = 2,
        statusCadastro = {status: "COMPLETO"},
    } = {}) => {

        mockRetornaMenuAtualizadoPorStatusCadastro.mockReturnValue([
            {label: "Menu atualizado"},
        ]);

        mockUseGetStatusCadastroAssociacao.mockReturnValue({
            data_status_cadastro_associacao: statusCadastro,
        });

        mockUseGetMandatosAnteriores.mockReturnValue({
            count_mandatos_anteriores: countMandatos,
        });

        return render(
            <ExportaDadosAssociacaoContext.Provider
                value={{exibeComponent}}
            >
                <MembrosDaAssociacao/>
            </ExportaDadosAssociacaoContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar a aba de mandato vigente inicialmente", () => {
        renderComponent();

        expect(
            screen.getByTestId("pagina-mandato-vigente")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("pagina-mandatos-anteriores")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar o MenuInterno com o menu atualizado", () => {
        renderComponent();

        expect(
            mockRetornaMenuAtualizadoPorStatusCadastro
        ).toHaveBeenCalledWith({
            status: "COMPLETO",
        });

        expect(
            screen.getByTestId("menu-interno")
        ).toHaveTextContent("Menu atualizado");
    });

    it("deve renderizar ExportaDadosDaAsssociacao quando exibeComponent for true", () => {
        renderComponent({
            exibeComponent: true,
        });

        expect(
            screen.getByTestId("exporta-dados")
        ).toBeInTheDocument();
    });

    it("não deve renderizar ExportaDadosDaAsssociacao quando exibeComponent for false", () => {
        renderComponent({
            exibeComponent: false,
        });

        expect(
            screen.queryByTestId("exporta-dados")
        ).not.toBeInTheDocument();
    });

    it("deve renderizar botão de mandatos anteriores quando existir histórico", () => {
        renderComponent({
            countMandatos: 5,
        });

        expect(
            screen.getByRole("tab", {
                name: /mandatos anteriores/i,
            })
        ).toBeInTheDocument();
    });

    it("não deve renderizar botão de mandatos anteriores quando não existir histórico", () => {
        renderComponent({
            countMandatos: 0,
        });

        expect(
            screen.queryByRole("tab", {
                name: /mandatos anteriores/i,
            })
        ).not.toBeInTheDocument();
    });

    it("deve iniciar com o botão de mandato vigente desabilitado", () => {
        renderComponent();

        expect(
            screen.getByRole("tab", {
                name: /mandato vigente/i,
            })
        ).toBeDisabled();

        expect(
            screen.getByRole("tab", {
                name: /mandatos anteriores/i,
            })
        ).toBeEnabled();
    });

    it("deve alternar para a aba de mandatos anteriores ao clicar no botão", () => {
        renderComponent();

        fireEvent.click(
            screen.getByRole("tab", {
                name: /mandatos anteriores/i,
            })
        );

        expect(
            screen.queryByTestId("pagina-mandato-vigente")
        ).not.toBeInTheDocument();

        expect(
            screen.getByTestId("pagina-mandatos-anteriores")
        ).toBeInTheDocument();

        expect(
            screen.getByRole("tab", {
                name: /mandatos anteriores/i,
            })
        ).toBeDisabled();

        expect(
            screen.getByRole("tab", {
                name: /mandato vigente/i,
            })
        ).toBeEnabled();
    });

    it("deve voltar para a aba de mandato vigente ao clicar novamente", () => {
        renderComponent();

        fireEvent.click(
            screen.getByRole("tab", {
                name: /mandatos anteriores/i,
            })
        );

        fireEvent.click(
            screen.getByRole("tab", {
                name: /mandato vigente/i,
            })
        );

        expect(
            screen.getByTestId("pagina-mandato-vigente")
        ).toBeInTheDocument();

        expect(
            screen.queryByTestId("pagina-mandatos-anteriores")
        ).not.toBeInTheDocument();
    });

    it("não deve renderizar ExportaDadosDaAsssociacao após trocar para mandatos anteriores", () => {
        renderComponent({
            exibeComponent: true,
        });

        fireEvent.click(
            screen.getByRole("tab", {
                name: /mandatos anteriores/i,
            })
        );

        expect(
            screen.queryByTestId("exporta-dados")
        ).not.toBeInTheDocument();
    });
});