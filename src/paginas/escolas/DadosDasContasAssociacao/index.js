import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {DadosDasContas} from "../../../componentes/escolas/Associacao/DadosDasContas";
import { TopoComBotoes } from "../../../componentes/escolas/Associacao/TopoComBotoes";


export const DadosDasContasPage = () =>{
    return (
        <PaginasContainer>
            <TopoComBotoes tituloPagina="Dados das contas"/>
            <div className="page-content-inner">
                <DadosDasContas/>
            </div>
        </PaginasContainer>
    )
};