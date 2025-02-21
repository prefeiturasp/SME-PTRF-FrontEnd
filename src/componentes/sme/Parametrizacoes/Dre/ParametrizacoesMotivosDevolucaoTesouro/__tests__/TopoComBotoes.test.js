import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import React from "react";

const mockContextValue = {
    setShowModalForm: jest.fn(),
    setStateFormModal: jest.fn(),
    initialStateFormModal: {},
};

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

describe("TopoComBotoes Component", () => {

    test("Deve renderizar o botão de adicionar motivo de devolução", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        expect(screen.getByText("+ Adicionar motivo de devolução ao tesouro")).toBeInTheDocument();
    });

    test("Deve estar habilitado quando tem permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const button = screen.getByText("+ Adicionar motivo de devolução ao tesouro");
        expect(button).not.toBeDisabled();
    });

    test("Deve estar desabilitado quando não tem permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const button = screen.getByText("+ Adicionar motivo de devolução ao tesouro");
        expect(button).toBeDisabled();
    });

    test("Deve chamar setStateFormModal e setShowModalForm ao clicar no botão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <MotivosDevolucaoTesouroContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosDevolucaoTesouroContext.Provider>
        );

        const button = screen.getByText("+ Adicionar motivo de devolução ao tesouro");
        fireEvent.click(button);

        expect(mockContextValue.setStateFormModal).toHaveBeenCalledWith(mockContextValue.initialStateFormModal);
        expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(true);
    });

});
