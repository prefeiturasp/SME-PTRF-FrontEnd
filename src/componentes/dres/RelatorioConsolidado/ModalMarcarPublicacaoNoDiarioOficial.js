import {ModalBootstrapFormMarcarPublicacaoNoDiarioOficial} from "../../Globais/ModalBootstrap";
import React from "react";

import FormMarcarPublicacaoNoDiarioOficial from "./MarcarPublicacaoNoDiarioOficial/FormMarcarPublicacaoNoDiarioOficial";

export const ModalMarcarPublicacaoNoDiarioOficial = ({show, titulo, handleClose, consolidadoDre, carregaConsolidadosDreJaPublicadosProximaPublicacao, textoMsg, textoBotaoSalvar}) => {

    const bodyTextarea = () => {
        return (
            <>
                <FormMarcarPublicacaoNoDiarioOficial
                    consolidadoDre={consolidadoDre}
                    carregaConsolidadosDreJaPublicadosProximaPublicacao={carregaConsolidadosDreJaPublicadosProximaPublicacao}
                    handleClose={handleClose}
                    textoMsg={textoMsg}
                    textoBotaoSalvar={textoBotaoSalvar}
                />
            </>
        )
    }

    return (
        <>
            <ModalBootstrapFormMarcarPublicacaoNoDiarioOficial
                show={show}
                onHide={handleClose}
                titulo={titulo}
                bodyText={bodyTextarea()}
                primeiroBotaoOnclick={handleClose}
            />
        </>
    )
}