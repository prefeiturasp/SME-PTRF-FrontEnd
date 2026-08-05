import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ButtonExcluirBemProduzido } from "../../components/ButtonExcluirBemProduzido";
import { useGetStatusDelecaoBemProduzido } from "../../hooks/useGetStatusDelecaoBemProduzido";

jest.mock("../../hooks/useGetStatusDelecaoBemProduzido");

const renderComponent = (uuid = "123", props = {}) => {
    const defaultProps = {
        handleDelete: jest.fn(),
        ...props
    };

    return {
        ...defaultProps,
        ...render(
            <MemoryRouter initialEntries={[`/bens/${uuid}`]}>
                <Routes>
                    <Route path="/bens/:uuid" element={<ButtonExcluirBemProduzido {...defaultProps} />} />
                </Routes>
            </MemoryRouter>
        )
    };
};

describe("ButtonExcluirBemProduzido", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não deve renderizar o botão quando o uuid não estiver presente", () => {
        useGetStatusDelecaoBemProduzido.mockReturnValue({
            error: null,
            isLoading: false,
            isError: false,
        });

        render(
            <MemoryRouter initialEntries={["/bens"]}>
                <Routes>
                    <Route path="/bens" element={<ButtonExcluirBemProduzido handleDelete={jest.fn()} />} />
                </Routes>
            </MemoryRouter>
        );

        const button = screen.queryByRole("button", { name: /excluir bem/i });
        expect(button).not.toBeInTheDocument();
    });

    it("deve renderizar o botão habilitado quando não estiver carregando e sem erros", () => {
        useGetStatusDelecaoBemProduzido.mockReturnValue({
            error: null,
            isLoading: false,
            isError: false,
        });

        renderComponent("123");

        const button = screen.getByRole("button", { name: /excluir bem/i });
        expect(button).toBeInTheDocument();
        expect(button).toBeEnabled();
    });

    it("deve desabilitar o botão e exibir tooltip de bloqueio quando estiver carregando", () => {
        useGetStatusDelecaoBemProduzido.mockReturnValue({
            error: null,
            isLoading: true,
            isError: false,
        });

        renderComponent("123");

        const button = screen.getByRole("button", { name: /excluir bem/i });
        expect(button).toBeDisabled();
    });

    it("deve desabilitar o botão quando houver erro na confirmação de status de deleção", () => {
        useGetStatusDelecaoBemProduzido.mockReturnValue({
            error: { response: { data: { titulo: "Item vinculado a outro registro" } } },
            isLoading: false,
            isError: true,
        });

        renderComponent("123");

        const button = screen.getByRole("button", { name: /excluir bem/i });
        expect(button).toBeDisabled();
    });

    it("deve chamar handleDelete ao clicar no botão de exclusão", () => {
        useGetStatusDelecaoBemProduzido.mockReturnValue({
            error: null,
            isLoading: false,
            isError: false,
        });

        const { handleDelete } = renderComponent("123");

        const button = screen.getByRole("button", { name: /excluir bem/i });
        fireEvent.click(button);

        expect(handleDelete).toHaveBeenCalledTimes(1);
    });
});
