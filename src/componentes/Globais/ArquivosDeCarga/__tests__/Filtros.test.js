import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Filtros } from '../Filtros';
import { mockTabelaArquivos as tabelaArquivos } from '../__fixtures__/mockData';


describe('Componente Filtros', () => {

  const mockhandleChangeFiltros = jest.fn();
  const mockhandleSubmitFiltros = jest.fn();
  const mocklimpaFiltros = jest.fn();
  const mockPropsFiltros = {
    stateFiltros: {},
    handleChangeFiltros: mockhandleChangeFiltros,
    handleSubmitFiltros: mockhandleSubmitFiltros,
    limpaFiltros: mocklimpaFiltros,
    tipoCarga: "CARGA_ACOES_ASSOCIACOES",
    tabelaArquivos: tabelaArquivos
};

  it('deve renderizar os campos e botões', () => {

    render(
      <Filtros {...mockPropsFiltros}/>
    );

    expect(screen.getByLabelText(/Filtrar por identificador/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de execução/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Limpar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Filtrar/i })).toBeInTheDocument();

  });

  it('testa a reatividade ao alterar os campos', () => {

    render(
      <Filtros {...mockPropsFiltros}/>
    );
    const input_identificador = screen.getByLabelText(/Filtrar por identificador/i);
    fireEvent.change(input_identificador, { target: { name: 'filtrar_por_identificador', value: 'Carga 123' } });
    expect(mockhandleChangeFiltros).toHaveBeenNthCalledWith(1, 'filtrar_por_identificador', 'Carga 123');

    const select_status = screen.getByLabelText(/Filtrar por status/i);
    fireEvent.change(select_status, { target: { value: tabelaArquivos.status[0].id } });
    expect(mockhandleChangeFiltros).toHaveBeenNthCalledWith(2, 'filtrar_por_status', tabelaArquivos.status[0].id);
  });

  it('testa a chamda de LimparFiltros ao clicar em Limpar', () => {

    render(
      <Filtros {...mockPropsFiltros}/>
    );
    const botao_limpar = screen.getByRole('button', { name: /Limpar/i });
    fireEvent.click(botao_limpar);
    expect(mocklimpaFiltros).toHaveBeenCalledTimes(1);
  });

  it('testa a chamda de SubmitFiltros ao clicar em Filtrar', () => {

    render(
      <Filtros {...mockPropsFiltros}/>
    );
    const botao_filtrar = screen.getByRole('button', { name: /Filtrar/i });
    fireEvent.click(botao_filtrar);
    expect(mockhandleSubmitFiltros).toHaveBeenCalledTimes(1);
  });
});