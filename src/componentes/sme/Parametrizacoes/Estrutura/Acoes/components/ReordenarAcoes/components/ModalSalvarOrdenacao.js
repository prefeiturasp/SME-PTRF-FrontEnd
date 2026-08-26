import React from "react";
import { ModalInformativoOrdenacaoAcoes } from "../../../../../componentes/ModalInformativoOrdenacaoAcoes";
import { useReordenarAcoesContext } from "../hooks/useReordenarAcoesContext";

export const ModalSalvarOrdenacao = () => {
    const { 
        showModalSalvarOrdenacao, 
        handleCloseModalSalvarOrdenacao,
        handleConfirmModalSalvarOrdenacao,
    } = useReordenarAcoesContext();

    // Modal para salvar a ordenação das ações ao clicar no botão "Salvar" na tela de reordenação
    return (
        <ModalInformativoOrdenacaoAcoes
            open={showModalSalvarOrdenacao}
            onOk={handleConfirmModalSalvarOrdenacao}
            okText="Salvar"
            onCancel={handleCloseModalSalvarOrdenacao}
            cancelText="Cancelar"
            cancelButtonProps={{ className: "btn-base-verde-outline" }}
            titulo="Confirmar ordenação"
            bodyText={
                 <p>
                    Ao salvar, a ordenação será exibida em todas as listas de ações.<br />
                    Deseja realmente salvar as alterações?
                </p>
            }
        />
    );
};
