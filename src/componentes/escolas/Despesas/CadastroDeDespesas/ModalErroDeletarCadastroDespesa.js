import React from "react";
import {ModalBootstrap} from "../../../Globais/ModalBootstrap";

export const ModalErroDeletarCadastroDespesa = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="Fechar"
            primeiroBotaoCss="success"
        />
    )
};