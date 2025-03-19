import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";
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

    test("Deve renderizar o botão de adicionar motivo", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosRejeicaoContext.Provider>
        );

        expect(screen.getByText("+ Adicionar motivo")).toBeInTheDocument();
    });

    test("Deve estar habilitado quando tem permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosRejeicaoContext.Provider>
        );

        const button = screen.getByText("+ Adicionar motivo");
        expect(button).not.toBeDisabled();
    });

    test("Deve estar desabilitado quando não tem permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosRejeicaoContext.Provider>
        );

        const button = screen.getByText("+ Adicionar motivo");
        expect(button).toBeDisabled();
    });

    test("Deve chamar setStateFormModal e setShowModalForm ao clicar no botão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(
            <MotivosRejeicaoContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MotivosRejeicaoContext.Provider>
        );

        const button = screen.getByText("+ Adicionar motivo");
        fireEvent.click(button);

        expect(mockContextValue.setStateFormModal).toHaveBeenCalledWith(mockContextValue.initialStateFormModal);
        expect(mockContextValue.setShowModalForm).toHaveBeenCalledWith(true);
    });

});
