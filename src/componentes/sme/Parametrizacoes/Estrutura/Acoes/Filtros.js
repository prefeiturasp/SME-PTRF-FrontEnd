import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) =>{
    return(
        <>
            <form onSubmit={handleSubmitFiltros}>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="filtrar_por_nome">Filtrar por nome da ação</label>
                        <input
                            value={stateFiltros.filtrar_por_nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da ação'
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