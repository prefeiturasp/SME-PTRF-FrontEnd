import React from "react";

export const Filtros = ({
    stateFiltros, 
    handleChangeFiltros, 
    handleSubmitFiltros, 
    limpaFiltros
}) => {
    return (
        <>
            <div className="mb-4">
                <h4 className="font-weight-bold mb-0">Refine sua busca</h4>
                <p>
                    Utilize o filtro por referência para localizar períodos específicos e monitorar as datas de cada etapa do recurso selecionado.
                </p>
            </div>

            <form>
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
                            className="btn btn btn-outline-success mr-2">
                            Limpar
                        </button>
                        
                        <button
                            data-qa="btn-filtrar"
                            onClick={handleSubmitFiltros}
                            type="button"
                            className="btn btn-success">
                            Filtrar
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};