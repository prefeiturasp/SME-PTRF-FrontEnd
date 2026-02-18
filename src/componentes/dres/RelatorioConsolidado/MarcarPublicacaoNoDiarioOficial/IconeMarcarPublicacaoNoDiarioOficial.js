import React, {memo, useState} from "react";
import {ModalMarcarPublicacaoNoDiarioOficial} from "../ModalMarcarPublicacaoNoDiarioOficial";
import moment from "moment";
import {visoesService} from "../../../../services/visoes.service";
import { EditIconButton } from "../../../Globais/UI/Button";

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
                <EditIconButton
                    tooltipMessage={retornaMsgToolTip()}
                    disabled={!visoesService.getPermissoes(['change_relatorio_consolidado_dre'])}
                    onClick={() => setShowModalMarcarPublicacaoNoDiarioOficial(true)}

                />
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