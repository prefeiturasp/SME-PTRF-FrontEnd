import React, {useContext, useEffect} from "react";
import {useParams} from "react-router-dom";
import {BarraTopoForm} from "./BarraTopoForm";
import {GestaoDeUsuariosFormContext} from "../context/GestaoDeUsuariosFormProvider";
import { UnidadesUsuarioProvider } from "../context/UnidadesUsuarioProvider";
import {FormUsuario} from "./FormUsuario";
import { UnidadesUsuario } from "./UnidadesUsuario";
import {useUsuario} from "../hooks/useUsuario";

export const GestaoDeUsuariosFormMain = () => {
    const {id_usuario} = useParams();
    const { setModo, Modos, setUsuarioId, visaoBase} = useContext(GestaoDeUsuariosFormContext)
    const { data: usuario, isLoading } = useUsuario(id_usuario);

    useEffect(() => {
        setUsuarioId(id_usuario);
        setModo(id_usuario ? Modos.EDIT : Modos.INSERT);
    }, [id_usuario, setUsuarioId, setModo, Modos]);

    return (
        <>
            <BarraTopoForm/>
            <FormUsuario usuario={usuario}/>

            {visaoBase !== 'UE' &&
                <UnidadesUsuarioProvider>
                    <UnidadesUsuario usuario={usuario}/>
                </UnidadesUsuarioProvider>
            }
            
            
        </>
    )
}
