import React from "react";
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {GestaoDeUsuariosMain} from "./GestaoDeUsuariosMain";

export const GestaoDeUsuarios = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Gestão de usuários</h1>
            <div className="page-content-inner">
                <GestaoDeUsuariosMain/>
            </div>
        </PaginasContainer>
    )
};