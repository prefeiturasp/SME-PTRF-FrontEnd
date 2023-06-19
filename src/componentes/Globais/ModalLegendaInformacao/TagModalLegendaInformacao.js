import React from 'react';
import './scss/tagModalLegendaInformacao.scss';

export const TagModalLegendaInformacao = ({data, coresTags}) => {
    return (
        <div className="row ml-2 pb-4" key={data.index}>
            <div className="col-3">
                <span className={`${coresTags[data.id]} tag-modal-legenda-informacoes`}>
                    {data.texto}
                </span>
            </div>

            <div className="col">
                <p>{data.descricao}</p>
            </div>
        </div>
    ) 
}