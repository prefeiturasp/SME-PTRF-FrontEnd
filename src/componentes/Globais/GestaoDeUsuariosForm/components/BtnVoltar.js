import React from "react";
import {useHistory} from "react-router-dom";
export const BtnVoltar = () => {
    let history = useHistory();
    return (
        <button
            onClick={() => {
                history.push('/gestao-de-usuarios-list')
            }}
            className="btn btn btn-outline-success mt-2 mr-2"
        >
            Voltar
        </button>
    )
}
