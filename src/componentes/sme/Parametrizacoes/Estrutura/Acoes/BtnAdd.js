import React from "react";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const BtnAdd = ({setShowModalForm, initialStateFormModal, setStateFormModal}) =>{
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    return(
        <div className="d-flex justify-content-end pb-4 mt-2">
            <button data-qa="botao-adicionar-acoes" onClick={()=>{
                setStateFormModal(initialStateFormModal);
                setShowModalForm(true);
            }
            } type="button" className="btn btn-success mt-2" disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}>
                <FontAwesomeIcon
                    data-qa="botao-adicionar-acoes-icone"
                    style={{fontSize: '15px', marginRight: "5", color:"#fff"}}
                    icon={faPlus}/>
                Adicionar ação
            </button>
        </div>
    );
};
