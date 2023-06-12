import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {DadosDaAsssociacao} from "../../../componentes/escolas/Associacao/DadosDaAssociacao";
import { TopoComBotoes } from "../../../componentes/escolas/Associacao/TopoComBotoes";


export const DadosDaAssociacaoPage = () =>{
    return (
        <PaginasContainer>
            <TopoComBotoes tituloPagina="Dados da Associação"/>
            <div className="page-content-inner">
                <DadosDaAsssociacao/>
            </div>
        </PaginasContainer>
    )
};