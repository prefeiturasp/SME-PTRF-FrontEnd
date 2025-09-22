import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ModalFormTags from "../ModalFormTags";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockSetFieldValue = jest.fn();
const mocksetShowModalConfirmDeleteTag = jest.fn();

const mockEdit = {
  id: 50,
  uuid: "8de8e23d-8ab5-474d-a0a8-c57857c23bc2",
  nome: "Nome de teste na edição",
  tem_documento: true,
  operacao: 'edit',
  status: "INATIVO"
};

const mockCreate = { 
  nome: "",
  operacao: "create",
  id: null,
  status: "INATIVO"
};

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  handleClose: jest.fn(),
  handleSubmitModalFormTags: jest.fn(),
  setShowModalConfirmDeleteTag: mocksetShowModalConfirmDeleteTag,
  setFieldValue: mockSetFieldValue
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: mockEdit
};

const renderModalForm = (props = defaultProps) => {
  render(<ModalFormTags {...props} />);
};

const verifyCommonElements = (isEditMode = false) => {
  expect(screen.getByText(isEditMode ? "Editar etiqueta/tag" : "Adicionar etiqueta/tag")).toBeInTheDocument();
  expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
  expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
  expect(screen.getByLabelText("Status *")).toBeInTheDocument();
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
      expect(screen.getByLabelText("Status *")).toHaveValue("INATIVO");
      expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

      const camposTexto = screen.getAllByRole("textbox");
      camposTexto.forEach((campo) => {
        expect(campo).toBeEnabled();
      });

      expect(screen.getByRole("combobox", { name: /Status \*/i })).toBeEnabled();
    });

    it("Renderiza a Modal corretamente com permissão False", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
      renderModalForm();
      verifyCommonElements();

      expect(screen.getByLabelText("Nome *")).toHaveValue("");
      expect(screen.getByLabelText("Status *")).toHaveValue("INATIVO");
      expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();

      const camposTexto = screen.getAllByRole("textbox");
      camposTexto.forEach((campo) => {
        expect(campo).toBeDisabled();
      });

      expect(screen.getByRole("combobox", { name: /Status \*/i })).toBeDisabled();
    });
  });

  describe("Quando a operação é Edição", () => {
    it("Renderiza a Modal corretamente com permissão True", () => {
      renderModalForm(defaultPropsEdicao);
      verifyCommonElements(true);

      expect(screen.getByLabelText("Nome *")).toHaveValue("Nome de teste na edição");
      expect(screen.getByLabelText("Status *")).toHaveValue("INATIVO");
      expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

      const camposTexto = screen.getAllByRole("textbox");
      camposTexto.forEach((campo) => {
        expect(campo).toBeEnabled();
      });

      expect(screen.getByRole("combobox", { name: /Status \*/i })).toBeEnabled();
    });

    it("Renderiza a Modal corretamente com permissão False", () => {
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
      renderModalForm(defaultPropsEdicao);
      verifyCommonElements(true);

      expect(screen.getByLabelText("Nome *")).toHaveValue("Nome de teste na edição");
      expect(screen.getByLabelText("Status *")).toHaveValue("INATIVO");
      expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();

      const camposTexto = screen.getAllByRole("textbox");
      camposTexto.forEach((campo) => {
        expect(campo).toBeDisabled();
      });

      expect(screen.getByRole("combobox", { name: /Status \*/i })).toBeDisabled();
    });
  });

  it("Chama handleSubmitModalFormTags quando o formulario for submetido", async () => {
    renderModalForm();

    const input = screen.getByLabelText("Nome *");
    const saveButton = screen.getByRole("button", { name: "Salvar" });
    const select = screen.getByLabelText("Status *");

    fireEvent.change(input, { target: { value: "Documento Teste" } });
    fireEvent.change(select, { target: { value: "INATIVO" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(defaultProps.handleSubmitModalFormTags).toHaveBeenCalledTimes(1);
    });
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    renderModalForm();
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it('Deve atualizar o valor do Select para ATIVO', async () => {
    renderModalForm();

    const select = screen.getByLabelText('Status *');
    fireEvent.change(select, { target: { value: 'ATIVO' } });
    await waitFor(() => {
      expect(select.value).toBe('ATIVO');
    });
  });

  it('Deve atualizar o valor do Select para INATIVO', async () => {
    renderModalForm();

    const select = screen.getByLabelText('Status *');
    fireEvent.change(select, { target: { value: 'INATIVO' } });
    await waitFor(() => {
      expect(select.value).toBe('INATIVO');
    });
  });

  it('Deve chamar setShowModalConfirmDeleteTag quando o botão for clicado', () => {
    renderModalForm(defaultPropsEdicao);
    const button = screen.getByRole('button', { name: /Excluir/i });
    fireEvent.click(button);
    expect(mocksetShowModalConfirmDeleteTag).toHaveBeenCalledTimes(1);
  });
});