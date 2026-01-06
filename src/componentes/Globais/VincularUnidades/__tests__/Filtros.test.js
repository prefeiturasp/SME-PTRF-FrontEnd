import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Filtros } from '../Filtros';
import { useGetDres, useGetTiposUnidades } from '../hooks/useGet';

jest.mock('../hooks/useGet');

describe('<Filtros />', () => {
  const mockOnFilterChange = jest.fn();
  const mockLimpaFiltros = jest.fn();

  const dresMock = [
    { uuid: 'dre-1', nome: 'DRE Centro' },
    { uuid: 'dre-2', nome: 'DRE Norte' },
  ];

  const tiposMock = [
    { id: 1, nome: 'EMEF' },
    { id: 2, nome: 'CEI' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    useGetDres.mockReturnValue({
      data: dresMock,
      isLoading: false,
    });

    useGetTiposUnidades.mockReturnValue({
      data: tiposMock,
      isLoading: false,
    });
  });

  test('renderiza campos principais do formulário', () => {
    render(
      <Filtros
        onFilterChange={mockOnFilterChange}
        limpaFiltros={mockLimpaFiltros}
      />
    );

    expect(
      screen.getByLabelText(/Buscar por nome ou código/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Filtrar por DRE/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Filtrar pelo tipo de UE/i)
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
  });

  test('chama hooks de busca de DREs e Tipos', () => {
    render(
      <Filtros
        onFilterChange={mockOnFilterChange}
        limpaFiltros={mockLimpaFiltros}
      />
    );

    expect(useGetDres).toHaveBeenCalled();
    expect(useGetTiposUnidades).toHaveBeenCalled();
  });

  test('preenche os campos quando filtros são passados via props', async () => {
    const filtros = {
      nome_ou_codigo: 'ESCOLA TESTE',
      dre: 'dre-1',
      tipo_unidade: 2,
    };

    render(
      <Filtros
        filtros={filtros}
        onFilterChange={mockOnFilterChange}
        limpaFiltros={mockLimpaFiltros}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByDisplayValue('ESCOLA TESTE')
      ).toBeInTheDocument();
    });
  });

  test('submete o formulário e chama onFilterChange com os valores', async () => {
    render(
      <Filtros
        onFilterChange={mockOnFilterChange}
        limpaFiltros={mockLimpaFiltros}
      />
    );

    const input = screen.getByPlaceholderText(
      /Escreva o nome ou o codigo/i
    );

    fireEvent.change(input, {
      target: { value: 'UNIDADE ABC' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Filtrar/i }));

    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(
        expect.objectContaining({
          nome_ou_codigo: 'UNIDADE ABC',
        })
      );
    });
  });

  test('limpa filtros ao clicar no botão Limpar', async () => {
    render(
      <Filtros
        onFilterChange={mockOnFilterChange}
        limpaFiltros={mockLimpaFiltros}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Limpar/i }));

    await waitFor(() => {
      expect(mockLimpaFiltros).toHaveBeenCalledWith({
        nome_ou_codigo: null,
        dre: null,
        tipo_unidade: null,
      });
    });
  });

  test('renderiza botões extras quando extraButtons é fornecido', () => {
    render(
      <Filtros
        onFilterChange={mockOnFilterChange}
        limpaFiltros={mockLimpaFiltros}
        extraButtons={<button>Botão Extra</button>}
      />
    );

    expect(screen.getByText('Botão Extra')).toBeInTheDocument();
  });
});
