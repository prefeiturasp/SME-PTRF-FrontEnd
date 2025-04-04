import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalFormAcoes } from "../ModalFormAcoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockEdit = {
  id: 11,
  uuid: "ee8a43b7-0156-4025-b142-b1c5ba2a3790",
  nome: "Teste",
  e_recursos_proprios: false,
  posicao_nas_pesquisas: "FFFFFFFFF",
  aceita_capital: true,
  aceita_custeio: true,
  aceita_livre: false,
  operacao: "edit"
}

const mockCreate = {
  id: null,
  uuid: "",
  nome: "",
  e_recursos_proprios: false,
  posicao_nas_pesquisas: "",
  aceita_capital: false,
  aceita_custeio: false,
  aceita_livre: false,
  operacao: "create"
}

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  // readOnly:
  handleClose: jest.fn(),
  handleSubmitModalFormAcoes: jest.fn(),
  setShowModalConfirmDelete: jest.fn(),
  setFieldValue: jest.fn()
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: mockEdit
};

describe("Renderiza radios do formulário", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  test("renderiza radios de acordo com o objeto de edição/criação",
    async () => {
      render(
          <ModalFormAcoes {...defaultPropsEdicao}/>
      );

      const radioAceitaCapitalSim = screen.getByLabelText("Sim", { selector: 'input[name="aceita_capital_true"]' });
      const radioAceitaCapitalNao = screen.getByLabelText("Não", { selector: 'input[name="aceita_capital_false"]' });
      expect(radioAceitaCapitalSim.checked).toBe(defaultPropsEdicao.stateFormModal.aceita_capital);
      expect(radioAceitaCapitalNao.checked).not.toBe(defaultPropsEdicao.stateFormModal.aceita_capital);

      const radioAceitaCusteioSim = screen.getByLabelText("Sim", { selector: 'input[name="aceita_custeio_true"]' });
      const radioAceitaCusteioNao = screen.getByLabelText("Não", { selector: 'input[name="aceita_custeio_false"]' });
      expect(radioAceitaCusteioSim.checked).toBe(defaultPropsEdicao.stateFormModal.aceita_custeio);
      expect(radioAceitaCusteioNao.checked).not.toBe(defaultPropsEdicao.stateFormModal.aceita_custeio);

      const radioAceitaLivreAplicacaoSim = screen.getByLabelText("Sim", { selector: 'input[name="aceita_livre_true"]' });
      const radioAceitaLivreAplicacaoNao = screen.getByLabelText("Não", { selector: 'input[name="aceita_livre_false"]' });
      expect(radioAceitaLivreAplicacaoSim.checked).toBe(defaultPropsEdicao.stateFormModal.aceita_livre);
      expect(radioAceitaLivreAplicacaoNao.checked).not.toBe(defaultPropsEdicao.stateFormModal.aceita_livre);

      const radioRecursosExternosSim = screen.getByLabelText("Sim", { selector: 'input[name="e_recursos_proprios_true"]' });
      const radioRecursosExternosNao = screen.getByLabelText("Não", { selector: 'input[name="e_recursos_proprios_false"]' });
      expect(radioRecursosExternosSim.checked).toBe(defaultPropsEdicao.stateFormModal.e_recursos_proprios);
      expect(radioRecursosExternosNao.checked).not.toBe(defaultPropsEdicao.stateFormModal.e_recursos_proprios);
    }
  );

  test("testa a alteração de valores dos radios",
    async () => {
      render(
          <ModalFormAcoes {...defaultPropsEdicao}/>
      );

      const radioAceitaCapitalSim = screen.getByLabelText("Sim", { selector: 'input[name="aceita_capital_true"]' });
      const radioAceitaCapitalNao = screen.getByLabelText("Não", { selector: 'input[name="aceita_capital_false"]' });
      expect(radioAceitaCapitalSim).toBeChecked();
      fireEvent.click(radioAceitaCapitalNao)
      fireEvent.click(radioAceitaCapitalSim)
      fireEvent.click(radioAceitaCapitalNao)
      expect(radioAceitaCapitalSim).not.toBeChecked();
      
      const radioAceitaCusteioSim = screen.getByLabelText("Sim", { selector: 'input[name="aceita_custeio_true"]' });
      const radioAceitaCusteioNao = screen.getByLabelText("Não", { selector: 'input[name="aceita_custeio_false"]' });
      expect(radioAceitaCusteioSim).toBeChecked();
      fireEvent.click(radioAceitaCusteioNao)
      fireEvent.click(radioAceitaCusteioSim)
      fireEvent.click(radioAceitaCusteioNao)
      expect(radioAceitaCusteioSim).not.toBeChecked();
      
      const radioAceitaLivreAplicacaoSim = screen.getByLabelText("Sim", { selector: 'input[name="aceita_livre_true"]' });
      const radioAceitaLivreAplicacaoNao = screen.getByLabelText("Não", { selector: 'input[name="aceita_livre_false"]' });
      expect(radioAceitaLivreAplicacaoNao).toBeChecked();
      fireEvent.click(radioAceitaLivreAplicacaoSim)
      fireEvent.click(radioAceitaLivreAplicacaoNao)
      fireEvent.click(radioAceitaLivreAplicacaoSim)
      expect(radioAceitaLivreAplicacaoSim).toBeChecked();
      
      const radioRecursosExternosSim = screen.getByLabelText("Sim", { selector: 'input[name="e_recursos_proprios_true"]' });
      const radioRecursosExternosNao = screen.getByLabelText("Não", { selector: 'input[name="e_recursos_proprios_false"]' });
      expect(radioRecursosExternosNao).toBeChecked();
      fireEvent.click(radioRecursosExternosSim)
      fireEvent.click(radioRecursosExternosNao)
      fireEvent.click(radioRecursosExternosSim)
      expect(radioRecursosExternosSim).toBeChecked();
    }
  );
});

describe("Componente ModalForm", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalFormAcoes {...defaultProps} />);

    expect(screen.getByText("Adicionar ação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(4);
    expect(screen.getAllByLabelText("Não").length).toEqual(4);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
      expect(campo).toBeEnabled();
    });
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    const props = {
      ...defaultProps,
      readOnly: true
    }
    console.log(props)
    render(<ModalFormAcoes {...props} />);

    expect(screen.getByText("Adicionar ação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome *")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getAllByLabelText("Sim").length).toEqual(4);
    expect(screen.getAllByLabelText("Não").length).toEqual(4);

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
    const campos = screen.getAllByRole(/textbox|radio/);
    campos.forEach((campo) => {
      expect(campo).toBeDisabled();
    });
  });

  it("chama mensagens de erro no formulário quando nome não for informado", async () => {
    render(<ModalFormAcoes {...defaultProps} />);

    const saveButton = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
    });
  });

  it("chama handleSubmitModalFormAcoes quando o formulario for submetido", async () => {
    render(<ModalFormAcoes {...defaultProps} />);

    const input = screen.getByLabelText("Nome *");
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(input, { target: { value: "Ação Teste" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(defaultProps.handleSubmitModalFormAcoes).toHaveBeenCalledTimes(1);
    });
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalFormAcoes {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it('Deve atualizar o valor de Radios opção SIM para checked(true)', async () => {
    render(<ModalFormAcoes {...defaultProps} />);

    const Radios = screen.getAllByText('Sim');
    Radios.forEach( async radio => {
      fireEvent.click(radio);
      await waitFor(() => {
         expect(radio.checked).toBe(true);
      });
    });
  });

  it('Deve atualizar o valor de Radios opção NÃO para checked(true)', async () => {
    render(<ModalFormAcoes {...defaultProps} />);

    const Radios = screen.getAllByText('Não');
    Radios.forEach( async radio => {
      fireEvent.click(radio);
      await waitFor(() => {
         expect(radio.checked).toBe(true);
      });
    });
  });

  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {
    render(<ModalFormAcoes {...defaultPropsEdicao}/>);

    const button = screen.getByRole('button', { name: /Excluir/i });

    fireEvent.click(button);

    expect(defaultPropsEdicao.setShowModalConfirmDelete).toHaveBeenCalledTimes(1);
  });

});
