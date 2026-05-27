import React, { useState, useEffect } from "react";
import { useDetalhesTiposCreditoContext } from "../hooks/useDetalhesTiposCreditoContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const Filtros = () => {

  const {
    setFilter, 
    initialFilter
  } = useDetalhesTiposCreditoContext();
  const { selectedRecurso } = useAbasPorRecursoContext();
  const [formFilter, setFormFilter] = useState(initialFilter);

  useEffect(() => {
    setFormFilter(initialFilter);
  }, [selectedRecurso?.uuid]);

  const handleChangeFormFilter = (name, value) => {
    setFormFilter({
      ...formFilter,
      [name]: value
    });
  };

  const handleSubmitFormFilter = () => {
    setFilter(prevState => ({
      ...formFilter,
      recurso_uuid: prevState.recurso_uuid
    }));
  };

  const clearFilter = () => {
    setFormFilter(initialFilter);
    setFilter(prevState => ({
      ...initialFilter,
      recurso_uuid: prevState.recurso_uuid
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    handleSubmitFormFilter()
  }
  
  return (
    <div className="d-flex bd-highlight align-items-end mt-2 mb-4">
      <div className="flex-grow-1 bd-highlight mr-4">
        <form onSubmit={handleSubmitForm} id="form-filtros-detalhes-tipos-credito" data-qa="form-filtros-detalhes-tipos-credito">
          <label htmlFor="nome">Filtrar por detalhe de tipo de crédito</label>
          <input
              value={formFilter.nome}
              onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
              name='nome'
              id="nome"
              type="text"
              className="form-control"
              placeholder='Busque por detalhe de tipo de crédito'
          />
        </form>
      </div>
      <div className="bd-highlight d-flex align-items-end">
        <button
          type="button"
          onClick={clearFilter}
          className="btn btn-outline-success mr-2"
        >
          Limpar
        </button>

        <button
          type="submit"
          form="form-filtros-detalhes-tipos-credito"
          className="btn btn-success"
        >
          Filtrar
        </button>
      </div>
    </div>
  )
}