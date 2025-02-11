import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalFormArquivosDeCarga from "../ModalFormArquivosDeCarga";
import { waitFor } from '@testing-library/react';
import { 
  mockTabelaArquivos as tabelaArquivos,
  // mockListaArquivos as listaArquivos,
  mockPeriodos as periodos,
  mockTipoContas as tipoContas
 } from '../__fixtures__/mockData';

const mockSetFieldValue = jest.fn();
const mockSetShowModalConfirmDelete = jest.fn();
const mockHandleCloseFormModal = jest.fn();
const mockHandleSubmitFormModal = jest.fn();

const mockEdit = {
  identificador: 'carga_007',
  tipo_carga: 'CARGA_ACOES_ASSOCIACOES',
  tipo_delimitador: 'DELIMITADOR_PONTO_VIRGULA',
  ultima_execucao: '10/02/2025',
  status: 'SUCESSO',
  conteudo: '',
  valida_conteudo: false,
  nome_arquivo: 'acoes_associacoes_T5yL7dd.csv',
  log: "\n3 linha(s) importada(s) com sucesso. 0 erro(s) reportado(s).",
  periodo: null,
  tipo_de_conta: null,
  id: 1,
  uuid: "ba8b96ef-f05c-41f3-af10-73753490c543",
  operacao: "edit"
};

const mockCreate = {
  identificador: '',
  tipo_carga: '',
  tipo_delimitador: '',
  ultima_execucao: '',
  status: '',
  conteudo: '',
  valida_conteudo: true,
  nome_arquivo: '',
  uuid: "",
  id: "",
  log: "",
  operacao: 'create',
};

const mockDadosOrigem = {
  titulo: 'Ações das Associações',
  titulo_modal: 'ações das associações',
  acesso_permitido: true,
  UrlsMenuInterno:[
      {label: "Ações das associações", url: "parametro-acoes-associacoes"},
      {label: "Cargas de arquivo", url: 'parametro-arquivos-de-carga', origem:'CARGA_ACOES_ASSOCIACOES'},
  ],
}


const mockStatusTemplate = (rowData='', status_estatico='') => {
  if (tabelaArquivos && tabelaArquivos.status && tabelaArquivos.status.length > 0) {
      let status_retornar;
      if (rowData){
          status_retornar = tabelaArquivos.status.filter(item => item.id === rowData.status);
      }else if(status_estatico){
          status_retornar = tabelaArquivos.status.filter(item => item.id === status_estatico);
      }else {
          return ''
      }
      return status_retornar[0].nome
  }
};


const defaultProps = {
  show: true,
  stateFormModal: mockCreate,
  tabelaArquivos: tabelaArquivos,
  statusTemplate: mockStatusTemplate,
  handleClose: mockHandleCloseFormModal,
  handleSubmitModalForm: mockHandleSubmitFormModal,
  dadosDeOrigem: mockDadosOrigem,
  periodos: periodos,
  arquivoRequerPeriodo: false,
  tiposDeContas: tipoContas,
  arquivoRequerTipoDeConta: false
};

const defaultPropsEdicao = {
  ...defaultProps,
  stateFormModal: mockEdit
};

describe('Componente Filtros', () => {

  it('deve renderizar os campos e botões', () => {
    
    render(<ModalFormArquivosDeCarga {...defaultProps} />);

    expect(screen.getByText("Adicionar ações das associações")).toBeInTheDocument();
    expect(screen.getByText("* Campos obrigatórios")).toBeInTheDocument();
    expect(screen.getByLabelText("Identificador *")).toHaveValue("");
    expect(screen.getByLabelText("Conteúdo *")).toHaveValue("");
    expect(screen.getByLabelText("Tipo delimitador")).toHaveValue("");
    expect(screen.getByLabelText("Última execução")).toHaveValue("");
    expect(screen.getByLabelText("Status")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Cancelar" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar e enviar" })).toBeInTheDocument();

  });

  it("chama handleSubmitModalForm quando o formulario for submetido", async () => {
    render(<ModalFormArquivosDeCarga {...defaultProps} />);

    const identificador_input = screen.getByLabelText("Identificador *");
    const conteudo_input = screen.getByLabelText("Conteúdo *");
    const tem_limitador_input = screen.getByLabelText("Tipo delimitador");
    const saveButton = screen.getByRole("button", { name: "Salvar e enviar" });
    const arquivo = new File(["teste"], "arquivo123.csv", { type: "text/csv" });

    fireEvent.change(identificador_input, { target: { value: "carga_007" } });
    fireEvent.change(conteudo_input, { target: { files: [arquivo] } });
    fireEvent.change(tem_limitador_input, { target: { value: "DELIMITADOR_PONTO_VIRGULA" } });
    fireEvent.click(saveButton);

    await waitFor(() => {
        expect(defaultProps.handleSubmitModalForm).toHaveBeenCalledTimes(1);
    });
  });

  it("Renderiza o Modal quando a operação é Criação e chama handleSubmitModalForm com campos em branco", async () => {
    render(<ModalFormArquivosDeCarga {...defaultProps} />);

    const saveButton = screen.getByRole("button", { name: "Salvar e enviar" });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/Identificador é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/Arquivo de Carga é obrigatório/i)).toBeInTheDocument();
      expect(defaultProps.handleSubmitModalForm).toHaveBeenCalledTimes(0)
    })
  });

  it("Renderiza o Modal quando a operação é Criação e requerPeriodo é true", async () => {
    const propsRequerPeriodo = {
      ...defaultProps,
      arquivoRequerPeriodo: true,
      arquivoRequerTipoDeConta: true
    }
    render(<ModalFormArquivosDeCarga {...propsRequerPeriodo} />);

    const campoPeriodo = screen.getByLabelText("Período *");
    expect(campoPeriodo).toBeInTheDocument();

    const campoTipoConta = screen.getByLabelText("Tipo de conta *");
    expect(campoTipoConta).toBeInTheDocument();

  });

  it("Renderiza a Modal quando a operação é Edição", () => {
    render(<ModalFormArquivosDeCarga {...defaultPropsEdicao} />);
    
    expect(screen.getByLabelText("Identificador *")).toHaveValue("carga_007");
    expect(screen.getByLabelText("Tipo delimitador")).toHaveValue("DELIMITADOR_PONTO_VIRGULA");
  });

  it("Chama a ação de fechar modal de Criação quando o botão Cancelar for clicado", () => {
    render(<ModalFormArquivosDeCarga {...defaultProps} />)
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

  it("Chama a ação de fechar modal de Edição quando o botão Cancelar for clicado", () => {
    render(<ModalFormArquivosDeCarga {...defaultPropsEdicao} />)
    const cancelButton = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(cancelButton);
    expect(defaultProps.handleClose).toHaveBeenCalled();
  });

});