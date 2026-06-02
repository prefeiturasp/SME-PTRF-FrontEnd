import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faEye } from '@fortawesome/free-solid-svg-icons';
import { IDocumentoPaa, IAtaPaa } from '../../../../../../interface/dre/Paa/paa.interface';
import './PaaLinhaDocumento.scss';

const MAPA_COR_MENSAGEM: Record<string, string> = {
    green: '#0F7A6C',
    red: '#C22D2D',
    orange: '#D06D12',
    grey: '#60686A',
};

const corMensagemParaHex = (corMensagem: string | undefined): string =>
    MAPA_COR_MENSAGEM[corMensagem || ''] || MAPA_COR_MENSAGEM.grey;

interface PaaLinhaDocumentoProps {
    titulo: string;
    bloco: IDocumentoPaa | IAtaPaa;
    testIdPrefix?: string;
    onVisualizar: () => void;
    onDownload: () => void;
    carregandoVisualizar?: boolean;
}

export const PaaLinhaDocumento: React.FC<PaaLinhaDocumentoProps> = ({
    titulo,
    bloco,
    testIdPrefix = 'paa-doc',
    onVisualizar,
    onDownload,
    carregandoVisualizar = false,
}) => {
    const status = bloco?.status;
    const mensagem = status?.mensagem ?? '';
    const textoExibido = mensagem;
    const cor = corMensagemParaHex(status?.cor_mensagem);
    const podeBaixarOuVer = bloco?.existe_arquivo && bloco?.url;

    return (
        <div>
            <h4 className='mb-2 paa-linha-documento__titulo'>{titulo}</h4>
            <div className='d-flex align-items-center flex-wrap'>
                <span
                    className='paa-linha-documento__mensagem d-inline-flex align-items-center flex-wrap'
                    style={{ color: cor }}
                    data-testid={`${testIdPrefix}-mensagem`}
                >
                    {textoExibido}
                </span>
                {podeBaixarOuVer && (
                    <>
                        <button
                            type='button'
                            className='ml-3 p-0 btn btn-link d-flex align-items-center paa-linha-documento__btn-acao'
                            disabled={carregandoVisualizar}
                            onClick={onVisualizar}
                        >
                            <FontAwesomeIcon
                                className='paa-linha-documento__icone'
                                icon={faEye}
                                title='Visualizar'
                            />
                        </button>
                        <button
                            type='button'
                            className='ml-1 p-0 btn btn-link d-flex align-items-center paa-linha-documento__btn-acao'
                            disabled={carregandoVisualizar}
                            onClick={onDownload}
                        >
                            <FontAwesomeIcon
                                className='paa-linha-documento__icone'
                                icon={faDownload}
                                title='Download'
                            />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
