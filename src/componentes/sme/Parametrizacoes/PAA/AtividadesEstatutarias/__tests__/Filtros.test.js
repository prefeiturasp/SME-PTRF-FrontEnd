import { render, screen, fireEvent } from '@testing-library/react';
import { Filtros } from '../Filtros';
import userEvent from '@testing-library/user-event';
import { AtividadesEstatutariasContext } from '../context/index';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetTabelas } from "../hooks/useGetTabelas";
import { tabelas } from "../__fixtures__/mockData";

const queryClient = new QueryClient();

jest.mock("../hooks/useGetTabelas");

const mockSetFilter = jest.fn();
const mockSetCurrentPage = jest.fn();
const mockSetFirstPage = jest.fn();

const initialFilter = { nome: '' };

const context = {
  setFilter: mockSetFilter,
  initialFilter,
  setCurrentPage: mockSetCurrentPage,
  setFirstPage: mockSetFirstPage,
}

describe('Filtros', () => {

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <AtividadesEstatutariasContext.Provider value={context}>
          <Filtros />
        </AtividadesEstatutariasContext.Provider>
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    useGetTabelas.mockReturnValue({
      isLoading: false,
      data: tabelas,
    });
  });

  test('Deve renderizar os elementos corretamente', () => {
    renderComponent();

    expect(screen.getByLabelText('Filtrar por nome da atividade estatutária')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite o nome da atividade estatutária')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Filtrar' })).toBeInTheDocument();
  });

  test('Deve atualizar o estado do filtro quando o input muda', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Digite o nome da atividade estatutária');
    fireEvent.change(input, { target: { name: 'nome', value: 'Teste' } });
    expect(input).toHaveValue('Teste');
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com os valores corretos quando o botão "Filtrar" é clicado', () => {
    renderComponent();
    const campoNome = screen.getByPlaceholderText('Digite o nome da atividade estatutária');
    fireEvent.change(campoNome, { target: { name: 'nome', value: 'Teste' } });
    const filtrarButton = screen.getByRole('button', { name: 'Filtrar' });
    fireEvent.click(filtrarButton);

    expect(mockSetFilter).toHaveBeenCalled();
    expect(mockSetFilter).toHaveBeenCalledWith({ nome: 'Teste' });
    expect(mockSetCurrentPage).toHaveBeenCalledTimes(1);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledTimes(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
  });

  test('Deve chamar setFilter, setCurrentPage e setFirstPage com o valor inicial quando o botão "Limpar" é clicado', () => {
    renderComponent();
    const campoNome = screen.getByPlaceholderText('Digite o nome da atividade estatutária');
    const campoTipo = screen.getByLabelText('Filtrar por tipo');
    const campoMes = screen.getByLabelText('Filtrar por mês');
    fireEvent.change(campoNome, { target: { name: 'nome', value: 'Teste' } });
    fireEvent.change(campoTipo, { target: { name: 'tipo', value: 'ORDINARIA' } });
    fireEvent.change(campoMes, { target: { name: 'mes', value: '1' } });

    const limparButton = screen.getByRole('button', { name: 'Limpar' });
    fireEvent.click(limparButton);    

    expect(mockSetFilter).toHaveBeenCalled();
    expect(mockSetFilter).toHaveBeenCalledWith(initialFilter);
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
  });

  test('Deve chamar onKeyDown', () => {
    renderComponent();
    const campoNome = screen.getByPlaceholderText('Digite o nome da atividade estatutária');
    fireEvent.change(campoNome, { target: { name: 'nome', value: 'Teste' } });
    const form = screen.getByTestId('form-filtros');
    fireEvent.keyDown(form, { key: 'Enter', keyCode: 13, charCode: 13 });

    expect(mockSetFilter).toHaveBeenCalled();
    expect(mockSetCurrentPage).toHaveBeenCalledWith(1);
    expect(mockSetFirstPage).toHaveBeenCalledWith(0);
  });

});
