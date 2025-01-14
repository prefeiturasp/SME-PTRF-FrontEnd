import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) => {
    return (
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-12">
                        <label htmlFor="filtrar_por_nome">Filtrar por nome</label>
                        <input
                            data-qa="campo-filtrar-por-nome-tipo-documento"
                            value={stateFiltros.filtrar_por_nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome do tipo'
                        />
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button
                        data-qa="botao-limpar-filtros-tipo-documento"
                        onClick={() => limpaFiltros()} type="button" className="btn btn btn-outline-success mr-2">Limpar</button>
                    <button
                        data-qa="botao-filtrar-tipo-documento"
                        onClick={handleSubmitFiltros} type="button" className="btn btn-success">Filtrar</button>
                </div>
            </form>
        </>
    );
};
