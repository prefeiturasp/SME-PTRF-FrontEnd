import React, {useCallback, useEffect, useMemo, useState} from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";

import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import { useGetTiposDeCredito } from './hooks/useGetTiposDeCredito';
import { getTiposDeCredito, getFiltrosTiposDeCredito } from '../../../../../services/sme/Parametrizacoes.service';

export const TiposDeCredito = () => {
  const initialFilter = {
    nome: '',
    tipo: '',
    classificacao: '',
    tipo_de_conta: '',
    uso_associacao: '',
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [firstPage, setFirstPage] = useState(1);
  const [filter, setFilter] = useState(initialFilter);
  const [dadosDosFiltros, setDadosDosFiltros] = useState({});

  const [tiposDeCredito, setTiposDeCredito] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchFiltrosTiposDeCredito();
    fetchTiposDeCredito(initialFilter, 1);
  }, []);

  const fetchTiposDeCredito = async (filter, currentPage) => {
    try {
        const response = await getTiposDeCredito(filter, currentPage);
        setTiposDeCredito(response.results);
        setCount(response.count);
        console.log("RESPONSE: ", filter ,response)
        setIsLoading(false);
        return response;
    } catch (error) {
        console.error("Erro ao buscar tipos de crédito:", error);
        setTiposDeCredito([]);
        setIsLoading(false);
        return null;
    }
  };

  const fetchFiltrosTiposDeCredito = async () => {
    try {
        const response = await getFiltrosTiposDeCredito();
        console.log("RESPONSE: ", response)
        setDadosDosFiltros(response);
        return response;
    } catch (error) {
        console.error("Erro ao buscar filtros:", error);
        return null;
    }
  };

  const onPageChange = (event) => {
    setCurrentPage(event.page + 1)
    setFirstPage(event.first)
    fetchTiposDeCredito(filter, event.page + 1)
  };

  const handleSubmitFormFilter = (formFilter) => {
    fetchTiposDeCredito(filter, 1);
    setCurrentPage(1);
    setFirstPage(1);
    setFilter(formFilter);
  };

  const clearFormFilter = () => {
    setFilter(initialFilter);
    setFirstPage(0);
    setCurrentPage(1);
    fetchTiposDeCredito(initialFilter, 1);
  };

    return (
      <PaginasContainer>
          <h1 className="titulo-itens-painel mt-5">Tipos de crédito</h1>
          <div className="page-content-inner">
              <TopoComBotoes/>
              <Filtros 
                filter={filter}
                setFilter={setFilter}
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