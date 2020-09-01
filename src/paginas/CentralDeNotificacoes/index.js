import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {CentralDeNotificacoes} from "../../componentes/Globais/CentralDeNotificacoes";


export const CentralDeNotificacoesPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Notificações</h1>
            <div className="page-content-inner">
                <CentralDeNotificacoes/>
            </div>
        </PaginasContainer>
    )
};