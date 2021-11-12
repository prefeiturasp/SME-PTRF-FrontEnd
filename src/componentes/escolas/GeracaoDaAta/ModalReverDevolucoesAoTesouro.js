import React from "react";
import {ModalBootstrap} from "../../Globais/ModalBootstrap";

export const ModalReverDevolucoesAoTesouro = (props)=> {
  return(
      <ModalBootstrap
          show={props.show}
          onHide={props.handleClose}
          titulo={props.titulo}
          bodyText={props.texto}
          primeiroBotaoOnclick={()=>props.setShowModalDevolucoesAoTesouro(true)}
          primeiroBotaoTexto={props.primeiroBotaoTexto}
          primeiroBotaoCss={props.primeiroBotaoCss}
          segundoBotaoOnclick={() => {
            props.irParaEdicaoAta()
          }}
          segundoBotaoCss={props.segundoBotaoCss}
          segundoBotaoTexto={props.segundoBotaoTexto}
      />
  )
};