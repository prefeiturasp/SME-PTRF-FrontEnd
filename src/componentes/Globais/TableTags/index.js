import React from 'react';
import { Tooltip as ReactTooltip } from "react-tooltip";
import './tableTags.scss';
import TagLabel from '../TagLabel';

const tagLabelMap = {
    'Conciliada': (tag, index) => <TagLabel label={`Período: ${tag.periodo_conciliacao}`} index={index} className={'px-2 tag-table-label-margin-top tag-table-label-color'} />,
};

export const TableTags = ({data, coresTags, excludeTags = []}) => {

    return (
        <>
            {data.informacoes ? data.informacoes?.map((tag, index) => {
                if(excludeTags.includes(tag.tag_nome)) {
                    return ''
                }

                let toolTip = ""

                if (typeof (tag.tag_hint) === 'string') {
                    toolTip = `<p style="max-width: 200px;">${tag.tag_hint}</p>`
                } else {
                    toolTip = tag.tag_hint.reduce((acc, info) => (acc + `${info}<br/>`), '<p>') + '</p>'
                }

                const tooltipId = `tooltip-tag-${index}`;

                return (
                    <>
                        <div key={index} className='p-2 text-wrap-tag'>
                            <div 
                                data-qa={`tooltip-tag-${index}`} 
                                data-tooltip-id={tooltipId}
                                data-tooltip-html={toolTip}
                                className={`${coresTags[tag.tag_id]} tag-tabelas mb-0`} 
                                key={index}
                            >
                                <span data-qa={`span-tag-${index}`} key={index}>{tag.tag_nome}</span>
                            </div>
                            <ReactTooltip 
                                id={tooltipId}
                                html={toolTip}
                                place="top"
                                style={{ maxWidth: '200px' }}
                            />
                        </div>
                                                    
                        {tagLabelMap[tag.tag_nome]?.(tag, index)}
                    </>
                )
            }) : '-'}
        </>
    )
}