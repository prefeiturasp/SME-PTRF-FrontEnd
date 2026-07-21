import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ReceitasPrevistasOutrosRecursos from "../ReceitasPrevistasOutrosRecursos";

jest.mock("../style.css", () => ({}));

jest.mock("../OutrosRecursosModalForm", () => {
    return function MockOutrosRecursosModalForm({ open, data, onClose }) {
        return (
            <div data-testid="modal-form-outros-recursos">
                <span>{`Modal Open: ${open}`}</span>
                <span>{`Modal Data: ${JSON.stringify(data)}`}</span>
                <button onClick={() => onClose()}>Fechar Modal</button>
            </div>
        );
    };
});

jest.mock("../TabelaOutrosRecursos", () => {
    return function MockTabelaOutrosRecursos({ setActiveTab, handleOpenEditar }) {
        return (
            <div data-testid="tabela-outros-recursos">
                <button onClick={() => setActiveTab()}>Ativar Tab</button>
                <button onClick={() => handleOpenEditar({ id: 1, nome: "Recurso Teste" })}>
                    Editar Recurso
                </button>
            </div>
        );
    };
});

describe("ReceitasPrevistasOutrosRecursos", () => {
    const renderComponent = (props = {}) => {
        const user = userEvent.setup();
        const result = render(<ReceitasPrevistasOutrosRecursos {...props} />);
        return { user, ...result };
    };

    it("deve renderizar o título e a tabela de outros recursos inicialmente sem o modal", () => {
        renderComponent();

        expect(
            screen.getByRole("heading", { name: /outros recursos/i, level: 4 })
        ).toBeInTheDocument();
        expect(screen.getByTestId("tabela-outros-recursos")).toBeInTheDocument();
        expect(
            screen.queryByTestId("modal-form-outros-recursos")
        ).not.toBeInTheDocument();
    });

    it("deve abrir o modal com os dados corretos ao acionar a edição na tabela", async () => {
        const { user } = renderComponent();

        const botaoEditar = screen.getByRole("button", { name: /editar recurso/i });
        await user.click(botaoEditar);

        expect(screen.getByTestId("modal-form-outros-recursos")).toBeInTheDocument();
        expect(screen.getByText("Modal Open: true")).toBeInTheDocument();
        expect(
            screen.getByText('Modal Data: {"id":1,"nome":"Recurso Teste"}')
        ).toBeInTheDocument();
    });

    it("deve fechar o modal quando o callback onClose for disparado", async () => {
        const { user } = renderComponent();

        const botaoEditar = screen.getByRole("button", { name: /editar recurso/i });
        await user.click(botaoEditar);

        expect(screen.getByTestId("modal-form-outros-recursos")).toBeInTheDocument();

        const botaoFechar = screen.getByRole("button", { name: /fechar modal/i });
        await user.click(botaoFechar);

        expect(
            screen.queryByTestId("modal-form-outros-recursos")
        ).not.toBeInTheDocument();
    });

    it("deve chamar setActiveTab com a constante 'outros-recursos' quando a tabela solicitar", async () => {
        const setActiveTabMock = jest.fn();
        const { user } = renderComponent({ setActiveTab: setActiveTabMock });

        const botaoAtivarTab = screen.getByRole("button", { name: /ativar tab/i });
        await user.click(botaoAtivarTab);

        expect(setActiveTabMock).toHaveBeenCalledTimes(1);
        expect(setActiveTabMock).toHaveBeenCalledWith("outros-recursos");
    });

    it("não deve disparar erro caso setActiveTab não seja fornecido como prop", async () => {
        const { user } = renderComponent();

        const botaoAtivarTab = screen.getByRole("button", { name: /ativar tab/i });

        await expect(user.click(botaoAtivarTab)).resolves.not.toThrow();
    });
});