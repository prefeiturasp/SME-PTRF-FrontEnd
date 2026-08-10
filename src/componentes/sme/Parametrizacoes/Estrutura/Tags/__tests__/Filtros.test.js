import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Filtros } from '../components/Filtros';
import { useTagsContext } from '../hooks/useTagsContext';

// Mock do hook que fornece o contexto
jest.mock('../hooks/useTagsContext');

describe('Componente <Filtros />', () => {
  // Mock das funções do contexto
  const mockHandleChangeFiltros = jest.fn();
  const mockHandleSubmitFiltros = jest.fn();
  const mockLimpaFiltros = jest.fn();

  const defaultContextValues = {
    draftFilters: {
      filtrar_por_nome: '',
      filtrar_por_status: '',
    },
    handleChangeFiltros: mockHandleChangeFiltros,
    handleSubmitFiltros: mockHandleSubmitFiltros,
    limpaFiltros: mockLimpaFiltros,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Define o valor padrão retornado pelo hook antes de cada teste
    useTagsContext.mockReturnValue(defaultContextValues);
  });

  it('deve renderizar os campos e botões corretamente', () => {
    render(<Filtros />);

    expect(screen.getByLabelText(/filtrar por etiqueta\/tag/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/filtrar por status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
  });

  it('deve chamar handleChangeFiltros ao alterar o texto da etiqueta', async () => {
    const user = userEvent.setup();
    render(<Filtros />);

    const inputNome = screen.getByLabelText(/filtrar por etiqueta\/tag/i);
    await user.type(inputNome, 'A');

    expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_nome', 'A');
  });

  it('deve chamar handleChangeFiltros ao selecionar um status', async () => {
    const user = userEvent.setup();
    render(<Filtros />);

    const selectStatus = screen.getByLabelText(/filtrar por status/i);
    await user.selectOptions(selectStatus, 'ATIVO');

    expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_status', 'ATIVO');
  });

  it('deve chamar limpaFiltros ao clicar no botão Limpar', async () => {
    const user = userEvent.setup();
    render(<Filtros />);

    const btnLimpar = screen.getByRole('button', { name: /limpar/i });
    await user.click(btnLimpar);

    expect(mockLimpaFiltros).toHaveBeenCalledTimes(1);
  });

  it('deve chamar handleSubmitFiltros ao clicar no botão Filtrar', async () => {
    const user = userEvent.setup();
    render(<Filtros />);

    const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
    await user.click(btnFiltrar);

    expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);
  });

  it('deve exibir os valores preenchidos vindos do draftFilters', () => {
    useTagsContext.mockReturnValue({
      ...defaultContextValues,
      draftFilters: {
        filtrar_por_nome: 'Minha Tag',
        filtrar_por_status: 'INATIVO',
      },
    });

    render(<Filtros />);

    expect(screen.getByLabelText(/filtrar por etiqueta\/tag/i)).toHaveValue('Minha Tag');
    expect(screen.getByLabelText(/filtrar por status/i)).toHaveValue('INATIVO');
  });
});