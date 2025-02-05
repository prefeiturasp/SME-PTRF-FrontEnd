import React, { useContext } from "react";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";

export const ModalConfirmacaoExclusao = ({handleExcluirMotivo}) => {

    const {showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao, stateFormModal} = useContext(MotivosDevolucaoTesouroContext)

    return(
        <ModalBootstrap
            show={showModalConfirmacaoExclusao}
            onHide={setShowModalConfirmacaoExclusao}
            titulo="Excluir motivo"
            bodyText="Deseja realmente excluir este motivo?"
            primeiroBotaoOnclick={() => setShowModalConfirmacaoExclusao(false)}
            primeiroBotaoTexto="Cancelar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={()=> {
                setShowModalConfirmacaoExclusao(false)
                handleExcluirMotivo(stateFormModal.uuid)
            }}
            segundoBotaoCss="danger"
            segundoBotaoTexto="Excluir"
        />
    )

}