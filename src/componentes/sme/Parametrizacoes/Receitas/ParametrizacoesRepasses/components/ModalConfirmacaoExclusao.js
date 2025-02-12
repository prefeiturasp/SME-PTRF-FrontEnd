import React, { useContext } from "react";
import { RepassesContext } from "../context/Repasse";
import {ModalConfirmarExclusao} from "../../../componentes/ModalConfirmarExclusao";

export const ModalConfirmacaoExclusao = ({handleExcluirRepasse}) => {

    const {showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao, stateFormModal} = useContext(RepassesContext)

    return(
        <ModalConfirmarExclusao
            open={showModalConfirmacaoExclusao}
            onOk={() => {
                setShowModalConfirmacaoExclusao(false)
                handleExcluirRepasse(stateFormModal.uuid)
            }}
            okText="Excluir"
            onCancel={() => setShowModalConfirmacaoExclusao(false)}
            cancelText="Cancelar"
            titulo="Excluir repasse"
            bodyText="Deseja realmente excluir esse repasse?"
        />
    )

}