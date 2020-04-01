import React, {useEffect, useContext} from "react";
import {PaginasContainer} from "../../PaginasContainer";
import {ListaDeReceitas} from "../../../componentes/Receitas/ListaDeReceitas";

export const ListaDeReceitasPage = () => {


    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Créditos recebidos</h1>
            <div className="page-content-inner ">
                <ListaDeReceitas/>
            </div>
        </PaginasContainer>

    );
}