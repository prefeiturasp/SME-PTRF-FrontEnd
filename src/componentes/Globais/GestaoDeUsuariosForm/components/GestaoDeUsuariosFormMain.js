import React, {useContext} from "react";
import {useParams} from "react-router-dom";
import {BarraTopoForm} from "./BarraTopoForm";
import {GestaoDeUsuariosFormContext} from "../context/GestaoDeUsuariosFormProvider";
import {FormUsuario} from "./FormUsuario";
import {useUsuario} from "../hooks/useUsuario";

export const GestaoDeUsuariosFormMain = () => {
    const {id_usuario} = useParams();
    const { setModo, Modos, setUsuarioId} = useContext(GestaoDeUsuariosFormContext)

    setUsuarioId(id_usuario)
    setModo(id_usuario ? Modos.EDIT : Modos.INSERT)


    const { data: usuario, isLoading } = useUsuario(id_usuario);


    return (
        <>
            <BarraTopoForm/>
            <FormUsuario usuario={usuario}/>
            <p>Id do usuário: {id_usuario}</p>
        </>
    )
}
