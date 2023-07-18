import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import '../parametrizacoes-estrutura.scss'

export const Filtros = ({ stateFiltros, handleChangeFiltros, handleSubmitFiltros }) => {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        handleSubmitFiltros();
    };

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div className="d-flex bd-highlight mt-2 mb-3">
                    <div className="p-2 pt-3 flex-grow bd-highlight">
                        <label htmlFor="filtro-nome">Pesquisar</label>
                    </div>
                    <div className="p-2 flex-grow-1 bd-highlight">
                        <input
                            value={stateFiltros.nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="nome"
                            id="filtro-nome"
                            type="text"
                            className="form-control"
                            placeholder="Busque por tipos de conta"
                            style={{ display: 'inline-block' }}
                        />
                    </div>
                    <div className="p-2 bd-highlight">
                        <button className="btn-pesquisar-tipos-conta" type="submit">
                            <FontAwesomeIcon
                                style={{ fontSize: '20px', marginTop: "8px", color: "#42474A" }}
                                icon={faSearch}
                            />
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};
