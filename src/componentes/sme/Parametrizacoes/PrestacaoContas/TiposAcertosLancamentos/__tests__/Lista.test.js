import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Lista } from '../components/Lista';
import { AcertosLancamentosContext } from '../context/AcertosLancamentos';
import { useGetAcertosLancamentos } from '../hooks/useGetAcertosLancamentos';
import { usePostAcertosLancamentos } from '../hooks/usePostAcertosLancamentos';
import { usePatchAcertosLancamentos } from '../hooks/usePatchAcertosLancamentos';
import { useDeleteAcertosLancamentos } from '../hooks/useDeleteAcertosLancamentos';

// --- MOCKS DOS HOOKS CUSTOMIZADOS ---
jest.mock('../hooks/useGetAcertosLancamentos');
jest.mock('../hooks/usePostAcertosLancamentos');
jest.mock('../hooks/usePatchAcertosLancamentos');
jest.mock('../hooks/useDeleteAcertosLancamentos');

// --- MOCKS DOS COMPONENTES E UTILITÁRIOS ---
jest.mock('../../../../../../utils/Loading', () => () => (
  <div data-testid="loading-spinner">Carregando...</div>
));

jest.mock('../../../../../Globais/Mensagens/MsgImgCentralizada', () => ({
  MsgImgCentralizada: ({ texto }) => <div data-testid="msg-empty">{texto}</div>,
}));

jest.mock('../../../../../../assets/img/img-404.svg', () => 'img-404.svg');

jest.mock('../../../../../Globais/UI/Button', () => ({
  EditIconButton: ({ onClick }) => (
    <button data-testid="btn-editar" onClick={onClick}>
      Editar
    </button>
  ),
}));

jest.mock('../components/ModalForm', () => ({
  ModalForm: ({ show, handleClose, handleSubmit, onDelete }) =>
    show ? (
      <div data-testid="modal-form">
        <button data-testid="modal-form-close" onClick={handleClose}>
          Fechar
        </button>
        <button
          data-testid="modal-form-submit-create"
          onClick={() =>
            handleSubmit({
              operacao: 'create',
              nome: 'Novo Acerto',
              categoria: '1',
              ativo: true,
              pode_alterar_saldo_conciliacao: false,
              recurso: 'rec-1',
            })
          }
        >
          Salvar Criacao
        </button>
        <button
          data-testid="modal-form-submit-edit"
          onClick={() =>
            handleSubmit({
              uuid: 'uuid-123',
              operacao: 'edit',
              nome: 'Acerto Editado',
              categoria: '1',
              ativo: true,
              pode_alterar_saldo_conciliacao: true,
              recurso: 'rec-1',
            })
          }
        >
          Salvar Edicao
        </button>
        <button data-testid="modal-form-delete" onClick={onDelete}>
          Excluir Form
        </button>
      </div>
    ) : null,
}));

jest.mock('../components/ModalConfirmacaoExclusao', () => ({
  ModalConfirmacaoExclusao: ({ open, onOk, onCancel }) =>
    open ? (
      <div data-testid="modal-confirm-delete">
        <button data-testid="btn-confirm-delete" onClick={onOk}>
          Confirmar Exclusao
        </button>
        <button data-testid="btn-cancel-delete" onClick={onCancel}>
          Cancelar Exclusao
        </button>
      </div>
    ) : null,
}));

// Mock do PrimeReact DataTable usando require('react') internamente para evitar ReferenceError
jest.mock('primereact/datatable', () => {
  const ReactInsideMock = require('react');

  return {
    DataTable: ({ value, children }) => (
      <table>
        <tbody>
          {value.map((item, idx) => (
            <tr key={item.uuid || idx}>
              {ReactInsideMock.Children.map(children, (child) => {
                if (!child || !child.props) return null;
                const { field, body } = child.props;
                let content = item[field];
                if (body) {
                  content = body(item);
                }
                return <td>{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    ),
  };
});

jest.mock('primereact/column', () => ({
  Column: () => null,
}));

describe('Componente: Lista', () => {
  const mockMutatePost = jest.fn();
  const mockMutatePatch = jest.fn();
  const mockMutateDelete = jest.fn();

  const mockSetShowModalForm = jest.fn();
  const mockSetStateFormModal = jest.fn();
  const mockSetBloquearBtnSalvarForm = jest.fn();
  const mockSetShowModalConfirmacaoExclusao = jest.fn();

  const mockCategorias = [
    { id: '1', nome: 'Categoria Teste 1' },
    { id: '2', nome: 'Categoria Teste 2' },
  ];

  const defaultContextValue = {
    setShowModalForm: mockSetShowModalForm,
    stateFormModal: { uuid: 'uuid-123' },
    setStateFormModal: mockSetStateFormModal,
    setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    showModalForm: false,
    showModalConfirmacaoExclusao: false,
    setShowModalConfirmacaoExclusao: mockSetShowModalConfirmacaoExclusao,
    tabelas: { categorias: mockCategorias },
    initialStateFormModal: { nome: '', categoria: '' },
  };

  const mockDataList = [
    {
      uuid: 'uuid-123',
      id: 1,
      nome: 'Acerto de Caixa',
      categoria: '1',
      ativo: true,
      pode_alterar_saldo_conciliacao: true,
      recurso: 'rec-1',
    },
    {
      uuid: 'uuid-456',
      id: 2,
      nome: 'Ajuste Banco',
      categoria: '2',
      ativo: false,
      pode_alterar_saldo_conciliacao: false,
      recurso: 'rec-2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    usePostAcertosLancamentos.mockReturnValue({
      mutationPost: { mutate: mockMutatePost },
    });
    usePatchAcertosLancamentos.mockReturnValue({
      mutationPatch: { mutate: mockMutatePatch },
    });
    useDeleteAcertosLancamentos.mockReturnValue({
      mutationDelete: { mutate: mockMutateDelete },
    });
  });

  const renderComponent = (customContext = {}, queryHookValue = {}) => {
    useGetAcertosLancamentos.mockReturnValue({
      isLoading: false,
      data: mockDataList,
      ...queryHookValue,
    });

    return render(
      <AcertosLancamentosContext.Provider value={{ ...defaultContextValue, ...customContext }}>
        <Lista />
      </AcertosLancamentosContext.Provider>
    );
  };

  describe('Estados de Carregamento e Exibição de Dados', () => {
    test('deve renderizar o indicador de Loading quando isLoading for true', () => {
      renderComponent({}, { isLoading: true, data: [] });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.queryByTestId('msg-empty')).not.toBeInTheDocument();
    });

    test('deve exibir a mensagem de lista vazia quando não houver dados', () => {
      renderComponent({}, { isLoading: false, data: [] });

      expect(screen.getByTestId('msg-empty')).toBeInTheDocument();
      expect(screen.getByText('Não há lançamentos')).toBeInTheDocument();
    });

    test('deve renderizar a tabela com os dados e templates formatados corretamente', () => {
      renderComponent();

      expect(screen.getByText('Acerto de Caixa')).toBeInTheDocument();
      expect(screen.getByText('Ajuste Banco')).toBeInTheDocument();

      expect(screen.getByText('Categoria Teste 1')).toBeInTheDocument();
      expect(screen.getByText('Categoria Teste 2')).toBeInTheDocument();

      expect(screen.getByText('Sim')).toBeInTheDocument();
      expect(screen.getByText('Não')).toBeInTheDocument();
    });
  });

  describe('Interações com o Form Modal', () => {
    test('deve preparar os dados e abrir o modal de formulário ao clicar em Editar', () => {
      renderComponent();

      const btnsEditar = screen.getAllByTestId('btn-editar');
      fireEvent.click(btnsEditar[0]);

      expect(mockSetStateFormModal).toHaveBeenCalledWith({
        uuid: 'uuid-123',
        id: 1,
        recurso: 'rec-1',
        nome: 'Acerto de Caixa',
        categoria: '1',
        ativo: true,
        pode_alterar_saldo_conciliacao: true,
        operacao: 'edit',
      });
      expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
    });

    test('deve resetar o estado do formulário e fechar a modal ao chamar onHandleClose', () => {
      renderComponent({ showModalForm: true });

      const btnCloseModal = screen.getByTestId('modal-form-close');
      fireEvent.click(btnCloseModal);

      expect(mockSetStateFormModal).toHaveBeenCalledWith(defaultContextValue.initialStateFormModal);
      expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
    });

    test('deve chamar mutationPost ao submeter o formulário em modo "create"', () => {
      renderComponent({ showModalForm: true });

      const btnSubmitCreate = screen.getByTestId('modal-form-submit-create');
      fireEvent.click(btnSubmitCreate);

      expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
      expect(mockMutatePost).toHaveBeenCalledWith({
        payload: {
          nome: 'Novo Acerto',
          categoria: '1',
          ativo: true,
          pode_alterar_saldo_conciliacao: false,
          recurso: 'rec-1',
        },
      });
    });

    test('deve chamar mutationPatch ao submeter o formulário em modo "edit"', () => {
      renderComponent({ showModalForm: true });

      const btnSubmitEdit = screen.getByTestId('modal-form-submit-edit');
      fireEvent.click(btnSubmitEdit);

      expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
      expect(mockMutatePatch).toHaveBeenCalledWith({
        uuid: 'uuid-123',
        payload: {
          nome: 'Acerto Editado',
          categoria: '1',
          ativo: true,
          pode_alterar_saldo_conciliacao: true,
          recurso: 'rec-1',
        },
      });
    });
  });

  describe('Fluxo de Confirmação e Exclusão', () => {
    test('deve abrir o modal de confirmação de exclusão ao solicitar a deleção', () => {
      renderComponent({ showModalForm: true });

      const btnDeleteForm = screen.getByTestId('modal-form-delete');
      fireEvent.click(btnDeleteForm);

      expect(mockSetShowModalConfirmacaoExclusao).toHaveBeenCalledWith(true);
    });

    test('deve disparar a deleção com o uuid correto e fechar o modal de confirmação ao aceitar', () => {
      renderComponent({
        showModalConfirmacaoExclusao: true,
        stateFormModal: { uuid: 'uuid-123' },
      });

      const btnConfirmDelete = screen.getByTestId('btn-confirm-delete');
      fireEvent.click(btnConfirmDelete);

      expect(mockMutateDelete).toHaveBeenCalledWith('uuid-123');
      expect(mockSetShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
    });

    test('deve fechar o modal de confirmação de exclusão sem deletar ao cancelar', () => {
      renderComponent({ showModalConfirmacaoExclusao: true });

      const btnCancelDelete = screen.getByTestId('btn-cancel-delete');
      fireEvent.click(btnCancelDelete);

      expect(mockMutateDelete).not.toHaveBeenCalled();
      expect(mockSetShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
    });
  });
});