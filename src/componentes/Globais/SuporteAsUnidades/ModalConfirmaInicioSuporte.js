import {ModalBootstrap} from "../ModalBootstrap";
import React from "react";

export const ModalConfirmaInicioSuporte = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={"Confirmação de acesso de suporte"}
            bodyText={props.texto}
            primeiroBotaoTexto={"Não"}
            primeiroBotaoCss={"outline-success"}
            primeiroBotaoOnclick={props.handleNaoConfirmaSuporte}
            segundoBotaoTexto={"Sim"}
            segundoBotaoCss={"danger"}
            segundoBotaoOnclick={props.handleConfirmaSuporte}
        />
    )
};