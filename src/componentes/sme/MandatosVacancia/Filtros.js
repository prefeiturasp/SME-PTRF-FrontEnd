import React from "react";

export const Filtros = ({ stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros }) => {
    return (
        <form>
            <div className="form-row Filtros">
                <div className="form-group col-md-12">
                    <label htmlFor="filtrar_por_referencia">Filtrar por referência</label>
                    <input
                        data-qa="campo-filtrar-por-referencia-mandato-vacancia"
                        value={stateFiltros.filtrar_por_referencia}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name="filtrar_por_referencia"
                        id="filtrar_por_referencia"
                        type="text"
                        className="form-control"
                        placeholder="Escreva a referência do mandato"
                    />
                </div>
            </div>
            <div className="d-flex justify-content-end mt-n2">
                <button
                    data-qa="botao-limpar-filtros-mandato-vacancia"
                    onClick={() => limpaFiltros()}
                    type="button"
                    className="btn btn btn-outline-success mr-2"
                >
                    Limpar
                </button>
                <button
                    data-qa="botao-filtrar-mandato-vacancia"
                    onClick={handleSubmitFiltros}
                    type="button"
                    className="btn btn-success"
                >
                    Filtrar
                </button>
            </div>
        </form>
    );
};
