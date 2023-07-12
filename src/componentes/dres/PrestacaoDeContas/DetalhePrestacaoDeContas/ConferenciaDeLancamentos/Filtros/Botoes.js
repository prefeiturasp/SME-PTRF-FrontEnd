import React from "react";

export const Botoes = ({setBtnMaisFiltros, btnMaisFiltros, limpaFiltros, handleSubmitFiltros}) => {
    return(
        <>
            <button
                type="button"
                onClick={() => setBtnMaisFiltros(!btnMaisFiltros)}
                className="btn btn-outline-success mt-2"
            >
                {btnMaisFiltros ? 'Menos filtros' : 'Mais Filtros'}
            </button>
            <button onClick={() => limpaFiltros()} type="button"
                    className="btn btn-success ml-md-2 mt-2">Limpar
            </button>
            <button onClick={() => handleSubmitFiltros()} type="button"
                    className="btn btn-success ml-md-2 mt-2">Filtrar
            </button>
        </>
    )

}