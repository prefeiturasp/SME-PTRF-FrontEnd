import React, {useEffect, useState} from "react";
import { PaginasContainer } from "../../../../../paginas/PaginasContainer";

import { TopoComBotoes } from "./components/TopoComBotoes";
import { Lista } from "./components/Lista";
import { Filtros } from "./components/Filtros";
import { getTiposDeCredito, getFiltrosTiposDeCredito } from '../../../../../services/sme/Parametrizacoes.service';

export const TiposDeCredito = () => {
  const initialFilter = {
    nome: '',
    tipo: '',
    classificacao: '',
    tipos_conta__uuid: '',
    unidades__uuid: '',
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

  const tratarFiltros = (valoresFiltros) => {
    const { e_repasse, e_estorno, e_devolucao, e_rendimento, tipo, unidades__uuid, classificacao, ...restoFiltros } = valoresFiltros;

    let filtrosTratados = { ...restoFiltros };

    if (unidades__uuid && typeof unidades__uuid === "object" && Object.keys(unidades__uuid).length > 0 && unidades__uuid.uuid) {
        filtrosTratados.unidades__uuid = unidades__uuid.uuid;
    }

    if (tipo === "e_repasse") {
        filtrosTratados.e_repasse = 1;
    } else if (tipo === "e_estorno") {
        filtrosTratados.e_estorno = 1;
    } else if (tipo === "e_devolucao") {
        filtrosTratados.e_devolucao = 1;
    } else if (tipo === "e_rendimento") {
        filtrosTratados.e_rendimento = 1;
    }

    if (classificacao === "aceita_capital") {
      filtrosTratados.aceita_capital = 1;
    } else if (classificacao === "aceita_custeio") {
      filtrosTratados.aceita_custeio = 1;
    } else if (classificacao === "aceita_livre") {
      filtrosTratados.aceita_livre = 1;
    }

    return filtrosTratados;
  };


  const fetchTiposDeCredito = async (filter, currentPage) => {
    let filtrosParaBusca = tratarFiltros(filter);

    filtrosParaBusca.uso_associacao = 0;

    try {
        const response = await getTiposDeCredito(filtrosParaBusca, currentPage);
        setTiposDeCredito(response.results);
        setCount(response.count);
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