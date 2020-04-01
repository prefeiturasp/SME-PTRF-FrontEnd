import React, {useEffect, useContext} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {ListaDeReceitas} from "../../../componentes/Receitas/ListaDeReceitas";

export const ListaDeReceitasPage = () => {


    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Cadastro de Despesa</h1>
            <div className="page-content-inner ">
                <h2 className="subtitulo-itens-painel">Dados do documento</h2>
                <ListaDeReceitas/>

            </div>
        </PaginasContainer>

    );
}