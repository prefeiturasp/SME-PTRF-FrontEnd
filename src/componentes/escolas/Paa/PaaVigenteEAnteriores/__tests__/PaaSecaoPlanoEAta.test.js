import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { PaaSecaoPlanoEAta } from '../components/PaaCard/PaaSecaoPlanoEAta/PaaSecaoPlanoEAta';

jest.mock('antd', () => ({
  Spin: () => null,
}));

jest.mock('../components/PaaAtaAcoes/PaaAtaAcoes', () => ({
  PaaAtaAcoes: () => <div data-testid="paa-ata-acoes-stub" />,
}));

const DOCUMENTO_PADRAO = {
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

const ATA_PADRAO = {
  uuid: 'ata-1',
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

describe('PaaSecaoPlanoEAta', () => {
  const chaveVisualizacaoDocumento = jest.fn((uuid, retificacao) => `doc:${uuid}:${retificacao}`);

  beforeEach(() => {
    jest.clearAllMocks();
    chaveVisualizacaoDocumento.mockImplementation((uuid, r) => `doc:${uuid}:${r}`);
  });

  const baseHandlers = {
    onVisualizarDocumento: jest.fn(),
    onDownloadDocumento: jest.fn(),
    onVisualizarAta: jest.fn(),
    onDownloadAta: jest.fn(),
    onDepoisDeGerarAta: jest.fn(),
  };

  it('renderiza título de seção quando tituloSecao é informado', () => {
    render(
      <PaaSecaoPlanoEAta
        tituloSecao="PAA Original"
        documento={DOCUMENTO_PADRAO}
        ata={ATA_PADRAO}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        {...baseHandlers}
      />
    );
    expect(screen.getByRole('heading', { name: 'PAA Original' })).toBeInTheDocument();
  });

  it('não renderiza h3 de seção quando tituloSecao é null', () => {
    render(
      <PaaSecaoPlanoEAta
        tituloSecao={null}
        documento={DOCUMENTO_PADRAO}
        ata={ATA_PADRAO}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        {...baseHandlers}
      />
    );
    expect(screen.queryByRole('heading', { level: 3 })).not.toBeInTheDocument();
  });

  it('exibe resumo da assembleia quando resumoAssembleia está definido', () => {
    render(
      <PaaSecaoPlanoEAta
        tituloSecao={null}
        documento={DOCUMENTO_PADRAO}
        ata={ATA_PADRAO}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        resumoAssembleia="Resumo da reunião."
        {...baseHandlers}
      />
    );
    expect(screen.getByText('Resumo da reunião.')).toBeInTheDocument();
  });

  it('renderiza PaaAtaAcoes quando ata.apresenta_botoes_acao é true', () => {
    const ata = { ...ATA_PADRAO, apresenta_botoes_acao: true };
    render(
      <PaaSecaoPlanoEAta
        tituloSecao={null}
        documento={DOCUMENTO_PADRAO}
        ata={ata}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        {...baseHandlers}
      />
    );
    expect(screen.getByTestId('paa-ata-acoes-stub')).toBeInTheDocument();
  });

  it('não renderiza PaaAtaAcoes quando apresenta_botoes_acao é false', () => {
    render(
      <PaaSecaoPlanoEAta
        tituloSecao={null}
        documento={DOCUMENTO_PADRAO}
        ata={ATA_PADRAO}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        {...baseHandlers}
      />
    );
    expect(screen.queryByTestId('paa-ata-acoes-stub')).not.toBeInTheDocument();
  });

  it('dispara onVisualizarDocumento ao visualizar o plano quando há arquivo', () => {
    const documento = {
      ...DOCUMENTO_PADRAO,
      existe_arquivo: true,
      url: 'https://exemplo/plano.pdf',
      status: {
        ...DOCUMENTO_PADRAO.status,
        status_geracao: 'CONCLUIDO',
        mensagem: 'Ok',
        cor_mensagem: 'green',
      },
    };
    render(
      <PaaSecaoPlanoEAta
        tituloSecao={null}
        documento={documento}
        ata={ATA_PADRAO}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        {...baseHandlers}
      />
    );
    const planoHeading = screen.getByRole('heading', { name: 'Plano anual' });
    const [btnVisualizarPlano] = within(planoHeading.parentElement).getAllByRole('button');
    fireEvent.click(btnVisualizarPlano);
    expect(baseHandlers.onVisualizarDocumento).toHaveBeenCalled();
  });

  it('dispara onVisualizarAta com título da ata ao visualizar a ata', () => {
    const ata = {
      ...ATA_PADRAO,
      uuid: 'ata-x',
      existe_arquivo: true,
      url: 'https://exemplo/ata.pdf',
      status: {
        ...ATA_PADRAO.status,
        status_geracao: 'CONCLUIDO',
        mensagem: 'Ok',
        cor_mensagem: 'green',
      },
    };
    render(
      <PaaSecaoPlanoEAta
        tituloSecao={null}
        documento={DOCUMENTO_PADRAO}
        ata={ata}
        tituloAta="Ata de apresentação do PAA"
        paaUuid="paa-1"
        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
        visualizacaoEmAndamento={null}
        {...baseHandlers}
      />
    );
    const ataHeading = screen.getByRole('heading', { name: 'Ata de apresentação do PAA' });
    const [btnVisualizarAta] = within(ataHeading.parentElement).getAllByRole('button');
    fireEvent.click(btnVisualizarAta);
    expect(baseHandlers.onVisualizarAta).toHaveBeenCalledWith(ata, 'Ata de apresentação do PAA');
  });
});
