import React, {act} from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import ModalForm from '../ModalForm';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';
import { categoriasPDDE as mockCategoriasPDDE } from "../__fixtures__/mockData";
jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
  deleteAcoesPDDE: jest.fn(),
  patchAcoesPDDECategorias: jest.fn(),
  postAcoesPDDECategorias: jest.fn(),
  deleteAcoesPDDECategorias: jest.fn(),
}));

jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(() => true),
}));

describe('ModalForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnHandleClose = jest.fn();
  const mockSetShowModalConfirmDelete = jest.fn();

  let queryClient;

  const initialProps = {
    show: true,
    stateFormModal: {
      nome: "Acao pdde 1",
      categoria: 1,
      aceita_capital: false,
      aceita_custeio: false,
      aceita_livre_aplicacao: false,    
      editavel: true,
      uuid: "fake-uuid",
      id: 1,
      operacao: 'edit',
      open: false
    },
    categorias: mockCategoriasPDDE,
    onSubmit: mockOnSubmit,
    onHandleClose: mockOnHandleClose,
    setShowModalConfirmDelete: mockSetShowModalConfirmDelete,
  };

  queryClient = new QueryClient({
      defaultOptions: {
          queries: { retry: false }, // Desativa retry apenas para esse teste
      },
  });

  beforeEach(() => {
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
  });

  it('deve renderizar o modal com os campos', () => {
    
    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
      
    );

    expect(screen.getByLabelText(/Nome */i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Programa */i)).toBeInTheDocument();
  });

  it('deve chamar o submit quando o formulário for submetido', async () => {
    
    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText(/Salvar/i));
    });
  
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('deve chamar o onHandleClose quando o botão de fechar for chamado', () => {

    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
    );

    fireEvent.click(screen.getByText(/Cancelar/i));
    expect(mockOnHandleClose).toHaveBeenCalled();
  });

  it('deve chamar o setShowModalConfirmDeletePeriodo quando o botão de apagar for chamado', () => {

    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
    );

    fireEvent.click(screen.getByText(/Excluir/i));
    expect(mockSetShowModalConfirmDelete).toHaveBeenCalled();
  });

  it('deve editar categoria', async() => {

    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('btn-adicionar-editar-categoria'));
    expect(screen.getByText(/Editar Programa/i)).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('btn-confirmar-editar-adicionar-categoria'));
    expect(screen.getByText(/Editar Programa de Ação PDDE/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Editar", selector: '.btn-editar-adicionar-categoria' }));
  });

  it('deve editar categoria alterando o nome', async() => {

    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('btn-adicionar-editar-categoria'));
    expect(screen.getByText(/Editar Programa/i)).toBeInTheDocument();
    const input = screen.getByLabelText("Programa *");
    fireEvent.change(input, { target: { value: 4 } });
    fireEvent.click(screen.getByTestId('btn-confirmar-editar-adicionar-categoria'));
    expect(screen.getByText(/Editar Programa de Ação PDDE/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Editar", selector: '.btn-editar-adicionar-categoria' }));
  });

  it('deve editar alterando o valor dos radios para sim', async() => {

    render(
      <QueryClientProvider client={queryClient}><ModalForm {...initialProps} /></QueryClientProvider>
    );
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

  it('deve editar alterando o valor dos radios para nao', async() => {
    const props = {
      ...initialProps,
      stateFormModal: {
        aceita_capital: true,
        aceita_custeio: true,
        aceita_livre_aplicacao: true,
      }
    }
    render(
      <QueryClientProvider client={queryClient}><ModalForm {...props} /></QueryClientProvider>
    );
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

  it('deve criar categoria', async() => {
    const props = {
      ...initialProps,
      stateFormModal: {
        nome: "",
        categoria: "",
        aceita_capital: false,
        aceita_custeio: false,
        aceita_livre_aplicacao: false,    
        editavel: true,
        uuid: "",
        id: "",
        operacao: 'create',
      }
    }
    render(
      <QueryClientProvider client={queryClient}><ModalForm {...props} /></QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('btn-adicionar-editar-categoria'));
    expect(screen.getByText(/Adicionar novo Programa/i)).toBeInTheDocument();
    const input = screen.getByLabelText("Adicionar novo Programa");
    fireEvent.change(input, { target: { value: "Nova categoria" } });
    const botao_confirmar_editar = screen.getByTestId('btn-confirmar-editar-adicionar-categoria');
    const botao_cancelar_editar = screen.getByTestId('btn-cancelar-editar-adicionar-categoria');
    fireEvent.mouseEnter(botao_confirmar_editar);
    fireEvent.mouseLeave(botao_confirmar_editar);
    fireEvent.mouseEnter(botao_cancelar_editar);
    fireEvent.mouseLeave(botao_cancelar_editar);
    fireEvent.click(botao_confirmar_editar);
    expect(screen.getByText(/Adicionar Programa de Ação PDDE/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Adicionar", selector: '.btn-editar-adicionar-categoria' }));
  });

  it('deve criar acao validar campos vazios', async() => {
    const props = {
      ...initialProps,
      stateFormModal: {
        nome: "",
        categoria: "",
        aceita_capital: false,
        aceita_custeio: false,
        aceita_livre_aplicacao: false,    
        editavel: true,
        uuid: "",
        id: "",
        operacao: 'create',
      }
    }
    render(
      <QueryClientProvider client={queryClient}><ModalForm {...props} /></QueryClientProvider>
    );

    fireEvent.click(screen.getByTestId('btn-salvar-acao'));
    await waitFor(() => {
      expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument();
      expect(screen.getByText(/Programa é obrigatório/i)).toBeInTheDocument();
    });
    
  });

});
