import React from 'react';
import './scss/tagModalLegendaInformacao.scss';
import TagLabel from '../TagLabel';

const tagLabelMap = {
    'Conciliada': (index) => <TagLabel label="Período: XXXX.X" index={index} className={"tag-modal-label-color tag-modal-label-margin-top"}/>,
};

export const TagModalLegendaInformacao = ({data, coresTags}) => {
    return (
        <div className="row ml-2 pb-4" key={data.index}>
            <div className="col-3">
                <span className={`${coresTags[data.id]} tag-modal-legenda-informacoes`} data-qa={`span-tag-${data.id}-texto-legenda-info`}>
                    {data.texto}
                </span>
                {tagLabelMap[data.texto]?.(data.index)}
            </div>

            <div className="col">
                <p data-qa={`p-tag-${data.id}-descricao-legenda-info`}>{data.descricao}</p>
            </div>
        </div>
    ) 
}