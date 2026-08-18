import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import {  useTagsContext } from "../hooks/useTagsContext";

export const TopoComBotoes = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const { handleOpenCreateModal } = useTagsContext();
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

    return (
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo as etiquetas/tags do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <button
                onClick={() => handleOpenCreateModal(selectedRecurso)}
                type="button"
                className="btn btn-success mt-2"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
                <FontAwesomeIcon
                    style={{ fontSize: '15px', marginRight: "5", color: "#fff" }}
                    icon={faPlus}
                />
                Adicionar etiqueta/tag
            </button>
        </div>
    );
};
