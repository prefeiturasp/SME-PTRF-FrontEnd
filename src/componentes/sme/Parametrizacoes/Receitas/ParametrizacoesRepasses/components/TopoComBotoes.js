import React, {useContext} from "react";
import { RepassesContext } from "../context/Repasse";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(RepassesContext)

    return(
        <div className="d-flex bd-highlight justify-content-end pb-4 mt-2">
            <button 
                onClick={()=>{
                    setStateFormModal(initialStateFormModal);
                    setShowModalForm(true);
                }}
                type="button" 
                className="btn btn-success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
                + Adicionar repasse previsto
            </button>
        </div>
    )

}