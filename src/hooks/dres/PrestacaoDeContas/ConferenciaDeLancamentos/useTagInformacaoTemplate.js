import React from "react";
import ReactTooltip from "react-tooltip";
import '../ConferenciaDeLancamentos/scss/tagInformacaoTemplate.scss';

const types = {
    1: 'tag-purple',
    2: 'tag-darkblue',
    3: 'tag-orange',
    4: 'tag-green',
    5: 'tag-blank',
    6: 'tag-red-white'
}

function useTagInformacaoTemplate() {

    function retornaTagInformacaoToolTip(informacao) {
        if (typeof (informacao) === 'string') {
            return `<p style="max-width: 200px;">${informacao}</p>`
        } else {
            return informacao.reduce((acc, info) => (acc + `${info}<br/>`), '<p>') + '</p>'
        }
    }

    function retornaTagInformacaoTemplate(rowData) {
        return (
            <>
                {rowData.informacoes ? rowData.informacoes?.map((tag, index) => {
                    const toolTip = retornaTagInformacaoToolTip(tag.tag_hint)
                    return (
                        <div key={index} className='p-2 text-wrap-conferencia-de-lancamentos'>
                            <div data-tip={toolTip} data-html={true} className={`tag-informacoes ${types[tag.tag_id]}`} key={index}>
                                <span key={index}>{tag.tag_nome}</span>
                                <ReactTooltip/>
                            </div>
                        </div>

                    )
                }) : '-'}

            </>
        )
    }

    return retornaTagInformacaoTemplate

}

export default useTagInformacaoTemplate
