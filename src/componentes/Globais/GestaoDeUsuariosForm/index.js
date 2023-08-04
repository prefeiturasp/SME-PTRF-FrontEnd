import React from "react";
import "./style/gestao-de-usuarios-form.scss"
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import {GestaoDeUsuariosFormProvider} from "./context/GestaoDeUsuariosFormProvider";
import {GestaoDeUsuariosFormMain} from "./components/GestaoDeUsuariosFormMain";

export const GestaoDeUsuariosFormPage = () =>{
    return (
        <GestaoDeUsuariosFormProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Gestão de usuários</h1>
                <div className="page-content-inner">
                    <GestaoDeUsuariosFormMain/>
                </div>
            </PaginasContainer>
        </GestaoDeUsuariosFormProvider>
    )
};