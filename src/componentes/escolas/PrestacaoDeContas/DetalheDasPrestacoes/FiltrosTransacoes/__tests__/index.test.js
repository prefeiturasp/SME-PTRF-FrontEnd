import { render, screen, fireEvent } from '@testing-library/react';
import { FiltrosTransacoes } from '../index';

describe('FiltrosTransacoes', () => {
  const mockHandleChangeFiltros = jest.fn();
  const mockHandleSubmitFiltros = jest.fn();

  const props = {
    conciliado: 'conciliado',
    stateFiltros: {
      filtrar_por_acao: '',
    },
    tabelasDespesa: {
      acoes_associacao: [
        { uuid: '1', nome: 'Ação 1' },
        { uuid: '2', nome: 'Ação 2' },
      ],
    },
    handleChangeFiltros: mockHandleChangeFiltros,
    handleSubmitFiltros: mockHandleSubmitFiltros,
  };

  it('renderiza select com opções e botão de filtro', () => {
    render(<FiltrosTransacoes {...props} />);

    const select = screen.getByLabelText(/Filtrar por ação/i);
    expect(select).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ação 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Ação 2' })).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Filtrar/i });
    expect(button).toBeInTheDocument();
  });

  it('dispara handleChangeFiltros ao mudar o select', () => {
    render(<FiltrosTransacoes {...props} />);

    const select = screen.getByLabelText(/Filtrar por ação/i);
    fireEvent.change(select, { target: { name: 'filtrar_por_acao_conciliado', value: '2' } });

    expect(mockHandleChangeFiltros).toHaveBeenCalledWith('filtrar_por_acao_conciliado', '2');
  });

  it('dispara handleSubmitFiltros ao clicar no botão', () => {
    render(<FiltrosTransacoes {...props} />);

    const button = screen.getByRole('button', { name: /Filtrar/i });
    fireEvent.click(button);

    expect(mockHandleSubmitFiltros).toHaveBeenCalledWith('conciliado');
  });
});
