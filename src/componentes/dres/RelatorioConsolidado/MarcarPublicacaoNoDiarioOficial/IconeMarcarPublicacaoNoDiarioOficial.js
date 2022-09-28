import React, {memo, useState} from "react";
import {ModalMarcarPublicacaoNoDiarioOficial} from "../ModalMarcarPublicacaoNoDiarioOficial";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit} from '@fortawesome/free-solid-svg-icons'
import ReactTooltip from "react-tooltip";
import moment from "moment";

const IconeMarcarPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {
    const [showModalMarcarPublicacaoNoDiarioOficial, setShowModalMarcarPublicacaoNoDiarioOficial] = useState(false)

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
            {consolidadoDre && consolidadoDre.ja_publicado && consolidadoDre.data_publicacao &&
                <div data-tip={retornaMsgToolTip()} data-html={true} style={{display:'inline'}}>
                    <button
                        onClick={() => setShowModalMarcarPublicacaoNoDiarioOficial(true)}
                        className="btn btn-link pt-1 pb-1 pl-2 pr-0"
                    >

                        <FontAwesomeIcon
                            style={{marginRight: "0", color: '#00585E', fontSize: '18px'}}
                            icon={faEdit}
                        />
                        <ReactTooltip html={true}/>

                    </button>
                </div>
            }
            <section>
                <ModalMarcarPublicacaoNoDiarioOficial
                    titulo='Informar publicação'
                    show={showModalMarcarPublicacaoNoDiarioOficial}
                    handleClose={() => setShowModalMarcarPublicacaoNoDiarioOficial(false)}
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    textoMsg='Informações da publicação alteradas com sucesso.'
                    textoBotaoSalvar='Salvar'
                />
            </section>
        </>
    )
}

export default memo(IconeMarcarPublicacaoNoDiarioOficial)