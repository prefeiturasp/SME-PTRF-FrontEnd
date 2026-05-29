import React from "react";
import '../parametrizacoes-estrutura.scss'

export const Filtros = ({ stateFiltros, handleChangeFiltros, handleSubmitFiltros, handleLimparFiltros }) => {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmitFiltros();
    };

    return (
            <form onSubmit={handleFormSubmit}>
                <div className="d-flex bd-highlight mt-2 mb-3">
                    <div className="p-Y d-flex flex-column flex-grow-1 bd-highlight mr-4">
                        <label htmlFor="filtro-nome">Filtre por tipo de conta</label>
                        <input
                            value={stateFiltros.nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="nome"
                            id="filtro-nome"
                            type="text"
                            className="form-control"
                            placeholder="Digite o tipo de conta..."
                            style={{ display: 'inline-block' }}
                        />
                    </div>
            
                    <div className="d-flex align-items-end p-Y bd-highlight">
                        <button
                            data-qa="btn-limpar-filtros"
                            onClick={handleLimparFiltros}
                            type="button"
                            className="btn btn btn-outline-success mr-2"
                            // disabled={!stateFiltros.nome}
                        >
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
    );
};
