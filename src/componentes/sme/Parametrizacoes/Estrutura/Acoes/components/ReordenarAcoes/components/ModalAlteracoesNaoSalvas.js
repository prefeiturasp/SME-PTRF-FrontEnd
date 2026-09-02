import React from "react";
import { ModalInformativoOrdenacaoAcoes} from "../../../../../componentes/ModalInformativoOrdenacaoAcoes";
import { useReordenarAcoesContext } from "../hooks/useReordenarAcoesContext";

export const ModalAlteracoesNaoSalvas = () => {
    const { 
        showModalAlteracoesNaoSalvas, 
        handleCloseModalAlteracoesNaoSalvas,
        handleConfirmModalAlteracoesNaoSalvas,
    } = useReordenarAcoesContext();

    // Modal para voltar para a tela de ações sem salvar a ordenação das ações ou salvar a ordenação das ações ao clicar no botão "Voltar" na tela de reordenação
    return (
        <ModalInformativoOrdenacaoAcoes
            open={showModalAlteracoesNaoSalvas}
            onOk={handleConfirmModalAlteracoesNaoSalvas}
            okText="Salvar"
            onCancel={handleCloseModalAlteracoesNaoSalvas}
            cancelText="Cancelar"
            cancelButtonProps={{ className: "btn-base-verde-outline" }}
            titulo="Atenção!"
            bodyText={
                <p>
                    Foram feitas alterações na ordenação das ações. <br />
                    Você deseja salvar as alterações?
                </p>
            }
        />
    );
};
