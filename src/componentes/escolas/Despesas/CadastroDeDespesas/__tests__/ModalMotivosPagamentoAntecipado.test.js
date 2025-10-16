import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalMotivosPagamentoAntecipado from "../ModalMotivosPagamentoAntecipado";

jest.mock("../../../../Globais/ModalBootstrap", () => ({
    ModalFormBodyText: ({ show, titulo, bodyText, onHide }) => (
        show ? (
            <div data-testid="modal-form-body-text">
                <h1>{titulo}</h1>
                <div>{bodyText}</div>
            </div>
        ) : null
    ),
}));

jest.mock("primereact/multiselect", () => ({
    MultiSelect: ({ value, options, onChange, placeholder, optionLabel, selectedItemsLabel }) => (
        <div data-testid="multiselect">
            <div data-testid="multiselect-selected-label">{selectedItemsLabel}</div>
            <select
                data-testid="multiselect-select"
                multiple
                value={value ? value.map(v => v.id) : []}
                onChange={(e) => {
                    const selectedIds = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    const selectedItems = options.filter(opt => selectedIds.includes(opt.id));
                    onChange({ value: selectedItems });
                }}
            >
                <option value="" disabled>{placeholder}</option>
                {options && options.map(option => (
                    <option key={option.id} value={option.id}>
                        {option[optionLabel]}
                    </option>
                ))}
            </select>
        </div>
    ),
}));

describe("ModalMotivosPagamentoAntecipado", () => {
    const mockMotivos = [
        { id: "1", motivo: "Urgência no pagamento" },
        { id: "2", motivo: "Desconto no pagamento antecipado" },
        { id: "3", motivo: "Necessidade de fluxo de caixa" },
    ];

    const defaultProps = {
        show: true,
        handleClose: jest.fn(),
        listaDemotivosPagamentoAntecipado: mockMotivos,
        selectMotivosPagamentoAntecipado: [],
        setSelectMotivosPagamentoAntecipado: jest.fn(),
        checkBoxOutrosMotivosPagamentoAntecipado: false,
        txtOutrosMotivosPagamentoAntecipado: "",
        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado: jest.fn(),
        handleChangeTxtOutrosMotivosPagamentoAntecipado: jest.fn(),
        onSalvarMotivosAntecipadosTrue: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renderiza o modal quando show é true", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        expect(screen.getByTestId("modal-form-body-text")).toBeInTheDocument();
        expect(screen.getByText("Motivos de pagamento antecipado")).toBeInTheDocument();
    });

    it("não renderiza o modal quando show é false", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} show={false} />);

        expect(screen.queryByTestId("modal-form-body-text")).not.toBeInTheDocument();
    });

    it("exibe a mensagem de confirmação corretamente", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        expect(screen.getByText("A data do documento é posterior à data cadastrada para o pagamento. Confirma o lançamento?")).toBeInTheDocument();
    });

    it("renderiza o MultiSelect com placeholder correto", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        expect(screen.getByText("Selecione o(s) motivo(s)")).toBeInTheDocument();
    });

    it("chama setSelectMotivosPagamentoAntecipado ao selecionar um motivo", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const select = screen.getByTestId("multiselect-select");
        
        // Simula a seleção criando options mockadas
        Object.defineProperty(select, 'selectedOptions', {
            value: [{ value: "1" }],
            writable: true
        });
        
        fireEvent.change(select);

        expect(defaultProps.setSelectMotivosPagamentoAntecipado).toHaveBeenCalledWith([mockMotivos[0]]);
    });

    it("exibe label '1 selecionado' quando um motivo está selecionado", () => {
        const propsComUmMotivo = {
            ...defaultProps,
            selectMotivosPagamentoAntecipado: [mockMotivos[0]],
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComUmMotivo} />);

        expect(screen.getByTestId("multiselect-selected-label")).toHaveTextContent("1 selecionado");
    });

    it("exibe label 'X selecionados' quando múltiplos motivos estão selecionados", () => {
        const propsComVariosMotivos = {
            ...defaultProps,
            selectMotivosPagamentoAntecipado: [mockMotivos[0], mockMotivos[1]],
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComVariosMotivos} />);

        expect(screen.getByTestId("multiselect-selected-label")).toHaveTextContent("2 selecionados");
    });

    it("exibe a lista de motivos selecionados", () => {
        const propsComMotivos = {
            ...defaultProps,
            selectMotivosPagamentoAntecipado: [mockMotivos[0], mockMotivos[1]],
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComMotivos} />);

        expect(screen.getByText(/1\. Urgência no pagamento/)).toBeInTheDocument();
        expect(screen.getByText(/2\. Desconto no pagamento antecipado/)).toBeInTheDocument();
    });

    it("renderiza o checkbox 'Outros motivos'", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const checkbox = screen.getByLabelText("Outros motivos");
        expect(checkbox).toBeInTheDocument();
        expect(checkbox).not.toBeChecked();
    });

    it("chama handleChangeCheckBoxOutrosMotivosPagamentoAntecipado ao marcar o checkbox", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const checkbox = screen.getByLabelText("Outros motivos");
        fireEvent.click(checkbox);

        expect(defaultProps.handleChangeCheckBoxOutrosMotivosPagamentoAntecipado).toHaveBeenCalled();
    });

    it("exibe o textarea quando checkbox 'Outros motivos' está marcado", () => {
        const propsComCheckbox = {
            ...defaultProps,
            checkBoxOutrosMotivosPagamentoAntecipado: true,
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComCheckbox} />);

        const textarea = screen.getByRole("textbox", { name: "" });
        expect(textarea).toBeInTheDocument();
    });

    it("não exibe o textarea quando checkbox 'Outros motivos' está desmarcado", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const textarea = screen.queryByRole("textbox", { name: "" });
        expect(textarea).not.toBeInTheDocument();
    });

    it("chama handleChangeTxtOutrosMotivosPagamentoAntecipado ao digitar no textarea", () => {
        const propsComCheckbox = {
            ...defaultProps,
            checkBoxOutrosMotivosPagamentoAntecipado: true,
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComCheckbox} />);

        const textarea = screen.getByRole("textbox", { name: "" });
        fireEvent.change(textarea, { target: { value: "Outro motivo qualquer" } });

        expect(defaultProps.handleChangeTxtOutrosMotivosPagamentoAntecipado).toHaveBeenCalled();
    });

    it("renderiza os botões Cancelar e Confirmar", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        expect(screen.getByText("Cancelar")).toBeInTheDocument();
        expect(screen.getByText("Confirmar")).toBeInTheDocument();
    });

    it("chama handleClose ao clicar no botão Cancelar", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const botaoCancelar = screen.getByText("Cancelar");
        fireEvent.click(botaoCancelar);

        expect(defaultProps.handleClose).toHaveBeenCalledTimes(1);
    });

    it("chama onSalvarMotivosAntecipadosTrue ao clicar no botão Confirmar", () => {
        const propsComMotivos = {
            ...defaultProps,
            selectMotivosPagamentoAntecipado: [mockMotivos[0]],
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComMotivos} />);

        const botaoConfirmar = screen.getByText("Confirmar");
        fireEvent.click(botaoConfirmar);

        expect(defaultProps.onSalvarMotivosAntecipadosTrue).toHaveBeenCalledTimes(1);
    });

    it("botão Confirmar está desabilitado quando não há motivos selecionados e texto vazio", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const botaoConfirmar = screen.getByText("Confirmar");
        expect(botaoConfirmar).toBeDisabled();
    });

    it("botão Confirmar está habilitado quando há motivos selecionados", () => {
        const propsComMotivos = {
            ...defaultProps,
            selectMotivosPagamentoAntecipado: [mockMotivos[0]],
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComMotivos} />);

        const botaoConfirmar = screen.getByText("Confirmar");
        expect(botaoConfirmar).not.toBeDisabled();
    });

    it("botão Confirmar está habilitado quando há texto em 'Outros motivos'", () => {
        const propsComTexto = {
            ...defaultProps,
            checkBoxOutrosMotivosPagamentoAntecipado: true,
            txtOutrosMotivosPagamentoAntecipado: "Texto de outros motivos",
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComTexto} />);

        const botaoConfirmar = screen.getByText("Confirmar");
        expect(botaoConfirmar).not.toBeDisabled();
    });

    it("botão Confirmar está desabilitado quando texto de 'Outros motivos' contém apenas espaços", () => {
        const propsComTextoVazio = {
            ...defaultProps,
            checkBoxOutrosMotivosPagamentoAntecipado: true,
            txtOutrosMotivosPagamentoAntecipado: "   ",
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComTextoVazio} />);

        const botaoConfirmar = screen.getByText("Confirmar");
        expect(botaoConfirmar).toBeDisabled();
    });

    it("exibe data-qa correto no MultiSelect", () => {
        render(<ModalMotivosPagamentoAntecipado {...defaultProps} />);

        const multiselect = screen.getByTestId("multiselect");
        expect(multiselect).toBeInTheDocument();
    });

    it("exibe data-qa correto nos motivos listados", () => {
        const propsComMotivos = {
            ...defaultProps,
            selectMotivosPagamentoAntecipado: [mockMotivos[0]],
        };

        render(<ModalMotivosPagamentoAntecipado {...propsComMotivos} />);

        const motivoListado = screen.getByText(/1\. Urgência no pagamento/);
        expect(motivoListado.closest('p')).toHaveAttribute('data-qa', 'modal-despesa-motivos-pagamentos-antecipados-select-motivo-1');
    });
});
