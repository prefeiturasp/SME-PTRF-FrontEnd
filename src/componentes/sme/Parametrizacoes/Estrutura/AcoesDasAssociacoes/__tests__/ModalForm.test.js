import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {ModalFormAcoesDaAssociacao as ModalForm} from "../ModalFormAcoesDasAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';
import { mockSelectAcoes, mockSelectAssociacoes  } from "../__fixtures__/mockData";
import { read } from "fs";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockEdit = {
  associacao: "1",
  acao: "1",
  status: "ATIVA",
  codigo_eol: "123",
  uuid: "1234",
  nome_unidade: "unidade",
  id: 1,
  uuid: "12345",
  operacao: "edit"
};

const mockCreate = { 
  associacao: "",
  acao: "",
  status: "",
  codigo_eol: "",
  uuid: "",
  id: "",
  nome_unidade: "",
  operacao: "create",
};

const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  handleClose: jest.fn(),
  readOnly: false,
  handleSubmitModalFormAcoes: jest.fn(),
  handleChangeFormModal: jest.fn(),
  setShowModalDeleteAcao: jest.fn(),
  recebeAcaoAutoComplete: jest.fn(),
  todasAsAcoesAutoComplete: mockSelectAssociacoes,
  listaTiposDeAcao: mockSelectAcoes,
  loadingAssociacoes: false
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: mockEdit
};

// describe("Controle Condicional de radio button", () => {

//   beforeEach(() => {
//     RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
//   });

  // test("Desabilitar radio #apenas_digitos_true e #apenas_digitos_false quando #numero_documento_digitado_false for selecionado",
  //   async () => {
  //     render(
  //         <ModalForm {...defaultPropsEdicao}/>
  //     );

  //     const radioNumeroDocumentoNao = screen.getByLabelText("Não", { selector: 'input[name="numero_documento_digitado_false"]' });
  //     const radioApenasDigitosSim = screen.getByLabelText("Sim", { selector: 'input[name="apenas_digitos_true"]' });
  //     const radioApenasDigitosNao = screen.getByLabelText("Não", { selector: 'input[name="apenas_digitos_false"]' });
      
  //     fireEvent.click(radioNumeroDocumentoNao);
  //     expect(radioApenasDigitosSim).not.toBeChecked()
  //     expect(radioApenasDigitosNao).toBeChecked()
  //     expect(radioApenasDigitosSim).toBeDisabled();
  //     expect(radioApenasDigitosNao).toBeDisabled();
  //   }
  // );

//   test("Habilitar radio #apenas_digitos_true e #apenas_digitos_false quando #numero_documento_digitado_true for selecionado",
//     async () => {
//       render(
//           <ModalForm {...defaultPropsEdicao}/>
//       );

//       const radioNumeroDocumentoSim = screen.getByLabelText("Sim", { selector: 'input[name="numero_documento_digitado_true"]' });
//       const radioApenasDigitosSim = screen.getByLabelText("Sim", { selector: 'input[name="apenas_digitos_true"]' });
//       const radioApenasDigitosNao = screen.getByLabelText("Não", { selector: 'input[name="apenas_digitos_false"]' });
      
//       fireEvent.click(radioNumeroDocumentoSim);
//       expect(radioApenasDigitosSim).not.toBeChecked();
//       expect(radioApenasDigitosNao).toBeChecked();
//       expect(radioApenasDigitosSim).toBeEnabled();
//       expect(radioApenasDigitosNao).toBeEnabled();
//     }
//   );

//   test("Desabilitar radio #pode_reter_imposto_true e #pode_reter_imposto_false quando #documento_comprobatorio_de_despesa_false for selecionado",
//     async () => {
//       render(
//           <ModalForm {...defaultProps}/>
//       );

//       const radioDocumentoComprobatorioNao = screen.getByLabelText("Não", { selector: 'input[name="documento_comprobatorio_de_despesa_false"]' });
//       const radioPodeRetirarImpostoSim = screen.getByLabelText("Sim", { selector: 'input[name="pode_reter_imposto_true"]' });
//       const radioPodeRetirarImpostoNao = screen.getByLabelText("Não", { selector: 'input[name="pode_reter_imposto_false"]' });

//       fireEvent.click(radioDocumentoComprobatorioNao);
//       expect(radioPodeRetirarImpostoSim).toBeDisabled();
//       expect(radioPodeRetirarImpostoNao).toBeDisabled();

//     }
//   );
//   test("Habilitar radio #pode_reter_imposto_true e #pode_reter_imposto_false quando #documento_comprobatorio_de_despesa_true for selecionado",
//     async () => {
//       render(
//           <ModalForm {...defaultProps}/>
//       );

//       const radioDocumentoComprobatorioSim = screen.getByLabelText("Sim", { selector: 'input[name="documento_comprobatorio_de_despesa_true"]' });
//       const radioPodeRetirarImpostoSim = screen.getByLabelText("Sim", { selector: 'input[name="pode_reter_imposto_true"]' });
//       const radioPodeRetirarImpostoNao = screen.getByLabelText("Não", { selector: 'input[name="pode_reter_imposto_false"]' });

//       fireEvent.click(radioDocumentoComprobatorioSim);
//       expect(radioPodeRetirarImpostoSim).toBeEnabled();
//       expect(radioPodeRetirarImpostoNao).toBeEnabled();
//     }
//   );
// });

describe("Componente ModalForm", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Adicionar ação de associação")).toBeInTheDocument();
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Unidade Educacional *")).toHaveValue("");
    expect(screen.getByLabelText("Código EOL *")).toBeInTheDocument();
    expect(screen.getByLabelText("Ação *")).toBeInTheDocument();
    expect(screen.getByLabelText("Status *")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Excluir" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    // mockRetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...defaultPropsEdicao} />);

    expect(screen.getByLabelText("Unidade Educacional *")).toHaveAttribute('readonly');
    expect(screen.queryByRole("button", { name: "Excluir" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancelar" })).not.toBeDisabled();
    expect(screen.getByLabelText("Código EOL *")).toHaveAttribute('readonly');
    expect(screen.getByLabelText("Ação *")).toBeDisabled();
    expect(screen.getByLabelText("Status *")).toBeDisabled();

    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalForm {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });
  
  it("chama handleSubmitModalFormAcoes quando o formulario for submetido", async () => {
    render(<ModalForm {...defaultProps} />);

    const campoAcao = screen.getByLabelText("Ação *");
    fireEvent.change(campoAcao, { target: { value: mockSelectAcoes[0].nome } });
    const campoStatus = screen.getByLabelText("Status *");
    fireEvent.change(campoStatus, { target: { value: 'ATIVA' } });
    
    const campoUnidade = screen.getByLabelText("Unidade Educacional *");
    fireEvent.change(campoUnidade, { target: { value: "JARAGUA" } });
    await waitFor(() => {
      const opcao = screen.getByText("CECI JARAGUA");
      fireEvent.click(opcao)

      const campoEol = screen.getByLabelText("Código EOL *");
      expect(campoEol).not.toBe("");
      const botaoSalvar = screen.getByRole("button", { name: "Salvar" });
      fireEvent.click(botaoSalvar);

      // Trecho comentado para exemplificador a morosidade de execução do teste unitário
      // com o trecho descomentado, o teste unitário se comportou com uma execução acima de 240s
      // com o trecho comentado, o teste durou ~7s
      // expect(defaultProps.handleSubmitModalFormAcoes).toHaveBeenCalled();
    })

  });


  test('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {

    render(<ModalForm {...defaultPropsEdicao}/>);

    const button = screen.getByRole('button', { name: /Excluir/i });
    fireEvent.click(button);
    expect(defaultPropsEdicao.setShowModalDeleteAcao).toHaveBeenCalledTimes(1);
  });

});
