import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalConfirmaLogout = (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onRedirectNotificacoes}
            primeiroBotaoTexto="Ver notificações"
            primeiroBotaoCss="danger"
            segundoBotaoOnclick={props.onLogoutTrue}
            segundoBotaoCss="success"
            segundoBotaoTexto="Sair do sistema"
        />
    )
};