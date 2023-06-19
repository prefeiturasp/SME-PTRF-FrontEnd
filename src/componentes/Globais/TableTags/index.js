import React from 'react';
import ReactTooltip from "react-tooltip";
import './tableTags.scss';

export const TableTags = ({data, coresTags}) => {
    return (
        <>
            {data.informacoes ? data.informacoes?.map((tag, index) => {
                let toolTip = ""

                if (typeof (tag.tag_hint) === 'string') {
                    toolTip = `<p style="max-width: 200px;">${tag.tag_hint}</p>`
                } else {
                    toolTip = tag.tag_hint.reduce((acc, info) => (acc + `${info}<br/>`), '<p>') + '</p>'
                }

                return (
                    <div key={index} className='p-2 text-wrap-tag'>
                        <div data-tip={toolTip} data-html={true} className={`${coresTags[tag.tag_id]} tag-tabelas`} key={index}>
                            <span key={index}>{tag.tag_nome}</span>
                            <ReactTooltip/>
                        </div>
                    </div>
                )
            }) : '-'}
        </>
    )
}