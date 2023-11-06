import React from "react";
import "./style/gestao-usuarios-adicionar-unidade.scss"
import {PaginasContainer} from "../../../paginas/PaginasContainer";
import { GestaoDeUsuariosAdicionarUnidadeProvider } from "./context/GestaoUsuariosAdicionarUnidadeProvider";
import { TopoComBotao } from "./components/TopoComBotao";
import { FiltroDeUnidades } from "./components/FiltroDeUnidades";
import { ListaDeUnidades } from "./components/ListaDeUnidades";

export const GestaoDeUsuariosAdicionarUnidadePage = () =>{
    return (
        <GestaoDeUsuariosAdicionarUnidadeProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Gestão de usuários</h1>
                <div className="page-content-inner">
                    <TopoComBotao/>
                    <FiltroDeUnidades/>
                    <ListaDeUnidades/>
                </div>
            </PaginasContainer>
        </GestaoDeUsuariosAdicionarUnidadeProvider>
    )
};