import React from "react";
import "./style/gestao-de-usuarios.scss"
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {GestaoDeUsuariosMain} from "./components/GestaoDeUsuariosMain";
import {GestaoDeUsuariosProvider} from "./context/GestaoDeUsuariosProvider";

export const GestaoDeUsuarios = () =>{
    return (
        <GestaoDeUsuariosProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Gestão de usuários</h1>
                <div className="page-content-inner">
                    <GestaoDeUsuariosMain/>
                </div>
            </PaginasContainer>
        </GestaoDeUsuariosProvider>
    )
};