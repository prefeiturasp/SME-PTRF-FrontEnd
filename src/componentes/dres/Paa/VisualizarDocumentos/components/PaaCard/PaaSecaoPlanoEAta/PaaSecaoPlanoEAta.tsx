import React from 'react';
import { PaaLinhaDocumento } from '../../PaaLinhaDocumento/PaaLinhaDocumento';
import { IDocumentoPaa, IAtaPaa } from '../../../../../../../interface/dre/Paa/paa.interface';

interface PaaSecaoPlanoEAtaProps {
    tituloSecao: string | null;
    documento: IDocumentoPaa;
    ata: IAtaPaa;
    tituloAta: string;
    paaUuid: string | null;
    chaveVisualizacaoDocumento: (paaUuid: string | null, ehRetificacao: boolean) => string | null;
    visualizacaoEmAndamento: string | null;
    onVisualizarDocumento: (bloco: IDocumentoPaa) => void;
    onDownloadDocumento: (bloco: IDocumentoPaa) => void;
    onVisualizarAta: (bloco: IAtaPaa, tituloModal?: string) => void;
    onDownloadAta: (bloco: IAtaPaa) => void;
}

export const PaaSecaoPlanoEAta: React.FC<PaaSecaoPlanoEAtaProps> = ({
    tituloSecao,
    documento,
    ata,
    tituloAta,
    paaUuid,
    chaveVisualizacaoDocumento,
    visualizacaoEmAndamento,
    onVisualizarDocumento,
    onDownloadDocumento,
    onVisualizarAta,
    onDownloadAta,
}) => {
    const chaveDoc = chaveVisualizacaoDocumento(paaUuid, documento.status.retificacao);
    const chaveAta = ata?.uuid ? `ata:${ata.uuid}` : null;

    return (
        <div>
            {tituloSecao ? <h3 className='mb-4 paa-card__titulo-versao'>{tituloSecao}</h3> : null}
            <PaaLinhaDocumento
                titulo='Plano anual'
                bloco={documento}
                testIdPrefix='plano'
                onVisualizar={() => onVisualizarDocumento(documento)}
                onDownload={() => onDownloadDocumento(documento)}
                carregandoVisualizar={visualizacaoEmAndamento === chaveDoc}
            />
            <div className='mt-4'>
                <div className='d-flex justify-content-between align-items-start flex-wrap gap-3'>
                    <div className='flex-grow-1 paa-card__col-ata'>
                        <PaaLinhaDocumento
                            titulo={tituloAta}
                            bloco={ata}
                            testIdPrefix='ata'
                            onVisualizar={() => onVisualizarAta(ata, tituloAta)}
                            onDownload={() => onDownloadAta(ata)}
                            carregandoVisualizar={Boolean(
                                chaveAta && visualizacaoEmAndamento === chaveAta,
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
