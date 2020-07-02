import React from "react";
import {PaginasContainer} from "../PaginasContainer";
import {DadosDasContas} from "../../componentes/Associacao/DadosDasContas";


export const DadosDasContasPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Membros</h1>
            <div className="page-content-inner">
                <DadosDasContas/>
            </div>
        </PaginasContainer>
    )
};