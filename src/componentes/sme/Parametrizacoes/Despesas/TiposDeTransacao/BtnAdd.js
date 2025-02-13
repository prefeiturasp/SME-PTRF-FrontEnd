import React from "react";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

export const BtnAdd = ({FontAwesomeIcon, faPlus, setShowModalForm, initialStateFormModal, setStateFormModal}) =>{
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <button
                role="button"
                data-qa="botao-adicionar-tipo-transacao"
                onClick={()=>{
                    setStateFormModal(initialStateFormModal);
                    setShowModalForm(true);
                }} 
                type="button" 
                className="btn btn-success mt-2" 
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
                <FontAwesomeIcon
                    style={{fontSize: '15px', marginRight: "5", color:"#fff"}}
                    icon={faPlus}
                />
                Adicionar tipo de transação
            </button>
        </div>
    );
};