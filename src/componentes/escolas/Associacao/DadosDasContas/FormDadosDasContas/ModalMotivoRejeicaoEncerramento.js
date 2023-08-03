import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalMotivoRejeicaoEncerramento = (props) => {
    const bodyText = () => {
        return (<>
            <p>Motivo</p>
            <p>{props.texto}</p>
        </>);
    }

    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={bodyText}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
            segundoBotaoTexto={props.segundoBotaoTexto}
        />
    )
};