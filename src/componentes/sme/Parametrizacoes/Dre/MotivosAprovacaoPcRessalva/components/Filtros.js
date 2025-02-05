import React, {useContext, useState} from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(MotivosAprovacaoPcRessalvaContext)
    const [formFilter, setFormFilter] = useState(initialFilter);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFilter(formFilter);
    };

    const clearFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFormFilter(initialFilter);
        setFilter(initialFilter);
    };
    
    return (
        <>
            <div className="d-flex bd-highlight align-items-end mt-2">
                <div className="p-2 flex-grow-1 bd-highlight">
                    <form>
                        <label htmlFor="motivo">Filtrar por motivo de aprovação de PC com ressalvas</label>
                        <input
                            value={formFilter.motivo}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='motivo'
                            id="motivo"
                            type="text"
                            className="form-control"
                            placeholder='Busque por motivo'
                        />
                    </form>
                </div>
                <div className="pt-2 pb-2 pr-0 pl-2 bd-highlight">
                    <button
                        onClick={clearFilter}
                        className="btn btn-outline-success"
                    >
                        Limpar
                    </button>
                </div>
                <div className="p-2 bd-highlight">
                    <button
                        onClick={handleSubmitFormFilter}
                        className="btn btn-success"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </>
    )
}