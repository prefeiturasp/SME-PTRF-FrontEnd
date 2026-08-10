import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import ModalFormTags from "./components/ModalFormTags";
import { Filtros } from "./components/Filtros";
import TabelaTags from "./components/TabelaTags";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { TagsContextProvider } from "./context/TagsContext";

export const Tags = () => {
    return (
        <PaginasContainer>
            <TagsContextProvider>
                <h1 className="titulo-itens-painel mt-5">Etiquetas/Tags</h1>
                <div className="page-content-inner">
                    <AbasPorRecurso />
                    
                    <TopoComBotoes />
                    
                    <Filtros />
                    
                    <TabelaTags />
                    
                    <ModalFormTags />
                </div>
            </TagsContextProvider>
        </PaginasContainer>
    );
};
