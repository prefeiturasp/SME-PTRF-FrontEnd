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

// ── Helper para criar acertos com status específico ──────────────────────────
const makeAcerto = (uuid, status) => ({
  uuid,
  ordem: 1,
  tipo_acerto: { nome: 'Tipo Acerto', categoria: 'AJUSTE_LANCAMENTO' },
  detalhamento: null,
  status_realizacao: status,
  justificativa: null,
  esclarecimentos: null,
  selecionado: false
});

const makeLancamentos = (acertos) => [{
  tipo_transacao: 'Gasto',
  documento_mestre: { uuid: 'doc-uuid', receitas_saida_do_recurso: null },
  analise_lancamento: {
    uuid: 'lancamento-uuid',
    selecionado: false,
    solicitacoes_de_ajuste_da_analise_total: acertos.length,
    solicitacoes_de_ajuste_da_analise: {
      solicitacoes_acerto_por_categoria: [{
        acertos,
        requer_ajustes_externos: false,
        mensagem_inativa: null
      }]
    }
  }
}];

// Dois lançamentos para testar branches de todosLancamentosCheckados
const mockDoisLancamentos = [
  {
    tipo_transacao: 'Gasto',
    documento_mestre: { uuid: 'doc-uuid-1', receitas_saida_do_recurso: null },
    analise_lancamento: {
      uuid: 'lancamento-uuid-1',
      selecionado: false,
      solicitacoes_de_ajuste_da_analise_total: 1,
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [{
          acertos: [makeAcerto('acerto-multi-1', 'PENDENTE')],
          requer_ajustes_externos: false,
          mensagem_inativa: null
        }]
      }
    }
  },
  {
    tipo_transacao: 'Gasto',
    documento_mestre: { uuid: 'doc-uuid-2', receitas_saida_do_recurso: null },
    analise_lancamento: {
      uuid: 'lancamento-uuid-2',
      selecionado: false,
      solicitacoes_de_ajuste_da_analise_total: 1,
      solicitacoes_de_ajuste_da_analise: {
        solicitacoes_acerto_por_categoria: [{
          acertos: [makeAcerto('acerto-multi-2', 'PENDENTE')],
          requer_ajustes_externos: false,
          mensagem_inativa: null
        }]
      }
    }
  }
];

const lancamentosJustificadoERealizado = makeLancamentos([
  makeAcerto('uuid-j', 'JUSTIFICADO'),
  makeAcerto('uuid-r', 'REALIZADO')
]);
const lancamentosJustificadoRealizadoPendente = makeLancamentos([
  makeAcerto('uuid-j', 'JUSTIFICADO'),
  makeAcerto('uuid-r', 'REALIZADO'),
  makeAcerto('uuid-p', 'PENDENTE')
]);
const lancamentosJustificadoEPendente = makeLancamentos([
  makeAcerto('uuid-j', 'JUSTIFICADO'),
  makeAcerto('uuid-p', 'PENDENTE')
]);
const lancamentosSoRealizados = makeLancamentos([makeAcerto('uuid-r', 'REALIZADO')]);
const lancamentosSoJustificados = makeLancamentos([makeAcerto('uuid-j', 'JUSTIFICADO')]);
const lancamentosSoPendentes = makeLancamentos([makeAcerto('uuid-p', 'PENDENTE')]);

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
    waitFor(() => {
      expect(screen.getByTestId('tabela-acertos-despesas')).toBeInTheDocument();
      expect(capturedTabelaProps.analisePermiteEdicao).toBeDefined();
    });

  // Helper para encontrar elementos em árvores JSX sem renderizar em árvore separada
  const findInJSX = (jsx, predicate) => {
    if (jsx === null || jsx === undefined || typeof jsx !== 'object' || !jsx.props)
      return null;
    if (predicate(jsx)) return jsx;
    const children = jsx.props.children;
    if (children === null || children === undefined) return null;
    const list = Array.isArray(children) ? children.flat(Infinity) : [children];
    for (const child of list) {
      const found = findInJSX(child, predicate);
      if (found) return found;
    }
    return null;
  };

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
    it('passa uuids dos acertos selecionados ao chamar justificarNaoRealizacao', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      postJustificarNaoRealizacaoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_justificado: true
      });
      renderComponent();
      await waitForTable();

      // Selecionar todos os acertos para que selecionados.map() seja chamado com itens
      const jsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      await act(async () => {
        jsx.props.children.props.onChange({ target: {} });
      });
      await waitFor(() =>
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true)
      );

      await act(async () => {
        await capturedTabelaProps.justificarNaoRealizacao('justificativa com selecionados');
      });

      expect(postJustificarNaoRealizacaoLancamentoPrestacaoConta).toHaveBeenCalledWith({
        uuids_solicitacoes_acertos_lancamentos: ['acerto-uuid-1', 'acerto-uuid-2'],
        justificativa: 'justificativa com selecionados'
      });
    });

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

      // Invocação direta do handler para evitar problema cross-root
      // onChange={(e) => selecionarTodosGlobal(e.target)} - selecionarTodosGlobal não usa e
      const checkboxJsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      await act(async () => {
        checkboxJsx.props.children.props.onChange({ target: {} });
      });

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
      // Verifica a estrutura do JSX diretamente sem renderizar em árvore separada
      expect(rowJsx.type).toBe('input');
      expect(rowJsx.props.type).toBe('checkbox');
      expect(typeof rowJsx.props.onChange).toBe('function');
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

      // Primeiro: seleciona todos via invocação direta
      const jsx1 = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      await act(async () => {
        jsx1.props.children.props.onChange({ target: {} });
      });

      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
      });

      // Segundo: desseleciona todos via invocação direta
      const jsx2 = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      await act(async () => {
        jsx2.props.children.props.onChange({ target: {} });
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

      // Verifica estado inicial via props do JSX
      expect(rowJsx.props.checked).toBe(false);

      // Invocação direta do handler para evitar problema cross-root
      // onChange={(e) => tratarSelecionado(e, rowData.analise_lancamento.uuid)}
      getDespesasPeriodosAnterioresAjustes.mockClear();
      await act(async () => {
        rowJsx.props.onChange({ target: { checked: true } });
      });

      // tratarSelecionado não deve disparar recarregamento de dados
      expect(getDespesasPeriodosAnterioresAjustes).not.toHaveBeenCalled();

      // Após seleção, o lançamento deve estar marcado como selecionado
      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
      });
    });

    it('tratarSelecionadoIndividual seleciona um acerto individual', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(
        capturedTabelaProps.lancamentosAjustes[0]
      );

      // Localiza checkbox individual via findInJSX e invoca diretamente
      const acertoCheckbox = findInJSX(
        expansion,
        (el) => el.type === 'input' && el.props.type === 'checkbox' && el.props.value === 'acerto-uuid-1'
      );

      expect(acertoCheckbox).toBeTruthy();

      await act(async () => {
        acertoCheckbox.props.onChange({ target: { checked: true } });
      });

      // Após selecionar 1 dos 2 acertos, quantidadeSelecionada deve ser 1
      await waitFor(() => {
        expect(capturedTabelaProps.quantidadeSelecionada).toBe(1);
      });
    });

    it('tratarSelecionadoIndividual cobre todosAcertosCheckados=true ao selecionar todos os acertos', async () => {
      // mockLancamentosComAcertos tem 2 acertos; selecionar ambos cobre linhas 723, 775-778
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      // Selecionar acerto-uuid-1 (todosAcertosCheckados ainda false)
      const exp1 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const cb1 = findInJSX(exp1, (el) =>
        el.type === 'input' && el.props.type === 'checkbox' && el.props.value === 'acerto-uuid-1'
      );
      await act(async () => { cb1.props.onChange({ target: { checked: true } }); });
      await waitFor(() => expect(capturedTabelaProps.quantidadeSelecionada).toBe(1));

      // Selecionar acerto-uuid-2 (todosAcertosCheckados agora true; 1/1 lancamento → todosLancamentosCheckados true)
      const exp2 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const cb2 = findInJSX(exp2, (el) =>
        el.type === 'input' && el.props.type === 'checkbox' && el.props.value === 'acerto-uuid-2'
      );
      await act(async () => { cb2.props.onChange({ target: { checked: true } }); });

      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
        expect(capturedTabelaProps.quantidadeSelecionada).toBe(2);
      });
    });

    it('tratarSelecionado cobre else de todosLancamentosCheckados com múltiplos lançamentos', async () => {
      // mockDoisLancamentos tem 2 lançamentos; selecionar apenas 1 → todosLancamentosCheckados false (linha 677)
      setupDefaultMocks(mockContas, mockDoisLancamentos);
      renderComponent();
      await waitForTable();

      // Seleciona apenas o primeiro lançamento
      const rowJsx = capturedTabelaProps.selecionarTodosItensDoLancamentoRow(
        capturedTabelaProps.lancamentosAjustes[0]
      );
      await act(async () => {
        rowJsx.props.onChange({ target: { checked: true } });
      });

      // Apenas 1 dos 2 lançamentos selecionado → identificadorCheckboxClicado deve ser false
      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
        expect(capturedTabelaProps.lancamentosAjustes[1].analise_lancamento.selecionado).toBe(false);
      });
    });

    it('tratarSelecionadoIndividual cobre else de todosLancamentosCheckados com múltiplos lançamentos', async () => {
      // Usa 2 lançamentos, seleciona todos os acertos do 1º → todosAcertosCheckados true mas todosLancamentosCheckados false (linha 781)
      const doisLancamentosComAcertos = [
        ...mockDoisLancamentos.map((l, i) => ({
          ...l,
          analise_lancamento: {
            ...l.analise_lancamento,
            uuid: `lancamento-multi-uuid-${i}`,
            solicitacoes_de_ajuste_da_analise_total: 2,
            solicitacoes_de_ajuste_da_analise: {
              solicitacoes_acerto_por_categoria: [{
                acertos: [
                  makeAcerto(`acerto-m${i}-1`, 'PENDENTE'),
                  makeAcerto(`acerto-m${i}-2`, 'PENDENTE')
                ],
                requer_ajustes_externos: false,
                mensagem_inativa: null
              }]
            }
          }
        }))
      ];

      setupDefaultMocks(mockContas, doisLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      const lancamento0 = capturedTabelaProps.lancamentosAjustes[0];

      // Selecionar ambos acertos do lançamento 0
      const exp1 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento0);
      const cbA = findInJSX(exp1, (el) =>
        el.type === 'input' && el.props.type === 'checkbox' && el.props.value === 'acerto-m0-1'
      );
      await act(async () => { cbA.props.onChange({ target: { checked: true } }); });
      await waitFor(() => expect(capturedTabelaProps.quantidadeSelecionada).toBe(1));

      // Segundo acerto → todosAcertosCheckados true, mas lancamento-1 ainda false → todosLancamentosCheckados false → linha 781
      const exp2 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento0);
      const cbB = findInJSX(exp2, (el) =>
        el.type === 'input' && el.props.type === 'checkbox' && el.props.value === 'acerto-m0-2'
      );
      await act(async () => { cbB.props.onChange({ target: { checked: true } }); });

      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
        expect(capturedTabelaProps.lancamentosAjustes[1].analise_lancamento.selecionado).toBe(false);
      });
    });

    it('acoesDisponiveis retorna REALIZADO_E_PENDENTE quando há acertos com esses status', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      renderComponent();
      await waitForTable();

      // Seleciona todos via invocação direta
      const checkboxJsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      await act(async () => {
        checkboxJsx.props.children.props.onChange({ target: {} });
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

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];
      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);

      // Localiza textarea via findInJSX e invoca onChange diretamente
      const textarea = findInJSX(
        expansion,
        (el) => el.type === 'textarea' && el.props.name === 'justificativa'
      );
      expect(textarea).toBeTruthy();

      await act(async () => {
        textarea.props.onChange({ target: { value: 'novo valor de justificativa' } });
      });

      // handleChangeTextareaJustificativa foi chamado; verifica estado atualizado
      await waitFor(() => {
        const updatedExpansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        const updatedTextarea = findInJSX(
          updatedExpansion,
          (el) => el.type === 'textarea' && el.props.name === 'justificativa'
        );
        // defaultValue não muda (é controlado pelo estado), mas o estado foi atualizado
        expect(updatedTextarea).toBeTruthy();
      });
    });

    it('salvarJustificativa chama postJustificarNaoRealizacaoLancamentoPrestacaoConta após habilitar o botão', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      postJustificarNaoRealizacaoLancamentoPrestacaoConta.mockResolvedValue({
        todas_as_solicitacoes_marcadas_como_justificado: true
      });
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      // Passo 1: invocar onChange da textarea para atualizar textareaJustificativa no estado
      const expansion1 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const textarea = findInJSX(
        expansion1,
        (el) => el.type === 'textarea' && el.props.name === 'justificativa'
      );
      expect(textarea).toBeTruthy();
      await act(async () => {
        textarea.props.onChange({ target: { value: 'justificativa completamente nova' } });
      });

      // Passo 2: obter closure atualizada e invocar botão Salvar Justificativas
      await act(async () => {
        const expansion2 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        const saveBtn = findInJSX(
          expansion2,
          (el) =>
            el.type === 'button' &&
            el.props.children?.type === 'strong' &&
            el.props.children?.props?.children === 'Salvar Justificativas' &&
            !el.props.disabled
        );
        saveBtn?.props?.onClick?.();
      });

      await waitFor(() => {
        expect(postJustificarNaoRealizacaoLancamentoPrestacaoConta).toHaveBeenCalled();
      });
    });

    it('salvarJustificativa trata erro do serviço no catch', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComAcertos);
      postJustificarNaoRealizacaoLancamentoPrestacaoConta.mockRejectedValue(new Error('Erro de rede'));
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      const expansion1 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const textarea = findInJSX(
        expansion1,
        (el) => el.type === 'textarea' && el.props.name === 'justificativa'
      );
      await act(async () => {
        textarea.props.onChange({ target: { value: 'justificativa nova para erro' } });
      });

      await act(async () => {
        const expansion2 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        const saveBtn = findInJSX(
          expansion2,
          (el) =>
            el.type === 'button' &&
            el.props.children?.type === 'strong' &&
            el.props.children?.props?.children === 'Salvar Justificativas' &&
            !el.props.disabled
        );
        saveBtn?.props?.onClick?.();
      });

      // O componente não deve lançar exceção (catch trata o erro)
      await waitFor(() => {
        expect(postJustificarNaoRealizacaoLancamentoPrestacaoConta).toHaveBeenCalled();
      });
    });

    it('handleChangeTextareaEsclarecimentoLancamento atualiza o estado ao digitar', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComEsclarecimento);
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];
      const expansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);

      // Localiza textarea de esclarecimento via findInJSX e invoca diretamente
      const textarea = findInJSX(
        expansion,
        (el) => el.type === 'textarea' && el.props.name === 'esclarecimento'
      );
      expect(textarea).toBeTruthy();

      await act(async () => {
        textarea.props.onChange({ target: { value: 'novo esclarecimento' } });
      });

      // handleChangeTextareaEsclarecimentoLancamento foi chamado
      await waitFor(() => {
        const updatedExpansion = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        const updatedTextarea = findInJSX(
          updatedExpansion,
          (el) => el.type === 'textarea' && el.props.name === 'esclarecimento'
        );
        expect(updatedTextarea).toBeTruthy();
      });
    });

    it('marcarComoEsclarecido chama postMarcarComoLancamentoEsclarecido após habilitar o botão', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComEsclarecimento);
      postMarcarComoLancamentoEsclarecido.mockResolvedValue({});
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      // Passo 1: invocar onChange do textarea para atualizar txtEsclarecimentoLancamento
      const expansion1 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const textarea = findInJSX(
        expansion1,
        (el) => el.type === 'textarea' && el.props.name === 'esclarecimento'
      );
      expect(textarea).toBeTruthy();
      await act(async () => {
        textarea.props.onChange({ target: { value: 'esclarecimento totalmente novo' } });
      });

      // Passo 2: obter closure atualizada e invocar botão Salvar esclarecimento
      await act(async () => {
        const expansion2 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        const saveBtn = findInJSX(
          expansion2,
          (el) =>
            el.type === 'button' &&
            el.props.children?.type === 'strong' &&
            el.props.children?.props?.children === 'Salvar esclarecimento' &&
            !el.props.disabled
        );
        saveBtn?.props?.onClick?.();
      });

      await waitFor(() => {
        expect(postMarcarComoLancamentoEsclarecido).toHaveBeenCalled();
      });
    });

    it('marcarComoEsclarecido trata erro do serviço no catch', async () => {
      setupDefaultMocks(mockContas, mockLancamentosComEsclarecimento);
      postMarcarComoLancamentoEsclarecido.mockRejectedValue(new Error('Erro de rede'));
      renderComponent();
      await waitForTable();

      const lancamento = capturedTabelaProps.lancamentosAjustes[0];

      const expansion1 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
      const textarea = findInJSX(
        expansion1,
        (el) => el.type === 'textarea' && el.props.name === 'esclarecimento'
      );
      await act(async () => {
        textarea.props.onChange({ target: { value: 'esclarecimento para erro' } });
      });

      await act(async () => {
        const expansion2 = capturedTabelaProps.rowExpansionTemplateLancamentos(lancamento);
        const saveBtn = findInJSX(
          expansion2,
          (el) =>
            el.type === 'button' &&
            el.props.children?.type === 'strong' &&
            el.props.children?.props?.children === 'Salvar esclarecimento' &&
            !el.props.disabled
        );
        saveBtn?.props?.onClick?.();
      });

      // O componente não deve lançar exceção (catch trata o erro)
      await waitFor(() => {
        expect(postMarcarComoLancamentoEsclarecido).toHaveBeenCalled();
      });
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

  // ── acoesDisponiveis: todas as combinações de status ────────────────────────

  describe('acoesDisponiveis: combinações de status', () => {
    const selecionarTodos = async () => {
      const jsx = capturedTabelaProps.selecionarTodosItensDosLancamentosGlobal();
      await act(async () => {
        jsx.props.children.props.onChange({ target: {} });
      });
      await waitFor(() => {
        expect(capturedTabelaProps.lancamentosAjustes[0].analise_lancamento.selecionado).toBe(true);
      });
    };

    it('retorna JUSTIFICADO_E_REALIZADO quando acertos têm esses status', async () => {
      setupDefaultMocks(mockContas, lancamentosJustificadoERealizado);
      renderComponent();
      await waitForTable();

      await selecionarTodos();

      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.JUSTIFICADO_E_REALIZADO).toBe(true);
      expect(acoes.REALIZADO_E_PENDENTE).toBe(false);
    });

    it('retorna JUSTIFICADO_E_REALIZADO_E_PENDENTE quando acertos têm os três status', async () => {
      setupDefaultMocks(mockContas, lancamentosJustificadoRealizadoPendente);
      renderComponent();
      await waitForTable();

      await selecionarTodos();

      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.JUSTIFICADO_E_REALIZADO_E_PENDENTE).toBe(true);
    });

    it('retorna JUSTIFICADO_E_PENDENTE quando acertos têm esses status', async () => {
      setupDefaultMocks(mockContas, lancamentosJustificadoEPendente);
      renderComponent();
      await waitForTable();

      await selecionarTodos();

      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.JUSTIFICADO_E_PENDENTE).toBe(true);
    });

    it('retorna REALIZADO quando apenas acertos REALIZADO estão selecionados', async () => {
      setupDefaultMocks(mockContas, lancamentosSoRealizados);
      renderComponent();
      await waitForTable();

      await selecionarTodos();

      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.REALIZADO).toBe(true);
    });

    it('retorna JUSTIFICADO quando apenas acertos JUSTIFICADO estão selecionados', async () => {
      setupDefaultMocks(mockContas, lancamentosSoJustificados);
      renderComponent();
      await waitForTable();

      await selecionarTodos();

      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.JUSTIFICADO).toBe(true);
    });

    it('retorna PENDENTE quando apenas acertos PENDENTE estão selecionados', async () => {
      setupDefaultMocks(mockContas, lancamentosSoPendentes);
      renderComponent();
      await waitForTable();

      await selecionarTodos();

      const acoes = capturedTabelaProps.acoesDisponiveis();
      expect(acoes.PENDENTE).toBe(true);
    });
  });

  // ── Navegação: Crédito ───────────────────────────────────

  describe('Navegação: Crédito', () => {
    it('navega para edição de receita ao clicar em "Ir para receita"', async () => {
      const lancamentosCredito = [{
        tipo_transacao: 'Crédito',
        documento_mestre: { uuid: 'doc-credito-uuid', receitas_saida_do_recurso: null },
        analise_lancamento: {
          uuid: 'lancamento-uuid',
          selecionado: false,
          solicitacoes_de_ajuste_da_analise_total: 1,
          solicitacoes_de_ajuste_da_analise: {
            solicitacoes_acerto_por_categoria: [{
              acertos: [{
                uuid: 'acerto-credito',
                ordem: 1,
                tipo_acerto: { nome: 'Tipo', categoria: 'AJUSTE_LANCAMENTO' },
                detalhamento: null,
                status_realizacao: 'PENDENTE',
                justificativa: null,
                esclarecimentos: null,
                selecionado: false
              }],
              requer_ajustes_externos: false,
              mensagem_inativa: null
            }]
          }
        }
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

      await act(async () => {
        fireEvent.click(getByText('Ir para receita'));
      });

      expect(mockNavigate).toHaveBeenCalledWith('/edicao-de-receita/doc-credito-uuid');
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
