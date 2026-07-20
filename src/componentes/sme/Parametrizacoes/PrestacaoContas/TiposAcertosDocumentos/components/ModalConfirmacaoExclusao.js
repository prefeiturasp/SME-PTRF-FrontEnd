import React from "react";
import { ModalConfirmarExclusao } from "../../../componentes/ModalConfirmarExclusao";

export const ModalConfirmacaoExclusao = ({ open, onOk, onCancel, titulo, bodyText }) => {
    return (
        <ModalConfirmarExclusao
            open={open}
            onOk={onOk}
            okText="Excluir"
            onCancel={onCancel}
            cancelText="Cancelar"
            cancelButtonProps={{ className: "btn-base-verde-outline" }}
            titulo={titulo}
            bodyText={bodyText}
        />
    );
};
