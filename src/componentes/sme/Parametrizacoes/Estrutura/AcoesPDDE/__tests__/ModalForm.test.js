import React, {act} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModalForm from '../ModalForm';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';
import { programasPDDE as mockProgramasPDDE } from "../__fixtures__/mockData";

jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(() => true),
}));

describe('ModalForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnHandleClose = jest.fn();
  const mockSetShowModalConfirmDelete = jest.fn();

  const stateFormModalCriacao = {
    nome: "",
    programa: "",
    aceita_capital: false,
    aceita_custeio: false,
    aceita_livre_aplicacao: false,
    editavel: true,
    uuid: "",
    id: "",
    operacao: 'create',
  };

  const initialProps = {
    show: true,
    stateFormModal: {
      nome: "Acao pdde 1",
      programa: "2df33e5d-fbbf-4a4a-ab9a-d5fa49de4db2",
      aceita_capital: false,
      aceita_custeio: false,
      aceita_livre_aplicacao: false,
      editavel: true,
      uuid: "fake-uuid",
      id: 1,
      operacao: 'edit',
      open: false
    },
    programas: mockProgramasPDDE,
    onSubmit: mockOnSubmit,
    onHandleClose: mockOnHandleClose,
    setShowModalConfirmDelete: mockSetShowModalConfirmDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  beforeAll(() => {
    global.ResizeObserver = class {
      constructor(callback) { }
      observe() { }
      unobserve() { }
      disconnect() { }
    };
  });

  it('deve renderizar o modal com os campos', () => {
    render(<ModalForm {...initialProps} />);

    expect(screen.getByText('Editar Ação PDDE')).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome */i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Programa */i)).toBeInTheDocument();
  });

  it('não deve exibir a opção de adicionar/editar programa dentro do cadastro da ação', () => {
    render(<ModalForm {...initialProps} />);

    expect(screen.queryByTestId('btn-adicionar-editar-categoria')).not.toBeInTheDocument();
    expect(screen.queryByTestId('btn-excluir-categoria')).not.toBeInTheDocument();
    expect(screen.queryByText(/Adicionar novo Programa/i)).not.toBeInTheDocument();
  });

  it('deve listar no select os programas cadastrados com o programa da ação selecionado', () => {
    render(<ModalForm {...initialProps} />);

    const select = screen.getByTestId('select-programa');
    const opcoes = select.querySelectorAll('option');
    expect(opcoes).toHaveLength(mockProgramasPDDE.results.length + 1);
    expect(screen.getByRole('option', {name: 'Programa 5'})).toBeInTheDocument();
    expect(select.value).toBe('2df33e5d-fbbf-4a4a-ab9a-d5fa49de4db2');
    expect(screen.queryByTestId('ajuda-sem-programas')).not.toBeInTheDocument();
  });

  it('deve exibir orientação quando não houver programas cadastrados', () => {
    render(<ModalForm {...initialProps} programas={{results: []}} stateFormModal={stateFormModalCriacao}/>);

    expect(screen.getByTestId('ajuda-sem-programas')).toHaveTextContent('Cadastre na aba Programas');
  });

  it('deve chamar o submit com o programa selecionado', async () => {
    render(<ModalForm {...initialProps} />);

    fireEvent.change(screen.getByTestId('select-programa'), {
      target: { value: '8492d8b9-b2dc-463a-b4a7-1474c950c7e5' }
    });
    await act(async () => {
      fireEvent.click(screen.getByText(/Salvar/i));
    });

    await waitFor(() => expect(mockOnSubmit).toHaveBeenCalled());
    expect(mockOnSubmit.mock.calls[0][0].programa).toBe('8492d8b9-b2dc-463a-b4a7-1474c950c7e5');
  });

  it('deve chamar o onHandleClose quando o botão de cancelar for clicado', () => {
    render(<ModalForm {...initialProps} />);

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockOnHandleClose).toHaveBeenCalled();
  });

  it('deve chamar o setShowModalConfirmDelete quando o botão de excluir for clicado', () => {
    render(<ModalForm {...initialProps} />);

    fireEvent.click(screen.getByText(/Excluir/i));
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalledWith(true);
  });

  it('deve editar alterando o valor dos radios para sim', () => {
    render(<ModalForm {...initialProps} />);

    const radio_capital = screen.getByLabelText('Sim', { selector: 'input[name="aceita_capital_true"]' });
    const radio_custeio = screen.getByLabelText('Sim', { selector: 'input[name="aceita_custeio_true"]' });
    const radio_livre_aplicacao = screen.getByLabelText('Sim', { selector: 'input[name="aceita_livre_aplicacao_true"]' });
    fireEvent.click(radio_capital);
    fireEvent.click(radio_custeio);
    fireEvent.click(radio_livre_aplicacao);
    expect(radio_capital).toBeChecked();
    expect(radio_custeio).toBeChecked();
    expect(radio_livre_aplicacao).toBeChecked();
  });

  it('deve editar alterando o valor dos radios para nao', () => {
    const props = {
      ...initialProps,
      stateFormModal: {
        aceita_capital: true,
        aceita_custeio: true,
        aceita_livre_aplicacao: true,
      }
    }
    render(<ModalForm {...props} />);

    const radio_capital = screen.getByLabelText('Não', { selector: 'input[name="aceita_capital_false"]' });
    const radio_custeio = screen.getByLabelText('Não', { selector: 'input[name="aceita_custeio_false"]' });
    const radio_livre_aplicacao = screen.getByLabelText('Não', { selector: 'input[name="aceita_livre_aplicacao_false"]' });
    fireEvent.click(radio_capital);
    fireEvent.click(radio_custeio);
    fireEvent.click(radio_livre_aplicacao);
    expect(radio_capital).toBeChecked();
    expect(radio_custeio).toBeChecked();
    expect(radio_livre_aplicacao).toBeChecked();
  });

  it('deve validar nome e programa obrigatórios ao criar ação', async () => {
    render(<ModalForm {...initialProps} stateFormModal={stateFormModalCriacao} />);

    expect(screen.getByText('Adicionar Ação PDDE')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('btn-salvar-acao'));
    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/Programa é obrigatório/i)).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('deve desabilitar os campos sem permissão de edição', () => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(false);
    render(<ModalForm {...initialProps} />);

    expect(screen.getByTestId('select-programa')).toBeDisabled();
    expect(screen.getByTestId('btn-salvar-acao')).toBeDisabled();
  });
});
