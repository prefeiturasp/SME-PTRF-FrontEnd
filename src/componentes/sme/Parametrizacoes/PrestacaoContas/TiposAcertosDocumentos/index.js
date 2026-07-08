import React from "react";
import { AcertosDocumentosProvider } from "./context/AcertosDocumentos";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import "../parametrizacoes-prestacao-contas.scss";

export const ParametrizacoesTiposAcertosDocumentos = () => {
  return (
    <AcertosDocumentosProvider>
      <PaginasContainer>
        <h1 className="titulo-itens-painel mt-5">Tipo de acertos em documentos</h1>
        <div className="page-content-inner">
          <AbasPorRecurso />

          <TopoComBotoes />
          <Filtros />
          <Lista />
        </div>
      </PaginasContainer>
    </AcertosDocumentosProvider>
  )
}