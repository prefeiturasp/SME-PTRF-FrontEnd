import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    ModalAdicionarMembroComissao,
    ModalEditarMembroComissao,
    ModalConfirmaExclusaoMembroComissao,
} from "../index";

jest.mock("antd", () => {
    const React = require("react");
    const Select = ({ children, value, onChange, placeholder }) => (
        <select
            multiple
            data-testid="select-comissoes"
            value={value}
            onChange={(e) =>
                onChange(Array.from(e.target.selectedOptions).map((o) => Number(o.value)))
            }
            aria-label={placeholder}
        >
            {children}
        </select>
    );
    Select.Option = ({ children, value }) => <option value={value}>{children}</option>;
    return { Select };
});

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {
        getPermissoes: jest.fn(() => true),
    },
}));

const { visoesService } = require("../../../../../../services/visoes.service");

const listaComissoes = [
    { id: 1, nome: "Comissão A" },
    { id: 2, nome: "Comissão B" },
];

const estadoModalVazio = {
    registro_funcional_modal: "",
    nome_modal: "",
    email_modal: "",
    comissoes_modal: [],
};

const errosModalVazio = {
    servidor_nao_encontrado: null,
    comissao_vazia: null,
    email_invalido: null,
};

describe("ModalAdicionarMembroComissao", () => {
    const baseProps = {
        show: true,
        onHide: jest.fn(),
        titulo: "Adicionar membro de comissão",
        estadoModal: estadoModalVazio,
        handleOnChangeRegistroFuncional: jest.fn(),
        handleOnBlurRegistroFuncional: jest.fn(),
        handleOnChangeModal: jest.fn(),
        handleOnSubmitModal: jest.fn(),
        handleOnChangeMultipleSelectModal: jest.fn(),
        listaComissoes,
        errosModal: errosModalVazio,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não renderiza o corpo do modal quando show é false", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} show={false} />);
        expect(screen.queryByLabelText("Registro funcional")).not.toBeInTheDocument();
    });

    it("exibe o título recebido", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        expect(screen.getByText("Adicionar membro de comissão")).toBeInTheDocument();
    });

    it("chama handleOnChangeRegistroFuncional ao digitar o RF", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        fireEvent.change(screen.getByPlaceholderText("Escreva o número"), {
            target: { value: "123" },
        });
        expect(baseProps.handleOnChangeRegistroFuncional).toHaveBeenCalled();
    });

    it("chama handleOnBlurRegistroFuncional ao sair do campo RF", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        fireEvent.blur(screen.getByPlaceholderText("Escreva o número"));
        expect(baseProps.handleOnBlurRegistroFuncional).toHaveBeenCalled();
    });

    it("exibe o erro de servidor não encontrado", () => {
        render(
            <ModalAdicionarMembroComissao
                {...baseProps}
                errosModal={{ ...errosModalVazio, servidor_nao_encontrado: "Servidor não encontrado" }}
            />
        );
        expect(screen.getByText("Servidor não encontrado")).toBeInTheDocument();
    });

    it("mantém o campo nome sempre desabilitado", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        expect(screen.getByPlaceholderText("-")).toBeDisabled();
    });

    it("chama handleOnChangeModal ao digitar o nome", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        fireEvent.change(screen.getByPlaceholderText("-"), { target: { value: "Fulano" } });
        expect(baseProps.handleOnChangeModal).toHaveBeenCalledWith("nome_modal", "Fulano");
    });

    it("chama handleOnChangeModal ao digitar o email", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        fireEvent.change(screen.getByPlaceholderText("Insira o email se desejar"), {
            target: { value: "a@a.com" },
        });
        expect(baseProps.handleOnChangeModal).toHaveBeenCalledWith("email_modal", "a@a.com");
    });

    it("exibe o erro de email inválido", () => {
        render(
            <ModalAdicionarMembroComissao
                {...baseProps}
                errosModal={{ ...errosModalVazio, email_invalido: "Digite um email válido" }}
            />
        );
        expect(screen.getByText("Digite um email válido")).toBeInTheDocument();
    });

    it("lista as comissões disponíveis para seleção", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        expect(screen.getByText("Comissão A")).toBeInTheDocument();
        expect(screen.getByText("Comissão B")).toBeInTheDocument();
    });

    it("não quebra quando não há lista de comissões", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} listaComissoes={[]} />);
        expect(screen.getByTestId("select-comissoes")).toBeInTheDocument();
    });

    it("chama handleOnChangeMultipleSelectModal ao selecionar comissões", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        const select = screen.getByTestId("select-comissoes");
        fireEvent.change(select, { target: { value: "1" } });
        expect(baseProps.handleOnChangeMultipleSelectModal).toHaveBeenCalled();
    });

    it("exibe o erro de comissão vazia", () => {
        render(
            <ModalAdicionarMembroComissao
                {...baseProps}
                errosModal={{ ...errosModalVazio, comissao_vazia: "Escolha pelo menos uma comissão" }}
            />
        );
        expect(screen.getByText("Escolha pelo menos uma comissão")).toBeInTheDocument();
    });

    it("chama onHide ao clicar em Cancelar", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(baseProps.onHide).toHaveBeenCalled();
    });

    it("chama handleOnSubmitModal ao clicar em Adicionar", () => {
        render(<ModalAdicionarMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Adicionar"));
        expect(baseProps.handleOnSubmitModal).toHaveBeenCalled();
    });
});

describe("ModalEditarMembroComissao", () => {
    const baseProps = {
        show: true,
        onHide: jest.fn(),
        titulo: "Editar membro de comissão",
        estadoModal: { ...estadoModalVazio, comissoes_modal: [1] },
        handleOnChangeRegistroFuncional: jest.fn(),
        handleOnBlurRegistroFuncional: jest.fn(),
        handleOnChangeModal: jest.fn(),
        handleOnSubmitModal: jest.fn(),
        handleOnChangeMultipleSelectModal: jest.fn(),
        handleOnShowModalExclusao: jest.fn(),
        listaComissoes,
        errosModal: errosModalVazio,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getPermissoes.mockReturnValue(true);
    });

    it("não renderiza o corpo do modal quando show é false", () => {
        render(<ModalEditarMembroComissao {...baseProps} show={false} />);
        expect(screen.queryByLabelText("Registro funcional")).not.toBeInTheDocument();
    });

    it("exibe o título recebido", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        expect(screen.getByText("Editar membro de comissão")).toBeInTheDocument();
    });

    it("chama handleOnChangeRegistroFuncional em modo de edição ao digitar o RF", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        fireEvent.change(screen.getByPlaceholderText("Escreva o número"), {
            target: { value: "999" },
        });
        expect(baseProps.handleOnChangeRegistroFuncional).toHaveBeenCalledWith(
            expect.anything(),
            true
        );
    });

    it("chama handleOnChangeModal em modo de edição ao digitar o nome", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        fireEvent.change(screen.getByPlaceholderText("-"), { target: { value: "Outro Nome" } });
        expect(baseProps.handleOnChangeModal).toHaveBeenCalledWith(
            "nome_modal",
            "Outro Nome",
            true
        );
    });

    it("chama handleOnChangeModal ao digitar o email", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        fireEvent.change(screen.getByPlaceholderText("Insira o email se desejar"), {
            target: { value: "b@b.com" },
        });
        expect(baseProps.handleOnChangeModal).toHaveBeenCalledWith("email_modal", "b@b.com");
    });

    it("lista as comissões e reflete a seleção atual", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        expect(screen.getByTestId("select-comissoes")).toHaveValue(["1"]);
    });

    it("chama onHide ao clicar em Cancelar", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(baseProps.onHide).toHaveBeenCalled();
    });

    it("chama handleOnSubmitModal ao clicar em Salvar", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Salvar"));
        expect(baseProps.handleOnSubmitModal).toHaveBeenCalled();
    });

    it("chama handleOnShowModalExclusao ao clicar em Remover", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Remover"));
        expect(baseProps.handleOnShowModalExclusao).toHaveBeenCalled();
    });

    it("habilita o botão Remover quando o usuário possui permissão", () => {
        render(<ModalEditarMembroComissao {...baseProps} />);
        expect(screen.getByText("Remover").closest("button")).toBeEnabled();
    });

    it("desabilita o botão Remover quando o usuário não possui permissão", () => {
        visoesService.getPermissoes.mockReturnValue(false);
        render(<ModalEditarMembroComissao {...baseProps} />);
        expect(screen.getByText("Remover").closest("button")).toBeDisabled();
    });
});

describe("ModalConfirmaExclusaoMembroComissao", () => {
    const baseProps = {
        show: true,
        onHide: jest.fn(),
        titulo: "Excluir membro de comissão",
        handleConfirmaExclusao: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não renderiza o corpo do modal quando show é false", () => {
        render(<ModalConfirmaExclusaoMembroComissao {...baseProps} show={false} />);
        expect(screen.queryByText(/Deseja realmente excluir/i)).not.toBeInTheDocument();
    });

    it("exibe a mensagem e o título de confirmação", () => {
        render(<ModalConfirmaExclusaoMembroComissao {...baseProps} />);
        expect(screen.getByText("Excluir membro de comissão")).toBeInTheDocument();
        expect(screen.getByText("Deseja realmente excluir ?")).toBeInTheDocument();
    });

    it("chama onHide ao clicar em Cancelar", () => {
        render(<ModalConfirmaExclusaoMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Cancelar"));
        expect(baseProps.onHide).toHaveBeenCalled();
    });

    it("chama handleConfirmaExclusao ao clicar em Sim", () => {
        render(<ModalConfirmaExclusaoMembroComissao {...baseProps} />);
        fireEvent.click(screen.getByText("Sim"));
        expect(baseProps.handleConfirmaExclusao).toHaveBeenCalled();
    });
});
