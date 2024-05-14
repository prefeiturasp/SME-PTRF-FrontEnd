import React, { useContext } from "react";
import { ModalBootstrap } from "../../../../../Globais/ModalBootstrap";
import { RepassesContext } from "../context/Repasse";

export const ModalConfirmacaoExclusao = ({handleExcluirRepasse}) => {

    const {showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao, stateFormModal} = useContext(RepassesContext)

    return(
        <ModalBootstrap
            show={showModalConfirmacaoExclusao}
            onHide={setShowModalConfirmacaoExclusao}
            titulo="Excluir repasse"
            bodyText="Deseja realmente excluir esse repasse?"
            primeiroBotaoOnclick={() => setShowModalConfirmacaoExclusao(false)}
            primeiroBotaoTexto="Voltar"
            primeiroBotaoCss="outline-success"
            segundoBotaoOnclick={()=> {
                setShowModalConfirmacaoExclusao(false)
                handleExcluirRepasse(stateFormModal.uuid)
            }}
            segundoBotaoCss="danger"
            segundoBotaoTexto="Excluir"
        />
    )

}