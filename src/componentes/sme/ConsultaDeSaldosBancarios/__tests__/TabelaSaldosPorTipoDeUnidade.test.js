import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaSaldosPorTipoDeUnidade } from '../TabelaSaldosPorTipoDeUnidade';

const mockValorTemplate = (valor) => <div>{valor}</div>;
const props = {
  saldosPorTipoDeUnidade: [
    {
      tipo_de_unidade: "TIPO 007",
      total_unidades: 3,
      qtde_unidades_informadas: 3,
      saldo_bancario_informado: "1000.00"
    }
  ],
  valorTemplate: mockValorTemplate
}



describe('Componente Tabela Saldos por Tipo de Unidade', () => {
  it('renderiza a tabela', () => {
    render(<TabelaSaldosPorTipoDeUnidade {...props} />);

    expect(screen.getByText("Tipo de unidade")).toBeInTheDocument();
    expect(screen.getByText("Nº de unidades")).toBeInTheDocument();
    expect(screen.getByText("Nº de unidades informadas")).toBeInTheDocument();
    expect(screen.getByText("Saldo bancário informado")).toBeInTheDocument();
    expect(screen.getByText("TIPO 007")).toBeInTheDocument();
    expect(screen.getByText("1000.00")).toBeInTheDocument();
  });

    it('renderiza a tabela sem itens', () => {
    render(<TabelaSaldosPorTipoDeUnidade {...{ ...props, saldosPorTipoDeUnidade: [] }} />);

    expect(screen.getByText("Não foram encontrados resultados, tente novamente")).toBeInTheDocument();
  });
});