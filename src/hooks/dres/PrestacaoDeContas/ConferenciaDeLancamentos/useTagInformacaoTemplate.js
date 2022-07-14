import React from "react";
import '../ConferenciaDeLancamentos/scss/tagInformacaoTemplate.scss';

const types = {
    1: 'tag-purple',
    2: 'tag-darkblue',
    3: 'tag-orange',
    4: 'tag-green',
    5: 'tag-blank'
}

function useTagInformacaoTemplate (){

    function retornaTagInformacaoToolTip (informacao){
        if(typeof(informacao) === 'string'){
            return `<p style="max-width: 200px;">${informacao}</p>`
    }  else {
        return informacao.reduce((acc, info) => (acc + `${info}<br/>`), '<p>') + '</p>'
        }
    }

    function retornaTagInformacaoTemplate (rowData) {
        return (
            <div className='p-2 text-wrap-conferencia-de-lancamentos'>
                {rowData.informacoes ? rowData['informacoes']?.map((tag, index) => {
                    const toolTip = retornaTagInformacaoToolTip(tag.tag_hint)
                    return (
                        <div data-tip={String(toolTip)} data-html={true} className={`tag-informacoes ${types[tag.tag_id]}`} key={index}>
                            <span>{tag.tag_nome}</span>
                        </div>
                    )
                }) : '-'}
            </div>
        )
    }

    return retornaTagInformacaoTemplate

}

export default useTagInformacaoTemplate
