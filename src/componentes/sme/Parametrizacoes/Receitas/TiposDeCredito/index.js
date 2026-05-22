import React, {useEffect, useState} from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";

import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import { AbasPorRecurso } from "../../componentes/AbasPorRecurso";
import { useGetTiposCredito } from "./hooks/useGetTiposCredito";
import { useAbasPorRecursoContext } from "../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useGetFiltrosTiposReceita } from "../TiposReceita/hooks/useGetFiltrosTiposReceita";

export const TiposDeCredito = () => {
  const { selectedRecurso } = useAbasPorRecursoContext();

  const initialFilter = {
    nome: '',
    tipo: '',
    classificacao: '',
    tipos_conta__uuid: '',
    unidades__uuid: '',
    recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null,
  };

  const [draftFilters, setDraftFilters] = useState(initialFilter);
  const [appliedFilters, setAppliedFilters] = useState(initialFilter);

  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(1);

  const { data: dadosDosFiltros } = useGetFiltrosTiposReceita({recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null, });
  const { results: tiposDeCredito, count, isLoading } = useGetTiposCredito({ filters: appliedFilters, currentPage });

  useEffect(() => {
    const initalFilterWithRecurso = { ...initialFilter, recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null };

    setDraftFilters(initalFilterWithRecurso)
    setAppliedFilters(initalFilterWithRecurso);
  }, [selectedRecurso?.uuid]);

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1)
    setFirstPage(event.first)
  };

  const handleSubmitFormFilter = () => {
    setCurrentPage(1);
    setFirstPage(1);

    setAppliedFilters(draftFilters);
  };

  const clearFormFilter = () => {
    setDraftFilters(initialFilter);
    setAppliedFilters(initialFilter);

    setFirstPage(0);
    setCurrentPage(1);
  };

    return (
      <PaginasContainer>
          <h1 className="titulo-itens-painel mt-5">Tipos de crédito</h1>
          <div className="page-content-inner">
              <AbasPorRecurso />

              <TopoComBotoes />

              <Filtros 
                filter={draftFilters}
                setFilter={setDraftFilters}
                handleSubmitFormFilter={handleSubmitFormFilter}
                clearFormFilter={clearFormFilter}
                dadosDosFiltros={dadosDosFiltros}
              />

              <Lista
                isLoading={isLoading}
                tiposDeCredito={tiposDeCredito}
                count={count}
                firstPage={firstPage}
                onPageChange={onPageChange}
              />
          </div>
      </PaginasContainer>
    )
}