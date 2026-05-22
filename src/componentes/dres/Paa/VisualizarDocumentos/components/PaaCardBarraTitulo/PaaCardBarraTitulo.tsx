import React from 'react';

import './PaaCardBarraTitulo.scss';

interface IPaaCardBarraTituloProps {
    titulo: string;
}

export const PaaCardBarraTitulo: React.FC<IPaaCardBarraTituloProps> = ({ titulo }) => {
    return (
        <div className='paa-card-barra-titulo d-flex justify-content-between align-items-center w-100'>
            <span className='paa-card-barra-titulo__texto'>{titulo}</span>
        </div>
    );
};
