import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {Faq} from "../../../componentes/dres/ApoioDiretoria/Faq"


export const FaqDrePage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Perguntas Frequentes</h1>
            <div className="page-content-inner">
                <Faq/>
            </div>
        </PaginasContainer>
    )
};