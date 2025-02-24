import React, { useContext } from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import {ModalConfirmarExclusao} from "../../../componentes/ModalConfirmarExclusao";

export const ModalConfirmacaoExclusao = ({handleExcluir}) => {

    const {showModalConfirmacaoExclusao, setShowModalConfirmacaoExclusao, stateFormModal} = useContext(MateriaisServicosContext)

    return(
        <ModalConfirmarExclusao
            open={showModalConfirmacaoExclusao}
            onOk={() => {
                setShowModalConfirmacaoExclusao(false)
                handleExcluir(stateFormModal.uuid)
            }}
            okText="Excluir"
            onCancel={() => setShowModalConfirmacaoExclusao(false)}
            cancelText="Cancelar"
            titulo={`Excluir especificação`}
            bodyText={`Deseja realmente excluir esta especificação de materiais e serviços?`}
        />
    )
}
