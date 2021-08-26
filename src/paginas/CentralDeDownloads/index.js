import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import { CentralDeDownloads } from "../../componentes/Globais/CentralDeDownloads";

export const CentralDeDownloadsPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Central de downloads</h1>
            <div className="page-content-inner">
                <CentralDeDownloads/>
            </div>
        </PaginasContainer>
    )
};