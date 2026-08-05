import React from "react";

import { IconButton } from "../../../../../Globais/UI/Button";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES =
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes();
    const { selectedRecurso } = useAbasPorRecursoContext();
    const { handleOpenCreateModal } = useMotivosEstornoContext();

    return (
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">
                    Confira abaixo os motivos de estorno do{" "}
                    {selectedRecurso?.nome_exibicao}.
                </p>
            </div>

            <IconButton
                icon="faPlus"
                iconProps={{
                    style: {
                        fontSize: "15px",
                        marginRight: "5",
                        color: "#fff",
                    },
                }}
                label="Adicionar motivo de estorno"
                onClick={() => handleOpenCreateModal(selectedRecurso)}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    );
};
