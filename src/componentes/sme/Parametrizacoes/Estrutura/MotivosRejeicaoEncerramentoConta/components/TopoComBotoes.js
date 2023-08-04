import React, {useContext} from "react";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";

export const TopoComBotoes = () => {

    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(MotivosRejeicaoContext)

    return(
        <div className="d-flex bd-highlight align-items-center">
            <div className="p-2 flex-grow-1 bd-highlight">
                <h5 className="titulo-explicativo mb-0">Consulta dos motivos</h5>
            </div>
            <div className="p-2 bd-highlight">
                <button
                    onClick={()=>{
                        setStateFormModal(initialStateFormModal);
                        setShowModalForm(true);
                    }}
                    className="btn btn-success"
                >
                    + Adicionar motivo
                </button>
            </div>
        </div>
    )

}