import React, { useCallback, useState } from 'react';
import { ModalVisualizarPdf } from '../../../../../Globais/ModalVisualizarPdf';
import {
    downloadDocumentoFinalPaa,
    getDownloadAtaPaa,
} from '../../../../../../services/Paa.service';
import { useDocumentoFinalPaa } from '../../../../../../hooks/Globais/useDocumentoFinalPaa';
import { PaaSecaoPlanoEAta } from './PaaSecaoPlanoEAta/PaaSecaoPlanoEAta';
import {
    IVigentePaa,
    IDocumentoPaa,
    IAtaPaa,
} from '../../../../../../interface/dre/Paa/paa.interface';
import './PaaCard.scss';

interface PaaCardProps {
    dados: IVigentePaa;
}

interface PdfModalState {
    show: boolean;
    url: string | null;
    titulo: string;
}

export const PaaCard: React.FC<PaaCardProps> = ({ dados }) => {
    const original = dados?.original;
    const [pdfModal, setPdfModal] = useState<PdfModalState>({ show: false, url: null, titulo: '' });

    const {
        obterUrlDocumentoFinal,
        obterUrlArquivoAtaPaa,
        revogarUrlDocumento,
        visualizacaoEmAndamento,
        chaveVisualizacaoDocumento,
    } = useDocumentoFinalPaa();

    const paaUuid = dados?.uuid;

    const abrirPdfModal = useCallback(
        async (titulo: string, carregarUrl: () => Promise<string | null>) => {
            const url = await carregarUrl();
            if (url) {
                setPdfModal((prev) => {
                    if (prev.url) {
                        revogarUrlDocumento(prev.url);
                    }
                    return { show: true, url, titulo };
                });
            }
        },
        [revogarUrlDocumento],
    );

    const fecharPdfModal = useCallback(() => {
        if (pdfModal.url) {
            revogarUrlDocumento(pdfModal.url);
        }
        setPdfModal({ show: false, url: null, titulo: '' });
    }, [pdfModal.url, revogarUrlDocumento]);

    const onVisualizarDocumento = useCallback(
        (bloco: IDocumentoPaa) =>
            abrirPdfModal('Plano anual', () =>
                obterUrlDocumentoFinal(paaUuid, bloco.status.retificacao),
            ),
        [abrirPdfModal, obterUrlDocumentoFinal, paaUuid],
    );

    const onDownloadDocumento = useCallback(
        async (bloco: IDocumentoPaa) => {
            await downloadDocumentoFinalPaa(paaUuid, { retificacao: bloco.status.retificacao });
        },
        [paaUuid],
    );

    const onVisualizarAta = useCallback(
        (bloco: IAtaPaa, tituloModal?: string) =>
            abrirPdfModal(tituloModal || 'Ata', () => {
                const id = bloco?.uuid;
                return id ? obterUrlArquivoAtaPaa(id) : Promise.resolve(null);
            }),
        [abrirPdfModal, obterUrlArquivoAtaPaa],
    );

    const onDownloadAta = useCallback(async (bloco: IAtaPaa) => {
        const id = bloco?.uuid;
        if (id) await getDownloadAtaPaa(id);
    }, []);

    const { retificacao, esta_em_retificacao } = dados;
    const mostrarRetificacao = Boolean(
        esta_em_retificacao && retificacao?.documento && retificacao?.ata,
    );

    return (
        <div className='paa-card border border-top-0 p-3'>
            {mostrarRetificacao ? (
                <>
                    <PaaSecaoPlanoEAta
                        tituloSecao={`PAA Retificado #${retificacao.documento.status.versao_documento}`}
                        documento={retificacao.documento}
                        ata={retificacao.ata}
                        tituloAta='Ata de retificação do PAA'
                        paaUuid={paaUuid}
                        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
                        visualizacaoEmAndamento={visualizacaoEmAndamento}
                        onVisualizarDocumento={onVisualizarDocumento}
                        onDownloadDocumento={onDownloadDocumento}
                        onVisualizarAta={onVisualizarAta}
                        onDownloadAta={onDownloadAta}
                    />
                    <hr className='my-4 paa-card__separador' />
                    <PaaSecaoPlanoEAta
                        tituloSecao='PAA Original'
                        documento={original.documento}
                        ata={original.ata}
                        tituloAta='Ata de apresentação do PAA'
                        paaUuid={paaUuid}
                        chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
                        visualizacaoEmAndamento={visualizacaoEmAndamento}
                        onVisualizarDocumento={onVisualizarDocumento}
                        onVisualizarAta={onVisualizarAta}
                        onDownloadDocumento={onDownloadDocumento}
                        onDownloadAta={onDownloadAta}
                    />
                </>
            ) : (
                <PaaSecaoPlanoEAta
                    tituloSecao={null}
                    documento={original.documento}
                    ata={original.ata}
                    tituloAta='Ata de apresentação do PAA'
                    paaUuid={paaUuid}
                    chaveVisualizacaoDocumento={chaveVisualizacaoDocumento}
                    visualizacaoEmAndamento={visualizacaoEmAndamento}
                    onVisualizarDocumento={onVisualizarDocumento}
                    onDownloadDocumento={onDownloadDocumento}
                    onVisualizarAta={onVisualizarAta}
                    onDownloadAta={onDownloadAta}
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
