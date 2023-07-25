import React from "react";
import "./style/gestao-de-usuarios-list.scss"
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {GestaoDeUsuariosListMain} from "./components/GestaoDeUsuariosListMain";
import {GestaoDeUsuariosListProvider} from "./context/GestaoDeUsuariosListProvider";

export const GestaoDeUsuariosListPage = () =>{
    return (
        <GestaoDeUsuariosListProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Gestão de usuários</h1>
                <div className="page-content-inner">
                    <GestaoDeUsuariosListMain/>
                </div>
            </PaginasContainer>
        </GestaoDeUsuariosListProvider>
    )
};
