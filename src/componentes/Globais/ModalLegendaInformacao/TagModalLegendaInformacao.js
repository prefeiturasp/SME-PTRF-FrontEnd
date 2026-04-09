import React from 'react';
import './scss/tagModalLegendaInformacao.scss';
import TagPeriodoConciliacao from '../TagPeriodoConciliacao';

export const TagModalLegendaInformacao = ({data, coresTags}) => {
    return (
        <div className="row ml-2 pb-4" key={data.index}>
            <div className="col-3">
                <span className={`${coresTags[data.id]} tag-modal-legenda-informacoes`} data-qa={`span-tag-${data.id}-texto-legenda-info`}>
                    {data.texto}
                </span>
                {
                    data.texto === 'Conciliada' && (
                        <TagPeriodoConciliacao periodo={'XXXX.X'} index={data.index} classExtra={"tag-margin"}/> 
                    )
                }
            </div>

            <div className="col">
                <p data-qa={`p-tag-${data.id}-descricao-legenda-info`}>{data.descricao}</p>
            </div>
        </div>
    ) 
}