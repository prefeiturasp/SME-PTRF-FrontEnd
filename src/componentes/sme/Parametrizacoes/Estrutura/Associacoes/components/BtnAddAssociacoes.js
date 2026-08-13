import React from "react";
import { IconButton } from "../../../../../Globais/UI/Button";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useNavigate } from "react-router-dom";

export const BtnAddAssociacoes = () =>{
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const navigate = useNavigate();

    return(
        <div className="d-flex  justify-content-end pb-4 mt-2">
            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar Associação"
                onClick={() => navigate("/formulario-associacao")}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    );
};
