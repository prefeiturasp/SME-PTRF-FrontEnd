import React, {useContext} from "react";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";
import {RetornaSeTemPermissaoEdicaoPainelParametrizacoes} from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes"

export const TopoComBotoes = () => {
    const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes()
    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(MotivosDevolucaoTesouroContext)

    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="p-2 flex-grow-1 bd-highlight">
                {/* <h5 className="titulo-explicativo mb-0">Consulta dos motivos</h5> */}
            </div>
            <div className="p-2 bd-highlight">
                <button
                    onClick={()=>{
                        setStateFormModal(initialStateFormModal);
                        setShowModalForm(true);
                    }}
                    className="btn btn-success"
                    disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
                >
                    + Adicionar motivo de devolução ao tesouro
                </button>
            </div>
        </div>
    )

}