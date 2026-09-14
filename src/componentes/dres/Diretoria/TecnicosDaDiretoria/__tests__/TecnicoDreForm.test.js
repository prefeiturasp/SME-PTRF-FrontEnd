import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TecnicoDreForm, telefoneMaskContitional } from "../TecnicoDreForm";

jest.mock("react-text-mask", () => ({ mask, guide, showMask, ...props }) => {
    if (typeof mask === "function") {
        mask(props.value || "");
    }
    return <input {...props} />;
});

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(() => true),
    },
}));

const { visoesService } = require("../../../../../services/visoes.service");

const initialValuesNovo = {
    uuid: "",
    rf: "",
    nome: "",
    email: "",
    telefone: "",
};

const initialValuesEdicao = {
    uuid: "tec-1",
    rf: "1234567",
    nome: "Fulano de Tal",
    email: "fulano@sme.com",
    telefone: "(11)99999-9999",
};

const baseProps = {
    show: true,
    handleClose: jest.fn(),
    onSubmit: jest.fn(),
    handleChange: jest.fn(),
    validateForm: jest.fn().mockResolvedValue({}),
    initialValues: initialValuesNovo,
    btnSalvarReadOnly: false,
};

describe("TecnicoDreForm", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getPermissoes.mockReturnValue(true);
    });

    it("não renderiza o corpo do modal quando show é false", () => {
        render(<TecnicoDreForm {...baseProps} show={false} />);
        expect(screen.queryByLabelText("Registro funcional")).not.toBeInTheDocument();
    });

    it("exibe o título de adicionar quando não há uuid", () => {
        render(<TecnicoDreForm {...baseProps} />);
        expect(screen.getByText("Adicionar novo técnico")).toBeInTheDocument();
        expect(screen.getByText("Adicionar")).toBeInTheDocument();
    });

    it("exibe o título de editar quando há uuid", () => {
        render(<TecnicoDreForm {...baseProps} initialValues={initialValuesEdicao} />);
        expect(screen.getByText("Editar um técnico")).toBeInTheDocument();
        expect(screen.getByText("Salvar")).toBeInTheDocument();
    });

    it("desabilita o campo RF quando o técnico já possui uuid", () => {
        render(<TecnicoDreForm {...baseProps} initialValues={initialValuesEdicao} />);
        expect(screen.getByDisplayValue("1234567")).toBeDisabled();
    });

    it("habilita o campo RF para um técnico novo", () => {
        render(<TecnicoDreForm {...baseProps} />);
        const rfInput = document.querySelector('input[name="rf"]');
        expect(rfInput).toBeEnabled();
    });

    it("chama handleChange ao digitar no campo RF", () => {
        render(<TecnicoDreForm {...baseProps} />);
        const rfInput = document.querySelector('input[name="rf"]');
        fireEvent.change(rfInput, { target: { value: "7654321" } });
        expect(baseProps.handleChange).toHaveBeenCalledWith("rf", "7654321");
    });

    it("mantém o campo nome sempre como somente leitura", () => {
        render(<TecnicoDreForm {...baseProps} initialValues={initialValuesEdicao} />);
        expect(screen.getByDisplayValue("Fulano de Tal")).toHaveAttribute("readonly");
    });

    it("chama handleChange ao disparar o evento de mudança no campo nome", () => {
        render(<TecnicoDreForm {...baseProps} />);
        const nomeInput = document.querySelector('input[name="nome"]');
        fireEvent.change(nomeInput, { target: { value: "Novo Nome" } });
        expect(baseProps.handleChange).toHaveBeenCalledWith("nome", "Novo Nome");
    });

    it("chama handleChange ao digitar no telefone", () => {
        render(<TecnicoDreForm {...baseProps} />);
        const telefoneInput = document.querySelector('input[name="telefone"]');
        fireEvent.change(telefoneInput, { target: { value: "(11)98888-7777" } });
        expect(baseProps.handleChange).toHaveBeenCalledWith("telefone", "(11)98888-7777");
    });

    it("chama handleChange ao digitar no email", () => {
        render(<TecnicoDreForm {...baseProps} />);
        const emailInput = document.querySelector('input[name="email"]');
        fireEvent.change(emailInput, { target: { value: "novo@sme.com" } });
        expect(baseProps.handleChange).toHaveBeenCalledWith("email", "novo@sme.com");
    });

    it("limpa o erro de email ao clicar no campo", () => {
        render(<TecnicoDreForm {...baseProps} />);
        const emailInput = document.querySelector('input[name="email"]');
        expect(() => fireEvent.click(emailInput)).not.toThrow();
    });

    it("chama handleClose ao clicar em Cancelar", () => {
        render(<TecnicoDreForm {...baseProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(baseProps.handleClose).toHaveBeenCalled();
    });

    it("exibe erro de validação quando o RF está vazio e o formulário é submetido", async () => {
        render(<TecnicoDreForm {...baseProps} />);
        fireEvent.click(screen.getByText("Adicionar"));

        expect(
            await screen.findByText("Campo RF do técnico é obrigatório")
        ).toBeInTheDocument();
        expect(baseProps.onSubmit).not.toHaveBeenCalled();
    });

    it("desabilita o botão de salvar quando btnSalvarReadOnly é verdadeiro", () => {
        render(<TecnicoDreForm {...baseProps} btnSalvarReadOnly={true} />);
        expect(screen.getByText("Adicionar")).toBeDisabled();
    });

    it("desabilita o botão de salvar quando o usuário não possui permissão", () => {
        visoesService.getPermissoes.mockReturnValue(false);
        render(<TecnicoDreForm {...baseProps} />);
        expect(screen.getByText("Adicionar")).toBeDisabled();
    });

    it("habilita o botão de salvar quando há permissão e não está em readonly", () => {
        render(<TecnicoDreForm {...baseProps} />);
        expect(screen.getByText("Adicionar")).toBeEnabled();
    });

    it("submete o formulário quando o RF é preenchido", async () => {
        render(<TecnicoDreForm {...baseProps} />);
        const rfInput = document.querySelector('input[name="rf"]');
        fireEvent.change(rfInput, { target: { value: "7654321" } });

        fireEvent.click(screen.getByText("Adicionar"));

        await waitFor(() => {
            expect(baseProps.onSubmit).toHaveBeenCalled();
        });
    });

    it("não chama validateForm para um técnico já existente (edição)", () => {
        render(<TecnicoDreForm {...baseProps} initialValues={initialValuesEdicao} />);
        expect(baseProps.validateForm).not.toHaveBeenCalled();
    });
});

describe("telefoneMaskContitional", () => {
    it("retorna a máscara de telefone fixo para números com até 10 dígitos", () => {
        const mask = telefoneMaskContitional("1122223333");
        expect(mask).toHaveLength(13);
    });

    it("retorna a máscara de celular para números com mais de 10 dígitos", () => {
        const mask = telefoneMaskContitional("11987654321");
        expect(mask).toHaveLength(14);
    });
});
