import {ModalBootstrap} from "../ModalBootstrap";
import React from "react";

export const ModalConfirmaEncerramentoSuporte = (props) => {
    return (
        <ModalBootstrap
            show={props.show}
            onHide={()=>{}}
            titulo={"Confirmação de encerramento de suporte"}
            bodyText={"<p>Deseja encerrar o suporte a essa unidade?</p> <p>Ao confirmar, você não visualizará mais essa unidade como suporte.</p>"}
            primeiroBotaoTexto={"Não"}
            primeiroBotaoCss={"outline-success"}
            primeiroBotaoOnclick={props.handleNaoConfirmaEncerramentoSuporte}
            segundoBotaoTexto={"Sim"}
            segundoBotaoCss={"danger"}
            segundoBotaoOnclick={props.handleConfirmaEncerramentoSuporte}
        />
    )
};