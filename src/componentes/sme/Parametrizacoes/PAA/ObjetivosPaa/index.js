import { ObjetivosPaaProvider } from "./context/index";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./TopoComBotoes";
import { Tabela } from "./Tabela";
import { Paginacao } from "./Paginacao";
import { Filtros } from "./Filtros";

export const ObjetivosPaa = () => {
    
    return (
        <ObjetivosPaaProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Objetivos</h1>
                <div className="page-content-inner">
                    <TopoComBotoes/>
                    <Filtros/>
                    <Tabela/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </ObjetivosPaaProvider>   
    )
}