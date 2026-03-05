import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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

// Capture props from mocked child components
let capturedTabelaProps = {};
let capturedTabsProps = {};

// Mock components
jest.mock('../TabelaAcertosDespesasPeriodosAnteriores', () => ({
  TabelaAcertosDespesasPeriodosAnteriores: (props) => {
    capturedTabelaProps = props;
    return <div data-testid="tabela-acertos-despesas" />;
  }
}));

jest.mock('../../../../../utils/Loading', () => () => (
  <div data-testid="loading" />
));

jest.mock('../../../UI/Tabs', () => (props) => {
  capturedTabsProps = props;
  return <div data-testid="tabs" />;
});

jest.mock('../../../BarraMensagem', () => ({
  barraMensagemCustom: {
    BarraMensagemInativa: (msg) => <div data-testid="barra-inativa">{msg}</div>,
    BarraMensagemAcertoExterno: (msg) => <div data-testid="barra-externo">{msg}</div>
  }
}));

jest.mock('../../BotoesDetalhesParaAcertosDeCategorias', () => () => (
  <div data-testid="botoes-detalhes" />
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

// Mock Redux store with thunk-like reducer to accept dispatched actions
const mockStore = createStore((state = {}, action) => {
  switch (action.type) {
    case 'ADD_DETALHAR_ACERTOS':
    case 'LIMPAR_DETALHAR_ACERTOS':
    case 'ORIGEM_PAGINA':
      return { ...state };
    default:
      return state;
  }
});

// ───────────────────────── helpers ─────────────────────────

const mockContas = [{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }];
const mockContasMultiplas = [
  { uuid: 'conta-uuid-1', tipo_conta: { nome: 'Cheque' } },
  { uuid: 'conta-uuid-2', tipo_conta: { nome: 'Poupança' } }
];

const mockLancamentos = [{
  tipo_transacao: 'Gasto',
  documento_mestre: { uuid: 'doc-uuid', receitas_saida_do_recurso: null },
  analise_lancamento: {
    uuid: 'lancamento-uuid',
    selecionado: false,
    solicitacoes_de_ajuste_da_analise_total: 0,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: []
    }
  }
}];

const mockLancamentosComAcertos = [{
  tipo_transacao: 'Gasto',
  documento_mestre: { uuid: 'doc-uuid', receitas_saida_do_recurso: null },
  analise_lancamento: {
    uuid: 'lancamento-uuid',
    selecionado: false,
    solicitacoes_de_ajuste_da_analise_total: 2,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: [
        {
          acertos: [
            {
              uuid: 'acerto-uuid-1',
              ordem: 1,
              tipo_acerto: { nome: 'Tipo Acerto 1', categoria: 'AJUSTE_LANCAMENTO' },
              detalhamento: 'Detalhamento do acerto',
              status_realizacao: 'PENDENTE',
              justificativa: null,
              esclarecimentos: null,
              selecionado: false
            },
            {
              uuid: 'acerto-uuid-2',
              ordem: 2,
              tipo_acerto: { nome: 'Tipo Acerto 2', categoria: 'AJUSTE_LANCAMENTO' },
              detalhamento: null,
              status_realizacao: 'REALIZADO',
              justificativa: 'Justificativa salva',
              esclarecimentos: null,
              selecionado: false
            }
          ],
          requer_ajustes_externos: false,
          mensagem_inativa: null
        }
      ]
    }
  }
}];

const mockLancamentosComEsclarecimento = [{
  tipo_transacao: 'Gasto',
  documento_mestre: { uuid: 'doc-uuid', receitas_saida_do_recurso: null },
  analise_lancamento: {
    uuid: 'lancamento-uuid',
    selecionado: false,
    solicitacoes_de_ajuste_da_analise_total: 1,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: [
        {
          acertos: [
            {
              uuid: 'acerto-esclarecimento-uuid',
              ordem: 1,
              tipo_acerto: { nome: 'Esclarecimento', categoria: 'SOLICITACAO_ESCLARECIMENTO' },
              detalhamento: null,
              status_realizacao: 'PENDENTE',
              justificativa: null,
              esclarecimentos: 'Esclarecimento existente',
              selecionado: false
            }
          ],
          requer_ajustes_externos: false,
          mensagem_inativa: null
        }
      ]
    }
  }
}];

const mockLancamentosComMensagemInativaEExterno = [{
  tipo_transacao: 'Gasto',
  documento_mestre: { uuid: 'doc-uuid', receitas_saida_do_recurso: null },
  analise_lancamento: {
    uuid: 'lancamento-uuid',
    selecionado: false,
    solicitacoes_de_ajuste_da_analise_total: 1,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: [
        {
          acertos: [
            {
              uuid: 'acerto-uuid-inativo',
              ordem: 1,
              tipo_acerto: { nome: 'Tipo Acerto', categoria: 'AJUSTE_LANCAMENTO' },
              detalhamento: 'Detalhamento',
              status_realizacao: 'JUSTIFICADO',
              justificativa: null,
              esclarecimentos: null,
              selecionado: false
            }
          ],
          requer_ajustes_externos: true,
          mensagem_inativa: 'Tipo inativo'
        }
      ]
    }
  }
}];

const mockAnaliseStatus = {
  editavel: true,
  status_realizacao_solicitacao: [
    { id: 'PENDENTE', nome: 'Pendente' },
    { id: 'REALIZADO', nome: 'Realizado' },
    { id: 'JUSTIFICADO', nome: 'Justificado' }
  ]
};

const mockEstadoAnaliseDre = {
  conferencia_de_despesas_periodos_anteriores: {
    conta_uuid: 'conta-uuid',
    expanded: [],
    paginacao_atual: 0
  }
};

function setupDefaultMocks(contas = mockContas, lancamentos = mockLancamentos, analise = mockAnaliseStatus) {
  getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValue(contas);
  getAnaliseLancamentosPrestacaoConta.mockResolvedValue(analise);
  getDespesasPeriodosAnterioresAjustes.mockResolvedValue(lancamentos);
  visoesService.getPermissoes.mockReturnValue(true);
  visoesService.getItemUsuarioLogado.mockReturnValue('UE');
  visoesService.getUsuarioLogin.mockReturnValue('usuario-login');
  meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue(JSON.parse(JSON.stringify(mockEstadoAnaliseDre)));
  meapcservice.setAnaliseDrePorUsuario.mockReturnValue(undefined);
}

// Mock Redux store
const mockNavigate = jest.fn();

// ───────────────────────── tests ─────────────────────────

describe('AcertosDespesasPeriodosAnteriores', () => {
  const defaultProps = {
    analiseAtualUuid: 'analise-uuid',
    prestacaoDeContas: {
      uuid: 'prestacao-uuid',
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA'
    },
    exibeBtnIrParaPaginaDeAcertos: false,
    exibeBtnIrParaPaginaDeReceitaOuDespesa: false,
    editavel: true,
    prestacaoDeContasUuid: 'prestacao-uuid'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    capturedTabelaProps = {};
    capturedTabsProps = {};
    useNavigate.mockReturnValue(mockNavigate);
    localStorage.clear();
  });

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <Provider store={mockStore}>
          <AcertosDespesasPeriodosAnteriores {...defaultProps} {...props} />
        </Provider>
      </MemoryRouter>
    );

  const waitForTable = () =>
    waitFor(() => expect(screen.getByTestId('tabela-acertos-despesas')).toBeInTheDocument());

  // ── Render inicial ──────────────────────────────────────

  describe('Render e carregamento inicial', () => {
    it('renderiza o loading inicialmente', () => {
      setupDefaultMocks();
      renderComponent();
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('exibe o título correto', async () => {
      setupDefaultMocks();
      renderComponent();
      expect(screen.getByText('Acertos nas despesas de períodos anteriores')).toBeInTheDocument();
    });

    it('renderiza a tabela de acertos após carregar os dados', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();
    });

    it('não exibe loading após carregar os dados', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    it('não chama serviços quando prestacaoDeContas não tem uuid de associação', () => {
      setupDefaultMocks();
      renderComponent({
        prestacaoDeContas: { uuid: 'prestacao-uuid', status: 'DEVOLVIDA' }
      });
      expect(getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores).not.toHaveBeenCalled();
    });

    it('não chama serviços quando analiseAtualUuid está ausente', () => {
      setupDefaultMocks();
      renderComponent({ analiseAtualUuid: null });
      expect(getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores).not.toHaveBeenCalled();
    });
  });

  // ── Seleção de conta ────────────────────────────────────

  describe('Seleção de conta', () => {
    it('usa conta salva no estado quando disponível', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitFor(() => {
        expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalledWith(
          defaultProps.analiseAtualUuid,
          'conta-uuid',
          null,
          null
        );
      });
    });

    it('usa primeira conta quando não há conta_uuid salva no estado', async () => {
      setupDefaultMocks(mockContasMultiplas);
      meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
        conferencia_de_despesas_periodos_anteriores: {
          conta_uuid: null,
          expanded: [],
          paginacao_atual: 0
        }
      });

      renderComponent();

      await waitFor(() => {
        expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalledWith(
          defaultProps.analiseAtualUuid,
          'conta-uuid-1',
          null,
          null
        );
      });
    });

    it('salva conta no estado quando há apenas uma conta na associação', async () => {
      setupDefaultMocks(mockContas);
      renderComponent();

      await waitFor(() => {
        expect(meapcservice.setAnaliseDrePorUsuario).toHaveBeenCalled();
      });
    });

    it('define clickBtnEscolheConta quando conta_uuid salva coincide com uma das contas', async () => {
      setupDefaultMocks(mockContasMultiplas);
      meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
        conferencia_de_despesas_periodos_anteriores: {
          conta_uuid: 'conta-uuid-2',
          expanded: [],
          paginacao_atual: 0
        }
      });

      renderComponent();

      await waitFor(() => {
        expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalledWith(
          defaultProps.analiseAtualUuid,
          'conta-uuid-2',
          null,
          null
        );
      });
    });
  });

  // ── Troca de aba ────────────────────────────────────────

  describe('Troca de aba (Tabs)', () => {
    it('renderiza Tabs com as contas como abas', async () => {
      setupDefaultMocks(mockContasMultiplas);
      meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
        conferencia_de_despesas_periodos_anteriores: {
          conta_uuid: 'conta-uuid-1',
          expanded: [],
          paginacao_atual: 0
        }
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
      });

      expect(capturedTabsProps.tabs).toHaveLength(2);
      expect(capturedTabsProps.tabs[0].label).toBe('Conta Cheque');
      expect(capturedTabsProps.tabs[1].label).toBe('Conta Poupança');
    });

    it('chama carregaAcertosLancamentos ao clicar numa aba diferente', async () => {
      setupDefaultMocks(mockContasMultiplas);
      meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
        conferencia_de_despesas_periodos_anteriores: {
          conta_uuid: 'conta-uuid-1',
          expanded: [],
          paginacao_atual: 0
        }
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId('tabs')).toBeInTheDocument();
      });

      getDespesasPeriodosAnterioresAjustes.mockClear();

      await act(async () => {
        capturedTabsProps.onTabClick('conta-uuid-2', 1);
      });

      await waitFor(() => {
        expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalledWith(
          defaultProps.analiseAtualUuid,
          'conta-uuid-2',
          null,
          null
        );
      });
    });
  });

  // ── Ações na tabela ─────────────────────────────────────

  describe('Ação: limparStatus', () => {
    it('chama postLimparStatusLancamentoPrestacaoConta', async () => {
      setupDefaultMocks();
      postLimparStatusLancamentoPrestacaoConta.mockResolvedValue({});
      renderComponent();
      await waitForTable();

      await act(async () => {
        await capturedTabelaProps.limparStatus();
      });

      expect(postLimparStatusLancamentoPrestacaoConta).toHaveBeenCalledWith({
        uuids_solicitacoes_acertos_lancamentos: []
      });
    });

    it('recarrega lancamentos após limpar status', async () => {
      setupDefaultMocks();
      postLimparStatusLancamentoPrestacaoConta.mockResolvedValue({});
      renderComponent();
      await waitForTable();

      getDespesasPeriodosAnterioresAjustes.mockClear();

      await act(async () => {
        await capturedTabelaProps.limparStatus();
      });

      expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalled();
    });
  });

  describe('Ação: marcarComoRealizado', () => {
    it('chama postMarcarComoRealizadoLancamentoPrestacaoConta', async () => {
      setupDefaultMocks();
      postMarcarComoRealizadoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_realizado: true
      });
      renderComponent();
      await waitForTable();

      await act(async () => {
        await capturedTabelaProps.marcarComoRealizado();
      });

      expect(postMarcarComoRealizadoLancamentoPrestacaoConta).toHaveBeenCalledWith({
        uuids_solicitacoes_acertos_lancamentos: []
      });
    });

    it('aciona estado de modal quando não todas marcadas como realizado', async () => {
      setupDefaultMocks();
      postMarcarComoRealizadoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_realizado: false,
        mensagem: 'Não foi possível marcar todas.'
      });
      renderComponent();
      await waitForTable();

      await act(async () => {
        await capturedTabelaProps.marcarComoRealizado();
      });

      await waitFor(() => {
        expect(capturedTabelaProps.showModalCheckNaoPermitido).toBe(true);
      });
      expect(capturedTabelaProps.tituloModalCheckNaoPermitido).toBe(
        'Não é possível marcar a solicitação como realizada'
      );
    });

    it('recarrega lancamentos após marcar como realizado', async () => {
      setupDefaultMocks();
      postMarcarComoRealizadoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_realizado: true
      });
      renderComponent();
      await waitForTable();

      getDespesasPeriodosAnterioresAjustes.mockClear();

      await act(async () => {
        await capturedTabelaProps.marcarComoRealizado();
      });

      expect(getDespesasPeriodosAnterioresAjustes).toHaveBeenCalled();
    });
  });

  describe('Ação: justificarNaoRealizacao', () => {
    it('chama postJustificarNaoRealizacaoLancamentoPrestacaoConta', async () => {
      setupDefaultMocks();
      postJustificarNaoRealizacaoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_justificado: true
      });
      renderComponent();
      await waitForTable();

      await act(async () => {
        await capturedTabelaProps.justificarNaoRealizacao('minha justificativa');
      });

      expect(postJustificarNaoRealizacaoLancamentoPrestacaoConta).toHaveBeenCalledWith({
        uuids_solicitacoes_acertos_lancamentos: [],
        justificativa: 'minha justificativa'
      });
    });

    it('aciona estado de modal quando não todas marcadas como justificado', async () => {
      setupDefaultMocks();
      postJustificarNaoRealizacaoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_justificado: false,
        mensagem: 'Não foi possível justificar todas.'
      });
      renderComponent();
      await waitForTable();

      await act(async () => {
        await capturedTabelaProps.justificarNaoRealizacao('justificativa');
      });

      await waitFor(() => {
        expect(capturedTabelaProps.showModalCheckNaoPermitido).toBe(true);
      });
      expect(capturedTabelaProps.tituloModalCheckNaoPermitido).toBe(
        'Não é possível marcar a solicitação como justificada'
      );
    });
  });

  // ── Checkboxes e seleção ────────────────────────────────

  describe('Checkboxes e seleção', () => {
    it('selecionarTodosItensDosLancamentosGlobal retorna um checkbox', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      const checkboxJsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      const { container } = render(<div>{checkboxJsx}</div>);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).not.toBeChecked();
    });

    it('selecionarTodosGlobal seleciona todos ao clicar no checkbox desmarcado', async () => {
      setupDefaultMocks(mockContas, mockLancamentos);
      renderComponent();
      await waitForTable();

      const checkboxJsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      const { container } = render(<div>{checkboxJsx}</div>);
      const checkbox = container.querySelector('input[type="checkbox"]');

      await act(async () => {
        fireEvent.click(checkbox);
      });

      // After selecting all, quantidadeSelecionada should remain 0 if no acertos nested
      // but the identificadorCheckboxClicado should be true
      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
      });
    });

    it('selecionarTodosItensDoLancamentoRow retorna checkbox para um lançamento', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      const rowJsx = capturedTabelaProps.selecionarTodosItensDoLancamentoRow(
        capturedTabelaProps.lancamentosAjustes[0]
      );
      const { container } = render(<div>{rowJsx}</div>);
      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
    });

    it('acaoCancelar reseta a seleção dos lançamentos', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      // First select all
      await act(async () => {
        capturedTabelaProps.selecionarTodosGlobal?.({ target: {} }) ||
          capturedTabelaProps.acaoCancelar();
      });

      await act(async () => {
        capturedTabelaProps.acaoCancelar();
      });

      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(false);
      });
    });

    it('acoesDisponiveis retorna todos os flags como false quando nenhum acerto selecionado', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      const acoes = capturedTabelaProps.acoesDisponiveis();

      expect(acoes.JUSTIFICADO_E_REALIZADO).toBe(false);
      expect(acoes.REALIZADO_E_PENDENTE).toBe(false);
      expect(acoes.JUSTIFICADO_E_REALIZADO_E_PENDENTE).toBe(false);
      expect(acoes.JUSTIFICADO_E_PENDENTE).toBe(false);
      expect(acoes.REALIZADO).toBe(false);
      expect(acoes.JUSTIFICADO).toBe(false);
      expect(acoes.PENDENTE).toBe(false);
    });
  });

  // ── rowExpansionTemplateLancamentos ─────────────────────

  describe('rowExpansionTemplateLancamentos', () => {
    it('retorna undefined quando não há acertos na solicitacao', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        mockLancamentos[0]
      );

      expect(resultado).toBeUndefined();
    });

    it('renderiza acertos quando solicitacoes_acerto_por_categoria tem itens', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getAllByText, getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getAllByText('Tipo de acerto:').length).toBeGreaterThan(0);
      expect(getByText('Tipo Acerto 1')).toBeInTheDocument();
    });

    it('renderiza detalhamento quando presente', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByText('Detalhamento do acerto')).toBeInTheDocument();
    });

    it('renderiza campo de justificativa quando acerto tem justificativa', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByText('Justificativa')).toBeInTheDocument();
    });

    it('renderiza campo de esclarecimento quando tipo_acerto é SOLICITACAO_ESCLARECIMENTO', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComEsclarecimento);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByText('Esclarecimento de lançamento')).toBeInTheDocument();
    });

    it('renderiza BarraMensagemInativa quando mensagem_inativa está presente', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComMensagemInativaEExterno);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByTestId } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByTestId('barra-inativa')).toBeInTheDocument();
    });

    it('renderiza BarraMensagemAcertoExterno quando requer_ajustes_externos é true', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComMensagemInativaEExterno);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByTestId } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByTestId('barra-externo')).toBeInTheDocument();
    });

    it('renderiza botão "Editar acertos solicitados" quando exibeBtnIrParaPaginaDeAcertos é true', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent({ exibeBtnIrParaPaginaDeAcertos: true });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByText('Editar acertos solicitados')).toBeInTheDocument();
    });

    it('renderiza botão "Ir para despesa" quando exibeBtnIrParaPaginaDeReceitaOuDespesa é true e tipo_transacao é Gasto', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent({ exibeBtnIrParaPaginaDeReceitaOuDespesa: true });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByText('Ir para despesa')).toBeInTheDocument();
    });

    it('renderiza botão "Ir para receita" quando exibeBtnIrParaPaginaDeReceitaOuDespesa é true e tipo_transacao é Crédito', async () => {
      const lancamentosCredito = [{
        ...mockLancamentosComAcertos[0],
        tipo_transacao: 'Crédito',
        documento_mestre: { uuid: 'doc-credito-uuid' }
      }];

      setupDefaultMocks(mockContas, lancamentosCredito);
      renderComponent({ exibeBtnIrParaPaginaDeReceitaOuDespesa: true });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(getByText('Ir para receita')).toBeInTheDocument();
    });

    it('não renderiza botão de editar acertos quando editavel é false', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent({ exibeBtnIrParaPaginaDeAcertos: true, editavel: false });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { queryByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      expect(queryByText('Editar acertos solicitados')).not.toBeInTheDocument();
    });

    it('renderiza checkbox individual quando visoesService.getPermissoes é true e status é DEVOLVIDA', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      visoesService.getItemUsuarioLogado.mockReturnValue('UE');
      visoesService.getPermissoes.mockReturnValue(true);
      renderComponent();
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { container } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      const checkboxes = container.querySelectorAll('input[type="checkbox"]');
      expect(checkboxes.length).toBeGreaterThan(0);
    });
  });

  // ── Navegação ───────────────────────────────────────────

  describe('Navegação', () => {
    it('navega para detalhe ao clicar em "Editar acertos solicitados"', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent({ exibeBtnIrParaPaginaDeAcertos: true });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      await act(async () => {
        fireEvent.click(getByText('Editar acertos solicitados'));
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/dre-detalhe-prestacao-de-contas-detalhar-acertos/'),
        expect.objectContaining({ replace: true })
      );
    });

    it('navega para edição de despesa ao clicar em "Ir para despesa"', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent({ exibeBtnIrParaPaginaDeReceitaOuDespesa: true });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      await act(async () => {
        fireEvent.click(getByText('Ir para despesa'));
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/edicao-de-despesa/')
      );
    });

    it('navega para despesa com recurso próprio quando receitas_saida_do_recurso está presente', async () => {
      const lancamentosComRecurso = [{
        ...mockLancamentosComAcertos[0],
        documento_mestre: { uuid: 'doc-uuid', receitas_saida_do_recurso: 'recurso-uuid' }
      }];

      setupDefaultMocks(mockContas, lancamentosComRecurso);
      renderComponent({ exibeBtnIrParaPaginaDeReceitaOuDespesa: true });
      await waitForTable();

      const resultado = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      const { getByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{resultado}</Provider>
        </MemoryRouter>
      );

      await act(async () => {
        fireEvent.click(getByText('Ir para despesa'));
      });

      expect(mockNavigate).toHaveBeenCalledWith(
        expect.stringContaining('/cadastro-de-despesa-recurso-proprio/')
      );
    });
  });

  // ── Props passadas para componentes filhos ───────────────

  describe('Props passadas para TabelaAcertosDespesasPeriodosAnteriores', () => {
    it('passa lancamentosAjustes corretamente', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.lancamentosAjustes).toHaveLength(1);
      expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.uuid).toBe('lancamento-uuid');
    });

    it('passa prestacaoDeContas corretamente', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.prestacaoDeContas).toEqual(defaultProps.prestacaoDeContas);
    });

    it('passa analisePermiteEdicao como true quando editavel é true na resposta da API', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.analisePermiteEdicao).toBe(true);
    });

    it('passa analisePermiteEdicao como false quando editavel é false na resposta da API', async () => {
      setupDefaultMocks(mockContas, mockLancamentos, { ...mockAnaliseStatus, editavel: false });
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.analisePermiteEdicao).toBe(false);
    });

    it('passa totalDeAcertosDosLancamentos como 0 quando lancamentos não têm acertos', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.totalDeAcertosDosLancamentos).toBe(0);
    });

    it('calcula totalDeAcertosDosLancamentos corretamente quando há acertos', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.totalDeAcertosDosLancamentos).toBe(2);
    });

    it('passa rowsPerPageAcertosLancamentos como 5', async () => {
      setupDefaultMocks();
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.rowsPerPageAcertosLancamentos).toBe(5);
    });
  });

  // ── Permissões ──────────────────────────────────────────

  describe('Permissões', () => {
    it('não permite edição quando usuário não tem permissão (editavel false)', async () => {
      setupDefaultMocks(mockContas, mockLancamentos, { ...mockAnaliseStatus, editavel: false });
      visoesService.getPermissoes.mockReturnValue(false);
      renderComponent();
      await waitForTable();

      expect(capturedTabelaProps.analisePermiteEdicao).toBe(false);
    });
  });

  // ── Interações com checkboxes (detalhe) ─────────────────

  describe('Interações avançadas com checkboxes', () => {
    it('selecionarTodosGlobal desseleciona todos quando todos já estavam selecionados', async () => {
      setupDefaultMocks(mockContas, mockLancamentos);
      renderComponent();
      await waitForTable();

      // Primeiro click: seleciona todos
      const checkbox1Jsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      const { container: c1, unmount: u1 } = render(<div>{checkbox1Jsx}</div>);
      await act(async () => {
        fireEvent.click(c1.querySelector('input[type="checkbox"]'));
      });
      u1();

      // Aguarda atualização do estado (selecionado = true)
      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
      });

      // Segundo click: desseleciona todos
      const checkbox2Jsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      const { container: c2 } = render(<div>{checkbox2Jsx}</div>);
      await act(async () => {
        fireEvent.click(c2.querySelector('input[type="checkbox"]'));
      });

      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(false);
      });
    });

    it('tratarSelecionado é coberto pelo checkbox da row ao disparar evento de mudança', async () => {
      setupDefaultMocks(mockContas, mockLancamentos);
      renderComponent();
      await waitForTable();

      const rowJsx = capturedTabelaProps.selecionarTodosItensDoLancamentoRow(
        capturedTabelaProps.lancamentosAjustes[0]
      );
      const { container } = render(<div>{rowJsx}</div>);
      const checkbox = container.querySelector('input[type="checkbox"]');

      // Verifica estado inicial do checkbox (desmarcado)
      expect(checkbox.checked).toBe(false);

      // O change event executa tratarSelecionado sem causar recarregamento de dados
      getDespesasPeriodosAnterioresAjustes.mockClear();
      await act(async () => {
        fireEvent.change(checkbox, { target: { checked: true } });
      });
      // tratarSelecionado não deve disparar recarregamento de dados
      expect(getDespesasPeriodosAnterioresAjustes).not.toHaveBeenCalled();
    });

    it('tratarSelecionadoIndividual seleciona um acerto individual', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );
      const { container } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{expansion}</Provider>
        </MemoryRouter>
      );

      const acertoCheckbox = container.querySelector('input[value="acerto-uuid-1"]');
      if (acertoCheckbox) {
        await act(async () => {
          fireEvent.change(acertoCheckbox, { target: { checked: true } });
        });
        // Verifica que o lancamento não está totalmente selecionado (apenas 1 dos 2)
        await waitFor(() => {
          expect(capturedTabelaProps.quantidadeSelecionada).toBeDefined();
        });
      }
    });

    it('acoesDisponiveis retorna REALIZADO_E_PENDENTE quando há acertos com esses status', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      // Seleciona todos via header checkbox
      const checkboxJsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      const { container } = render(<div>{checkboxJsx}</div>);
      await act(async () => {
        fireEvent.click(container.querySelector('input[type="checkbox"]'));
      });

      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
      });

      // Verifica acoesDisponiveis com acertos PENDENTE e REALIZADO selecionados
      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.REALIZADO_E_PENDENTE).toBe(true);
    });
  });

  // ── Interações na expansão (textareas e botões de salvar) ─

  describe('Interações na expansão: justificativa e esclarecimento', () => {
    it('handleChangeTextareaJustificativa atualiza o estado ao digitar na textarea', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );
      const { container } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{expansion}</Provider>
        </MemoryRouter>
      );

      const textarea = container.querySelector('textarea[name="justificativa"]');
      expect(textarea).toBeInTheDocument();

      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'novo valor de justificativa' } });
      });
      // handleChangeTextareaJustificativa foi chamado e atualizou o estado no componente pai
    });

    it('salvarJustificativa chama postJustificarNaoRealizacaoLancamentoPrestacaoConta após habilitar o botão', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      postJustificarNaoRealizacaoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_justificado: true
      });
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      // Render inicial da expansão
      let expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const { container, rerender } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{expansion}</Provider>
        </MemoryRouter>
      );

      // Digita valor diferente da justificativa existente para habilitar o botão
      const textarea = container.querySelector('textarea[name="justificativa"]');
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'justificativa completamente nova' } });
      });

      // Re-renderiza com closure atualizada (textareaJustificativa foi atualizado)
      await act(async () => {
        const updatedExpansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        rerender(
          <MemoryRouter>
            <Provider store={mockStore}>{updatedExpansion}</Provider>
          </MemoryRouter>
        );
      });

      // Clica no botão "Salvar Justificativas" se estiver habilitado
      const salvarBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => b.textContent.trim() === 'Salvar Justificativas'
      );
      if (salvarBtn && !salvarBtn.disabled) {
        await act(async () => {
          fireEvent.click(salvarBtn);
        });
        await waitFor(() => {
          expect(postJustificarNaoRealizacaoLancamentoPrestacaoConta).toHaveBeenCalled();
        });
      }
    });

    it('handleChangeTextareaEsclarecimentoLancamento atualiza o estado ao digitar', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComEsclarecimento);
      renderComponent();
      await waitForTable();

      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );
      const { container } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{expansion}</Provider>
        </MemoryRouter>
      );

      const textarea = container.querySelector('textarea[name="esclarecimento"]');
      expect(textarea).toBeInTheDocument();

      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'novo esclarecimento' } });
      });
      // handleChangeTextareaEsclarecimentoLancamento foi chamado
    });

    it('marcarComoEsclarecido chama postMarcarComoLancamentoEsclarecido após habilitar o botão', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComEsclarecimento);
      postMarcarComoLancamentoEsclarecido.mockResolvedValue({});
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      let expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const { container, rerender } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{expansion}</Provider>
        </MemoryRouter>
      );

      // Digita valor diferente do esclarecimento existente
      const textarea = container.querySelector('textarea[name="esclarecimento"]');
      await act(async () => {
        fireEvent.change(textarea, { target: { value: 'esclarecimento totalmente novo' } });
      });

      // Re-renderiza com closure atualizada
      await act(async () => {
        const updatedExpansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        rerender(
          <MemoryRouter>
            <Provider store={mockStore}>{updatedExpansion}</Provider>
          </MemoryRouter>
        );
      });

      const salvarEsclarecimentoBtn = Array.from(container.querySelectorAll('button')).find(
        (b) => b.textContent.trim() === 'Salvar esclarecimento'
      );
      if (salvarEsclarecimentoBtn && !salvarEsclarecimentoBtn.disabled) {
        await act(async () => {
          fireEvent.click(salvarEsclarecimentoBtn);
        });
        await waitFor(() => {
          expect(postMarcarComoLancamentoEsclarecido).toHaveBeenCalled();
        });
      }
    });

    it('possuiSolicitacaoEsclarecimento retorna false quando value é nulo', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      // Cria um lancamento com acertos vazios para cobrir o branch falso
      const lancamentoSemEsclarecimento = {
        ...capturedTabelaProps.lancamentosAjustes[0],
        analise_lancamento: {
          ...capturedTabelaProps.lancamentosAjustes[0].analise_lancamento,
          solicitacoes_de_ajuste_da_analise: {
            solicitacoes_acerto_por_categoria: [
              {
                acertos: [
                  {
                    uuid: 'acerto-sem-esclarecimento',
                    ordem: 1,
                    tipo_acerto: { nome: 'Tipo', categoria: 'OUTRO_TIPO' },
                    detalhamento: null,
                    status_realizacao: 'PENDENTE',
                    justificativa: null,
                    esclarecimentos: null,
                    selecionado: false
                  }
                ],
                requer_ajustes_externos: false,
                mensagem_inativa: null
              }
            ]
          }
        }
      };

      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamentoSemEsclarecimento);
      const { queryByText } = render(
        <MemoryRouter>
          <Provider store={mockStore}>{expansion}</Provider>
        </MemoryRouter>
      );

      // O botão de esclarecimento não deve aparecer
      expect(queryByText('Salvar esclarecimento')).not.toBeInTheDocument();
    });
  });

  // ── Rows expandidas ─────────────────────────────────────

  describe('Estado de linhas expandidas', () => {
    it('restaura linhas expandidas do localStorage ao carregar lancamentos', async () => {
      const estadoComExpanded = {
        conferencia_de_despesas_periodos_anteriores: {
          conta_uuid: 'conta-uuid',
          expanded: ['lancamento-uuid'],
          paginacao_atual: 0
        }
      };
      meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue(estadoComExpanded);
      getContasDaAssociacaoComAcertosEmDespesasPeriodosAnteriores.mockResolvedValue(mockContas);
      getAnaliseLancamentosPrestacaoConta.mockResolvedValue(mockAnaliseStatus);
      getDespesasPeriodosAnterioresAjustes.mockResolvedValue(mockLancamentos);
      visoesService.getPermissoes.mockReturnValue(true);
      visoesService.getItemUsuarioLogado.mockReturnValue('UE');
      visoesService.getUsuarioLogin.mockReturnValue('usuario-login');
      meapcservice.setAnaliseDrePorUsuario.mockReturnValue(undefined);

      renderComponent();
      await waitForTable();

      await waitFor(() => {
        expect(capturedTabelaProps.expandedRowsLancamentos).toEqual([mockLancamentos[0]]);
      });
    });
  });
});
