import React from "react";
import IconeOrdenar from "../../../../../../assets/img/bar-chart.svg";
import {ModalOrdenar} from "./ModalOrdenar";

export const Ordenacao = ({showModalOrdenar, setShowModalOrdenar, camposOrdenacao, handleChangeOrdenacao, onSubmitOrdenar}) => {

    return(
        <>
            <img src={IconeOrdenar} alt=''/>
            <button
                className='legendas-table text-md-start'
                onClick={() => setShowModalOrdenar(true)}
                style={{
                    color: '#00585D',
                    outline: 'none',
                    border: 0,
                    background: 'inherit',
                    padding: '4px',
                    marginRight: '5px'
                }}
            >
                Ordenação
            </button>

            <ModalOrdenar
                showModalOrdenar={showModalOrdenar}
                setShowModalOrdenar={setShowModalOrdenar}
                camposOrdenacao={camposOrdenacao}
                handleChangeOrdenacao={handleChangeOrdenacao}
                onSubmitOrdenar={onSubmitOrdenar}
            />

        </>
    )

  
}