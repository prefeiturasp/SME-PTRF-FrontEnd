import React from "react";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";

export const ParametrizacoesDetalhesTiposCredito = () => {
  return (
    <PaginasContainer>
      <h1 className="titulo-itens-painel mt-5">Detalhes de tipos de crédito</h1>

      <div className="page-content-inner">
        <TopoComBotoes />
      </div>
    </PaginasContainer>
  );
}