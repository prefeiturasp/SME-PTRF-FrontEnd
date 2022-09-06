import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) => {
    return (
        <>
            <form>
                <div className="d-flex bd-highlight mt-2 mb-3">
                    <div className="p-Y flex-grow-1 bd-highlight">
                        <span className='mr-5'><label htmlFor="filtrar_por_referencia">Pesquisar</label></span>
                        <input
                            value={stateFiltros.filtrar_por_referencia}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_referencia'
                            id="filtrar_por_referencia"
                            type="text"
                            className="form-control w-75"
                            placeholder='Busque por referência'
                            style={{display: 'inline-block'}}
                        />

                    </div>
                    <div className="p-Y bd-highlight">
                        <button onClick={() => limpaFiltros()} type="button" className="btn btn btn-outline-success mr-2">Limpar</button>
                    </div>
                    <div className="p-Y bd-highlight">
                        <button onClick={handleSubmitFiltros} type="button" className="btn btn-success">Filtrar</button>
                    </div>
                </div>
            </form>
        </>
    );
};