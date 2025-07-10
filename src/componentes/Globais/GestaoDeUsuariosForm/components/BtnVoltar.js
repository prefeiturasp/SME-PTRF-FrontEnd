import React from "react";
import { useNavigate } from 'react-router-dom';

export const BtnVoltar = () => {
    let navigate = useNavigate();
    return (
        <button
            onClick={() => {
                navigate('/gestao-de-usuarios-list')
            }}
            className="btn btn btn-outline-success mt-2 mr-2"
        >
            Voltar
        </button>
    )
}
