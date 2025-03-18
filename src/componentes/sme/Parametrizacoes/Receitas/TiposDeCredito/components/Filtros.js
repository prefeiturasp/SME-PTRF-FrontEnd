import React, {useEffect, useState} from "react";

export const Filtros = ({filter, setFilter, handleSubmitFormFilter, clearFormFilter, dadosDosFiltros}) => {

    useEffect(() => {
      console.log("dadosDosFiltros", dadosDosFiltros)
    }, [dadosDosFiltros]);

    const handleChangeFormFilter = (name, value) => {
        setFilter({
            ...filter,
            [name]: value
        });
    };

    return (
        <>
            <div className="d-flex flex-column bd-highlight my-3 pl-2">
              <div className="row">
                <form className="col-4">
                  <label htmlFor="nome">Filtrar por nome de crédito</label>
                  <input
                    value={filter.nome}
                    onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                    name="nome"
                    id="nome"
                    type="text"
                    className="form-control"
                    placeholder="Busque pelo nome do crédito"
                  />
                </form>

                <form className="col-4">
                  <label htmlFor="tipo">Filtrar por tipo</label>
                  <input
                    value={filter.tipo}
                    onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                    name="tipo"
                    id="tipo"
                    type="text"
                    className="form-control"
                    placeholder="Selecione"
                  />
                </form>

                <form className="col-4">
                  <label htmlFor="classificacao">Filtrar por classificação</label>
                  <input
                    value={filter.classificacao}
                    onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                    name="classificacao"
                    id="classificacao"
                    type="text"
                    className="form-control"
                    placeholder="Selecione"
                  />
                </form>
              </div>

              <div className="row align-items-end mt-3">
                <div className="col-4">
                  <label htmlFor="filtrar_por_tipo_de_conta">Filtrar por tipo de conta</label>
                    <select
                        value={filter.tipo_conta}
                        onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                        name='filtrar_por_tipo_de_conta'
                        id="filtrar_por_tipo_de_conta"
                        className="form-control"
                    >
                        <option value=''>Selecione</option>
                        {dadosDosFiltros && dadosDosFiltros.tipos_contas && dadosDosFiltros.tipos_contas > 0 && dadosDosFiltros.tipos_contas.map(item => (
                            <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                        ))}
                    </select>
                </div>

                <form className="col-4">
                  <label htmlFor="outroFiltro2">Uso associação</label>
                  <input
                    value={filter.uso_associacao}
                    onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                    name="outroFiltro2"
                    id="outroFiltro2"
                    type="text"
                    className="form-control"
                    placeholder="Selecione"
                  />
                </form>

                <div className="col-4 text-end">
                  <div className="d-flex gap-2 justify-content-end">
                    <button onClick={() => clearFormFilter()} className="btn btn-outline-success mr-2">
                      Limpar
                    </button>
                    <button onClick={() => handleSubmitFormFilter(filter)} className="btn btn-success">
                      Filtrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </>
    )
}