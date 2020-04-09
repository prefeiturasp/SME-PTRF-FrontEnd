import React from "react";

export const FormFiltrosAvancados = () =>{
    return (
      <>
          <form>
              <div className="form-row">
                  <div className="form-group col-md-6">
                      <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                      <input name="filtrar_por_termo" id="filtrar_por_termo" type="text" className="form-control" placeholder="Escreva o termo que deseja filtrar"/>
                  </div>
                  <div className="form-group col-md-6">
                      <label htmlFor="acao_associacao">Filtrar por ação</label>
                      <select name="acao_associacao" id="acao_associacao" className="form-control">
                          <option key={0} value={0}>Selecione uma ação</option>
                          <option>...</option>
                      </select>
                  </div>
                  <div className="form-group col-md-6">
                      <label htmlFor="acao_associacao">Filtrar por tipo de despesa</label>
                      <select name="acao_associacao" id="acao_associacao" className="form-control">
                          <option key={0} value={0}>Selecione uma ação</option>
                          <option>...</option>
                      </select>
                  </div>
                  <div className="form-group col-md-6">
                      <label htmlFor="acao_associacao">Filtrar por status</label>
                      <select name="acao_associacao" id="acao_associacao" className="form-control">
                          <option key={0} value={0}>Selecione uma ação</option>
                          <option>...</option>
                      </select>
                  </div>
              </div>

          </form>
      </>
    );
}