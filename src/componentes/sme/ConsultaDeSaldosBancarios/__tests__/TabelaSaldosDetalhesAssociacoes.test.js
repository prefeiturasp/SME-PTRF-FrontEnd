import { render, screen, fireEvent } from '@testing-library/react';
import { TabelaSaldosDetalhesAssociacoes } from '../TabelaSaldosDetalhesAssociacoes';


const mockAcoesTemplate = (rowData) => <div>{rowData.acoes}</div>;
const mockValorTemplate = (rowData) => <div>{rowData.obs_periodo__saldo_extrato}</div>;
const mockDataTemplate = (rowData) => <div>{rowData.obs_periodo__data_extrato}</div>;
const props = {
  saldosDetalhesAssociacoes: [
    {
      unidade__codigo_eol: "123456",
      unidade__nome: "Unidade Teste",
      obs_periodo__data_extrato: "2023-10-01",
      obs_periodo__saldo_extrato: "1000.00",
      obs_periodo__uuid: "uuid-123",
      obs_periodo__comprovante_extrato: "comprovante.pdf",
      acoes: "Ação 1"
    }
  ],
  valorTemplate: mockValorTemplate,
  dataTemplate: mockDataTemplate,
  acoesTemplate: mockAcoesTemplate,
  rowsPerPage: 10
}



describe('Componente Tabela Saldos Detalhes Associacoes', () => {
  it('renderiza a tabela', () => {
    render(<TabelaSaldosDetalhesAssociacoes {...props} />);

    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("Unidade Teste")).toBeInTheDocument();
  });
});