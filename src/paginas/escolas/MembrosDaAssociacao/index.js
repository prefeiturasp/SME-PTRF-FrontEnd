import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {MembrosDaAssociacao} from "../../../componentes/escolas/Associacao/Membros";
import { TopoComBotoes } from "../../../componentes/escolas/Associacao/TopoComBotoes";


export const MembrosDaAssociacaoPage = () =>{
    return (
        <PaginasContainer>
            <TopoComBotoes tituloPagina="Membros"/>
            <div className="page-content-inner">
                <MembrosDaAssociacao/>
            </div>
        </PaginasContainer>
    )
};