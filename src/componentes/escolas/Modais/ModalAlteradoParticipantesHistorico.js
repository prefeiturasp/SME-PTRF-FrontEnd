import React from 'react';
import { ModalBootstrap } from '../../Globais/ModalBootstrap';

export const ModalAlteradoParticipantesHistorico = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={props.handleClose}
            titulo={props.titulo}
            bodyText={props.texto}
            primeiroBotaoOnclick={props.onClickGerarAta}
            primeiroBotaoTexto="Gerar ata"
            primeiroBotaoCss="outline-success"
            primeiroBotaoDisabled={props.btGerarDesabilitado}
            segundoBotaoOnclick={props.onClickVisualizarAta}
            segundoBotaoTexto={props.textoBotaoVisualizar}
            segundoBotaoCss="success"
            dataQa={props.dataQa}
        />
    )
}
