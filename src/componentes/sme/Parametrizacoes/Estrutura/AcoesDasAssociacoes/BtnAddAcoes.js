import React from "react";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../sme/Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useAbasPorRecursoContext } from "../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { IconButton } from "../../../../Globais/UI/Button";

import { useAcoesDasAssociacoesContext } from "./hooks/useAcoesDasAssociacoesContext";

export const BtnAddAcoes = () =>{
    const { selectedRecurso } = useAbasPorRecursoContext();
    const { handleOpenFormModalCreate } = useAcoesDasAssociacoesContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    return(
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo as ações das associações do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar ação de associação"
                onClick={handleOpenFormModalCreate}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    );
};