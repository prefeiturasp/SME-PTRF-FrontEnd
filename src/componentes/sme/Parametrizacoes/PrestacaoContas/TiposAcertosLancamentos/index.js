import React from "react";
import { AcertosLancamentosProvider } from "./context/AcertosLancamentos";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import "../parametrizacoes-prestacao-contas.scss";

import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";

export const ParametrizacoesTiposAcertosLancamentos = () => {
  return (
    <AcertosLancamentosProvider>
      <PaginasContainer>
        <h1 className="titulo-itens-painel mt-5">Tipo de acertos em lançamentos</h1>
        <div className="page-content-inner">
          <AbasPorRecurso />

          <TopoComBotoes />
          <Filtros />
          <Lista />
        </div>
      </PaginasContainer>
    </AcertosLancamentosProvider>
  )
}
