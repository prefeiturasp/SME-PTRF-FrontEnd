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
  const ROWS_PER_PAGE = 10;
  const { selectedRecurso } = useAbasPorRecursoContext();

  const initialFilter = {
    nome: '',
    tipo: '',
    classificacao: '',
    tipos_conta__uuid: '',
    unidades__uuid: '',
    recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null,
    currentPage: 1,
  };

  const [draftFilters, setDraftFilters] = useState(initialFilter);
  const [appliedFilters, setAppliedFilters] = useState(initialFilter);

  const { data: dadosDosFiltros } = useGetFiltrosTiposReceita({recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null, });
  const { results: tiposDeCredito, count, isLoading } = useGetTiposCredito({ filters: appliedFilters });

  const fisrtPage = (appliedFilters.currentPage - 1) * ROWS_PER_PAGE;

  useEffect(() => {
    const initalFilterWithRecurso = { ...initialFilter, currentPage: 1, recurso_uuid: selectedRecurso ? selectedRecurso.uuid : null };

    setDraftFilters(initalFilterWithRecurso)
    setAppliedFilters(initalFilterWithRecurso);
  }, [selectedRecurso?.uuid]);

  const changePageFilters = (currentPage) => {
    setAppliedFilters((prevState) => ({...prevState, currentPage}));
  }

  const onPageChange = (event) => {
    const currentPage = event.page + 1;
    changePageFilters(currentPage);
  };

  const handleSubmitFormFilter = () => {
    setAppliedFilters(draftFilters);
  };

  const clearFormFilter = () => {
    setDraftFilters(initialFilter);
    setAppliedFilters(initialFilter);
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
                firstPage={fisrtPage}
                onPageChange={onPageChange}
                rowsPerPage={ROWS_PER_PAGE}
              />
          </div>
      </PaginasContainer>
    )
}