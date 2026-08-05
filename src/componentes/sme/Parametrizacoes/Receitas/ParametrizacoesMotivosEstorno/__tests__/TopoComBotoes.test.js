import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../hooks/useMotivosEstornoContext");
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext");
jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));
jest.mock("../../../../../Globais/UI/Button", () => ({
    IconButton: ({ label, onClick, disabled }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            data-testid="botao-adicionar-motivo-estorno"
        >
            {label}
        </button>
    ),
}));

const selectedRecurso = {
    uuid: "recurso-1",
    nome: "PTRF",
    nome_exibicao: "Programa de Transferencia de Recursos Financeiros",
};

describe("TopoComBotoes", () => {
    const handleOpenCreateModal = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        useAbasPorRecursoContext.mockReturnValue({
            selectedRecurso,
        });
        useMotivosEstornoContext.mockReturnValue({
            handleOpenCreateModal,
        });
    });

    it("deve renderizar as informacoes do recurso selecionado e o botao de adicionar", () => {
        render(<TopoComBotoes />);

        expect(screen.getByText("PTRF")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Confira abaixo os motivos de estorno do Programa de Transferencia de Recursos Financeiros.",
            ),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "Adicionar motivo de estorno",
            }),
        ).toBeEnabled();
    });

    it("deve abrir o modal de criacao com o recurso selecionado ao clicar no botao", () => {
        render(<TopoComBotoes />);

        fireEvent.click(screen.getByTestId("botao-adicionar-motivo-estorno"));

        expect(handleOpenCreateModal).toHaveBeenCalledTimes(1);
        expect(handleOpenCreateModal).toHaveBeenCalledWith(selectedRecurso);
    });

    it("deve desabilitar o botao quando usuario nao tem permissao", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

        render(<TopoComBotoes />);

        expect(screen.getByTestId("botao-adicionar-motivo-estorno")).toBeDisabled();
    });
});
