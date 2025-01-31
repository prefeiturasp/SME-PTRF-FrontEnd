import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalForm from "../ModalForm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockSetFieldValue = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();

const mockEdit = {
  nome: "Nome do tipo",
  numero_documento_digitado: true,
  apenas_digitos: false,
  documento_comprobatorio_de_despesa: false,
  pode_reter_imposto: false,
  eh_documento_de_retencao_de_imposto: false,
  id: 1,
  uuid: "12345",
  operacao: "edit"
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

describe("Controle Condicional de radio button", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  test("Desabilitar radio #apenas_digitos_true e #apenas_digitos_false quando #numero_documento_digitado_false for selecionado",
    async () => {
      render(
          <ModalForm {...defaultPropsEdicao}/>
      );

      const radioNumeroDocumentoNao = screen.getByLabelText("Não", { selector: 'input[name="numero_documento_digitado_false"]' });
      const radioApenasDigitosSim = screen.getByLabelText("Sim", { selector: 'input[name="apenas_digitos_true"]' });
      const radioApenasDigitosNao = screen.getByLabelText("Não", { selector: 'input[name="apenas_digitos_false"]' });
      
      fireEvent.click(radioNumeroDocumentoNao);
      expect(radioApenasDigitosSim).not.toBeChecked()
      expect(radioApenasDigitosNao).toBeChecked()
      expect(radioApenasDigitosSim).toBeDisabled();
      expect(radioApenasDigitosNao).toBeDisabled();
    }
  );

  test("Habilitar radio #apenas_digitos_true e #apenas_digitos_false quando #numero_documento_digitado_true for selecionado",
    async () => {
      render(
          <ModalForm {...defaultPropsEdicao}/>
      );

      const radioNumeroDocumentoSim = screen.getByLabelText("Sim", { selector: 'input[name="numero_documento_digitado_true"]' });
      const radioApenasDigitosSim = screen.getByLabelText("Sim", { selector: 'input[name="apenas_digitos_true"]' });
      const radioApenasDigitosNao = screen.getByLabelText("Não", { selector: 'input[name="apenas_digitos_false"]' });
      
      fireEvent.click(radioNumeroDocumentoSim);
      expect(radioApenasDigitosSim).not.toBeChecked();
      expect(radioApenasDigitosNao).toBeChecked();
      expect(radioApenasDigitosSim).toBeEnabled();
      expect(radioApenasDigitosNao).toBeEnabled();
    }
  );

  test("Desabilitar radio #pode_reter_imposto_true e #pode_reter_imposto_false quando #documento_comprobatorio_de_despesa_false for selecionado",
    async () => {
      render(
          <ModalForm {...defaultProps}/>
      );

      const radioDocumentoComprobatorioNao = screen.getByLabelText("Não", { selector: 'input[name="documento_comprobatorio_de_despesa_false"]' });
      const radioPodeRetirarImpostoSim = screen.getByLabelText("Sim", { selector: 'input[name="pode_reter_imposto_true"]' });
      const radioPodeRetirarImpostoNao = screen.getByLabelText("Não", { selector: 'input[name="pode_reter_imposto_false"]' });

      fireEvent.click(radioDocumentoComprobatorioNao);
      expect(radioPodeRetirarImpostoSim).toBeDisabled();
      expect(radioPodeRetirarImpostoNao).toBeDisabled();

    }
  );
  test("Habilitar radio #pode_reter_imposto_true e #pode_reter_imposto_false quando #documento_comprobatorio_de_despesa_true for selecionado",
    async () => {
      render(
          <ModalForm {...defaultProps}/>
      );

      const radioDocumentoComprobatorioSim = screen.getByLabelText("Sim", { selector: 'input[name="documento_comprobatorio_de_despesa_true"]' });
      const radioPodeRetirarImpostoSim = screen.getByLabelText("Sim", { selector: 'input[name="pode_reter_imposto_true"]' });
      const radioPodeRetirarImpostoNao = screen.getByLabelText("Não", { selector: 'input[name="pode_reter_imposto_false"]' });

      fireEvent.click(radioDocumentoComprobatorioSim);
      expect(radioPodeRetirarImpostoSim).toBeEnabled();
      expect(radioPodeRetirarImpostoNao).toBeEnabled();
    }
  );
});

describe("Componente ModalForm", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar tipo de documento")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
      expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar tipo de documento")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalForm {...defaultPropsEdicao} />);
    
    expect(screen.getByText("Editar tipo de documento")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do tipo");
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campoTexto = screen.getByRole(/textbox/);
    expect(campoTexto).toBeEnabled();

    const camposRadio = screen.getAllByRole(/radio/);
    camposRadio.forEach((campo) => {
        expect(campo).toBeInTheDocument();
    });
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);

    expect(screen.getByText("Editar tipo de documento")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("Nome do tipo");
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(5);
    expect(screen.getAllByLabelText("Não").length).toEqual(5);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("chama handleSubmitModalForm quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const input = screen.getByLabelText("Nome *");
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(input, { target: { value: "Documento Teste" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(defaultProps.handleSubmitModalForm).toHaveBeenCalledTimes(1);
    });
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalForm {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it('Deve atualizar o valor de Radios opção SIM para checked(true)', async () => {
    render(<ModalForm {...defaultProps} />);

    const Radios = screen.getAllByText('Sim');
    Radios.forEach( async radio => {
      fireEvent.click(radio);
      await waitFor(() => {
         expect(radio.checked).toBe(true);
      });
    });
  });

  it('Deve atualizar o valor de Radios opção NÃO para checked(true)', async () => {
    render(<ModalForm {...defaultProps} />);

    const Radios = screen.getAllByText('Não');
    Radios.forEach( async radio => {
      fireEvent.click(radio);
      await waitFor(() => {
         expect(radio.checked).toBe(true);
      });
    });
  });

  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {

    // Renderize o componente, passando as props necessárias
    render(<ModalForm {...defaultPropsEdicao}/>);

    // Localize o botão
    const button = screen.getByRole('button', { name: /Excluir/i });

    // Simule o clique no botão
    fireEvent.click(button);

    // Verifique se a função setShowModalConfirmDelete foi chamada
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalledTimes(1);
  });

});
