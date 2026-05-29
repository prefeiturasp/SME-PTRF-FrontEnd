import React from "react";
import { useAbasPorRecursoContext } from "../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { IconButton } from "../../../../Globais/UI/Button";

export function TopoComBotoes({ handleOpenCreateModal, tem_permissao_edicao_painel_parametrizacoes }) {
    const { selectedRecurso } = useAbasPorRecursoContext();

    return (
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo os tipos de conta do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <IconButton
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar tipo de conta"
                onClick={() => handleOpenCreateModal(selectedRecurso)}
                variant="success"
                disabled={!tem_permissao_edicao_painel_parametrizacoes}
            />
        </div>
    )
}