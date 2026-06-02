import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Icon } from '../../../../../Globais/UI/Icon';

import './scss/HeaderDocumentos.scss';

interface IHeaderDocumentosProps {
    unidadeTipo?: string;
    unidadeNome?: string;
    codigoEol?: number | string;
    referencia?: string;
    estaEmRetificacao?: boolean;
}

export const HeaderDocumentos: React.FC<IHeaderDocumentosProps> = ({
    unidadeTipo,
    unidadeNome,
    codigoEol,
    referencia,
    estaEmRetificacao = false,
}) => {
    const navigate = useNavigate();

    return (
        <div className='header-documentos d-flex justify-content-between align-items-center'>
            <div className='header-documentos__informacoes-container'>
                <h2 className='header-documentos__titulo'>
                    {unidadeTipo} {unidadeNome}
                </h2>

                <div className='header-documentos__informacoes'>
                    <div>
                        <strong>Código EOL:</strong>
                        <span>{codigoEol}</span>
                    </div>

                    <div>
                        <strong>Vigência:</strong>
                        <span>{referencia}</span>
                    </div>

                    <div>
                        <strong>Status:</strong>
                        <span>{estaEmRetificacao ? 'Em Retificação' : 'Gerado'}</span>
                    </div>
                </div>
            </div>

            <div className='header-documentos__acoes'>
                <Button className='header-documentos__btn-voltar' onClick={() => navigate(-1)}>
                    <Icon icon='faArrowLeft' />
                    Voltar
                </Button>
            </div>
        </div>
    );
};
