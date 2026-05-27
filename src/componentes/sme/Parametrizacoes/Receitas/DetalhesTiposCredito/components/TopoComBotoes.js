import React from "react";
import { IconButton } from "../../../../../Globais/UI/Button";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useDetalhesTiposCreditoContext } from "../hooks/useDetalhesTiposCreditoContext";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

export const TopoComBotoes = () => {
  const { selectedRecurso } = useAbasPorRecursoContext();
  const { handleOpenCreateModal } = useDetalhesTiposCreditoContext();
  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()

  return(
    <div className="d-flex justify-content-between align-items-end mb-3">
      <div>
        <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
        <p className="m-0">Confira abaixo os detalhes de tipos de crédito do {selectedRecurso?.nome_exibicao}.</p>
      </div>

      <IconButton
        icon="faPlus"
        iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
        label="Adicionar detalhe de tipo de crédito"
        onClick={() => handleOpenCreateModal(selectedRecurso)}
        variant="success"
        disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
      />
    </div>
  )
}