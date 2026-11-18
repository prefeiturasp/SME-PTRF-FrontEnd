import React, {act} from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import ModalForm from "../ModalForm";

describe("ModalForm de Programa", () => {
    const mockOnSubmit = jest.fn();
    const mockOnHandleClose = jest.fn();
    const mockSetShowModalConfirmDelete = jest.fn();

    const stateCriacao = {nome: "", uuid: "", id: "", pode_ser_excluida: true, operacao: "create", open: true};
    const stateEdicao = {nome: "Qualidade", uuid: "uuid-1", id: 3, pode_ser_excluida: true, operacao: "edit", open: true};

    const renderModal = (props = {}) => render(
        <ModalForm
            show={true}
            stateFormModal={stateCriacao}
            onSubmit={mockOnSubmit}
            onHandleClose={mockOnHandleClose}
            setShowModalConfirmDelete={mockSetShowModalConfirmDelete}
            temPermissaoEdicao={true}
            {...props}
        />
    );

    beforeEach(() => jest.clearAllMocks());

    it("deve renderizar o modal de criação sem botão Excluir", () => {
        renderModal();

        expect(screen.getByText("Adicionar Programa")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
        expect(screen.queryByTestId("btn-excluir-programa")).not.toBeInTheDocument();
    });

    it("deve validar nome obrigatório", async () => {
        renderModal();

        fireEvent.change(screen.getByLabelText("Nome *"), { target: { value: "   " } });
        await act(async () => {
            fireEvent.click(screen.getByTestId("btn-salvar-programa"));
        });

        expect(await screen.findByText("Nome é obrigatório")).toBeInTheDocument();
        expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("deve submeter o nome informado", async () => {
        renderModal();

        fireEvent.change(screen.getByLabelText("Nome *"), { target: { value: "Novo Programa" } });
        await act(async () => {
            fireEvent.click(screen.getByTestId("btn-salvar-programa"));
        });

        await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
        expect(mockOnSubmit.mock.calls[0][0].nome).toBe("Novo Programa");
    });

    it("deve exibir edição com ID e permitir excluir programa sem vínculos", () => {
        renderModal({ stateFormModal: stateEdicao });

        expect(screen.getByText("Editar Programa")).toBeInTheDocument();
        expect(screen.getByLabelText("Nome *")).toHaveValue("Qualidade");
        expect(screen.getByText("3")).toBeInTheDocument();

        const btnExcluir = screen.getByTestId("btn-excluir-programa");
        expect(btnExcluir).toBeEnabled();
        fireEvent.click(btnExcluir);
        expect(mockSetShowModalConfirmDelete).toHaveBeenCalledWith(true);
    });

    it("deve manter Excluir habilitado mesmo quando o programa possui vínculos (validação ocorre no backend)", () => {
        renderModal({ stateFormModal: {...stateEdicao, pode_ser_excluida: false} });

        const btnExcluir = screen.getByTestId("btn-excluir-programa");
        expect(btnExcluir).toBeEnabled();
        fireEvent.click(btnExcluir);
        expect(mockSetShowModalConfirmDelete).toHaveBeenCalledWith(true);
    });

    it("deve desabilitar campos e botões sem permissão de edição", () => {
        renderModal({ stateFormModal: stateEdicao, temPermissaoEdicao: false });

        expect(screen.getByLabelText("Nome *")).toBeDisabled();
        expect(screen.getByTestId("btn-salvar-programa")).toBeDisabled();
        expect(screen.getByTestId("btn-excluir-programa")).toBeDisabled();
    });

    it("deve chamar onHandleClose ao cancelar", () => {
        renderModal();

        fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
        expect(mockOnHandleClose).toHaveBeenCalled();
    });
});
