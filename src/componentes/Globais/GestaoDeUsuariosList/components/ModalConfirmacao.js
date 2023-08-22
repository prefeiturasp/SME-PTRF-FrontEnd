
import React from "react";
import {ModalBootstrap} from "../../ModalBootstrap";

export const ModalConfirmacao = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.botaoCancelarHandle}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoTexto={props.botaoCancelarTexto}
            primeiroBotaoCss="outline-success"
            primeiroBotaoOnclick={props.botaoCancelarHandle}
            segundoBotaoTexto={props.botaoConfirmarTexto}
            segundoBotaoCss="danger"
            segundoBotaoOnclick={props.botaoConfirmarHandle}
        />
    )
};
