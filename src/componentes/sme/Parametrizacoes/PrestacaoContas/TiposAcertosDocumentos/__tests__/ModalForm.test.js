import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalForm } from '../components/ModalForm';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { useRecursoSelecionadoContext } from '../../../../../../context/RecursoSelecionado';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

// Mocks dos Hooks e utilitários
jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));
jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes');

// Mock do ModalBootstrap para facilitar a verificação da exibição do conteúdo
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
  ModalFormParametrizacoesAcertos: ({ show, titulo, bodyText }) =>
    show ? (
      <div data-testid="modal-container">
        <h2>{titulo}</h2>
        <div>{bodyText}</div>
      </div>
    ) : null,
}));

describe('Componente <ModalForm />', () => {
  const mockSetStateFormModal = jest.fn();
  const mockHandleSubmitModalFormDocumentos = jest.fn();
  const mockHandleClose = jest.fn();
  const mockHandleShowModalExcluir = jest.fn();

  const mockRecursos = [
    { uuid: 'rec-1', nome: 'Recurso Educação' },
    { uuid: 'rec-2', nome: 'Recurso Saúde' },
  ];

  const mockCategoriaTabela = [
    { id: '1', nome: 'Categoria A' },
    { id: '2', nome: 'Categoria B' },
  ];

  const mockDocumentoTabela = [
    { id: '10', nome: 'Nota Fiscal' },
    { id: '20', nome: 'Recibo' },
  ];

  const defaultStateFormModal = {
    uuid: 'uuid-123',
    id: 99,
    recurso: 'rec-1',
    nome: 'Tipo Acerto Teste',
    categoria: '1',
    tipos_documento_prestacao: ['10'],
    ativo: true,
    pode_alterar_saldo_conciliacao: true,
    operacao: 'create',
  };

  const defaultProps = {
    show: true,
    stateFormModal: defaultStateFormModal,
    handleSubmitModalFormDocumentos: mockHandleSubmitModalFormDocumentos,
    handleClose: mockHandleClose,
    handleShowModalExcluir: mockHandleShowModalExcluir,
    categoriaTabela: mockCategoriaTabela,
    documentoTabela: mockDocumentoTabela,
  };

  const renderComponent = (props = defaultProps, contextValue = {}) => {
    return render(
      <AcertosDocumentosContext.Provider
        value={{
          bloquearBtnSalvarForm: false,
          stateFormModal: props.stateFormModal,
          setStateFormModal: mockSetStateFormModal,
          ...contextValue,
        }}
      >
        <ModalForm {...props} />
      </AcertosDocumentosContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    useRecursoSelecionadoContext.mockReturnValue({ recursos: mockRecursos });
  });

  test('não deve renderizar nada quando a prop show for false', () => {
    renderComponent({ ...defaultProps, show: false });
    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  test('deve renderizar o título correto em modo de criação (create)', () => {
    renderComponent();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Adicionar tipo de acerto em documento'
    );
  });

  test('deve renderizar o título e o ID em modo de edição (edit)', () => {
    const editProps = {
      ...defaultProps,
      stateFormModal: { ...defaultStateFormModal, operacao: 'edit' },
    };
    renderComponent(editProps);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Editar tipo de acerto em documento'
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  test('deve desabilitar o botão Salvar se campos obrigatórios estiverem em branco (validação useEffect)', () => {
    const estadoIncompleto = {
      ...defaultStateFormModal,
      nome: '', // Campo em branco
    };

    renderComponent({ ...defaultProps, stateFormModal: estadoIncompleto });

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    expect(btnSalvar).toBeDisabled();
  });

  test('deve habilitar o botão Salvar quando todos os campos obrigatórios estiverem preenchidos', () => {
    renderComponent();

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    expect(btnSalvar).not.toBeDisabled();
  });

  test('deve atualizar o estado ao alterar o campo de Nome', () => {
    renderComponent();

    const inputNome = screen.getByLabelText(/nome do tipo \*/i);
    fireEvent.change(inputNome, { target: { value: 'Novo Nome' } });

    expect(mockSetStateFormModal).toHaveBeenCalledWith({
      ...defaultStateFormModal,
      nome: 'Novo Nome',
    });
  });

  test('deve atualizar o estado ao selecionar uma Categoria', () => {
    renderComponent();

    const selectCategoria = screen.getByLabelText(/categoria \*/i);
    fireEvent.change(selectCategoria, { target: { value: '2' } });

    expect(mockSetStateFormModal).toHaveBeenCalledWith({
      ...defaultStateFormModal,
      categoria: '2',
    });
  });

  test('deve atualizar o estado ao alterar o radio button de Saldo Conciliação', () => {
    renderComponent();

    const radioNao = screen.getByLabelText('Não', { selector: 'input[name="pode_alterar_saldo_conciliacao"]' });
    fireEvent.click(radioNao);

    expect(mockSetStateFormModal).toHaveBeenCalledWith({
      ...defaultStateFormModal,
      pode_alterar_saldo_conciliacao: false,
    });
  });

  test('deve chamar a função de submit ao clicar em Salvar', () => {
    renderComponent();

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    expect(mockHandleSubmitModalFormDocumentos).toHaveBeenCalledWith(defaultStateFormModal);
  });

  test('deve exibir botão de excluir em modo "edit" e acionar o modal de confirmação', () => {
    const editProps = {
      ...defaultProps,
      stateFormModal: { ...defaultStateFormModal, operacao: 'edit' },
    };
    renderComponent(editProps);

    const btnExcluir = screen.getByRole('button', { name: /excluir/i });
    expect(btnExcluir).toBeInTheDocument();

    fireEvent.click(btnExcluir);
    expect(mockHandleShowModalExcluir).toHaveBeenCalledTimes(1);
  });

  test('deve chamar handleClose ao clicar no botão Cancelar', () => {
    renderComponent();

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('deve desabilitar campos e botão salvar quando o usuário NÃO tiver permissão de edição', () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    renderComponent();

    const inputNome = screen.getByLabelText(/nome do tipo \*/i);
    const selectCategoria = screen.getByLabelText(/categoria \*/i);
    const btnSalvar = screen.getByRole('button', { name: /salvar/i });

    expect(inputNome).toBeDisabled();
    expect(selectCategoria).toBeDisabled();
    expect(btnSalvar).toBeDisabled();
  });
});