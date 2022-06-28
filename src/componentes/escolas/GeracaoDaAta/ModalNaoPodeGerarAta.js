import React from 'react';
import { ModalBootstrap } from '../../Globais/ModalBootstrap';

export const ModalNaoPodeGerarAta = (props) => {
    return (
        <ModalBootstrap
        show={props.show}
        onHide={props.handleClose}
        titulo={props.titulo}
        bodyText={props.texto}
        primeiroBotaoOnclick={()=>props.setShowNaoPodeGerarAta(false)}
        primeiroBotaoTexto={props.primeiroBotaoTexto}
        primeiroBotaoCss={props.primeiroBotaoCss}
        />
    )
}