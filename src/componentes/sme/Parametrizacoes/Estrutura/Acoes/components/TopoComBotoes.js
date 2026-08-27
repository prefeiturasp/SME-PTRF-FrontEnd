import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useAcoesContext } from "../hooks/useAcoesContext";

export const TopoComBotoes = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const { handleOpenCreateModal } = useAcoesContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    return (
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo as ações do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <button
                onClick={() => handleOpenCreateModal()}
                type="button"
                className="btn btn-success mt-2"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
                <FontAwesomeIcon
                    data-qa="botao-adicionar-acoes-icone"
                    style={{ fontSize: '15px', marginRight: "5", color: "#fff" }}
                    icon={faPlus}
                />
                Adicionar ação
            </button>
        </div>
    );
};
