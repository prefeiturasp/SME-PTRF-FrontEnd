import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalSalvarJustificativa= (props) =>{
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo="Informações salvas"
            bodyText="<p>Informações salvas com sucesso!</p>"
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto="OK"
        />
    )
};