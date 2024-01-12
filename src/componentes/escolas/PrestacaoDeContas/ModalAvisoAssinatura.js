import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalAvisoAssinatura = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.primeiroBotaoOnclick}
            primeiroBotaoTexto="Ir para Membros da Associação"
            primeiroBotaoCss="success"
            segundoBotaoOnclick={props.segundoBotaoOnclick}
            segundoBotaoCss="success"
            segundoBotaoTexto="Concluir período"
            dataQa={props.dataQa}
            size={"lg"}
        />
    )
};