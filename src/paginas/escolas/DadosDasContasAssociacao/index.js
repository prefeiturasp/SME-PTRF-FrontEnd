import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {DadosDasContas} from "../../../componentes/escolas/Associacao/DadosDasContas";


export const DadosDasContasPage = () =>{
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Dados das contas</h1>
            <div className="page-content-inner">
                <DadosDasContas/>
            </div>
        </PaginasContainer>
    )
};