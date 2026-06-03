import React from "react";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";

export const ParametrizacoesComissoes = () => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Comissões</h1>

      <div className="page-content-inner">
        <TopoComBotoes />
      </div>
    </PaginasContainer>
  );
}