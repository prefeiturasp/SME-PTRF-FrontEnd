import React, {useContext, useState} from "react";
import { MotivosEstornoContext } from "./context/MotivosEstorno";

export const Filtros = () => {

    const {setFilter, initialFilter} = useContext(MotivosEstornoContext);
    const [formFilter, setFormFilter] = useState(initialFilter);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = () => {
        setFilter(formFilter);
    };

    const clearFilter = () => {
        setFormFilter(initialFilter);
        setFilter(initialFilter);
    };
    
    if(!formFilter) return null;
    
    return (
        <>
            <div className="d-flex bd-highlight align-items-end mt-2">
                <div className="p-2 flex-grow-1 bd-highlight">
                    <form>
                        <label htmlFor="motivo">Filtrar por nome</label>
                        <input
                            value={formFilter.motivo}
                            onChange={(e) => {handleChangeFormFilter(e.target.name, e.target.value)}}
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