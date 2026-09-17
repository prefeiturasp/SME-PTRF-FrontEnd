import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ConfirmaDeleteTecnico } from "../ConfirmaDeleteTecnicoDialog";

const tecnicosList = [
    { uuid: "tec-1", nome: "Técnico Um" },
    { uuid: "tec-2", nome: "Técnico Dois" },
    { uuid: "tec-3", nome: "Técnico Três" },
];

const stateTecnicoForm = { uuid: "tec-1", nome: "Técnico Um", rf: "1234567" };

const baseProps = {
    show: true,
    onCancelDelete: jest.fn(),
    onConfirmDelete: jest.fn(),
    stateTecnicoForm,
    tecnicosList,
    stateSelectDeleteTecnico: "",
    stateCheckboxDeleteTecnico: false,
    handleChangeSelectDeleteTecnico: jest.fn(),
    handleChangeCheckboxDeleteTecnico: jest.fn(),
};

describe("ConfirmaDeleteTecnico", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não renderiza o corpo do modal quando show é false", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} show={false} />);
        expect(screen.queryByText(/prestes a excluir/i)).not.toBeInTheDocument();
    });

    it("exibe o nome e o RF do técnico a ser excluído", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} />);
        expect(screen.getByText(/Técnico Um — Registro Funcional: 1234567/)).toBeInTheDocument();
    });

    it("lista as opções de técnicos excluindo o próprio técnico a ser excluído", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} />);
        expect(screen.queryByText("Técnico Um")).not.toBeInTheDocument();
        expect(screen.getByText("Técnico Dois")).toBeInTheDocument();
        expect(screen.getByText("Técnico Três")).toBeInTheDocument();
    });

    it("não lista opções quando tecnicosList está vazia", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} tecnicosList={[]} />);
        expect(screen.getByRole("combobox")).toBeInTheDocument();
        expect(screen.queryByText("Técnico Dois")).not.toBeInTheDocument();
    });

    it("chama handleChangeSelectDeleteTecnico ao escolher um técnico substituto", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} />);
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "tec-2" } });
        expect(baseProps.handleChangeSelectDeleteTecnico).toHaveBeenCalledWith("tec-2");
    });

    it("usa o valor selecionado quando o checkbox não está marcado", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} stateSelectDeleteTecnico="tec-2" />);
        expect(screen.getByRole("combobox")).toHaveValue("tec-2");
    });

    it("ignora o valor selecionado quando o checkbox de não transferir está marcado", () => {
        render(
            <ConfirmaDeleteTecnico
                {...baseProps}
                stateSelectDeleteTecnico="tec-2"
                stateCheckboxDeleteTecnico={true}
            />
        );
        expect(screen.getByRole("combobox")).toHaveValue("");
    });

    it("chama handleChangeCheckboxDeleteTecnico ao marcar o checkbox", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} />);
        fireEvent.click(screen.getByLabelText(/Não transferir no momento/i));
        expect(baseProps.handleChangeCheckboxDeleteTecnico).toHaveBeenCalled();
    });

    it("chama onCancelDelete ao clicar em Cancelar", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(baseProps.onCancelDelete).toHaveBeenCalled();
    });

    it("chama onConfirmDelete ao clicar em Excluir", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} stateSelectDeleteTecnico="tec-2" />);
        fireEvent.click(screen.getByText("Excluir"));
        expect(baseProps.onConfirmDelete).toHaveBeenCalled();
    });

    it("desabilita o botão Excluir quando nenhuma opção foi definida", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} />);
        expect(screen.getByText("Excluir")).toBeDisabled();
    });

    it("habilita o botão Excluir quando um técnico substituto é selecionado", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} stateSelectDeleteTecnico="tec-2" />);
        expect(screen.getByText("Excluir")).toBeEnabled();
    });

    it("habilita o botão Excluir quando o checkbox de não transferir está marcado", () => {
        render(<ConfirmaDeleteTecnico {...baseProps} stateCheckboxDeleteTecnico={true} />);
        expect(screen.getByText("Excluir")).toBeEnabled();
    });
});
