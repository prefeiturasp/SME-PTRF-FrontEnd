import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumoDosAcertos } from '../index';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(),
    useLocation: jest.fn(),
    useNavigate: jest.fn(),
  };
});

jest.mock('../TopoComBotoes', () => ({
  TopoComBotoes: ({
    onClickDevolver,
  }: {
    onClickDevolver: () => void;
  }) => (
    <button type="button" data-testid="botao-devolver" onClick={onClickDevolver}>
      Devolver para Associação
    </button>
  ),
}));

jest.mock('../TabsConferenciaAtualHistorico', () => () => (
  <div data-testid="tabs-conferencia-mock" />
));

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
  '../../../../../../paginas/PaginasContainer',
  () => ({
    PaginasContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="paginas-container-mock">{children}</div>
    ),
  }),
  { virtual: true }
);

jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid', () => ({
  useCarregaPrestacaoDeContasPorUuid: jest.fn(),
}));

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
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

jest.mock('../../../../../../services/mantemEstadoAnaliseDre.service', () => {
  const getAnaliseDreUsuarioLogado = jest.fn(() => ({ analise_pc_uuid: '' }));
  const limpaAnaliseDreUsuarioLogado = jest.fn();
  const setAnaliseDrePorUsuario = jest.fn();

  return {
    mantemEstadoAnaliseDre: {
      getAnaliseDreUsuarioLogado,
      limpaAnaliseDreUsuarioLogado,
      setAnaliseDrePorUsuario,
    },
  };
});

jest.mock('../../../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(() => false),
    getUsuarioLogin: jest.fn(() => 'usuario-teste'),
  },
}));

jest.mock('../../../../../../componentes/Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

jest.mock('../../../../../../utils/Loading', () => () => (
  <div data-testid="loading-mock" />
));

const { useParams, useLocation, useNavigate } = jest.requireMock(
  'react-router-dom'
) as {
  useParams: jest.Mock;
  useLocation: jest.Mock;
  useNavigate: jest.Mock;
};

const { useCarregaPrestacaoDeContasPorUuid } = jest.requireMock(
  '../../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid'
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
} = jest.requireMock('../../../../../../services/dres/PrestacaoDeContas.service') as {
  getAnalisesDePcDevolvidas: jest.Mock;
  getUltimaAnalisePc: jest.Mock;
  getLancamentosAjustes: jest.Mock;
  getDocumentosAjustes: jest.Mock;
  getExtratosBancariosAjustes: jest.Mock;
  getInfoAta: jest.Mock;
  getDespesasPeriodosAnterioresAjustes: jest.Mock;
  getPrestacaoDeContasDetalhe: jest.Mock;
};

const {
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado,
    limpaAnaliseDreUsuarioLogado,
    setAnaliseDrePorUsuario,
  },
} = jest.requireMock('../../../../../../services/mantemEstadoAnaliseDre.service') as {
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado: jest.Mock;
    limpaAnaliseDreUsuarioLogado: jest.Mock;
    setAnaliseDrePorUsuario: jest.Mock;
  };
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

const setupComponent = async (analiseOverride?: Partial<typeof basePrestacao.analise_atual>) => {
  const prestacao = {
    ...basePrestacao,
    analise_atual: {
      ...basePrestacao.analise_atual,
      ...(analiseOverride || {}),
    },
  };

  useParams.mockReturnValue({ prestacao_conta_uuid: prestacao.uuid });
  useLocation.mockReturnValue({ state: defaultLocationState });
  useNavigate.mockReturnValue(mockNavigate);
  useCarregaPrestacaoDeContasPorUuid.mockReturnValue(prestacao);

  getPrestacaoDeContasDetalhe.mockResolvedValue(prestacao);
  getAnalisesDePcDevolvidas.mockResolvedValue([]);
  getUltimaAnalisePc.mockResolvedValue({ uuid: prestacao.analise_atual.uuid });
  getLancamentosAjustes.mockResolvedValue([]);
  getDocumentosAjustes.mockResolvedValue([]);
  getExtratosBancariosAjustes.mockResolvedValue([]);
  getInfoAta.mockResolvedValue(defaultLocationState.infoAta);
  getDespesasPeriodosAnterioresAjustes.mockResolvedValue([]);

  const user = userEvent.setup();
  render(<ResumoDosAcertos />);

  const botao = await screen.findByTestId('botao-devolver');

  return { user, botao };
};

describe('ResumoDosAcertos - handleDevolverParaAssociacao', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getAnaliseDreUsuarioLogado.mockReturnValue({ analise_pc_uuid: '' });
    limpaAnaliseDreUsuarioLogado.mockImplementation(() => {});
    setAnaliseDrePorUsuario.mockImplementation(() => {});
  });

  it('abre o modal de comprovante quando existe pendência de conciliação sem solicitação de acerto', async () => {
    const { user, botao } = await setupComponent({
      tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: true,
      contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: ['conta-1'],
    });

    await user.click(botao);

    await waitFor(() => {
      expect(screen.getByTestId('modal-comprovante')).toHaveAttribute('data-visible', 'true');
    });
    expect(screen.getByTestId('modal-conciliacao')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('modal-confirma')).toHaveAttribute('data-visible', 'false');
    expect(getPrestacaoDeContasDetalhe).toHaveBeenCalledTimes(1);
  });

  it('abre o modal de conciliação quando ajustes podem alterar a conciliação e não há pendência de comprovante', async () => {
    const { user, botao } = await setupComponent({
      acertos_podem_alterar_saldo_conciliacao: true,
      tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
    });

    await user.click(botao);

    await waitFor(() => {
      expect(screen.getByTestId('modal-conciliacao')).toHaveAttribute('data-visible', 'true');
    });
    expect(screen.getByTestId('modal-comprovante')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('modal-confirma')).toHaveAttribute('data-visible', 'false');
    expect(getPrestacaoDeContasDetalhe).toHaveBeenCalledTimes(1);
  });

  it('abre o modal de confirmação quando não existe pendência nem impacto na conciliação', async () => {
    const { user, botao } = await setupComponent({
      acertos_podem_alterar_saldo_conciliacao: false,
      tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta: false,
    });

    await user.click(botao);

    await waitFor(() => {
      expect(screen.getByTestId('modal-confirma')).toHaveAttribute('data-visible', 'true');
    });
    expect(screen.getByTestId('modal-conciliacao')).toHaveAttribute('data-visible', 'false');
    expect(screen.getByTestId('modal-comprovante')).toHaveAttribute('data-visible', 'false');
    expect(getPrestacaoDeContasDetalhe).toHaveBeenCalledTimes(1);
  });
});
