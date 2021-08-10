import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) => {
    return (
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_cpf_cnpj">Filtrar por CNPJ</label>
                        <input
                            value={stateFiltros.filtrar_por_cpf_cnpj}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_cpf_cnpj'
                            id="filtrar_por_cpf_cnpj"
                            type="text"
                            className="form-control"
                            placeholder='Busque por CNPJ'
                        />
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_nome">Filtrar por razão social</label>
                        <input
                            value={stateFiltros.filtrar_por_nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder='Busque por nome'
                        />
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={() => limpaFiltros()} type="button" className="btn btn btn-outline-success mr-2">Limpar</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success">Filtrar</button>
                </div>
            </form>
        </>
    );
};