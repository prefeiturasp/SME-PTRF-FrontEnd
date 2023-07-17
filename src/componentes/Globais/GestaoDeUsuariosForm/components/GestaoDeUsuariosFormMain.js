import React from "react";
import {useParams} from "react-router-dom";

export const GestaoDeUsuariosFormMain = () => {
    let {id_usuario} = useParams();
    return (
        <>
            <p>Formulário de usuários.</p>
            <p>Id do usuário: {id_usuario}</p>
        </>
    )
}