import React from "react";
import {useGruposAcesso} from "./hooks/useGruposAcesso";
import {GruposAcessoInfo} from "./GruposAcessoInfo";

export const GestaoDeUsuariosMain = () => {
    const { data: grupos } = useGruposAcesso();
    return (
        <>
            <p>Faça a gestão dos seus usuários e determine seus perfis atrelando-os aos grupos de acesso.</p>
            <GruposAcessoInfo grupos={grupos}/>
        </>
    )
}