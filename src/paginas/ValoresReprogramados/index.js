import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {ValoresReprogramados} from "../../componentes/ValoresReprogramados";


export const ValoresReprogramadosPage = () =>{

    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Cadastro de valores reprogramados</h1>
            <div className="page-content-inner">
                <ValoresReprogramados/>
            </div>
        </PaginasContainer>
    )

}