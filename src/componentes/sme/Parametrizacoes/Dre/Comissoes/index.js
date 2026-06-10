import React from "react";
 
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { Filtros } from "./components/Filtros";
import { Tabela } from "./components/Tabela";
import { ComissoesProvider } from "./context/Comissoes";
import { Paginacao } from "./components/Paginacao";
 
export const ParametrizacoesComissoes = () => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Comissões</h1>
 
      <div className="page-content-inner">
        <ComissoesProvider>
          <Filtros />

          <Tabela />
          
          <Paginacao />
        </ComissoesProvider>
      </div>
    </PaginasContainer>
  );
}