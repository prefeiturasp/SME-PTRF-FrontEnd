import React, {useContext} from "react";
import { RepassesContext } from "../context/Repasse";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { IconButton } from "../../../../../Globais/UI/Button";

export const TopoComBotoes = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();

    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(RepassesContext)

    return(
        <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
                <h5 className="font-weight-bold">{selectedRecurso?.nome}</h5>
                <p className="m-0">Confira abaixo as ações das associações do {selectedRecurso?.nome_exibicao}.</p>
            </div>

            <IconButton 
                icon="faPlus"
                iconProps={{ style: {fontSize: '15px', marginRight: "5", color:"#fff"} }}
                label="Adicionar repasse previsto"
                onClick={()=>{
                    setStateFormModal({ ...initialStateFormModal, recurso: selectedRecurso?.uuid || "", });
                    setShowModalForm(true);
                }}
                variant="success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            />
        </div>
    )

}