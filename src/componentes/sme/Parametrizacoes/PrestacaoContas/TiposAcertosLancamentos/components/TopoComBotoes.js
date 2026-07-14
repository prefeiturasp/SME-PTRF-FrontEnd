import React, { useContext } from "react";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { IconButton } from "../../../../../Globais/UI/Button";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const { setShowModalForm, setStateFormModal, initialStateFormModal } = useContext(AcertosLancamentosContext)
    const { selectedRecurso } = useAbasPorRecursoContext()

    return (
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h5 className="font-weight-bold">Tipos de acertos em lançamentos</h5>
                <p className="m-0">Confira abaixo os tipos de acertos em lançamentos cadastrados.</p>
            </div>

            <IconButton 
                icon="faPlus"
                iconProps={{ style: { fontSize: '15px', marginRight: "5", color: "#fff" } }}
                label="Adicionar tipo de acerto em lançamento"
                onClick={() => {
                    setStateFormModal({
                        ...initialStateFormModal,
                        recurso: selectedRecurso?.uuid || ''
                    });
                    setShowModalForm(true);
                }}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    )
}
