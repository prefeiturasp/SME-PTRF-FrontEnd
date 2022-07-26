import {ModalBootstrap} from "../../Globais/ModalBootstrap";
import React from "react";

export const ModalNaoPodeVoltarParaAnalise = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo="Prestação de Contas já publicada"
            bodyText={props.texto}
            primeiroBotaoOnclick={props.handleClose}
            primeiroBotaoTexto={props.primeiroBotaoTexto}
            primeiroBotaoCss={props.primeiroBotaoCss}
        />
    )
};
