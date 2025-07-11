import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaSaldosPorUeDre } from '../TabelaSaldosPorUeDre';

const mockValorTemplate = (valor) => <div>{valor}</div>;
const mockAcaoTemplate = (acao) => <div>{acao}</div>;
const props = {
  saldosPorUeDre: [
    {
      nome_dre: "Nome 007",
      uuid_dre: "uuid-007",
      associacoes: [
        {
          associacao: "Associacao 1",
          saldo_total: "1000.00",
        }
      ]
    }
  ],
  valorTemplate: mockValorTemplate,
  retornaTituloCelulasTabelaSaldosPorUeDre: () => "Diretoria",
  acoesTemplate: mockAcaoTemplate,
}



describe('Componente Tabela Saldos por Tipo de Unidade', () => {
  it('renderiza a tabela', () => {
    render(<TabelaSaldosPorUeDre {...props} />);

    expect(screen.getByText("Diretoria")).toBeInTheDocument();
    expect(screen.getByText("Nome 007")).toBeInTheDocument();
    expect(screen.getByText("1000.00")).toBeInTheDocument();
  });

    it('renderiza a tabela sem itens', () => {
    render(<TabelaSaldosPorUeDre {...{ ...props, saldosPorUeDre: [] }} />);

    expect(screen.getByText("Não foram encontrados resultados, tente novamente")).toBeInTheDocument();
  });
});