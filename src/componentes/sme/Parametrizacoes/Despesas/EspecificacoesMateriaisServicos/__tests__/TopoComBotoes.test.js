import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopoComBotoes } from "../components/TopoComBotoes";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGetTabelas } from "../hooks/useGetTabelas";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const setShowModalForm = jest.fn();
const setStateFormModal = jest.fn();

const mockContextValue = {
    setShowModalForm,
    setStateFormModal,
};

describe("TopoComBotoes Componentes", () => {

    const renderComponent = () => {
        return render(
            <MateriaisServicosContext.Provider value={mockContextValue}>
                <TopoComBotoes />
            </MateriaisServicosContext.Provider>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("testa o botão adicionar quando há Permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        renderComponent();
        const adicionarBtn = screen.getByRole("button", { name: "+ Adicionar especificação"});
        expect(adicionarBtn).toBeInTheDocument();
        expect(adicionarBtn).toBeEnabled();

        fireEvent.click(adicionarBtn);

        expect(setShowModalForm).toHaveBeenCalledTimes(1);
        expect(setStateFormModal).toHaveBeenCalledTimes(1);
    });

    test("testa o botão adicionar quando NÃO há Permissão", () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
        renderComponent();
        const adicionarBtn = screen.getByRole("button", { name: "+ Adicionar especificação"});
        expect(adicionarBtn).toBeInTheDocument();
        expect(adicionarBtn).not.toBeEnabled();
    });

});
