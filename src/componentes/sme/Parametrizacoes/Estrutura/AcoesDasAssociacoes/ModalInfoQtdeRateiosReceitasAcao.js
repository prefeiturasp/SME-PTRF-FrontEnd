import {ModalBootstrap} from "../../../../Globais/ModalBootstrap";
import React from "react";

export const ModalInfoQtdeRateiosReceitasAcao = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
        />
    )
};