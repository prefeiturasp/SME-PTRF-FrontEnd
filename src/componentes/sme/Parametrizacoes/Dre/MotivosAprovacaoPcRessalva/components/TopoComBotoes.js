import React, {useContext} from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(MotivosAprovacaoPcRessalvaContext)
    const { selectedRecurso } = useAbasPorRecursoContext();

    return(
        <div className="d-flex justify-content-between align-items-end mb-3">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo os motivos de aprovação com ressalvas do {selectedRecurso?.nome_exibicao}.</p>
            </div>
            <div className="p-2 bd-highlight">
                <button
                    onClick={()=>{
                        setStateFormModal({
                            ...initialStateFormModal,
                            recurso: selectedRecurso ? selectedRecurso.uuid : ''
                        });
                        setShowModalForm(true);
                    }}
                    className="btn btn-success"
                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                >
                    + Adicionar motivo de PC aprovada com ressalva
                </button>
            </div>
        </div>
    )

}