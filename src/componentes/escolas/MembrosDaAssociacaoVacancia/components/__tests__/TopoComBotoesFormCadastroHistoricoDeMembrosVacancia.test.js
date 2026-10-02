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

    const createDefaultCargo = () => ({
        cargo_vago: true,
        ocupante_vigente: false,
        pode_cancelar_saida: false,
        pode_cancelar_entrada: false,
    });

    const createDefaultProps = () => ({
        cargo: createDefaultCargo(),
        mandato: { data_inicial: "2024-01-01", data_final: "2024-12-31" },
        isValid: true,
        onInformarSaida: mockOnInformarSaida,
        onCancelarSaida: mockOnCancelarOcupante,
        onCancelarEntrada: mockOnCancelarEntrada,
    });

    beforeEach(() => {
        jest.clearAllMocks();
        useDataTemplate.mockReturnValue((_, __, data) => data);
        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
    });

    const renderComponent = ({ cargo = {}, ...props } = {}) =>
        render(
            <MemoryRouter>
                <TopoComBotoesFormCadastroHistoricoDeMembrosVacancia
                    {...createDefaultProps()}
                    {...props}
                    cargo={{ ...createDefaultCargo(), ...cargo }}
                />
            </MemoryRouter>
        );

    describe("renderização", () => {
        it("deve renderizar título de adicionar membro quando cargo_vago for true", () => {
            renderComponent({ cargo: { cargo_vago: true } });

            expect(
                screen.getByRole("heading", { name: /adicionar membro/i })
            ).toBeInTheDocument();
        });

        it("deve renderizar título de editar membro quando cargo_vago for false", () => {
            renderComponent({ cargo: { cargo_vago: false } });

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
        it("deve exibir botão informar saída quando cargo_vago for false", () => {
            renderComponent({ cargo: { cargo_vago: false, ocupante_vigente: true } });

            expect(
                screen.getByRole("button", { name: /informar saída/i })
            ).toBeInTheDocument();
        });

        it("não deve exibir botão informar saída quando cargo_vago for true", () => {
            renderComponent({ cargo: { cargo_vago: true } });

            expect(
                screen.queryByRole("button", { name: /informar saída/i })
            ).not.toBeInTheDocument();
        });

        it("deve desabilitar informar saída quando o ocupante não for vigente", () => {
            renderComponent({ cargo: { cargo_vago: false, ocupante_vigente: false } });

            const botao = screen.getByRole("button", { name: /informar saída/i });
            expect(botao).toBeDisabled();
            expect(botao).toHaveAttribute("title", "Cargo não é vigente");
        });

        it("deve habilitar informar saída quando ocupante for vigente e usuário tiver permissão", () => {
            renderComponent({ cargo: { cargo_vago: false, ocupante_vigente: true } });

            const botao = screen.getByRole("button", { name: /informar saída/i });
            expect(botao).toBeEnabled();
            expect(botao).toHaveAttribute("title", "Informar Saída de membro");
        });

        it("deve executar callback ao clicar em informar saída", () => {
            renderComponent({ cargo: { cargo_vago: false, ocupante_vigente: true } });

            fireEvent.click(screen.getByRole("button", { name: /informar saída/i }));

            expect(mockOnInformarSaida).toHaveBeenCalledTimes(1);
        });

        it("deve desabilitar informar saída quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent({ cargo: { cargo_vago: false, ocupante_vigente: true } });

            expect(
                screen.getByRole("button", { name: /informar saída/i })
            ).toBeDisabled();
        });
    });

    describe("botão cancelar entrada", () => {
        it("deve exibir botão cancelar entrada quando pode_cancelar_entrada for true", () => {
            renderComponent({ cargo: { pode_cancelar_entrada: true } });

            expect(
                screen.getByRole("button", { name: /cancelar entrada/i })
            ).toBeInTheDocument();
        });

        it("não deve exibir botão cancelar entrada quando pode_cancelar_entrada for false", () => {
            renderComponent({ cargo: { pode_cancelar_entrada: false } });

            expect(
                screen.queryByRole("button", { name: /cancelar entrada/i })
            ).not.toBeInTheDocument();
        });

        it("deve executar callback ao clicar em cancelar entrada", () => {
            renderComponent({ cargo: { pode_cancelar_entrada: true } });

            fireEvent.click(screen.getByRole("button", { name: /cancelar entrada/i }));

            expect(mockOnCancelarEntrada).toHaveBeenCalledTimes(1);
        });

        it("deve desabilitar cancelar entrada quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent({ cargo: { pode_cancelar_entrada: true } });

            expect(
                screen.getByRole("button", { name: /cancelar entrada/i })
            ).toBeDisabled();
        });
    });

    describe("botão cancelar saída (cancelar ocupante)", () => {
        it("deve exibir botão cancelar saída quando pode_cancelar_saida for true", () => {
            renderComponent({ cargo: { pode_cancelar_saida: true } });

            expect(
                screen.getByRole("button", { name: /cancelar saída/i })
            ).toBeInTheDocument();
        });

        it("não deve exibir botão cancelar saída quando pode_cancelar_saida for false", () => {
            renderComponent({ cargo: { pode_cancelar_saida: false } });

            expect(
                screen.queryByRole("button", { name: /cancelar saída/i })
            ).not.toBeInTheDocument();
        });

        it("deve executar callback ao clicar em cancelar saída", () => {
            renderComponent({ cargo: { pode_cancelar_saida: true } });

            fireEvent.click(screen.getByRole("button", { name: /cancelar saída/i }));

            expect(mockOnCancelarOcupante).toHaveBeenCalledTimes(1);
        });

        it("deve desabilitar cancelar saída quando usuário não possuir permissão", () => {
            RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

            renderComponent({ cargo: { pode_cancelar_saida: true } });

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
