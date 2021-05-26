import React from "react";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {UrlsMenuInterno} from "./UrlsMenuInterno";
import {MenuInterno} from "../../../../Globais/MenuInterno";

export const Usuarios = () =>{
    return(
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Usuários</h1>
            <div className="page-content-inner">
                <MenuInterno
                    caminhos_menu_interno={UrlsMenuInterno}
                />
            </div>
        </PaginasContainer>
    )
}