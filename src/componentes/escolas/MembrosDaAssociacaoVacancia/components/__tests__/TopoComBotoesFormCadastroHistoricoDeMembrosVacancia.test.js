import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { TopoComBotoesFormCadastroHistoricoDeMembrosVacancia } from "../TopoComBotoesFormCadastroHistoricoDeMembrosVacancia";

import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";

jest.mock("../../../../../hooks/Globais/useDataTemplate");

jest.mock(
    "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros",
    () => ({
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros: jest.fn(() => true),
    })
);

describe("TopoComBotoesFormCadastroHistoricoDeMembrosVacancia", () => {
    const mockOnInformarSaida = jest.fn();
    const mockOnCancelarOcupante = jest.fn();
    const mockOnCancelarEntrada = jest.fn();

    const createDefaultProps = () => ({
        mandato: { data_inicial: "2024-01-01", data_final: "2024-12-31" },
        isValid: true,
        onInformarSaida: mockOnInformarSaida,
        ehEdicao: false,
        ocupanteVigente: false,
        podeCancelarSaida: false,
        onCancelarSaida: mockOnCancelarOcupante,
        podeCancelarEntrada: false,
        onCancelarEntrada: mockOnCancelarEntrada,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useDataTemplate.mockReturnValue((_, __, data) => data);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
    });

    const renderComponent = (props = {}) =>
        render(
            <MemoryRouter>
                <TopoComBotoesFormCadastroHistoricoDeMembrosVacancia
                    {...createDefaultProps()}
                    {...props}
                />
            </MemoryRouter>
        );

    describe("renderização", () => {
        it("deve renderizar título de adicionar membro quando ehEdicao for false", () => {
            renderComponent({ ehEdicao: false });

            expect(
                screen.getByRole("heading", { name: /adicionar membro/i })
            ).toBeInTheDocument();
        });

        it("deve renderizar título de editar membro quando ehEdicao for true", () => {
            renderComponent({ ehEdicao: true });

            expect(
                screen.getByRole("heading", { name: /editar membro/i })
            ).toBeInTheDocument();
        });

        it("deve exibir período do mandato", () => {
            renderComponent();

            expect(screen.getByText(/mandato:/i)).toBeInTheDocument();
            expect(screen.getByText(/2024-01-01 até 2024-12-31/i)).toBeInTheDocument();
        });

        it("não deve quebrar quando não houver mandato", () => {
            renderComponent({ mandato: undefined });

            expect(screen.getByText(/mandato:/i)).toBeInTheDocument();
        });

        it("deve renderizar link voltar", () => {
            renderComponent();

            const link = screen.getByRole("link", { name: /voltar/i });

            expect(link).toBeInTheDocument();
            expect(link).toHaveAttribute("href", "/membros-da-associacao");
        });
    });

    describe("botão informar saída", () => {
        it("deve exibir botão informar saída quando ehEdicao for true", () => {
            renderComponent({ ehEdicao: true, ocupanteVigente: true });

            expect(
                screen.getByRole("button", { name: /informar saída/i })
            ).toBeInTheDocument();
        });

        it("não deve exibir botão informar saída quando ehEdicao for false", () => {
            renderComponent({ ehEdicao: false });

            expect(
                screen.queryByRole("button", { name: /informar saída/i })
            ).not.toBeInTheDocument();
        });

        it("deve desabilitar informar saída quando o ocupante não for vigente", () => {
            renderComponent({ ehEdicao: true, ocupanteVigente: false });

            const botao = screen.getByRole("button", { name: /informar saída/i });
            expect(botao).toBeDisabled();
            expect(botao).toHaveAttribute("title", "Cargo não é vigente");
        });

        it("deve habilitar informar saída quando ocupante for vigente e usuário tiver permissão", () => {
            renderComponent({ ehEdicao: true, ocupanteVigente: true });

            const botao = screen.getByRole("button", { name: /informar saída/i });
            expect(botao).toBeEnabled();
            expect(botao).toHaveAttribute("title", "Informar Saída de membro");
        });

        it("deve executar callback ao clicar em informar saída", () => {
            renderComponent({ ehEdicao: true, ocupanteVigente: true });

            fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));

            expect(mockOnInformarSaida).toHaveBeenCalledTimes(1);
        });

        it("deve desabilitar informar saída quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent({ ehEdicao: true, ocupanteVigente: true });

            expect(
                screen.getByRole("button", { name: /informar saída/i })
            ).toBeDisabled();
        });
    });

    describe("botão cancelar entrada", () => {
        it("deve exibir botão cancelar entrada quando podeCancelarEntrada for true", () => {
            renderComponent({ podeCancelarEntrada: true });

            expect(
                screen.getByRole("button", { name: /cancelar entrada/i })
            ).toBeInTheDocument();
        });

        it("não deve exibir botão cancelar entrada quando podeCancelarEntrada for false", () => {
            renderComponent({ podeCancelarEntrada: false });

            expect(
                screen.queryByRole("button", { name: /cancelar entrada/i })
            ).not.toBeInTheDocument();
        });

        it("deve executar callback ao clicar em cancelar entrada", () => {
            renderComponent({ podeCancelarEntrada: true });

            fireEvent.click(screen.getByRole("button", { name: /cancelar entrada/i }));

            expect(mockOnCancelarEntrada).toHaveBeenCalledTimes(1);
        });

        it("deve desabilitar cancelar entrada quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent({ podeCancelarEntrada: true });

            expect(
                screen.getByRole("button", { name: /cancelar entrada/i })
            ).toBeDisabled();
        });
    });

    describe("botão cancelar saída (cancelar ocupante)", () => {
        it("deve exibir botão cancelar saída quando podeCancelarSaida for true", () => {
            renderComponent({ podeCancelarSaida: true });

            expect(
                screen.getByRole("button", { name: /cancelar saída/i })
            ).toBeInTheDocument();
        });

        it("não deve exibir botão cancelar saída quando podeCancelarSaida for false", () => {
            renderComponent({ podeCancelarSaida: false });

            expect(
                screen.queryByRole("button", { name: /cancelar saída/i })
            ).not.toBeInTheDocument();
        });

        it("deve executar callback ao clicar em cancelar saída", () => {
            renderComponent({ podeCancelarSaida: true });

            fireEvent.click(screen.getByRole("button", { name: /cancelar saída/i }));

            expect(mockOnCancelarOcupante).toHaveBeenCalledTimes(1);
        });

        it("deve desabilitar cancelar saída quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent({ podeCancelarSaida: true });

            expect(
                screen.getByRole("button", { name: /cancelar saída/i })
            ).toBeDisabled();
        });
    });

    describe("botão salvar", () => {
        it("deve habilitar salvar quando formulário válido e usuário com permissão", () => {
            renderComponent();

            expect(screen.getByRole("button", { name: /salvar/i })).toBeEnabled();
        });

        it("deve desabilitar salvar quando formulário for inválido", () => {
            renderComponent({ isValid: false });

            expect(screen.getByRole("button", { name: /salvar/i })).toBeDisabled();
        });

        it("deve desabilitar salvar quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent();

            expect(screen.getByRole("button", { name: /salvar/i })).toBeDisabled();
        });
    });
});
