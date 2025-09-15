import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RelatorioDosAcertos } from '../RelatorioDosAcertos';

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
  getRelatorioAcertosInfo: jest.fn(),
  gerarPreviaRelatorioAcertos: jest.fn(),
  downloadDocumentoPreviaPdf: jest.fn(),
  getAnalisePrestacaoConta: jest.fn(),
  getAnalisesDePcDevolvidas: jest.fn(),
}));

jest.mock('../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc', () => ({
  RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: jest.fn(),
}));

import {
  getRelatorioAcertosInfo,
  getAnalisePrestacaoConta,
  getAnalisesDePcDevolvidas,
} from '../../../../../../services/dres/PrestacaoDeContas.service';
import { RetornaSeTemPermissaoEdicaoAcompanhamentoDePc } from '../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc';

describe('RelatorioDosAcertos - botão "Gerar prévia"', () => {
  const prestacaoDeContasUuid = 'pc-uuid';
  const analiseAtualUuid = 'analise-uuid';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve habilitar o botão quando podeGerarPrevia=true, versao=RASCUNHO e temPermissao=true', async () => {
    (RetornaSeTemPermissaoEdicaoAcompanhamentoDePc as jest.Mock).mockReturnValue(true);
    (getAnalisePrestacaoConta as jest.Mock).mockResolvedValue({
      versao: 'RASCUNHO',
      status: 'EM_ANALISE',
    });
    (getAnalisesDePcDevolvidas as jest.Mock).mockResolvedValue([]);
    (getRelatorioAcertosInfo as jest.Mock).mockResolvedValue('Nenhuma prévia gerada');

    render(
      <RelatorioDosAcertos
        prestacaoDeContasUuid={prestacaoDeContasUuid}
        analiseAtualUuid={analiseAtualUuid}
        podeGerarPrevia={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma prévia gerada/i)).toBeInTheDocument();
    });

    const botao = screen.getByRole('button', { name: /Gerar prévia/i });
    expect(botao).toBeEnabled();
  });

  test('deve desabilitar o botão quando não tem permissão', async () => {
    (RetornaSeTemPermissaoEdicaoAcompanhamentoDePc as jest.Mock).mockReturnValue(false);
    (getAnalisePrestacaoConta as jest.Mock).mockResolvedValue({
      versao: 'RASCUNHO',
      status: 'EM_ANALISE',
    });
    (getAnalisesDePcDevolvidas as jest.Mock).mockResolvedValue([]);
    (getRelatorioAcertosInfo as jest.Mock).mockResolvedValue('Nenhuma prévia gerada');

    render(
      <RelatorioDosAcertos
        prestacaoDeContasUuid={prestacaoDeContasUuid}
        analiseAtualUuid={analiseAtualUuid}
        podeGerarPrevia={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma prévia gerada/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Gerar prévia/i })).toBeDisabled();
  });

  test('deve desabilitar o botão quando podeGerarPrevia=false', async () => {
    (RetornaSeTemPermissaoEdicaoAcompanhamentoDePc as jest.Mock).mockReturnValue(true);
    (getAnalisePrestacaoConta as jest.Mock).mockResolvedValue({
      versao: 'RASCUNHO',
      status: 'EM_ANALISE',
    });
    (getAnalisesDePcDevolvidas as jest.Mock).mockResolvedValue([]);
    (getRelatorioAcertosInfo as jest.Mock).mockResolvedValue('Nenhuma prévia gerada');

    render(
      <RelatorioDosAcertos
        prestacaoDeContasUuid={prestacaoDeContasUuid}
        analiseAtualUuid={analiseAtualUuid}
        podeGerarPrevia={false}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma prévia gerada/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Gerar prévia/i })).toBeDisabled();
  });

  test('deve desabilitar o botão quando versao não é RASCUNHO (ex: FINAL)', async () => {
    (RetornaSeTemPermissaoEdicaoAcompanhamentoDePc as jest.Mock).mockReturnValue(true);
    (getAnalisePrestacaoConta as jest.Mock).mockResolvedValue({
      versao: 'FINAL',
      status: 'ENCERRADA',
    });
    (getAnalisesDePcDevolvidas as jest.Mock).mockResolvedValue([]);
    (getRelatorioAcertosInfo as jest.Mock).mockResolvedValue('Nenhuma prévia gerada');

    render(
      <RelatorioDosAcertos
        prestacaoDeContasUuid={prestacaoDeContasUuid}
        analiseAtualUuid={analiseAtualUuid}
        podeGerarPrevia={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Nenhuma prévia gerada/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Gerar prévia/i })).toBeDisabled();
  });

  test('deve desabilitar o botão enquanto status está EM_PROCESSAMENTO (spinner ativo)', async () => {
    (RetornaSeTemPermissaoEdicaoAcompanhamentoDePc as jest.Mock).mockReturnValue(true);
    (getAnalisePrestacaoConta as jest.Mock).mockResolvedValue({
      versao: 'RASCUNHO',
      status: 'EM_ANALISE',
    });
    (getAnalisesDePcDevolvidas as jest.Mock).mockResolvedValue([]);
    (getRelatorioAcertosInfo as jest.Mock).mockResolvedValue('Relatório sendo gerado...');

    render(
      <RelatorioDosAcertos
        prestacaoDeContasUuid={prestacaoDeContasUuid}
        analiseAtualUuid={analiseAtualUuid}
        podeGerarPrevia={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Relatório sendo gerado/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Gerar prévia/i })).toBeDisabled();
  });
});