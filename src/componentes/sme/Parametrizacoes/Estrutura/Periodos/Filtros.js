import React from "react";

export const Filtros = ({
    stateFiltros, 
    handleChangeFiltros, 
    handleSubmitFiltros, 
    limpaFiltros
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();

        handleSubmitFiltros();
    }

    return (
        <form onSubmit={handleSubmit} id="form-filtros-periodos">
            <div className="d-flex bd-highlight mt-2 mb-3">
                <div className="p-Y d-flex flex-column flex-grow-1 bd-highlight mr-4">
                    <label htmlFor="filtrar_por_referencia">Filtre por referência</label>
                    <input
                        data-qa="input-filtro-referencia"
                        value={stateFiltros.filtrar_por_referencia}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_referencia'
                        id="filtrar_por_referencia"
                        type="text"
                        className="form-control"
                        placeholder='Busque por referência'
                        style={{display: 'inline-block'}}
                    />

                </div>
                <div className="d-flex align-items-end p-Y bd-highlight">
                    <button
                        data-qa="btn-limpar-filtros"
                        onClick={() => limpaFiltros()}
                        type="button"
                        className="btn btn btn-outline-success mr-2"
                    >
                        Limpar
                    </button>
                    
                    <button
                        data-qa="btn-filtrar"
                        type="submit"
                        className="btn btn-success"
                        form="form-filtros-periodos"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </form>
    );
};