import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalForm from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockSetFieldValue = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();

const mockEdit = {
  id: 50,
  uuid: "8de8e23d-8ab5-474d-a0a8-c57857c23bc2",
  nome: "Nome de teste na edição",
  tem_documento: true,
  operacao: 'edit'
};

const mockCreate = { 
  nome: "",
  operacao: "create",
  id: null
};

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  handleClose: jest.fn(),
  handleSubmitModalForm: jest.fn(),
  setShowModalConfirmDelete: mockSetShowModalConfirmDelete,
  setFieldValue: mockSetFieldValue
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: mockEdit
};

const renderModalForm = (props = defaultProps) => {
  render(<ModalForm {...props} />);
};

const verifyCommonElements = (isEditMode = false) => {
  expect(screen.getByText(isEditMode ? "Editar tipo de transação" : "Adicionar tipo de transação")).toBeInTheDocument();
  expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  expect(screen.getAllByLabelText("Sim").length).toEqual(1);
  expect(screen.getAllByLabelText("Não").length).toEqual(1);
};

describe("Componente ModalForm", () => {
  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  describe("Quando a operação é Cadastro", () => {
    it("Renderiza a Modal corretamente com permissão True", () => {
      renderModalForm();
      verifyCommonElements();

      expect(screen.getByLabelText("Nome *")).toHaveValue("");
      expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

      const campos = screen.getAllByRole(/textbox|radio/);
      campos.forEach((campo) => {
        expect(campo).toBeEnabled();
      });
    });

    it("Renderiza a Modal corretamente com permissão False", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
      renderModalForm();
      verifyCommonElements();

      expect(screen.getByLabelText("Nome *")).toHaveValue("");
      expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();

      const campos = screen.getAllByRole(/textbox|radio/);
      campos.forEach((campo) => {
        expect(campo).toBeDisabled();
      });
    });
  });

  describe("Quando a operação é Edição", () => {
    it("Renderiza a Modal corretamente com permissão True", () => {
      renderModalForm(defaultPropsEdicao);
      verifyCommonElements(true);

      expect(screen.getByLabelText("Nome *")).toHaveValue("Nome de teste na edição");
      expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

      const campos = screen.getAllByRole(/textbox|radio/);
      campos.forEach((campo) => {
        expect(campo).toBeEnabled();
      });
    });

    it("Renderiza a Modal corretamente com permissão False", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
      renderModalForm(defaultPropsEdicao);
      verifyCommonElements(true);

      expect(screen.getByLabelText("Nome *")).toHaveValue("Nome de teste na edição");
      expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();

      const campos = screen.getAllByRole(/textbox|radio/);
      campos.forEach((campo) => {
        expect(campo).toBeDisabled();
      });
    });
  });

  describe("Quando a operação é Edição", () => {
    it("Renderiza a Modal corretamente com permissão True", () => {
      renderModalForm(defaultPropsEdicao);
      verifyCommonElements(true);

      expect(screen.getByLabelText("Nome *")).toHaveValue("Nome de teste na edição");
      expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
      
      const campos = screen.getAllByRole(/textbox|radio/);
      campos.forEach((campo) => {
        expect(campo).toBeEnabled();
      });
    });

    it("Renderiza a Modal corretamente com permissão False", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
      renderModalForm(defaultPropsEdicao);
      verifyCommonElements(true);

      expect(screen.getByLabelText("Nome *")).toHaveValue("Nome de teste na edição");
      expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
      
      const campos = screen.getAllByRole(/textbox|radio/);
      campos.forEach((campo) => {
        expect(campo).toBeDisabled();
      });
    });
  });

  it("Chama handleSubmitModalForm quando o formulario for submetido", async () => {
    renderModalForm();

    const input = screen.getByLabelText("Nome *");
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(input, { target: { value: "Documento Teste" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.handleSubmitModalForm).toHaveBeenCalledTimes(1);
    });
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    renderModalForm();
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it('Deve atualizar o valor de Radios opção SIM para checked(true)', async () => {
    renderModalForm();

    const radios = screen.getAllByText('Sim');
    radios.forEach(async radio => {
      fireEvent.click(radio);
      await waitFor(() => {
        expect(radio.checked).toBe(true);
      });
    });
  });

  it('Deve atualizar o valor de Radios opção NÃO para checked(true)', async () => {
    renderModalForm();

    const radios = screen.getAllByText('Não');
    radios.forEach(async radio => {
      fireEvent.click(radio);
      await waitFor(() => {
        expect(radio.checked).toBe(true);
      });
    });
  });

  it('Deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {
    renderModalForm(defaultPropsEdicao);
    const button = screen.getByRole('button', { name: /Apagar/i });
    fireEvent.click(button);
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalledTimes(1);
  });
});