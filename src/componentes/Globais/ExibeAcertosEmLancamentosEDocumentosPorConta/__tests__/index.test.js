import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ExibeAcertosEmLancamentosEDocumentosPorConta from '../index';
import { visoesService } from "../../../../services/visoes.service";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../services/mantemEstadoAnaliseDre.service";
import {
  getContasDaAssociacao,
  getTemAjustesExtratos
} from "../../../../services/dres/PrestacaoDeContas.service";
import {
  useCarregaPrestacaoDeContasPorUuid
} from "../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";


jest.mock('../TabsAjustesEmExtratosBancarios', () => ({ children }) => <div data-testid="tabs-ajustes">{children}</div>);
jest.mock('../TabelaAcertosEmExtratosBancarios', () => () => <div data-testid="tabela-acertos" />);
jest.mock('../AcertosLancamentos', () => () => <div data-testid="acertos-lancamentos" />);
jest.mock('../AcertosDespesasPeriodosAnteriores', () => () => <div data-testid="acertos-despesas" />);
jest.mock('../AcertosDocumentos', () => () => <div data-testid="acertos-documentos" />);
jest.mock('../RelatorioAposAcertos', () => ({
  RelatorioAposAcertos: () => <div data-testid="relatorio-apos-acertos" />
}));
jest.mock('../../../../utils/Loading', () => () => <div data-testid="loading" />);

jest.mock('../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid', () => ({
  useCarregaPrestacaoDeContasPorUuid: jest.fn()
}));
jest.mock('../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(() => true),
    getUsuarioLogin: jest.fn(() => 'user'),
    getItemUsuarioLogado: jest.fn(() => 'UE'),
    getPermissoes: jest.fn()
  },
}));
jest.mock('../../../../services/mantemEstadoAnaliseDre.service', () => ({
  mantemEstadoAnaliseDre: {
    getAnaliseDreUsuarioLogado: jest.fn(),
    setAnaliseDrePorUsuario: jest.fn(),
  },
}));
jest.mock('../../../../services/dres/PrestacaoDeContas.service', () => ({
  getContasDaAssociacao: jest.fn(),
  getExtratosBancariosAjustes: jest.fn(() => Promise.resolve({})),
  getTemAjustesExtratos: jest.fn(() => Promise.resolve([{}])),
}));


describe('ExibeAcertosEmLancamentosEDocumentosPorConta', () => {
  const defaultProps = {
    exibeBtnIrParaPaginaDeAcertos: true,
    exibeBtnIrParaPaginaDeReceitaOuDespesa: false,
    prestacaoDeContasUuid: 'prestacao-uuid',
    analiseAtualUuid: 'analise-uuid',
    editavel: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renderiza o loading e depois todas as seções principais', async () => {
    getContasDaAssociacao.mockReturnValueOnce([{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }]);
    getTemAjustesExtratos.mockReturnValueOnce([{}]);
    useCarregaPrestacaoDeContasPorUuid.mockReturnValueOnce({
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA',
    });
    visoesService.getPermissoes.mockReturnValueOnce(true);
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_extrato_bancario: { conta_uuid: 'conta-uuid' },
    });
    localStorage.setItem('periodoContaAcertosEmExtratosBancarios', JSON.stringify({ conta: 'conta-uuid' }));
    
    render(<ExibeAcertosEmLancamentosEDocumentosPorConta {...defaultProps} />);
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Acertos nas informações de extratos bancários/i)).toBeInTheDocument();
      expect(screen.getByTestId('tabs-ajustes')).toBeInTheDocument();
      expect(screen.getByTestId('tabela-acertos')).toBeInTheDocument();
      expect(screen.getByTestId('acertos-lancamentos')).toBeInTheDocument();
      expect(screen.getByTestId('acertos-despesas')).toBeInTheDocument();
      expect(screen.getByTestId('acertos-documentos')).toBeInTheDocument();
      expect(screen.getByTestId('relatorio-apos-acertos')).toBeInTheDocument();
    });
  });

  it('não renderiza AcertosDespesasPeriodosAnteriores quando feature flag está desativada', async () => {
    getContasDaAssociacao.mockReturnValueOnce([{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }]);
    getTemAjustesExtratos.mockReturnValueOnce([{}]);
    useCarregaPrestacaoDeContasPorUuid.mockReturnValueOnce({
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA',
    });
    visoesService.getPermissoes.mockReturnValueOnce(true);
    visoesService.featureFlagAtiva.mockReturnValueOnce(false);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_extrato_bancario: { conta_uuid: 'conta-uuid' },
    });

    render(<ExibeAcertosEmLancamentosEDocumentosPorConta {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByTestId('acertos-despesas')).not.toBeInTheDocument();
    });
  });

  it('não renderiza RelatorioAposAcertos quando visão não é UE', async () => {
    getContasDaAssociacao.mockReturnValueOnce([{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }]);
    getTemAjustesExtratos.mockReturnValueOnce([{}]);
    useCarregaPrestacaoDeContasPorUuid.mockReturnValueOnce({
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA',
    });
    visoesService.getPermissoes.mockReturnValueOnce(true);
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('DRE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_extrato_bancario: { conta_uuid: 'conta-uuid' },
    });

    render(<ExibeAcertosEmLancamentosEDocumentosPorConta {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByTestId('relatorio-apos-acertos')).not.toBeInTheDocument();
    });
  });

  it('renderiza apenas AcertosDocumentos quando não há ajustes de extratos', async () => {
    getContasDaAssociacao.mockReturnValueOnce([{ uuid: 'conta-uuid', tipo_conta: { nome: 'Cheque' } }]);
    getTemAjustesExtratos.mockReturnValueOnce([]);
    useCarregaPrestacaoDeContasPorUuid.mockReturnValueOnce({
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA',
    });
    visoesService.getPermissoes.mockReturnValueOnce(true);
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_extrato_bancario: { conta_uuid: 'conta-uuid' },
    });

    render(<ExibeAcertosEmLancamentosEDocumentosPorConta {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByText(/Acertos nas informações de extratos bancários/i)).not.toBeInTheDocument();
      expect(screen.getByTestId('acertos-documentos')).toBeInTheDocument();
    });
  });

  it('carrega dados da conta corretamente do localStorage', async () => {
    const contaUuid = 'conta-uuid-from-storage';
    getContasDaAssociacao.mockReturnValueOnce([{ uuid: contaUuid, tipo_conta: { nome: 'Cheque' } }]);
    getTemAjustesExtratos.mockReturnValueOnce([{}]);
    useCarregaPrestacaoDeContasPorUuid.mockReturnValueOnce({
      associacao: { uuid: 'assoc-uuid' },
      status: 'DEVOLVIDA',
    });
    visoesService.getPermissoes.mockReturnValueOnce(true);
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    meapcservice.getAnaliseDreUsuarioLogado.mockReturnValue({
      conferencia_extrato_bancario: { conta_uuid: contaUuid },
    });
    localStorage.setItem('periodoContaAcertosEmExtratosBancarios', JSON.stringify({ conta: contaUuid }));

    render(<ExibeAcertosEmLancamentosEDocumentosPorConta {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTestId('tabs-ajustes')).toBeInTheDocument();
    });
  });
});