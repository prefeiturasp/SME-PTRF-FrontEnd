import React, { useCallback, useEffect, useState } from 'react';
import { ModalVisualizarPdf } from '../../../../../Globais/ModalVisualizarPdf';
import { downloadDocumentoFinalPaa, getDownloadAtaPaa } from '../../../../../../services/escolas/Paa.service';
import { useDocumentoFinalPaa } from '../../hooks/useDocumentoFinalPaa';
import { PaaSecaoPlanoEAta } from './PaaSecaoPlanoEAta/PaaSecaoPlanoEAta';
import './PaaCard.scss';

export const PaaCard = ({ dados, onDadosAtualizados }) => {
  const original = dados?.original;
  const [pdfModal, setPdfModal] = useState({ show: false, url: null, titulo: '' });

  const {
    obterUrlDocumentoFinal,
    obterUrlArquivoAtaPaa,
    revogarUrlDocumento,
    visualizacaoEmAndamento,
    chaveVisualizacaoDocumento,
  } = useDocumentoFinalPaa();

  const paaUuid = dados?.uuid;

  const abrirPdfModal = useCallback(
    async (titulo, carregarUrl) => {
      const url = await carregarUrl();
      if (url) {
        setPdfModal((prev) => {
          revogarUrlDocumento(prev.url);
          return { show: true, url, titulo };
        });
      }
    },
    [revogarUrlDocumento]
  );

  const fecharPdfModal = useCallback(() => {
    revogarUrlDocumento(pdfModal.url);
    setPdfModal({ show: false, url: null, titulo: '' });
  }, [pdfModal.url, revogarUrlDocumento]);

  const onVisualizarDocumento = useCallback(
    (bloco) =>
      abrirPdfModal('Plano anual', () =>
        obterUrlDocumentoFinal(paaUuid, bloco.status.retificacao)
      ),
    [abrirPdfModal, obterUrlDocumentoFinal, paaUuid]
  );

  const onDownloadDocumento = useCallback(
    async (bloco) => {
      await downloadDocumentoFinalPaa(paaUuid, { retificacao: bloco.status.retificacao });
    },
    [paaUuid]
  );

  const onVisualizarAta = useCallback(
    (bloco, tituloModal) =>
      abrirPdfModal(tituloModal || 'Ata', () => {
        const id = bloco?.uuid;
        return id ? obterUrlArquivoAtaPaa(id) : Promise.resolve(null);
      }),
    [abrirPdfModal, obterUrlArquivoAtaPaa]
  );

  const onDownloadAta = useCallback(async (bloco) => {
    const id = bloco?.uuid;
    if (id) await getDownloadAtaPaa(id);
  }, []);

  const statusGeracaoAtaApresentacao = original?.ata?.status?.status_geracao;
  useEffect(() => {
    if (statusGeracaoAtaApresentacao !== 'EM_PROCESSAMENTO') {
      return undefined;
    }
    if (!onDadosAtualizados) {
      return undefined;
    }
    const id = setInterval(() => {
      onDadosAtualizados();
    }, 5000);
    return () => {
      clearInterval(id);
    };
  }, [statusGeracaoAtaApresentacao, onDadosAtualizados]);

  if (!original?.documento || !original?.ata) {
    return null;
  }

  const { retificacao, esta_em_retificacao } = dados;
  const mostrarRetificacao = Boolean(esta_em_retificacao && retificacao?.documento && retificacao?.ata);
  const resumoAssembleiaOriginal = original.ata?.resumo_assembleia;

  return (
    <div className="paa-card border border-top-0 p-3">
      {mostrarRetificacao ? (
        <>
          <PaaSecaoPlanoEAta
            tituloSecao={`PAA Retificado #${retificacao.documento.status.versao_documento}`}
            documento={retificacao.documento}
            ata={retificacao.ata}
            tituloAta="Ata de retificação do PAA"
            paaUuid={paaUuid}
            chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
            visualizacaoEmAndamento={visualizacaoEmAndamento}
            onVisualizarDocumento={onVisualizarDocumento}
            onDownloadDocumento={onDownloadDocumento}
            onVisualizarAta={onVisualizarAta}
            onDownloadAta={onDownloadAta}
          />
          <hr className="my-4 paa-card__separador" />
          <PaaSecaoPlanoEAta
            tituloSecao="PAA Original"
            documento={original.documento}
            ata={original.ata}
            tituloAta="Ata de apresentação do PAA"
            paaUuid={paaUuid}
            chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
            visualizacaoEmAndamento={visualizacaoEmAndamento}
            onVisualizarDocumento={onVisualizarDocumento}
            onVisualizarAta={onVisualizarAta}
            onDownloadDocumento={onDownloadDocumento}
            onDownloadAta={onDownloadAta}
            onDepoisDeGerarAta={onDadosAtualizados}
            resumoAssembleia={resumoAssembleiaOriginal}
          />
        </>
      ) : (
        <PaaSecaoPlanoEAta
          tituloSecao={null}
          documento={original.documento}
          ata={original.ata}
          tituloAta="Ata de apresentação do PAA"
          paaUuid={paaUuid}
          chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
          visualizacaoEmAndamento={visualizacaoEmAndamento}
          onVisualizarDocumento={onVisualizarDocumento}
          onDownloadDocumento={onDownloadDocumento}
          onVisualizarAta={onVisualizarAta}
          onDownloadAta={onDownloadAta}
          onDepoisDeGerarAta={onDadosAtualizados}
          resumoAssembleia={resumoAssembleiaOriginal}
        />
      )}
      <ModalVisualizarPdf
        show={pdfModal.show}
        onHide={fecharPdfModal}
        url={pdfModal.url}
        titulo={pdfModal.titulo ? `Documento — ${pdfModal.titulo}` : 'Documento'}
        iframeTitle={pdfModal.titulo || 'Documento PAA'}
      />
    </div>
  );
};
