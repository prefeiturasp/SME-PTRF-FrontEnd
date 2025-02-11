import React from "react";
import {ModalConfirmarExclusao} from "../../componentes/ModalConfirmarExclusao";

export const ModalConfirmDeleteTag = (props) => {
    return (
        <ModalConfirmarExclusao
            open={props.show}
            onOk={props.onDeleteTagTrue}
            okText={props.segundoBotaoTexto}
            onCancel={props.handleClose}
            cancelText={props.primeiroBotaoTexto}
            titulo={props.titulo}
            bodyText={props.texto}
        />
    )
};