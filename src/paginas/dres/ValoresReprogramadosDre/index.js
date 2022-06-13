import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import { ValoresReprogramadosDre } from "../../../componentes/dres/ValoresReprogramadosDre";

export const ValoresReprogramadosDrePage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Valores reprogramados</h1>
            <div className="page-content-inner">
                <ValoresReprogramadosDre/>
            </div>
        </PaginasContainer>
    )
};