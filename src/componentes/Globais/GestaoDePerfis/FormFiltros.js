import React from "react";

export const FormFiltros = ({stateFiltros, handleChangeFiltros, limpaFiltros, handleSubmitFiltros}) =>{
  return(
      <form onSubmit={handleSubmitFiltros} method="post">
          <div className="row mt-3">
              <div className="col">
                  <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                  <input
                      value={stateFiltros.filtrar_por_nome}
                      onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                      name='filtrar_por_nome'
                      type="text"
                      className="form-control"
                      placeholder="Escreva o termo que deseja filtrar"
                  />
              </div>

              <div className="col">
                  <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                  <input
                      value={stateFiltros.filtrar_por_grupo}
                      onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                      name='filtrar_por_grupo'
                      type="text"
                      className="form-control"
                      placeholder="Escreva o termo que deseja filtrar"
                  />
              </div>

              <div className="col-md-3 col-xl-2 text-right mt-4">
                  <button onClick={() => limpaFiltros()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                  <button type="submit" className="btn btn-success mt-2">Filtrar</button>
              </div>
          </div>


      </form>
  );
};