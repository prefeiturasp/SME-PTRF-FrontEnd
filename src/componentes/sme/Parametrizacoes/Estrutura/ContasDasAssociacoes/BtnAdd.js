import React from "react";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const BtnAdd = ({FontAwesomeIcon, faPlus, setShowModalForm, initialStateFormModal, setStateFormModal}) =>{
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    return(
        <div className="d-flex  justify-content-end pb-4 mt-n5">
            <button 
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                onClick={()=>{
                        setStateFormModal(initialStateFormModal);
                        setShowModalForm(true);
                    }}
                type="button" 
                className="btn btn-success mt-2">
                    <FontAwesomeIcon
                        style={{fontSize: '15px', marginRight: "5", color:"#fff"}}
                        icon={faPlus}
                    />
                    Adicionar conta de associação
            </button>
        </div>
    );
};