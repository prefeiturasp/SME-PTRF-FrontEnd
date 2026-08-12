import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Lista } from '../components/Lista';
import { AcertosDocumentosContext } from '../context/AcertosDocumentos';
import { useGetAcertosDocumentos } from '../hooks/useGetAcertosDocumentos';
import { usePostAcertosDocumentos } from '../hooks/usePostAcertosDocumentos';
import { usePatchAcertosDocumentos } from '../hooks/usePatchAcertosDocumentos';
import { useDeleteAcertosDocumentos } from '../hooks/useDeleteAcertosDocumentos';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';

// Mocks de Hooks Customizados
jest.mock('../hooks/useGetAcertosDocumentos');
jest.mock('../hooks/usePostAcertosDocumentos');
jest.mock('../hooks/usePatchAcertosDocumentos');
jest.mock('../hooks/useDeleteAcertosDocumentos');
jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext');

// Mocks de Subcomponentes Filhos
jest.mock('../components/ModalForm', () => ({
  ModalForm: ({ show, handleSubmitModalFormDocumentos, serviceCrudDocumentos, handleClose }) =>
    show ? (
      <div data-testid="modal-form">
        <button
          onClick={() =>
            handleSubmitModalFormDocumentos({
              nome: 'Novo Acerto',
              categoria: 1,
              tipos_documento_prestacao: [10],
              ativo: true,
              pode_alterar_saldo_conciliacao: false,
              recurso: 'recurso-uuid',
              operacao: 'create',
            })
          }
        >
          Salvar Criar
        </button>
        <button
          onClick={() =>
            handleSubmitModalFormDocumentos({
              uuid: 'item-uuid-1',
              nome: 'Acerto Editado',
              categoria: 1,
              tipos_documento_prestacao: ['all'],
              ativo: true,
              pode_alterar_saldo_conciliacao: false,
              recurso: 'recurso-uuid',
              operacao: 'edit',
            })
          }
        >
          Salvar Editar Com All
        </button>
        <button onClick={serviceCrudDocumentos}>Excluir via Form</button>
        <button onClick={handleClose}>Fechar Modal Form</button>
      </div>
    ) : null,
}));

jest.mock('../components/ModalConfirmacaoExclusao', () => ({
  ModalConfirmacaoExclusao: ({ open, onOk, onCancel }) =>
    open ? (
      <div data-testid="modal-confirmacao">
        <button onClick={onOk}>Confirmar Exclusão</button>
        <button onClick={onCancel}>Cancelar Exclusão</button>
      </div>
    ) : null,
}));

jest.mock('../../../../../../utils/Loading', () => () => <div data-testid="loading-spinner">Carregando...</div>);

describe('Componente <Lista />', () => {
  const mockSetShowModalForm = jest.fn();
  const mockSetStateFormModal = jest.fn();
  const mockSetBloquearBtnSalvarForm = jest.fn();
  const mockSetShowModalConfirmacaoExclusao = jest.fn();

  const mockMutatePost = jest.fn();
  const mockMutatePatch = jest.fn();
  const mockMutateDelete = jest.fn();

  const mockSelectedRecurso = { uuid: 'recurso-uuid-123' };

  const mockTabelas = {
    categorias: [
      { id: 1, nome: 'Categoria Teste' },
      { id: 2, nome: 'Outra Categoria' },
    ],
    documentos: [
      { id: 10, nome: 'Doc Prestacao 1' },
      { id: 20, nome: 'Doc Prestacao 2' },
    ],
  };

  const mockData = [
    {
      id: 1,
      uuid: 'uuid-item-1',
      nome: 'Acerto Nota Fiscal',
      categoria: 1,
      tipos_documento_prestacao: [{ id: 10, nome: 'Doc Prestacao 1' }],
      ativo: true,
      pode_alterar_saldo_conciliacao: true,
      recurso: 'recurso-uuid-123',
    },
    {
      id: 2,
      uuid: 'uuid-item-2',
      nome: 'Acerto Recibo',
      categoria: 99, // Categoria inexistente na tabela para testar fallback
      tipos_documento_prestacao: [{ id: 20, nome: 'Doc Prestacao 2' }],
      ativo: false,
      pode_alterar_saldo_conciliacao: false,
      recurso: 'recurso-uuid-123',
    },
  ];

  const defaultContextValues = {
    setShowModalForm: mockSetShowModalForm,
    stateFormModal: { uuid: 'uuid-item-1', id: 1, operacao: 'edit' },
    setStateFormModal: mockSetStateFormModal,
    setBloquearBtnSalvarForm: mockSetBloquearBtnSalvarForm,
    showModalForm: false,
    showModalConfirmacaoExclusao: false,
    setShowModalConfirmacaoExclusao: mockSetShowModalConfirmacaoExclusao,
    tabelas: mockTabelas,
  };

  const renderComponent = (customContext = {}) => {
    return render(
      <AcertosDocumentosContext.Provider value={{ ...defaultContextValues, ...customContext }}>
        <Lista />
      </AcertosDocumentosContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAbasPorRecursoContext.mockReturnValue({ selectedRecurso: mockSelectedRecurso });
    useGetAcertosDocumentos.mockReturnValue({ isLoading: false, data: mockData });
    usePostAcertosDocumentos.mockReturnValue({ mutationPost: { mutate: mockMutatePost } });
    usePatchAcertosDocumentos.mockReturnValue({ mutationPatch: { mutate: mockMutatePatch } });
    useDeleteAcertosDocumentos.mockReturnValue({ mutationDelete: { mutate: mockMutateDelete } });
  });

  test('deve exibir indicador de carregamento quando isLoading for true', () => {
    useGetAcertosDocumentos.mockReturnValue({ isLoading: true, data: [] });

    renderComponent();

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  test('deve exibir mensagem de nenhum resultado quando a lista estiver vazia', () => {
    useGetAcertosDocumentos.mockReturnValue({ isLoading: false, data: [] });

    renderComponent();

    expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
  });

  test('deve renderizar a tabela com os dados formatados corretamente', () => {
    renderComponent();

    // Registros
    expect(screen.getByText('Acerto Nota Fiscal')).toBeInTheDocument();
    expect(screen.getByText('Acerto Recibo')).toBeInTheDocument();

    // Formatador de Categoria (Mapeado e Fallback)
    expect(screen.getByText('Categoria Teste')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();

    // Formatador de Documentos
    expect(screen.getByText('Doc Prestacao 1')).toBeInTheDocument();
    expect(screen.getByText('Doc Prestacao 2')).toBeInTheDocument();

    // Formatador de Status (Ativo)
    expect(screen.getByText('Sim')).toBeInTheDocument();
    expect(screen.getByText('Não')).toBeInTheDocument();
  });

  test('deve disparar edição ao clicar no botão de editar da linha', () => {
    renderComponent();

    const editButtons = screen.getAllByRole('button');
    fireEvent.click(editButtons[0]);

    expect(mockSetStateFormModal).toHaveBeenCalledWith({
      uuid: 'uuid-item-1',
      id: 1,
      recurso: 'recurso-uuid-123',
      nome: 'Acerto Nota Fiscal',
      categoria: 1,
      tipos_documento_prestacao: [10],
      ativo: true,
      pode_alterar_saldo_conciliacao: true,
      operacao: 'edit',
    });
    expect(mockSetShowModalForm).toHaveBeenCalledWith(true);
  });

  test('deve disparar criação no submit do ModalForm quando a operação for "create"', () => {
    renderComponent({ showModalForm: true });

    const btnSalvar = screen.getByText('Salvar Criar');
    fireEvent.click(btnSalvar);

    expect(mockSetBloquearBtnSalvarForm).toHaveBeenCalledWith(true);
    expect(mockMutatePost).toHaveBeenCalledWith({
      payload: {
        nome: 'Novo Acerto',
        categoria: 1,
        tipos_documento_prestacao: [10],
        ativo: true,
        pode_alterar_saldo_conciliacao: false,
        recurso: 'recurso-uuid',
      },
    });

    // Deve fechar e resetar o form modal
    expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
  });

  test('deve expandir "all" para todos os IDs de documentos ao submeter o formulário com a opção "all"', () => {
    renderComponent({ showModalForm: true });

    const btnSalvarComAll = screen.getByText('Salvar Editar Com All');
    fireEvent.click(btnSalvarComAll);

    expect(mockMutatePatch).toHaveBeenCalledWith({
      uuid: 'item-uuid-1',
      payload: {
        nome: 'Acerto Editado',
        categoria: 1,
        tipos_documento_prestacao: [10, 20], // IDs Mapeados do mockTabelas.documentos
        ativo: true,
        pode_alterar_saldo_conciliacao: false,
        recurso: 'recurso-uuid',
      },
    });
  });

  test('deve excluir item e fechar modais ao disparar o serviço de exclusão', () => {
    renderComponent({ showModalConfirmacaoExclusao: true });

    const btnConfirmar = screen.getByText('Confirmar Exclusão');
    fireEvent.click(btnConfirmar);

    expect(mockMutateDelete).toHaveBeenCalledWith('uuid-item-1');
    expect(mockSetShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
    expect(mockSetShowModalForm).toHaveBeenCalledWith(false);
  });

  test('deve fechar o modal de confirmação de exclusão ao cancelar', () => {
    renderComponent({ showModalConfirmacaoExclusao: true });

    const btnCancelar = screen.getByText('Cancelar Exclusão');
    fireEvent.click(btnCancelar);

    expect(mockSetShowModalConfirmacaoExclusao).toHaveBeenCalledWith(false);
  });
});