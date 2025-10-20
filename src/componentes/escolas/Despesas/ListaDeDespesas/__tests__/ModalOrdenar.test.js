import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalOrdenar } from "../ModalOrdenar";

jest.mock("../../../../Globais/ModalBootstrap", () => ({
    ModalFormBodyText: ({ show, titulo, bodyText, onHide }) => 
        show ? (
            <div>
                <h2>{titulo}</h2>
                <div>{bodyText}</div>
                <button onClick={onHide}>Close</button>
            </div>
        ) : null
}));

describe("ModalOrdenar", () => {
    let mockProps;

    beforeEach(() => {
        mockProps = {
            showModalOrdenar: true,
            setShowModalOrdenar: jest.fn(),
            camposOrdenacao: {
                ordenar_por_numero_do_documento: "",
                ordenar_por_data_especificacao: "",
                ordenar_por_valor: "",
                ordenar_por_imposto: false
            },
            handleChangeOrdenacao: jest.fn(),
            onSubmitOrdenar: jest.fn()
        };
    });

    it("renderiza o modal quando showModalOrdenar é true", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        expect(screen.getByText("Ordenar por")).toBeInTheDocument();
        expect(screen.getByLabelText("Nº do documento")).toBeInTheDocument();
        expect(screen.getByLabelText("Data da Especif. do material ou serviço")).toBeInTheDocument();
        expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    });

    it("não renderiza o modal quando showModalOrdenar é false", () => {
        mockProps.showModalOrdenar = false;
        render(<ModalOrdenar {...mockProps} />);
        
        expect(screen.queryByText("Ordenar por")).not.toBeInTheDocument();
    });

    it("chama handleChangeOrdenacao ao mudar select", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const select = screen.getByLabelText("Nº do documento");
        fireEvent.change(select, { target: { name: "ordenar_por_numero_do_documento", value: "crescente" } });
        
        expect(mockProps.handleChangeOrdenacao).toHaveBeenCalledWith("ordenar_por_numero_do_documento", "crescente");
    });

    it("chama handleChangeOrdenacao ao marcar checkbox", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const checkbox = screen.getByLabelText("Ordenar com imposto vinculados às despesas");
        fireEvent.click(checkbox);
        
        expect(mockProps.handleChangeOrdenacao).toHaveBeenCalled();
    });

    it("chama onSubmitOrdenar ao clicar em Ordenar", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const btnOrdenar = screen.getByText("Ordenar");
        fireEvent.click(btnOrdenar);
        
        expect(mockProps.onSubmitOrdenar).toHaveBeenCalled();
    });

    it("chama setShowModalOrdenar ao clicar em Cancelar", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const btnCancelar = screen.getByText("Cancelar");
        fireEvent.click(btnCancelar);
        
        expect(mockProps.setShowModalOrdenar).toHaveBeenCalledWith(false);
    });

    it("chama handleChangeOrdenacao ao mudar ordenar por data", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const select = screen.getByLabelText("Data da Especif. do material ou serviço");
        fireEvent.change(select, { target: { name: "ordenar_por_data_especificacao", value: "decrescente" } });
        
        expect(mockProps.handleChangeOrdenacao).toHaveBeenCalledWith("ordenar_por_data_especificacao", "decrescente");
    });

    it("chama handleChangeOrdenacao ao mudar ordenar por valor", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const select = screen.getByLabelText("Valor");
        fireEvent.change(select, { target: { name: "ordenar_por_valor", value: "crescente" } });
        
        expect(mockProps.handleChangeOrdenacao).toHaveBeenCalledWith("ordenar_por_valor", "crescente");
    });

    it("renderiza com valores preenchidos nos selects", () => {
        mockProps.camposOrdenacao = {
            ordenar_por_numero_do_documento: "crescente",
            ordenar_por_data_especificacao: "decrescente",
            ordenar_por_valor: "crescente",
            ordenar_por_imposto: true
        };
        
        render(<ModalOrdenar {...mockProps} />);
        
        expect(screen.getByLabelText("Nº do documento")).toHaveValue("crescente");
        expect(screen.getByLabelText("Data da Especif. do material ou serviço")).toHaveValue("decrescente");
        expect(screen.getByLabelText("Valor")).toHaveValue("crescente");
        expect(screen.getByLabelText("Ordenar com imposto vinculados às despesas")).toBeChecked();
    });

    it("fecha o modal ao clicar no botão Close", () => {
        render(<ModalOrdenar {...mockProps} />);
        
        const btnClose = screen.getByText("Close");
        fireEvent.click(btnClose);
        
        expect(mockProps.setShowModalOrdenar).toHaveBeenCalledWith(false);
    });
});

