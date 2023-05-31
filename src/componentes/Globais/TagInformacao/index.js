import React from 'react';
import ReactTooltip from "react-tooltip";
import './tagInformacaoTemplate.scss';

const types = {
    1: 'tag-purple',
    2: 'tag-darkblue',
    3: 'tag-orange',
    4: 'tag-green',
    5: 'tag-blank',
    6: 'tag-red-white',
    7: 'tag-neutral-3',
    8: 'tag-light-purple',
    9: 'tag-blue',
    10: 'tag-blue-white',
}


export const TagInformacao = (props) => {
    if(props.localDaTag === "modal-legenda-informacao") {
        return (
            <div className="row ml-2 pb-4" key={props.data.index}>
                <div className="col-3">
                    <span className={`${types[props.data.id]} tag-modal-legenda-informacoes`}>
                        {props.data.texto}
                    </span>
                </div>

                <div className="col">
                    <p>{props.data.descricao}</p>
                </div>
            </div>
        )
    }


    return (
        <>
            {props.data.informacoes ? props.data.informacoes?.map((tag, index) => {
                let toolTip = ""

                if (typeof (tag.tag_hint) === 'string') {
                    toolTip = `<p style="max-width: 200px;">${tag.tag_hint}</p>`
                } else {
                    toolTip = tag.tag_hint.reduce((acc, info) => (acc + `${info}<br/>`), '<p>') + '</p>'
                }

                
                if(props.tooltipsPersonalizadas && props.tooltipsPersonalizadas.length > 0) {
                    props.tooltipsPersonalizadas.forEach(tooltipPersonalizada => {
                        if(tooltipPersonalizada.nomeTooltip === tag.tag_nome) {
                            toolTip = `${toolTip} ${tooltipPersonalizada.textoPersonalizado}`
                        }
                    });
                }

                return (
                    <div key={index} className='p-2 text-wrap-tag'>
                        <div data-tip={toolTip} data-html={true} className={`tag-tabelas ${types[tag.tag_id]}`} key={index}>
                            <span key={index}>{tag.tag_nome}</span>
                            <ReactTooltip/>
                        </div>
                    </div>
                )
            }) : '-'}

        </>
    )
}