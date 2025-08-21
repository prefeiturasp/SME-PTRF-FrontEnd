import React, {memo} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import { Tooltip as ReactTooltip } from "react-tooltip";
import moment from "moment";
import {visoesService} from "../../../../services/visoes.service";

const IconeEditarRetificacao = ({consolidadoDre}) => {
    const retornaMsgToolTip = () => {
        let data_de_publicacao = moment(consolidadoDre.data_publicacao).format("DD/MM/YYYY")
        return (
            `
            <div>
                <p class='mb-1'>Data publicação: ${data_de_publicacao}</p>
                <p class='mb-1'>Página publicação: ${consolidadoDre.pagina_publicacao}</p>
            </div>
            `
        )
    }

    return (
        <>
            {consolidadoDre && consolidadoDre?.ja_publicado && consolidadoDre?.data_publicacao && consolidadoDre?.eh_retificacao && 
                    <div data-tooltip-content={retornaMsgToolTip()} data-html={true} style={{display:'inline'}} data-tooltip-id={`tooltip-id-${consolidadoDre.uuid}`}>
                    <button
                        onClick={(e) => console.log(e)}
                        className="btn btn-link pt-1 pb-1 pl-2 pr-0"
                        disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])}
                    >

                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E', fontSize: '18px'}}
                            icon={faEdit}
                        />
                        <ReactTooltip id={`tooltip-id-${consolidadoDre.uuid}`} html={true}/>

                    </button>
                </div>
            }
        </>
    )
}

export default memo(IconeEditarRetificacao)