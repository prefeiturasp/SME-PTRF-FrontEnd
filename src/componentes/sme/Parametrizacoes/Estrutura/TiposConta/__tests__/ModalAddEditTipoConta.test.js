import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalAddEditTipoConta from '../ModalAddEditTipoConta';
import { useRecursoSelecionadoContext } from '../../../../../../context/RecursoSelecionado';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

// Mocks de Hooks e Utilitários de Permissão
jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

// Mock do Esquema Yup para evitar falhas de validação inesperadas nos testes de integração do Formik
jest.mock('../YupSchemaTipoConta', () => ({
  YupSchemaTipoConta: null,
}));

// Mock do Modal Bootstrap Global
jest.mock('../../../../../Globais/ModalBootstrap', () => ({
  ModalFormBodyText: ({ show, titulo, bodyText }) =>
    show ? (
      <div data-testid="modal-container">
        <h2>{titulo}</h2>
        <div>{bodyText}</div>
      </div>
    ) : null,
}));

describe('Componente <ModalAddEditTipoConta />', () => {
  const mockHandleClose = jest.fn();
  const mockHandleSubmitModalFormTiposConta = jest.fn();
  const mockSetShowModalConfirmDeleteTipoConta = jest.fn();

  const mockRecursos = [
    { uuid: 'rec-uuid-1', nome: 'Recurso A' },
    { uuid: 'rec-uuid-2', nome: 'Recurso B' },
  ];

  const defaultStateFormModal = {
    uuid: '',
    id: '',
    nome: 'Conta Corrente Padrão',
    recurso: { uuid: 'rec-uuid-1' },
    permite_inativacao: true,
    apenas_leitura: false,
    banco_nome: '',
    agencia: '',
    numero_conta: '',
    operacao: 'create',
  };

  const defaultProps = {
    show: true,
    stateFormModal: defaultStateFormModal,
    handleClose: mockHandleClose,
    handleSubmitModalFormTiposConta: mockHandleSubmitModalFormTiposConta,
    setShowModalConfirmDeleteTipoConta: mockSetShowModalConfirmDeleteTipoConta,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    useRecursoSelecionadoContext.mockReturnValue({
      recursos: mockRecursos,
      recursoSelecionado: { cor: '#008000' },
    });
  });

  test('não deve renderizar a modal quando a prop show for false', () => {
    render(<ModalAddEditTipoConta {...defaultProps} show={false} />);
    expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
  });

  test('deve renderizar o título de "Adicionar tipo de conta" quando não houver uuid', () => {
    render(<ModalAddEditTipoConta {...defaultProps} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Adicionar tipo de conta');
  });

  test('deve renderizar o título de "Editar tipo de conta" e exibir o ID quando houver uuid e id', () => {
    const editProps = {
      ...defaultProps,
      stateFormModal: {
        ...defaultStateFormModal,
        uuid: 'uuid-123',
        id: 45,
        operacao: 'edit',
      },
    };

    render(<ModalAddEditTipoConta {...editProps} />);

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Editar tipo de conta');
    expect(screen.getByText('ID: 45')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
  });

  test('deve ocultar/exibir campos bancários ao alternar a opção apenas_leitura (Switch de unidades)', async () => {
    const propsComLeitura = {
      ...defaultProps,
      stateFormModal: {
        ...defaultStateFormModal,
        apenas_leitura: true,
        banco_nome: 'Banco do Brasil',
        agencia: '1234',
        numero_conta: '56789-0',
      },
    };

    render(<ModalAddEditTipoConta {...propsComLeitura} />);

    // Verifica se os campos bancários adicionais são exibidos
    expect(screen.getByLabelText(/nome do banco/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nº da agência/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nº da conta/i)).toBeInTheDocument();

    expect(screen.getByLabelText(/nome do banco/i)).toHaveValue('Banco do Brasil');
  });

  test('deve submeter o formulário chamando handleSubmitModalFormTiposConta com os dados atualizados', async () => {
    render(<ModalAddEditTipoConta {...defaultProps} />);

    const inputNome = screen.getByLabelText(/nome do tipo de conta \*/i);
    fireEvent.change(inputNome, { target: { name: 'nome', value: 'Novo Tipo de Conta' } });

    const btnSalvar = screen.getByRole('button', { name: /salvar/i });
    fireEvent.click(btnSalvar);

    await waitFor(() => {
      expect(mockHandleSubmitModalFormTiposConta).toHaveBeenCalledTimes(1);
    });
  });

  test('deve chamar handleClose ao clicar no botão Cancelar', () => {
    render(<ModalAddEditTipoConta {...defaultProps} />);

    const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(btnCancelar);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  test('deve chamar setShowModalConfirmDeleteTipoConta ao clicar no botão Excluir', () => {
    const editProps = {
      ...defaultProps,
      stateFormModal: {
        ...defaultStateFormModal,
        uuid: 'uuid-123',
        id: 45,
        operacao: 'edit',
      },
    };

    render(<ModalAddEditTipoConta {...editProps} />);

    const btnExcluir = screen.getByRole('button', { name: /excluir/i });
    fireEvent.click(btnExcluir);

    expect(mockSetShowModalConfirmDeleteTipoConta).toHaveBeenCalledWith(true);
  });

  test('deve desabilitar os campos e o botão Salvar se o usuário não possuir permissão de edição', () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);

    render(<ModalAddEditTipoConta {...defaultProps} />);

    const inputNome = screen.getByLabelText(/nome do tipo de conta \*/i);
    const checkboxPermiteInativacao = screen.getByLabelText(/conta permite encerramento/i);
    const btnSalvar = screen.getByRole('button', { name: /salvar/i });

    expect(inputNome).toBeDisabled();
    expect(checkboxPermiteInativacao).toBeDisabled();
    expect(btnSalvar).toBeDisabled();
  });
});