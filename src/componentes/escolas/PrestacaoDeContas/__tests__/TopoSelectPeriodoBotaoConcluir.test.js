import { render, screen, fireEvent } from '@testing-library/react';
import { TopoSelectPeriodoBotaoConcluir } from '../TopoSelectPeriodoBotaoConcluir';
import { mockPeriodos, mockContasAssociacoes } from '../__fixtures__/mockData';

jest.mock('../../../../utils/ValidacoesAdicionaisFormularios', () => ({
  exibeDataPT_BR: (data) => `formatada-${data}`,
}));

describe('TopoSelectPeriodoBotaoConcluir', () => {
  const periodoSelecionado = {
    periodo_uuid: 'uuid1',
    data_inicial: '2025-01-01',
    data_final: '2025-01-31',
  };

  const retornaObjetoPeriodoPrestacaoDeConta = jest.fn((uuid, dataInicio, dataFim) => uuid);

  const handleChangePeriodoPrestacaoDeConta = jest.fn();

  const checkCondicaoExibicao = jest.fn(() => true);

  const statusPrestacaoDeConta = {
    prestacao_contas_status: {
      pc_requer_conclusao: true,
    },
  };

  const textoBotaoConcluir = jest.fn(() => 'Concluir');

  const concluirPeriodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza selects com as opções corretas', () => {
    render(
      <TopoSelectPeriodoBotaoConcluir
        periodoPrestacaoDeConta={periodoSelecionado}
        handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
        periodosAssociacao={mockPeriodos}
        retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
        statusPrestacaoDeConta={statusPrestacaoDeConta}
        checkCondicaoExibicao={checkCondicaoExibicao}
        podeConcluir={true}
        concluirPeriodo={concluirPeriodo}
        textoBotaoConcluir={textoBotaoConcluir}
        contasAssociacao={mockContasAssociacoes}
      />
    );

    // verifica select e opções
    const selectPeriodo = screen.getByLabelText('Período:');
    expect(selectPeriodo).toBeInTheDocument();

    expect(screen.getByText('Escolha um período')).toBeInTheDocument();

    // opções renderizadas
    expect(screen.getByText('2023.2 - formatada-2023-05-01 até formatada-2023-08-31')).toBeInTheDocument();
    expect(screen.getByText('2023.1 - formatada-2023-01-01 até formatada-2023-04-30')).toBeInTheDocument();
  });

  it('chama handleChangePeriodoPrestacaoDeConta ao alterar o select', () => {
    render(
      <TopoSelectPeriodoBotaoConcluir
        periodoPrestacaoDeConta={periodoSelecionado}
        handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
        periodosAssociacao={mockPeriodos}
        retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
        statusPrestacaoDeConta={statusPrestacaoDeConta}
        checkCondicaoExibicao={checkCondicaoExibicao}
        podeConcluir={true}
        concluirPeriodo={concluirPeriodo}
        textoBotaoConcluir={textoBotaoConcluir}
        contasAssociacao={mockContasAssociacoes}
      />
    );
    const selectPeriodo = screen.getByLabelText('Período:')
    expect(selectPeriodo).toBeInTheDocument()
    fireEvent.click(selectPeriodo)
    const optionSelectPeriodo = screen.getByText('2023.2 - formatada-2023-05-01 até formatada-2023-08-31')
    expect(optionSelectPeriodo).toBeInTheDocument()

    fireEvent.click(optionSelectPeriodo)
    const valorSelect = JSON.stringify({
            periodo_uuid: mockPeriodos[0].uuid,
            data_inicial: mockPeriodos[0].data_inicio_realizacao_despesas,
            data_final: mockPeriodos[0].data_final
        })
    fireEvent.change(selectPeriodo, {
      target: { name: 'periodoPrestacaoDeConta', value: valorSelect },
    });

    expect(handleChangePeriodoPrestacaoDeConta).toHaveBeenCalledWith('periodoPrestacaoDeConta', "");
  });

  it('exibe o botão concluir somente quando as condições são verdadeiras', () => {
    render(
      <TopoSelectPeriodoBotaoConcluir
        periodoPrestacaoDeConta={periodoSelecionado}
        handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
        periodosAssociacao={mockPeriodos}
        retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
        statusPrestacaoDeConta={statusPrestacaoDeConta}
        checkCondicaoExibicao={() => true}
        podeConcluir={true}
        concluirPeriodo={concluirPeriodo}
        textoBotaoConcluir={textoBotaoConcluir}
        contasAssociacao={mockContasAssociacoes}
      />
    );

    const selectPeriodo = screen.getByLabelText('Período:')
    expect(selectPeriodo).toBeInTheDocument()
    fireEvent.click(selectPeriodo)
    const optionSelectPeriodo = screen.getByText('2023.2 - formatada-2023-05-01 até formatada-2023-08-31')
    expect(optionSelectPeriodo).toBeInTheDocument()

    fireEvent.click(optionSelectPeriodo)

    const botao = screen.getByRole('button', { selector: '.btn-success' });
    expect(botao).toBeInTheDocument();

    fireEvent.click(botao);
    expect(concluirPeriodo).toHaveBeenCalled();
  });

  it('não exibe o botão concluir se podeConcluir for falso', () => {
    render(
      <TopoSelectPeriodoBotaoConcluir
        periodoPrestacaoDeConta={periodoSelecionado}
        handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
        periodosAssociacao={mockPeriodos}
        retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
        statusPrestacaoDeConta={statusPrestacaoDeConta}
        checkCondicaoExibicao={() => true}
        podeConcluir={false}
        concluirPeriodo={concluirPeriodo}
        textoBotaoConcluir={textoBotaoConcluir}
        contasAssociacao={mockContasAssociacoes}
      />
    );

    expect(screen.queryByRole('button', { name: /Concluir/i })).not.toBeInTheDocument();
  });

  it('não exibe o botão concluir se outras condições falharem', () => {
    render(
      <TopoSelectPeriodoBotaoConcluir
        periodoPrestacaoDeConta={periodoSelecionado}
        handleChangePeriodoPrestacaoDeConta={handleChangePeriodoPrestacaoDeConta}
        periodosAssociacao={mockPeriodos}
        retornaObjetoPeriodoPrestacaoDeConta={retornaObjetoPeriodoPrestacaoDeConta}
        statusPrestacaoDeConta={{ prestacao_contas_status: { pc_requer_conclusao: false } }}
        checkCondicaoExibicao={() => true}
        podeConcluir={true}
        concluirPeriodo={concluirPeriodo}
        textoBotaoConcluir={textoBotaoConcluir}
        contasAssociacao={mockContasAssociacoes}
      />
    );

    expect(screen.queryByRole('button', { name: /Concluir/i })).not.toBeInTheDocument();
  });
});
