import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaSaldosPorDre } from '../TabelaSaldosPorDre';

const mockValorTemplate = (valor) => <div>{valor}</div>;
const props = {
  saldosPorDre: [
    {
      nome_dre: "DRE 007",
      total_unidades: 3,
      qtde_dre_informadas: 3,
      saldo_bancario_informado: "1000.00"
    }
  ],
  valorTemplate: mockValorTemplate
}



describe('Componente Tabela Saldos por DRE', () => {
  it('renderiza a tabela', () => {
    render(<TabelaSaldosPorDre {...props} />);

    expect(screen.getByText("Diretoria")).toBeInTheDocument();
    expect(screen.getByText("Nº de unidades")).toBeInTheDocument();
    expect(screen.getByText("Nº de unidades informadas")).toBeInTheDocument();
    expect(screen.getByText("Saldo bancário informado")).toBeInTheDocument();
    expect(screen.getByText("DRE 007")).toBeInTheDocument();
    expect(screen.getByText("1000.00")).toBeInTheDocument();
  });

    it('renderiza a tabela sem itens', () => {
    render(<TabelaSaldosPorDre {...{ ...props, saldosPorDre: [] }} />);

    expect(screen.getByText("Não foram encontrados resultados, tente novamente")).toBeInTheDocument();
  });
});