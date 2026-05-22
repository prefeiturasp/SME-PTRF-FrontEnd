import React from "react";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useNavigate } from 'react-router-dom';
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { IconButton } from "../../../../../Globais/UI/Button";

export const TopoComBotoes = () => {
    const navigate = useNavigate();
    const { selectedRecurso } = useAbasPorRecursoContext();

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    return(
        <div className="d-flex bd-highlight align-items-center justify-content-between">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo os tipos de crédito do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar tipo de crédito"
                onClick={() => {
                    navigate(`/cadastro-tipo-de-credito`);
                }}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                data-testid="btn-adicionar-tipo-de-credito"
            />
        </div>
    )

}