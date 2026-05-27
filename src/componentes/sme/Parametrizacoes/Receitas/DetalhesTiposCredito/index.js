import React from "react";

import { DetalhesTipoCreditoProvider } from "./context/DetalhesTiposCredito";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { Filtros } from "./components/Filtros";
import { Lista } from "./components/Lista";

export const ParametrizacoesDetalhesTiposCredito = () => {
  return (
    <DetalhesTipoCreditoProvider>
      <PaginasContainer>
        <h1 className="titulo-itens-painel mt-5">Detalhes de tipos de crédito</h1>

        <div className="page-content-inner">
          <AbasPorRecurso />
          
          <TopoComBotoes />
          
          <Filtros />
          
          <Lista />
        </div>
      </PaginasContainer>
    </DetalhesTipoCreditoProvider>
  );
}