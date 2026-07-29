import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ModalForm } from '../components/ModalForm';
import { AcertosLancamentosContext } from '../context/AcertosLancamentos';
import { useRecursoSelecionadoContext } from '../../../../../../context/RecursoSelecionado';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

// --- MOCKS DE DEPENDÊNCIAS EXTERNAS ---

// 1. Mock das permissões
jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

// 2. Mock do hook de recurso selecionado
jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

// 3. Mock do componente de Modal customizado para renderizar diretamente na DOM de teste
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
  ModalFormParametrizacoesAcertos: ({ show, titulo, bodyText }) =>
    show ? (
      <div data-testid="modal-container">
        <h2>{titulo}</h2>
        <div>{bodyText}</div>
      </div>
    ) : null,
}));

// 4. Mock do FontAwesomeIcon
jest.mock('@fortawesome/react-fontawesome', () => ({
  FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

describe('Componente: ModalForm', () => {
  // Mocks padrão das props e contextos
  const mockHandleClose = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockSetStateFormModal = jest.fn();

  const mockCategorias = [
    { id: '1', nome: 'Categoria 1' },
    { id: '2', nome: 'Categoria 2' },
  ];

  const mockRecursos = [
    { uuid: 'rec-1', nome: 'Recurso 1' },
    { uuid: 'rec-2', nome: 'Recurso 2' },
  ];

  const defaultStateFormModal = {
    operacao: 'create',
    recurso: 'rec-1',
    nome: 'Tipo Teste',
    categoria: '1',
    pode_alterar_saldo_conciliacao: true,
    ativo: true,
  };

  const renderComponent = (
    customContextState = {},
    props = {}
  ) => {
    const contextValue = {
      stateFormModal: { ...defaultStateFormModal, ...customContextState },
      setStateFormModal: mockSetStateFormModal,
      bloquearBtnSalvarForm: false,
    };

    const defaultProps = {
      show: true,
      handleClose: mockHandleClose,
      handleSubmit: mockHandleSubmit,
      categoriaTabela: mockCategorias,
      onDelete: mockOnDelete,
      ...props,
    };

    return render(
      <AcertosLancamentosContext.Provider value={contextValue}>
        <ModalForm {...defaultProps} />
      </AcertosLancamentosContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Permissão habilitada por padrão
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
    // Dados de recursos mockados
    useRecursoSelecionadoContext.mockReturnValue({ recursos: mockRecursos });
  });

  describe('Renderização e Títulos', () => {
    test('não deve renderizar a modal quando "show" for false', () => {
      renderComponent({}, { show: false });
      expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
    });

    test('deve exibir o título correto para operação de criação (create)', () => {
      renderComponent({ operacao: 'create' });
      expect(
        screen.getByRole('heading', { name: /Adicionar tipo de acerto em lançamento/i })
      ).toBeInTheDocument();
    });

    test('deve exibir o título correto para operação de edição (edit)', () => {
      renderComponent({ operacao: 'edit' });
      expect(
        screen.getByRole('heading', { name: /Editar tipo de acerto em lançamento/i })
      ).toBeInTheDocument();
    });
  });

  describe('Comportamento dos Campos e Interações', () => {
    test('deve carregar os campos com os valores iniciais do contexto', () => {
      renderComponent();

      expect(screen.getByLabelText(/Nome do tipo \*/i)).toHaveValue('Tipo Teste');
      expect(screen.getByLabelText(/Categoria \*/i)).toHaveValue('1');
      expect(screen.getByLabelText(/Sim/i, { selector: '#pode_alterar_saldo_conciliacao_sim' })).toBeChecked();
      expect(screen.getByLabelText(/Sim/i, { selector: '#ativo-sim' })).toBeChecked();
    });

    test('deve chamar setStateFormModal ao alterar o campo Nome', () => {
      renderComponent();

      const inputNome = screen.getByLabelText(/Nome do tipo \*/i);
      fireEvent.change(inputNome, { target: { value: 'Novo Nome' } });

      expect(mockSetStateFormModal).toHaveBeenCalledWith({
        ...defaultStateFormModal,
        nome: 'Novo Nome',
      });
    });

    test('deve chamar setStateFormModal ao alterar a Categoria', () => {
      renderComponent();

      const selectCategoria = screen.getByLabelText(/Categoria \*/i);
      fireEvent.change(selectCategoria, { target: { value: '2' } });

      expect(mockSetStateFormModal).toHaveBeenCalledWith({
        ...defaultStateFormModal,
        categoria: '2',
      });
    });

    test('deve chamar setStateFormModal ao mudar as opções dos Radio Buttons', () => {
      renderComponent();

      const radioConciliacaoNao = screen.getByLabelText(/Não/i, { selector: '#pode_alterar_saldo_conciliacao_nao' });
      fireEvent.click(radioConciliacaoNao);

      expect(mockSetStateFormModal).toHaveBeenCalledWith({
        ...defaultStateFormModal,
        pode_alterar_saldo_conciliacao: false,
      });

      const radioAtivoNao = screen.getByLabelText(/Não/i, { selector: '#ativo-nao' });
      fireEvent.click(radioAtivoNao);

      expect(mockSetStateFormModal).toHaveBeenCalledWith({
        ...defaultStateFormModal,
        ativo: false,
      });
    });
  });

  describe('Validação e Habilitação do Botão Salvar', () => {
    test('deve desabilitar o botão Salvar quando "nome" estiver vazio', () => {
      renderComponent({ nome: '' });
      const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
      expect(btnSalvar).toBeDisabled();
    });

    test('deve desabilitar o botão Salvar quando "categoria" estiver vazia', () => {
      renderComponent({ categoria: '' });
      const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
      expect(btnSalvar).toBeDisabled();
    });

    test('deve habilitar o botão Salvar se "nome" e "categoria" estiverem preenchidos e houver permissão', () => {
      renderComponent({ nome: 'Valid Name', categoria: '1' });
      const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
      expect(btnSalvar).not.toBeDisabled();
    });
  });

  describe('Ações de Botões', () => {
    test('deve chamar handleSubmit com stateFormModal ao clicar em Salvar', () => {
      renderComponent();

      const btnSalvar = screen.getByRole('button', { name: /Salvar/i });
      fireEvent.click(btnSalvar);

      expect(mockHandleSubmit).toHaveBeenCalledWith(defaultStateFormModal);
    });

    test('deve chamar handleClose ao clicar no botão Cancelar', () => {
      renderComponent();

      const btnCancelar = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(btnCancelar);

      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    test('deve renderizar o botão Excluir e disparar onDelete apenas quando a operação for "edit"', () => {
      const { rerender } = renderComponent({ operacao: 'create' });

      expect(screen.queryByRole('button', { name: /Excluir/i })).not.toBeInTheDocument();

      rerender(
        <AcertosLancamentosContext.Provider
          value={{
            stateFormModal: { ...defaultStateFormModal, operacao: 'edit' },
            setStateFormModal: mockSetStateFormModal,
            bloquearBtnSalvarForm: false,
          }}
        >
          <ModalForm
            show={true}
            handleClose={mockHandleClose}
            handleSubmit={mockHandleSubmit}
            categoriaTabela={mockCategorias}
            onDelete={mockOnDelete}
          />
        </AcertosLancamentosContext.Provider>
      );

      const btnExcluir = screen.getByRole('button', { name: /Excluir/i });
      expect(btnExcluir).toBeInTheDocument();

      fireEvent.click(btnExcluir);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('Regras de Permissão de Edição', () => {
    test('deve desabilitar os campos e botões quando o usuário não tiver permissão de edição', () => {
      // Força a função de permissão a retornar FALSE
      RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

      renderComponent({ operacao: 'edit' });

      expect(screen.getByLabelText(/Nome do tipo \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/Categoria \*/i)).toBeDisabled();
      expect(screen.getByLabelText(/Sim/i, { selector: '#pode_alterar_saldo_conciliacao_sim' })).toBeDisabled();
      expect(screen.getByLabelText(/Sim/i, { selector: '#ativo-sim' })).toBeDisabled();
      
      expect(screen.getByRole('button', { name: /Salvar/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Excluir/i })).toBeDisabled();
    });
  });
});