import {ModalBootstrapFormExcluirTecnicoDre} from "../../../Globais/ModalBootstrap";
import React from "react";
import {FormAlterarEmail} from "../../../Globais/FormAlterarEmail";

export const ConfirmaDeleteTecnico = ({show, onCancelDelete, onConfirmDelete, stateTecnicoForm}) => {

    const bodyTextarea = () => {
        return (
            <>
                <div className="col-12">
                    <FormAlterarEmail
                        handleClose={onCancelDelete}
                    />
                </div>
            </>
        )
    };

    return (
        <ModalBootstrapFormExcluirTecnicoDre
            show={show}
            onHide={onCancelDelete}
            titulo="Excluir um técnico"
            bodyText={bodyTextarea()}
            /*primeiroBotaoOnclick={onCancelDelete}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={onConfirmDelete}
            segundoBotaoTexto="Excluir"
            segundoBotaoCss="danger"*/
        />
    )
};
