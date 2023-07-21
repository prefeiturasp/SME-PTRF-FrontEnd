
import React from "react";
import {ModalBootstrap} from "../../ModalBootstrap";

export const ModalValidacao = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.botaoCancelarHandle}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
            primeiroBotaoOnclick={props.botaoFecharHandle}
        />
    )
};
