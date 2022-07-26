import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) =>{
    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_lancamento">Filtrar por tipo de acerto</label>
                        <input
                            value={stateFiltros.filtrar_por_lancamento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder="Selecione um tipo"
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_nome_cod_eol">Filtrar por reabertura de lançamentos</label>
                        <input
                            value={stateFiltros.filtrar_por_nome_cod_eol}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder="Selecione um dos status"
                        />
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};