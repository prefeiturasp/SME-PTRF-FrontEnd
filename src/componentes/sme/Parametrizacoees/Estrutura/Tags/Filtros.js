import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros}) => {
    return (
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-8">
                        <label htmlFor="filtrar_por_nome">Filtrar por etiqueta/tag</label>
                        <input
                            value={stateFiltros.filtrar_por_nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da etiqueta/tag'
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_status'
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            <option value=''>Selecione o status</option>
                            <option value='ATIVO'>Ativo</option>
                            <option value='INATIVO'>Inativo</option>
                        </select>
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