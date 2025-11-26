import { OutrosRecursosPaaProvider } from "./context/index";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./TopoComBotoes";
import { Tabela } from "./Tabela";
import { Paginacao } from "./Paginacao";
import { Filtros } from "./Filtros";

export const OutrosRecursos = () => {
    
    return (
        <OutrosRecursosPaaProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Outros Recursos</h1>
                <div className="page-content-inner">
                    <TopoComBotoes/>
                    <Filtros/>
                    <Tabela/>
                    <Paginacao/>
                </div>
            </PaginasContainer>
        </OutrosRecursosPaaProvider>   
    )
}