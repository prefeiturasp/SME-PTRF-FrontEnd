import React, {useEffect, useState} from "react";
import { getDres } from "../../../../../../../services/sme/Parametrizacoes.service";

export const Filtros = ({filtros, onFilterChange, setFiltros, limpaFiltros}) => {
    const [dres, setDres] = useState([]);

    useEffect(() => {
        fetchDres()
    }, []);

    const handleChangeFiltros = (name, value) => {
        setFiltros({...filtros, [name]: value})
    };

    const handleLimpaFiltros = () => {
        limpaFiltros()
    }

    async function fetchDres() {
        const dres = await getDres()
        setDres(dres);
    }

    const handleFilter = (ev) => {
        ev.preventDefault(); 
        onFilterChange()
    }

    return(
        <>
            <form>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <label htmlFor="nome_ou_codigo">Buscar por nome ou código EOL da unidade</label>
                        <input
                            value={filtros.nome_ou_codigo}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="nome_ou_codigo"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o nome ou código que deseja procurar..."
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <label htmlFor="dre">Filtrar por DRE</label>
                        <select
                            value={filtros.dre}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="dre"
                            id="dre"
                            className="form-control"
                        >
                            <option value="">Selecione uma DRE</option>
                            {dres && dres.length > 0 && dres.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button onClick={handleLimpaFiltros} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button onClick={handleFilter} className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};
