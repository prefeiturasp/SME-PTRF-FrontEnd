import React from 'react';
import { render, screen, fireEvent, act, within } from '@testing-library/react';
import { PaaCard } from '../components/PaaCard/PaaCard';
import { useDocumentoFinalPaa } from '../hooks/useDocumentoFinalPaa';
import { downloadDocumentoFinalPaa, getDownloadAtaPaa } from '../../../../../services/escolas/Paa.service';

jest.mock('../hooks/useDocumentoFinalPaa');

jest.mock('../../../../../services/escolas/Paa.service', () => {
  const actual = jest.requireActual('../../../../../services/escolas/Paa.service');
  return {
    ...actual,
    downloadDocumentoFinalPaa: jest.fn().mockResolvedValue(undefined),
    getDownloadAtaPaa: jest.fn().mockResolvedValue(undefined),
  };
});

jest.mock('../../../../Globais/ModalVisualizarPdf', () => ({
  ModalVisualizarPdf: ({ show, onHide, url }) =>
    show ? (
      <div data-testid="modal-visualizar-pdf" data-url={url}>
        <button type="button" onClick={onHide}>
          fechar-modal
        </button>
      </div>
    ) : null,
}));

jest.mock('antd', () => ({
  Spin: () => null,
}));

const STATUS_INICIAL = {
  status_geracao: 'NAO_GERADO',
  mensagem: 'Documento pendente de geração.',
  cor_mensagem: 'red',
  retificacao: false,
  versao_documento: 1,
};

const DOCUMENTO_PADRAO = {
  uuid: 'doc-uuid',
  existe_arquivo: false,
  url: '',
  status: { ...STATUS_INICIAL },
};

const ATA_PADRAO = {
  uuid: 'a1',
  existe_arquivo: false,
  url: '',
  status: { ...STATUS_INICIAL },
};

describe('PaaCard', () => {
  let obterUrlDocumentoFinal;
  let obterUrlArquivoAtaPaa;

  beforeEach(() => {
    jest.clearAllMocks();
    obterUrlDocumentoFinal = jest.fn().mockResolvedValue('blob:doc');
    obterUrlArquivoAtaPaa = jest.fn().mockResolvedValue('blob:ata');
    useDocumentoFinalPaa.mockReturnValue({
      obterUrlDocumentoFinal,
      obterUrlArquivoAtaPaa,
      revogarUrlDocumento: jest.fn(),
      visualizacaoEmAndamento: null,
      chaveVisualizacaoDocumento: (uuid, r) => `doc:${uuid}:${r}`,
    });
  });

  it('retorna null quando falta original.documento ou original.ata', () => {
    const { container } = render(
      <PaaCard
        dados={{
          uuid: 'paa-uuid',
          esta_em_retificacao: false,
          retificacao: null,
          original: {
            documento: { ...DOCUMENTO_PADRAO },
            ata: null,
          },
        }}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renderiza seção única quando não está em retificação', () => {
    const dados = {
      uuid: 'paa-uuid',
      esta_em_retificacao: false,
      retificacao: null,
      original: {
        documento: {
          ...DOCUMENTO_PADRAO,
          existe_arquivo: true,
          url: 'x',
          status: {
            ...DOCUMENTO_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
        ata: {
          ...ATA_PADRAO,
          existe_arquivo: true,
          url: 'y',
          status: {
            ...ATA_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
      },
    };
    render(<PaaCard dados={dados} />);
    expect(screen.getAllByText('Plano anual').length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('PAA Original')).not.toBeInTheDocument();
  });

  it('renderiza bloco de retificação e PAA Original quando em retificação', () => {
    const dados = {
      uuid: 'paa-uuid',
      esta_em_retificacao: true,
      retificacao: {
        documento: {
          ...DOCUMENTO_PADRAO,
          status: {
            status_geracao: 'CONCLUIDO',
            versao_documento: 2,
            mensagem: 'ok',
            cor_mensagem: 'green',
            retificacao: true,
          },
        },
        ata: {
          uuid: 'ata-ret',
          existe_arquivo: true,
          url: 'z',
          status: {
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
            retificacao: false,
            versao_documento: 1,
          },
        },
      },
      original: {
        documento: {
          ...DOCUMENTO_PADRAO,
          existe_arquivo: true,
          url: 'x',
          status: {
            ...DOCUMENTO_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
        ata: {
          ...ATA_PADRAO,
          existe_arquivo: true,
          url: 'y',
          status: {
            ...ATA_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
      },
    };
    render(<PaaCard dados={dados} />);
    expect(screen.getByText(/PAA Retificado #2/)).toBeInTheDocument();
    expect(screen.getByText('PAA Original')).toBeInTheDocument();
  });

  it('agenda polling de onDadosAtualizados quando ata está EM_PROCESSAMENTO', () => {
    jest.useFakeTimers();
    const onDadosAtualizados = jest.fn();
    const dados = {
      uuid: 'paa-uuid',
      esta_em_retificacao: false,
      retificacao: null,
      original: {
        documento: { ...DOCUMENTO_PADRAO },
        ata: {
          ...ATA_PADRAO,
          status: {
            ...ATA_PADRAO.status,
            status_geracao: 'EM_PROCESSAMENTO',
            mensagem: 'gerando',
            cor_mensagem: 'orange',
          },
        },
      },
    };
    render(<PaaCard dados={dados} onDadosAtualizados={onDadosAtualizados} />);
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(onDadosAtualizados).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('abre modal de PDF ao visualizar plano', async () => {
    const dados = {
      uuid: 'paa-open',
      esta_em_retificacao: false,
      retificacao: null,
      original: {
        documento: {
          ...DOCUMENTO_PADRAO,
          existe_arquivo: true,
          url: 'x',
          status: {
            ...DOCUMENTO_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
            retificacao: false,
          },
        },
        ata: {
          ...ATA_PADRAO,
          existe_arquivo: true,
          url: 'y',
          status: {
            ...ATA_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
      },
    };
    render(<PaaCard dados={dados} />);
    const planoHeading = screen.getByRole('heading', { name: 'Plano anual' });
    const [btnVisualizarPlano] = within(planoHeading.parentElement).getAllByRole('button');
    await act(async () => {
      fireEvent.click(btnVisualizarPlano);
    });
    const modal = screen.getByTestId('modal-visualizar-pdf');
    expect(modal).toHaveAttribute('data-url', 'blob:doc');
    expect(obterUrlDocumentoFinal).toHaveBeenCalledWith('paa-open', false);
  });

  it('chama download do documento final ao clicar em download do plano', async () => {
    const dados = {
      uuid: 'paa-dl',
      esta_em_retificacao: false,
      retificacao: null,
      original: {
        documento: {
          ...DOCUMENTO_PADRAO,
          existe_arquivo: true,
          url: 'x',
          status: {
            ...DOCUMENTO_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
            retificacao: false,
          },
        },
        ata: {
          ...ATA_PADRAO,
          existe_arquivo: true,
          url: 'y',
          status: {
            ...ATA_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
      },
    };
    render(<PaaCard dados={dados} />);
    const planoHeading = screen.getByRole('heading', { name: 'Plano anual' });
    const botoesPlano = within(planoHeading.parentElement).getAllByRole('button');
    await act(async () => {
      fireEvent.click(botoesPlano[1]);
    });
    expect(downloadDocumentoFinalPaa).toHaveBeenCalledWith('paa-dl', { retificacao: false });
  });

  it('chama getDownloadAtaPaa ao baixar ata', async () => {
    const dados = {
      uuid: 'paa-uuid',
      esta_em_retificacao: false,
      retificacao: null,
      original: {
        documento: {
          ...DOCUMENTO_PADRAO,
          existe_arquivo: true,
          url: 'x',
          status: {
            ...DOCUMENTO_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
        ata: {
          ...ATA_PADRAO,
          uuid: 'ata-dl',
          existe_arquivo: true,
          url: 'y',
          status: {
            ...ATA_PADRAO.status,
            status_geracao: 'CONCLUIDO',
            mensagem: 'ok',
            cor_mensagem: 'green',
          },
        },
      },
    };
    render(<PaaCard dados={dados} />);
    const ataHeading = screen.getByRole('heading', { name: 'Ata de apresentação do PAA' });
    const botoesAta = within(ataHeading.parentElement).getAllByRole('button');
    await act(async () => {
      fireEvent.click(botoesAta[1]);
    });
    expect(getDownloadAtaPaa).toHaveBeenCalledWith('ata-dl');
  });
});
