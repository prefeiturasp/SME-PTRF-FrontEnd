import React, {useContext} from "react";
import {useParams} from "react-router-dom";
import {BarraTopoForm} from "./BarraTopoForm";
import {GestaoDeUsuariosFormContext} from "../context/GestaoDeUsuariosFormProvider";

export const GestaoDeUsuariosFormMain = () => {
    const { setModo, Modos} = useContext(GestaoDeUsuariosFormContext)

    const {id_usuario} = useParams();

    setModo(id_usuario ? Modos.EDIT : Modos.INSERT)

    return (
        <>
            <BarraTopoForm/>
            <p>Formulário de usuários.</p>
            <p>Id do usuário: {id_usuario}</p>
        </>
    )
}
