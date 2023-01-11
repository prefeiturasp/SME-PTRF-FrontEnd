import React, {memo, useState} from "react";
import {ModalMarcarPublicacaoNoDiarioOficial} from "../ModalMarcarPublicacaoNoDiarioOficial";

const BotaoMarcarPublicacaoNoDiarioOficial = ({consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao}) => {
    const [showModalMarcarPublicacaoNoDiarioOficial, setShowModalMarcarPublicacaoNoDiarioOficial] = useState(false)
    return (
        <>
            {consolidadoDre && consolidadoDre.ja_publicado && !consolidadoDre.data_publicacao && !consolidadoDre?.eh_retificacao &&
                <div className="p-2 bd-highlight">
                    <button
                        onClick={() => setShowModalMarcarPublicacaoNoDiarioOficial(true)}
                        className="btn btn-outline-success"
                    >
                        Informar publicação
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
                    textoMsg='Data e página da publicação incluída com sucesso.'
                    textoBotaoSalvar='Informar'
                />
            </section>
        </>

    )
}

export default memo(BotaoMarcarPublicacaoNoDiarioOficial)