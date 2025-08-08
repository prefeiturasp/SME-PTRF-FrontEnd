import React from "react";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useNavigate } from 'react-router-dom';

export const TopoComBotoes = () => {
    const navigate = useNavigate();

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    return(
        <div className="d-flex bd-highlight justify-content-end pb-4 mt-2">
            <button 
                onClick={()=>{
                    navigate(`/cadastro-tipo-de-credito`);
                }}
                type="button" 
                className="btn btn-success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
                + Adicionar tipo de crédito
            </button>
        </div>
    )

}