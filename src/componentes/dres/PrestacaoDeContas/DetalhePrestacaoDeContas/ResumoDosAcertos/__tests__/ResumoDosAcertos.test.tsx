import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumoDosAcertos } from '../index';

jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as object),
  useParams: jest.fn(),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../TopoComBotoes', () => ({
  TopoComBotoes: ({
    onClickDevolver,
    devolverDisabled,
  }: {
    onClickDevolver: () => void;
    devolverDisabled: boolean;
  }) => (
    <div>
      <button
        type="button"
        data-testid="botao-devolver"
        onClick={onClickDevolver}
        disabled={devolverDisabled}
      >
        Disparar devolução
      </button>
      <span data-testid="devolver-disabled">{String(devolverDisabled)}</span>
    </div>
  ),
}));

jest.mock('../TabsConferenciaAtualHistorico', () => {
  const React = require('react');
  const TabsMock = ({
    handleChangeDataLimiteDevolucao,
  }: {
    handleChangeDataLimiteDevolucao: (name: string, value: string) => void;
  }) => {
    React.useEffect(() => {
      handleChangeDataLimiteDevolucao('data_limite_devolucao', '2024-01-01');
    }, [handleChangeDataLimiteDevolucao]);
    return <div data-testid="tabs-mock">Tabs</div>;
  };
  return { __esModule: true, default: TabsMock };
});

jest.mock(
  '../../../../Globais/DatePickerField',
  () => ({
    DatePickerField: () => <input data-testid="datepicker-mock" />,
  }),
  { virtual: true }
);

jest.mock('../../DevolucaoParaAcertos/ModalErroDevolverParaAcerto', () => ({
  ModalErroDevolverParaAcerto: ({ show }: { show: boolean }) => (
    <div data-testid="modal-erro" data-visible={String(show)} />
  ),
}));

jest.mock('../../DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto', () => ({
  ModalConfirmaDevolverParaAcerto: ({ show }: { show: boolean }) => (
    <div data-testid="modal-confirma" data-visible={String(show)} />
  ),
}));

jest.mock('../../DevolucaoParaAcertos/ModalConciliacaoBancaria', () => ({
  ModalConciliacaoBancaria: ({ show }: { show: boolean }) => (
    <div data-testid="modal-conciliacao" data-visible={String(show)} />
  ),
}));

jest.mock('../../DevolucaoParaAcertos/ModalComprovanteSaldoConta', () => ({
  ModalComprovanteSaldoConta: ({ show }: { show: boolean }) => (
    <div data-testid="modal-comprovante" data-visible={String(show)} />
  ),
}));

jest.mock(
  '../../../../../paginas/PaginasContainer',
  () => ({
    PaginasContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="paginas-container">{children}</div>
    ),
  }),
  { virtual: true }
);

jest.mock('../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid', () => ({
  useCarregaPrestacaoDeContasPorUuid: jest.fn(),
}));

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
  getConcluirAnalise: jest.fn(),
  getAnalisesDePcDevolvidas: jest.fn(),
  getUltimaAnalisePc: jest.fn(),
  getLancamentosAjustes: jest.fn(),
  getDocumentosAjustes: jest.fn(),
  getExtratosBancariosAjustes: jest.fn(),
  getInfoAta: jest.fn(),
  getDespesasPeriodosAnterioresAjustes: jest.fn(),
  getPrestacaoDeContasDetalhe: jest.fn(),
}));

jest.mock('../../../../../services/mantemEstadoAnaliseDre.service', () => ({
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado: jest.fn(() => ({})),
    limpaAnaliseDreUsuarioLogado: jest.fn(),
    setAnaliseDrePorUsuario: jest.fn(),
  },
}));

jest.mock('../../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(() => false),
    getUsuarioLogin: jest.fn(() => 'usuario-teste'),
  },
}));

const {
  useParams,
  useLocation,
  useNavigate,
} = jest.requireMock('react-router-dom') as {
  useParams: jest.Mock;
  useLocation: jest.Mock;
  useNavigate: jest.Mock;
};

const {
  useCarregaPrestacaoDeContasPorUuid,
} = jest.requireMock(
  '../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid'
) as { useCarregaPrestacaoDeContasPorUuid: jest.Mock };

const {
  getAnalisesDePcDevolvidas,
  getUltimaAnalisePc,
  getLancamentosAjustes,
  getDocumentosAjustes,
  getExtratosBancariosAjustes,
  getInfoAta,
  getDespesasPeriodosAnterioresAjustes,
  getPrestacaoDeContasDetalhe,
} = jest.requireMock('../../../../../services/dres/PrestacaoDeContas.service') as {
  getAnalisesDePcDevolvidas: jest.Mock;
  getUltimaAnalisePc: jest.Mock;
  getLancamentosAjustes: jest.Mock;
  getDocumentosAjustes: jest.Mock;
  getExtratosBancariosAjustes: jest.Mock;
  getInfoAta: jest.Mock;
  getDespesasPeriodosAnterioresAjustes: jest.Mock;
  getPrestacaoDeContasDetalhe: jest.Mock;
};

const basePrestacao = {
  uuid: 'prestacao-uuid',
  status: 'EM_ANALISE',
  pode_devolver: true,
  devolucoes_da_prestacao: [],
  analise_atual: {
    uuid: 'analise-uuid',
    acertos_podem_alterar_saldo_conciliacao: false,
    tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
    contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [],
  },
  analises_de_conta_da_prestacao: [],
};

const defaultLocationState = {
  infoAta: {
    contas: [
      {
        conta_associacao: {
          uuid: 'conta-1',
          nome: 'Conta 1',
        },
      },
    ],
  },
  analisesDeContaDaPrestacao: [],
  editavel: true,
};

const setupRender = async (
  prestacaoDetalhada: Partial<typeof basePrestacao> = {}
) => {
  useParams.mockReturnValue({ prestacao_conta_uuid: 'prestacao-uuid' });
  useLocation.mockReturnValue({ state: defaultLocationState });
  useNavigate.mockReturnValue(jest.fn());

  useCarregaPrestacaoDeContasPorUuid.mockReturnValue({
    ...basePrestacao,
    ...prestacaoDetalhada,
    analise_atual: {
      ...basePrestacao.analise_atual,
      ...(prestacaoDetalhada.analise_atual || {}),
    },
  });

  getPrestacaoDeContasDetalhe.mockResolvedValue({
    ...basePrestacao,
    ...prestacaoDetalhada,
    analise_atual: {
      ...basePrestacao.analise_atual,
      ...(prestacaoDetalhada.analise_atual || {}),
    },
  });

  getAnalisesDePcDevolvidas.mockResolvedValue([]);
  getUltimaAnalisePc.mockResolvedValue({ uuid: 'analise-uuid' });
  getLancamentosAjustes.mockResolvedValue([]);
  getDocumentosAjustes.mockResolvedValue([]);
  getExtratosBancariosAjustes.mockResolvedValue([]);
  getInfoAta.mockResolvedValue(defaultLocationState.infoAta);
  getDespesasPeriodosAnterioresAjustes.mockResolvedValue([]);

  const user = userEvent.setup();
  render(<ResumoDosAcertos />);

  const botaoDevolver = await screen.findByTestId('botao-devolver');

  return { user, botaoDevolver };
};

describe('ResumoDosAcertos - handleDevolverParaAssociacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exibe modal de comprovante de saldo quando há pendência de conciliação sem solicitação de acerto', async () => {
    const { user, botaoDevolver } = await setupRender({
      analise_atual: {
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
        contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: [
          'conta-1',
        ],
      },
    });

    await user.click(botaoDevolver);

    await waitFor(() => {
      expect(screen.getByTestId('modal-comprovante')).toHaveAttribute(
        'data-visible',
        'true'
      );
    });

    expect(screen.getByTestId('modal-conciliacao')).toHaveAttribute(
      'data-visible',
      'false'
    );
    expect(screen.getByTestId('modal-confirma')).toHaveAttribute(
      'data-visible',
      'false'
    );
    expect(screen.getByTestId('devolver-disabled')).toHaveTextContent('false');
    expect(getPrestacaoDeContasDetalhe).toHaveBeenCalledTimes(1);
  });

  it('exibe modal de conciliação quando há acertos que podem alterar a conciliação bancária', async () => {
    const { user, botaoDevolver } = await setupRender({
      analise_atual: {
        acertos_podem_alterar_saldo_conciliacao: true,
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
      },
    });

    await user.click(botaoDevolver);

    await waitFor(() => {
      expect(screen.getByTestId('modal-conciliacao')).toHaveAttribute(
        'data-visible',
        'true'
      );
    });

    expect(screen.getByTestId('modal-comprovante')).toHaveAttribute(
      'data-visible',
      'false'
    );
    expect(screen.getByTestId('modal-confirma')).toHaveAttribute(
      'data-visible',
      'false'
    );
    expect(screen.getByTestId('devolver-disabled')).toHaveTextContent('false');
    expect(getPrestacaoDeContasDetalhe).toHaveBeenCalledTimes(1);
  });

  it('exibe modal de confirmação quando não há pendências nem impacto na conciliação', async () => {
    const { user, botaoDevolver } = await setupRender({
      analise_atual: {
        acertos_podem_alterar_saldo_conciliacao: false,
        tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
      },
    });

    await user.click(botaoDevolver);

    await waitFor(() => {
      expect(screen.getByTestId('modal-confirma')).toHaveAttribute(
        'data-visible',
        'true'
      );
    });

    expect(screen.getByTestId('modal-conciliacao')).toHaveAttribute(
      'data-visible',
      'false'
    );
    expect(screen.getByTestId('modal-comprovante')).toHaveAttribute(
      'data-visible',
      'false'
    );
    expect(screen.getByTestId('devolver-disabled')).toHaveTextContent('false');
    expect(getPrestacaoDeContasDetalhe).toHaveBeenCalledTimes(1);
  });
});
