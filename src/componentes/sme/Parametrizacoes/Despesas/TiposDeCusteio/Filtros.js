import React, { useState } from "react";
import { AutoComplete } from "primereact/autocomplete";
import { getAssociacoesPeloNome } from "../../../../../services/sme/Parametrizacoes.service";

export const Filtros = ({
  stateFiltros,
  setStateFilter,
  handleChangeFiltros,
  handleSubmitFiltros,
  limpaFiltros,
}) => {
  const [loading, setLoading] = useState(false);
  const [filteredAssociacoes, setFilteredAssociacoes] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const handleChangeFormFilter = (name, value) => {
    setStateFilter({
      ...stateFiltros,
      [name]: value,
    });
  };
  const searchAssociacao = (event) => {
    const query = event.query;
    handleChangeFormFilter("unidades__uuid", query);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newTimeout = setTimeout(() => {
      fetchAssociacoes(query);
    }, 2000);

    setDebounceTimeout(newTimeout);
  };

  const fetchAssociacoes = async (nomeBusca) => {
    if (!nomeBusca) return;
    setLoading(true);
    try {
      const response = await getAssociacoesPeloNome(nomeBusca);
      setFilteredAssociacoes(response);
    } catch (error) {
      console.error("Erro ao buscar associações:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form>
        <div className="form-row">
          <div className="form-group col-md-8">
            <label htmlFor="filtrar_por_nome">Filtrar por nome</label>
            <input
              value={stateFiltros.filtrar_por_nome}
              onChange={(e) =>
                handleChangeFiltros(e.target.name, e.target.value)
              }
              name="filtrar_por_nome"
              id="filtrar_por_nome"
              type="text"
              className="form-control"
              placeholder="Escreva o nome do tipo"
            />
          </div>
          <div className="form-group col-md-4">
            <label className="col-12" htmlFor="unidades__uuid">
              Uso associação
            </label>
            <AutoComplete
              className="col-12"
              value={stateFiltros.unidades__uuid}
              suggestions={filteredAssociacoes}
              completeMethod={searchAssociacao}
              field="unidade.nome_com_tipo"
              onChange={(e) =>
                handleChangeFormFilter("unidades__uuid", e.value)
              }
              inputClassName="form-control"
              inputStyle={{
                borderColor: "#d3d3d3",
                paddingLeft: "15px",
              }}
              placeholder="Digite e selecione"
            />
          </div>
        </div>
        <div className="d-flex  justify-content-end mt-n2">
          <button
            onClick={() => limpaFiltros()}
            type="button"
            className="btn btn btn-outline-success mr-2"
          >
            Limpar
          </button>
          <button
            onClick={handleSubmitFiltros}
            type="button"
            className="btn btn-success"
          >
            Filtrar
          </button>
        </div>
      </form>
    </>
  );
};
