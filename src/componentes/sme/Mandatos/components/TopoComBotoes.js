import React, {useContext} from "react";
import {MandatosContext} from "../context/Mandatos";
import {useGetMandatoMaisRecente} from "../hooks/useGetMandatoMaisRecente";

export const TopoComBotoes = () => {

    const {setShowModalForm, setStateFormModal, initialStateFormModal} = useContext(MandatosContext)

    const {data} = useGetMandatoMaisRecente()

    const handleClickAddMandato = () => {
        setStateFormModal(
            {
                ...initialStateFormModal,
                editavel: true,
                data_inicial: data.data_inicial_proximo_mandato,
            }
        )
        setShowModalForm(true);
    }

    return (
        <div className="d-flex bd-highlight align-items-center">
            <div className="p-2 flex-grow-1 bd-highlight">
                <h5 className="titulo-explicativo mb-0">Consulta dos mandatos</h5>
            </div>
            <div className="p-2 bd-highlight">
                <button
                    onClick={handleClickAddMandato}
                    className="btn btn-success"
                >
                    + adicionar mandato
                </button>
            </div>
        </div>
    )

}