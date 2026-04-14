import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PaaAtaAcoes } from '../components/PaaAtaAcoes/PaaAtaAcoes';
import { visoesService } from '../../../../../services/visoes.service';
import { postGerarAtaPaa } from '../../../../../services/escolas/Paa.service';
import { toastCustom } from '../../../../Globais/ToastCustom';

jest.mock('react-tooltip', () => ({
  Tooltip: () => null,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../services/visoes.service', () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

jest.mock('../../../../../services/escolas/Paa.service', () => {
  const actual = jest.requireActual('../../../../../services/escolas/Paa.service');
  return {
    ...actual,
    postGerarAtaPaa: jest.fn(),
  };
});

jest.mock('../../../../Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const renderComRouter = (ui) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('PaaAtaAcoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
  });

  it('desabilita Gerar ata e não abre modal sem permissão', () => {
    visoesService.getPermissoes.mockReturnValue(false);
    const ata = {
      uuid: 'ata-uuid',
      existe_arquivo: false,
      url: '',
      pode_gerar_ata: true,
      apresenta_botoes_acao: false,
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    const documentoPlano = {
      uuid: 'doc-uuid',
      existe_arquivo: false,
      url: '',
      status: {
        status_geracao: 'CONCLUIDO',
        mensagem: 'ok',
        cor_mensagem: 'green',
        retificacao: false,
        versao_documento: 1,
      },
    };
    renderComRouter(
      <PaaAtaAcoes paaUuid="paa-1" ata={ata} documentoPlano={documentoPlano} />
    );
    const btn = screen.getByRole('button', { name: /gerar ata/i });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(screen.queryByText('Confirmar geração da Ata')).not.toBeInTheDocument();
  });

  it('desabilita Gerar ata quando ata.pode_gerar_ata é false', () => {
    const ata = {
      uuid: 'ata-uuid',
      existe_arquivo: false,
      url: '',
      pode_gerar_ata: false,
      apresenta_botoes_acao: false,
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    const documentoPlano = {
      uuid: 'doc-uuid',
      existe_arquivo: false,
      url: '',
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    renderComRouter(
      <PaaAtaAcoes paaUuid="paa-1" ata={ata} documentoPlano={documentoPlano} />
    );
    expect(screen.getByRole('button', { name: /gerar ata/i })).toBeDisabled();
  });

  it('abre modal e confirma geração chamando postGerarAtaPaa e onDepoisDeGerar', async () => {
    postGerarAtaPaa.mockResolvedValueOnce({});
    const onDepoisDeGerar = jest.fn();
    const ata = {
      uuid: 'ata-uuid',
      existe_arquivo: false,
      url: '',
      pode_gerar_ata: true,
      apresenta_botoes_acao: false,
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    const documentoPlano = {
      uuid: 'doc-uuid',
      existe_arquivo: false,
      url: '',
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    renderComRouter(
      <PaaAtaAcoes
        paaUuid="paa-xyz"
        ata={ata}
        documentoPlano={documentoPlano}
        onDepoisDeGerar={onDepoisDeGerar}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /gerar ata/i }));
    expect(screen.getByText('Confirmar geração da Ata')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^confirmar$/i }));
    await waitFor(() => {
      expect(postGerarAtaPaa).toHaveBeenCalledWith('paa-xyz', { confirmar: 1 });
    });
    expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
    expect(onDepoisDeGerar).toHaveBeenCalled();
  });

  it('exibe toast de erro quando postGerarAtaPaa falha', async () => {
    postGerarAtaPaa.mockRejectedValueOnce({
      response: { data: { mensagem: 'Falha no servidor' } },
    });
    const ata = {
      uuid: 'ata-uuid',
      existe_arquivo: false,
      url: '',
      pode_gerar_ata: true,
      apresenta_botoes_acao: false,
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    const documentoPlano = {
      uuid: 'doc-uuid',
      existe_arquivo: false,
      url: '',
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    renderComRouter(
      <PaaAtaAcoes paaUuid="paa-xyz" ata={ata} documentoPlano={documentoPlano} />
    );
    fireEvent.click(screen.getByRole('button', { name: /gerar ata/i }));
    fireEvent.click(screen.getByRole('button', { name: /^confirmar$/i }));
    await waitFor(() => {
      expect(toastCustom.ToastCustomError).toHaveBeenCalledWith('Erro!', 'Falha no servidor');
    });
  });

  it('mostra Visualizar ata e navega quando o documento final está CONCLUIDO', () => {
    const ata = {
      uuid: 'ata-uuid',
      existe_arquivo: false,
      url: '',
      pode_gerar_ata: true,
      apresenta_botoes_acao: false,
      status: {
        status_geracao: 'NAO_GERADO',
        mensagem: 'Documento pendente de geração.',
        cor_mensagem: 'red',
        retificacao: false,
        versao_documento: 1,
      },
    };
    const documentoPlano = {
      uuid: 'doc-uuid',
      existe_arquivo: false,
      url: '',
      status: {
        status_geracao: 'CONCLUIDO',
        mensagem: 'ok',
        cor_mensagem: 'green',
        retificacao: false,
        versao_documento: 1,
      },
    };
    renderComRouter(
      <PaaAtaAcoes paaUuid="paa-99" ata={ata} documentoPlano={documentoPlano} />
    );
    fireEvent.click(screen.getByRole('button', { name: /visualizar ata/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/relatorios-paa/visualizacao-da-ata-paa/paa-99', {
      state: { origem: 'paa-vigente-e-anteriores' },
    });
  });
});
