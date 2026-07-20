import React from "react";
import { ModalConfirmarExclusao } from "../../../componentes/ModalConfirmarExclusao";

export const ModalConfirmacaoExclusao = ({ open, onOk, onCancel }) => {
    return (
        <ModalConfirmarExclusao
            open={open}
            onOk={onOk}
            okText="Excluir"
            onCancel={onCancel}
            cancelText="Cancelar"
            cancelButtonProps={{ className: "btn-base-verde-outline" }}
            titulo="Excluir tipo de acerto em lançamentos"
            bodyText={
                <p>Tem certeza que deseja excluir o tipo de acerto em lançamentos?</p>
            }
        />
    )
}
