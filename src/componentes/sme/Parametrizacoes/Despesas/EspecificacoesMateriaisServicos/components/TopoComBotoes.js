import React, {useContext} from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(MateriaisServicosContext)

    return(
        <div className="d-flex bd-highlight justify-content-end pb-4 mt-2">
            <button 
                onClick={()=>{
                    setStateFormModal(initialStateFormModal);
                    setShowModalForm(true);
                }}
                type="button" 
                className="btn btn-success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                + Adicionar especificação
            </button>
        </div>
    )
}
