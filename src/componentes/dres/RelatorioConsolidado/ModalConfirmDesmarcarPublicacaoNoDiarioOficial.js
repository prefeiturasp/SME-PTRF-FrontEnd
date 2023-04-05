import React, {memo} from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

const ModalConfirmDesmarcarPublicacaoNoDiarioOficial = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={props.segundoBotaoOnclick}
            segundoBotaoTexto="Confirmar"
            segundoBotaoCss="success"
        />
    )
};

export default memo(ModalConfirmDesmarcarPublicacaoNoDiarioOficial)