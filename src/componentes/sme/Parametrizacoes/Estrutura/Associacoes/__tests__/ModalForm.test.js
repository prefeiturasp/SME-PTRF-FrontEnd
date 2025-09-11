import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalFormAssociacoes from "../ModalFormAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { waitFor } from '@testing-library/react';
import {mockTabelaAssociacoes, mockListaPeriodos} from "../__fixtures__/mockData";

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

const mockHandleClose = jest.fn();
const mockHandleSubmitModalFormAssociacoes = jest.fn();
const mockCarregaUnidadePeloCodigoEol = jest.fn();
const mockOnDeleteAssocicacaoTratamento = jest.fn();

const EditStateFormModal = {
    nome: 'ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA',
    uuid_unidade: 'acf92a00-3fc7-4c41-8eab-ee54e3864052',
    codigo_eol_unidade: '200204',
    observacao: '',
    tipo_unidade: 'CECI',
    nome_unidade: 'JARAGUA',
    cnpj: '11.267.355/0001-68',
    periodo_inicial: 'def64363-d264-4137-ac91-5a367b837131' ,
    ccm: '4.184.240-5',
    email: 'CECIJARAGUA123@SME.PREFEITURA.SP.GOV.BR',
    status_regularidade: '-',
    processo_regularidade: '',
    uuid:"5003fbd5-fd37-40eb-8889-e40042ec7e77",
    id: 1188,
    operacao: "edit"
};

const initialStateFormModal = {
    nome: '',
    uuid_unidade: '',
    codigo_eol_unidade: '',
    observacao: '',
    tipo_unidade: '',
    nome_unidade: '',
    cnpj: '',
    periodo_inicial: '' ,
    ccm: '',
    email: '',
    status_regularidade: '',
    processo_regularidade: '',
    uuid:"",
    id:"",
    operacao: 'create',
};

const defaultProps = {
  show: true,
  stateFormModal: initialStateFormModal,
  listaDePeriodos: mockListaPeriodos,
  tabelaAssociacoes: mockTabelaAssociacoes,
  carregaUnidadePeloCodigoEol: mockCarregaUnidadePeloCodigoEol,
  errosCodigoEol: "",
  handleClose: mockHandleClose,
  handleSubmitModalFormAssociacoes: mockHandleSubmitModalFormAssociacoes,
  onDeleteAssocicacaoTratamento: mockOnDeleteAssocicacaoTratamento
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: EditStateFormModal
};

describe("Componente ModalForm", () => {

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalFormAssociacoes {...defaultProps} />);

    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome*")).toHaveValue("");
    expect(screen.getByLabelText("Código EOL*")).toHaveValue("");
    expect(screen.getByLabelText("CNPJ")).toHaveValue("");
    expect(screen.getByLabelText("Nº processo regularidade")).toHaveValue("");
    expect(screen.getByLabelText("CCM")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Período inicial*")).toHaveValue("");
    expect(screen.getByLabelText("Data de encerramento")).toHaveValue("");

    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();

  });

  it("Renderiza a Modal quando a operação é Cadastro e Permissão False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalFormAssociacoes {...defaultProps} />);

    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome*")).toHaveValue("");
    expect(screen.getByLabelText("Código EOL*")).toHaveValue("");
    expect(screen.getByLabelText("CNPJ")).toHaveValue("");
    expect(screen.getByLabelText("Nº processo regularidade")).toHaveValue("");
    expect(screen.getByLabelText("CCM")).toHaveValue("");
    expect(screen.getByLabelText("Email")).toHaveValue("");
    expect(screen.getByLabelText("Período inicial*")).toHaveValue("");
    expect(screen.getByLabelText("Data de encerramento")).toHaveValue("");

    expect(screen.queryByRole("button", { name: "Apagar" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é True", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    render(<ModalFormAssociacoes {...defaultPropsEdicao} />);
    
    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome*")).toHaveValue("ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA");
    expect(screen.getByLabelText("Código EOL*")).toHaveValue("200204");
    expect(screen.getByLabelText("CNPJ")).toHaveValue("11.267.355/0001-68");
    expect(screen.getByLabelText("Nº processo regularidade")).toHaveValue("");
    expect(screen.getByLabelText("CCM")).toHaveValue("4.184.240-5");
    expect(screen.getByLabelText("Email")).toHaveValue("CECIJARAGUA123@SME.PREFEITURA.SP.GOV.BR");
    expect(screen.getByLabelText("Data de encerramento")).toHaveValue("");

    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
  });

  it("Renderiza a Modal quando a operação é Edição e permissão é False", () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalFormAssociacoes {...defaultPropsEdicao} />);

    expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome*")).toHaveValue("ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA");
    expect(screen.getByLabelText("Código EOL*")).toHaveValue("200204");
    expect(screen.getByLabelText("CNPJ")).toHaveValue("11.267.355/0001-68");
    expect(screen.getByLabelText("Nº processo regularidade")).toHaveValue("");
    expect(screen.getByLabelText("CCM")).toHaveValue("4.184.240-5");
    expect(screen.getByLabelText("Email")).toHaveValue("CECIJARAGUA123@SME.PREFEITURA.SP.GOV.BR");
    expect(screen.getByLabelText("Data de encerramento")).toHaveValue("");

    expect(screen.queryByRole("button", { name: "Apagar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("Chama a ação de fechar modal quando o botão Cancelar for clicado", () => {
    render(<ModalFormAssociacoes {...defaultProps} />);
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it('deve chamar setShowModalConfirmDelete quando o botão for clicado', () => {

    // Renderize o componente, passando as props necessárias
    render(<ModalFormAssociacoes {...defaultPropsEdicao}/>);

    const button = screen.getByRole('button', { name: /Apagar/i });
    fireEvent.click(button);
    expect(mockOnDeleteAssocicacaoTratamento).toHaveBeenCalledTimes(1);
  });

  it("Exibe o nome da DRE tratado no modo Cadastro quando retornado da busca por EOL", async () => {
    mockCarregaUnidadePeloCodigoEol.mockImplementation((valor, setFieldValue) => {
      setFieldValue('nome_dre', 'DIRETORIA REGIONAL DE EDUCACAO DRE BUTANTÃ');
    });

    render(<ModalFormAssociacoes {...defaultProps} />);

    const inputEol = screen.getByLabelText("Código EOL*");
    fireEvent.change(inputEol, { target: { value: '123456' } });

    await waitFor(() => {
      const inputDre = screen.getByLabelText("DRE");
      expect(inputDre).toHaveValue("DRE BUTANTÃ");
      expect(inputDre).toBeDisabled();
    });
  });

  it("Exibe o nome da DRE tratado no modo Edição", () => {
    const propsEdicaoComDre = {
      ...defaultPropsEdicao,
      stateFormModal: {
        ...EditStateFormModal,
        nome_dre: 'DIRETORIA REGIONAL DE EDUCACAO DRE IPIRANGA'
      }
    };

    render(<ModalFormAssociacoes {...propsEdicaoComDre} />);

    const inputDre = screen.getByLabelText("DRE");
    expect(inputDre).toHaveValue("DRE IPIRANGA");
    expect(inputDre).toBeDisabled();
  });

});