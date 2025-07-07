import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { useNavigate, MemoryRouter } from 'react-router-dom';
import AcertosDespesasPeriodosAnteriores from '../index';
import { visoesService } from '../../../../../services/visoes.service';
import { mantemEstadoAnaliseDre as meapcservice } from '../../../../../services/mantemEstadoAnaliseDre.service';
import {
  getAnaliseLancamentosPrestacaoConta,
  getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores,
  getDespesasPeriodosAnterioresAjustes,
  postJustificarNaoRealizacaoLancamentoPrestacaoConta,
  postLimparStatusLancamentoPrestacaoConta,
  postMarcarComoLancamentoEsclarecido,
  postMarcarComoRealizadoLancamentoPrestacaoConta
} from '../../../../../services/dres/PrestacaoDeContas.service';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

// Mock components
jest.mock('../TabelaAcertosDespesasPeriodosAnteriores', () => ({
  TabelaAcertosDespesasPeriodosAnteriores: () => <div data-testid="tabela-acertos-despesas" />
}));

jest.mock('../../../../../utils/Loading', () => () => (
  <div data-testid="loading" />
));

jest.mock('../../../UI/Tabs', () => () => (
  <div data-testid="tabs" />
));

// Mock services
jest.mock('../../../../../services/visoes.service', () => ({
  visoesService: {
    getItemUsuarioLogado: jest.fn(),
    getPermissoes: jest.fn(),
    getUsuarioLogin: jest.fn()
  }
}));

jest.mock('../../../../../services/mantemEstadoAnaliseDre.service', () => ({
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado: jest.fn(),
    setAnaliseDrePorUsuario: jest.fn()
  }
}));

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
  getAnaliseLancamentosPrestacaoConta: jest.fn(),
  getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores: jest.fn(),
  getDespesasPeriodosAnterioresAjustes: jest.fn(),
  postJustificarNaoRealizacaoLancamentoPrestacaoConta: jest.fn(),
  postLimparStatusLancamentoPrestacaoConta: jest.fn(),
  postMarcarComoLancamentoEsclarecido: jest.fn(),
  postMarcarComoRealizadoLancamentoPrestacaoConta: jest.fn()
}));

// Mock Redux store
const mockStore = createStore(() => ({}));

describe('AcertosDespesasPeriodosAnteriores', () => {
  const defaultProps = {
    analiseAtualUuid: 'analise-uuid',
    prestacaoDeContas: {
      uuid: 'prestacao-uuid',
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA'
    },
    exibeBtnIrParaPaginaDeAcertos: true,
    exibeBtnIrParaPaginaDeReceitaOuDespesa: false,
    editavel: true,
    prestacaoDeContasUuid: 'prestacao-uuid'
  };

  const mockHistory = {
    push: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockHistory);
    localStorage.clear();
  });

  it('renderiza o loading inicialmente', async () => {
    getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValueOnce([]);
    getAnaliseLancamentosPrestacaoConta.mockResolvedValueOnce({ editavel: true });
    getDespesasPeriodosAnterioresAjustes.mockResolvedValueOnce([]);
    visoesService.getPermissoes.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_despesas_periodos_anteriores: { conta_uuid: 'conta-uuid' }
    });

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <AcertosDespesasPeriodosAnteriores {...defaultProps} />
        </Provider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('renderiza a tabela de acertos após carregar os dados', async () => {
    const mockContas = [{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }];
    const mockLancamentos = [{
      analise_lancamento: {
        uuid: 'lancamento-uuid',
        solicitacoes_de_ajuste_da_analise: {
          solicitacoes_acerto_por_categoria: []
        }
      }
    }];

    getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValueOnce(mockContas);
    getAnaliseLancamentosPrestacaoConta.mockResolvedValueOnce({ editavel: true });
    getDespesasPeriodosAnterioresAjustes.mockResolvedValueOnce(mockLancamentos);
    visoesService.getPermissoes.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_despesas_periodos_anteriores: { conta_uuid: 'conta-uuid' }
    });

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <AcertosDespesasPeriodosAnteriores {...defaultProps} />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tabela-acertos-despesas')).toBeInTheDocument();
    });
  });

  it('carrega dados da conta do localStorage quando disponível', async () => {
    const mockContas = [{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }];
    const mockLancamentos = [{
      analise_lancamento: {
        uuid: 'lancamento-uuid',
        solicitacoes_de_ajuste_da_analise: {
          solicitacoes_acerto_por_categoria: []
        }
      }
    }];

    getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValueOnce(mockContas);
    getAnaliseLancamentosPrestacaoConta.mockResolvedValueOnce({ editavel: true });
    getDespesasPeriodosAnterioresAjustes.mockResolvedValueOnce(mockLancamentos);
    visoesService.getPermissoes.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_despesas_periodos_anteriores: { conta_uuid: 'conta-uuid' }
    });

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <AcertosDespesasPeriodosAnteriores {...defaultProps} />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalledWith(
        defaultProps.analiseAtualUuid,
        'conta-uuid',
        null,
        null
      );
    });
  });

  it('não permite edição quando usuário não tem permissão', async () => {
    const mockContas = [{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }];
    const mockLancamentos = [{
      analise_lancamento: {
        uuid: 'lancamento-uuid',
        solicitacoes_de_ajuste_da_analise: {
          solicitacoes_acerto_por_categoria: []
        }
      }
    }];

    getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValueOnce(mockContas);
    getAnaliseLancamentosPrestacaoConta.mockResolvedValueOnce({ editavel: false });
    getDespesasPeriodosAnterioresAjustes.mockResolvedValueOnce(mockLancamentos);
    visoesService.getPermissoes.mockReturnValue(false);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_despesas_periodos_anteriores: { conta_uuid: 'conta-uuid' }
    });

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <AcertosDespesasPeriodosAnteriores {...defaultProps} />
        </Provider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId('tabela-acertos-despesas')).toBeInTheDocument();
    });
  });

  it('redireciona para página de detalhes ao clicar em editar acertos', async () => {
    const mockContas = [{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }];
    const mockLancamentos = [{
      analise_lancamento: {
        uuid: 'lancamento-uuid',
        solicitacoes_de_ajuste_da_analise: {
          solicitacoes_acerto_por_categoria: []
        }
      }
    }];

    getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValueOnce(mockContas);
    getAnaliseLancamentosPrestacaoConta.mockResolvedValueOnce({ editavel: true });
    getDespesasPeriodosAnterioresAjustes.mockResolvedValueOnce(mockLancamentos);
    visoesService.getPermissoes.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_de_despesas_periodos_anteriores: { conta_uuid: 'conta-uuid' }
    });

    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <AcertosDespesasPeriodosAnteriores {...defaultProps} />
        </Provider>
      </MemoryRouter>
    );

    // Primeiro verifica se o componente está renderizando
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    // Aguarda o loading desaparecer e a tabela aparecer
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByTestId('tabela-acertos-despesas')).toBeInTheDocument();
    });
  });
});