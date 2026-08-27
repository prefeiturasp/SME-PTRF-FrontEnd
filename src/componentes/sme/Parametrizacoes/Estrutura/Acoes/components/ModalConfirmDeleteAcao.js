import React from "react";
import { ModalConfirmarExclusao } from "../../../componentes/ModalConfirmarExclusao";
import { useAcoesContext } from "../hooks/useAcoesContext";

export const ModalConfirmDeleteAcao = () => {
    const { handleDelete, submitForm, showModalConfirmDesabilitarAcao, handleCloseModalConfirmDesabilitarAcao, showModalDeleteAcao, handleCloseModalDeleteAcao, modalForm } = useAcoesContext();

    // Modal para desabilitação de ação (quando tem receitas previstas)
    if (showModalConfirmDesabilitarAcao?.open) {
        return (
            <ModalConfirmarExclusao
                open={showModalConfirmDesabilitarAcao?.open}
                onOk={() => submitForm(showModalConfirmDesabilitarAcao?.form)}
                okText="Confirmar"
                onCancel={handleCloseModalConfirmDesabilitarAcao}
                cancelText="Cancelar"
                cancelButtonProps={{ className: "btn-base-verde-outline-desabilita-acao" }}
                titulo="Desabilitar ação PTRF"
                bodyText={
                    <p>A ação PTRF que deseja desabilitar possui receitas previstas indicadas e/ou prioridades no PAA. Deseja continuar?</p>
                }
            />
        );
    }

    // Modal para exclusão de ação
    return (
        <ModalConfirmarExclusao
            open={showModalDeleteAcao}
            onOk={() => handleDelete(modalForm?.uuid)}
            okText="Excluir"
            onCancel={handleCloseModalDeleteAcao}
            cancelText="Cancelar"
            cancelButtonProps={{ className: "btn-base-verde-outline" }}
            titulo="Excluir Ação"
            bodyText={
                <p>Tem certeza que deseja excluir esta ação?</p>
            }
        />
    );
};
