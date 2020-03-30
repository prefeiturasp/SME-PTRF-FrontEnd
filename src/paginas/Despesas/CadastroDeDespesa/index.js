import React from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {Despesa} from "../../../componentes/Formularios/Despesa";

export const CadastroDeDespesa = () => {

    return (
        <PaginasContainer>

            <h1 className="titulo-itens-painel mt-5">Cadastro de Despesa</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <Despesa/>
            </div>
        </PaginasContainer>

    );
}