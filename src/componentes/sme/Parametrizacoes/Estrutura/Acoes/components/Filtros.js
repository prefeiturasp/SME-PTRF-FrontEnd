import React from "react";
import { useAcoesContext } from "../hooks/useAcoesContext";

export const Filtros = () => {
    const {
        draftFilters,
        handleChangeFiltros,
        handleSubmitFiltros,
        limpaFiltros
    } = useAcoesContext();

    return (
        <form>
            <div className="form-row align-items-end">
                <div className="form-group col">
                    <label htmlFor="filtrar_por_nome">Filtrar por nome da ação</label>
                    <input
                        value={draftFilters.filtrar_por_nome}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name="filtrar_por_nome"
                        id="filtrar_por_nome"
                        type="text"
                        className="form-control"
                        placeholder="Escreva o nome da ação"
                    />
                </div>

                <div className="form-group col-auto d-flex">
                    <button 
                        onClick={() => limpaFiltros()} 
                        type="button" 
                        className="btn btn-outline-success mr-2"
                    >
                        Limpar
                    </button>
                    <button 
                        onClick={handleSubmitFiltros} 
                        type="button" 
                        className="btn btn-success"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </form>
    );
};
