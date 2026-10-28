import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import ModalMotivos from "../ModalMotivosPagamentoAntecipado";

let ultimoMultiSelect;
jest.mock("primereact/multiselect", () => ({
    MultiSelect: (props) => {
        ultimoMultiSelect = props;
        return <div data-testid="multiselect" />;
    },
}));

const props = (extra = {}) => ({
    show: true,
    handleClose: jest.fn(),
    listaDemotivosPagamentoAntecipado: [{id: 1, motivo: "A"}, {id: 2, motivo: "B"}],
    selectMotivosPagamentoAntecipado: [],
    setSelectMotivosPagamentoAntecipado: jest.fn(),
    checkBoxOutrosMotivosPagamentoAntecipado: false,
    txtOutrosMotivosPagamentoAntecipado: "",
    handleChangeCheckBoxOutrosMotivosPagamentoAntecipado: jest.fn(),
    handleChangeTxtOutrosMotivosPagamentoAntecipado: jest.fn(),
    onSalvarMotivosAntecipadosTrue: jest.fn(),
    ...extra,
});

describe("ModalMotivosPagamentoAntecipado", () => {
    it("renderiza título, texto e botão confirmar desabilitado sem motivos", () => {
        render(<ModalMotivos {...props()} />);
        expect(screen.getByText("Motivos de pagamento antecipado")).toBeInTheDocument();
        expect(screen.getByText(/data do documento é posterior/i)).toBeInTheDocument();
        expect(screen.getByRole("button", {name: "Confirmar"})).toBeDisabled();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    it("habilita confirmar com motivos selecionados e lista-os", () => {
        const sel = [{id: 1, motivo: "A"}, {id: 2, motivo: "B"}];
        const p = props({selectMotivosPagamentoAntecipado: sel});
        render(<ModalMotivos {...p} />);
        expect(screen.getByRole("button", {name: "Confirmar"})).toBeEnabled();
        expect(screen.getByText("1. A")).toBeInTheDocument();
        expect(screen.getByText("2. B")).toBeInTheDocument();
        expect(ultimoMultiSelect.selectedItemsLabel).toBe("2 selecionados");
        fireEvent.click(screen.getByRole("button", {name: "Confirmar"}));
        expect(p.onSalvarMotivosAntecipadosTrue).toHaveBeenCalledTimes(1);
    });

    it("usa label singular com um motivo e repassa seleção ao setter", () => {
        const p = props({selectMotivosPagamentoAntecipado: [{id: 1, motivo: "A"}]});
        render(<ModalMotivos {...p} />);
        expect(ultimoMultiSelect.selectedItemsLabel).toBe("1 selecionado");
        ultimoMultiSelect.onChange({value: [{id: 2, motivo: "B"}]});
        expect(p.setSelectMotivosPagamentoAntecipado).toHaveBeenCalledWith([{id: 2, motivo: "B"}]);
    });

    it("sem motivos o label é undefined", () => {
        render(<ModalMotivos {...props()} />);
        expect(ultimoMultiSelect.selectedItemsLabel).toBeUndefined();
    });

    it("exibe textarea de outros motivos e habilita confirmar quando preenchida", () => {
        const p = props({
            checkBoxOutrosMotivosPagamentoAntecipado: true,
            txtOutrosMotivosPagamentoAntecipado: "texto",
        });
        render(<ModalMotivos {...p} />);
        const textarea = screen.getByRole("textbox");
        expect(textarea).toHaveValue("texto");
        expect(screen.getByRole("button", {name: "Confirmar"})).toBeEnabled();
        fireEvent.change(textarea, {target: {value: "novo"}});
        expect(p.handleChangeTxtOutrosMotivosPagamentoAntecipado).toHaveBeenCalled();
    });

    it("mantém confirmar desabilitado com texto apenas de espaços", () => {
        render(<ModalMotivos {...props({
            checkBoxOutrosMotivosPagamentoAntecipado: true,
            txtOutrosMotivosPagamentoAntecipado: "   ",
        })} />);
        expect(screen.getByRole("button", {name: "Confirmar"})).toBeDisabled();
    });

    it("dispara callbacks do checkbox e de cancelar", () => {
        const p = props();
        render(<ModalMotivos {...p} />);
        fireEvent.click(screen.getByLabelText("Outros motivos"));
        expect(p.handleChangeCheckBoxOutrosMotivosPagamentoAntecipado).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", {name: "Cancelar"}));
        expect(p.handleClose).toHaveBeenCalledTimes(1);
    });
});
