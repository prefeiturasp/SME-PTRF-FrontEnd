import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import {ModalDeletarDespesa} from "../ModalDeletarDespesa";
import {ModalDeletarRateioComEstorno} from "../ModalDeletarRateioComEstorno";
import {ModalDespesaIncompleta} from "../ModalDespesaIncompleta";
import {ModalDespesaConferida} from "../ModalDespesaJaConferida";
import {ModalErroDeletarCadastroDespesa} from "../ModalErroDeletarCadastroDespesa";

const base = () => ({
    show: true,
    handleClose: jest.fn(),
    titulo: "Título do modal",
    texto: "<p>Texto do modal</p>",
});

describe("ModalDeletarDespesa", () => {
    it("renderiza título/texto e dispara ações Sim/Não", () => {
        const props = {...base(), onDeletarDespesas: jest.fn()};
        render(<ModalDeletarDespesa {...props} />);
        expect(screen.getByText("Título do modal")).toBeInTheDocument();
        expect(screen.getByText("Texto do modal")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Sim"}));
        expect(props.onDeletarDespesas).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", {name: "Não"}));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });

    it("não renderiza conteúdo quando show=false", () => {
        render(<ModalDeletarDespesa {...base()} show={false} onDeletarDespesas={jest.fn()} />);
        expect(screen.queryByText("Título do modal")).not.toBeInTheDocument();
    });
});

describe("ModalDeletarRateioComEstorno", () => {
    it("dispara onDeletarRateio em Sim e handleClose em Não", () => {
        const props = {...base(), onDeletarRateio: jest.fn()};
        render(<ModalDeletarRateioComEstorno {...props} />);
        expect(screen.getByText("Texto do modal")).toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "Sim"}));
        expect(props.onDeletarRateio).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", {name: "Não"}));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});

describe("ModalDespesaIncompleta", () => {
    it("Sim fecha e Não salva despesa incompleta", () => {
        const props = {...base(), onSalvarDespesaIncompleta: jest.fn()};
        render(<ModalDespesaIncompleta {...props} />);
        fireEvent.click(screen.getByRole("button", {name: "Sim"}));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
        expect(props.onSalvarDespesaIncompleta).not.toHaveBeenCalled();
        fireEvent.click(screen.getByRole("button", {name: "Não"}));
        expect(props.onSalvarDespesaIncompleta).toHaveBeenCalledTimes(1);
    });
});

describe("ModalDespesaConferida", () => {
    it("cancelar fecha e Gravar salva", () => {
        const props = {...base(), onSalvarDespesaConferida: jest.fn()};
        render(<ModalDespesaConferida {...props} />);
        fireEvent.click(screen.getByRole("button", {name: "Não, cancelar"}));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole("button", {name: "Gravar"}));
        expect(props.onSalvarDespesaConferida).toHaveBeenCalledTimes(1);
    });
});

describe("ModalErroDeletarCadastroDespesa", () => {
    it("exibe apenas o botão Fechar", () => {
        const props = base();
        render(<ModalErroDeletarCadastroDespesa {...props} />);
        expect(screen.getByText("Texto do modal")).toBeInTheDocument();
        expect(screen.getAllByRole("button")).toHaveLength(1);
        fireEvent.click(screen.getByRole("button", {name: "Fechar"}));
        expect(props.handleClose).toHaveBeenCalledTimes(1);
    });
});
