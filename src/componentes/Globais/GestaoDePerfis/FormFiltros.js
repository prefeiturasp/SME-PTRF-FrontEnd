import React from "react";

export const FormFiltros = ({stateFiltros, handleChangeFiltros, limpaFiltros, handleSubmitFiltros, grupos}) =>{
  return(
      <form onSubmit={handleSubmitFiltros} method="post">
          <div className="row mt-3">
              <div className="col-auto">
                  <label htmlFor="filtrar_por_termo">Filtrar por nome ou nome de usuário</label>
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
                  <label htmlFor="filtrar_por_grupo">Filtrar por grupo</label>

                  <select
                      value={stateFiltros.filtrar_por_grupo}
                      onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                      name='filtrar_por_grupo'
                      id='filtrar_por_grupo'
                      className='form-control'
                  >
                      <option key='' value="">Selecione o tipo</option>
                      {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                          <option key={index} value={grupo.id}>{grupo.nome}</option>
                      ))}
                  </select>
              </div>
              <div className="col">
                  <label htmlFor="filtrar_por_grupo">Filtrar por tipo de usuário</label>

                  <select
                      value={stateFiltros.filtrar_tipo_de_usuario}
                      onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                      name='filtrar_tipo_de_usuario'
                      id='filtrar_tipo_de_usuario'
                      className='form-control'
                  >
                      <option value="">Filtrar por tipo de usuário</option>
                      <option value="True">Servidor</option>
                      <option value="False">Não Servidor</option>
                  </select>
              </div>

              <div className="col-auto text-right mt-4">
                  <button onClick={() => limpaFiltros()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                  <button type="submit" className="btn btn-success mt-2">Filtrar</button>
              </div>
          </div>
      </form>
  );
};