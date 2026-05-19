import React, {useContext, useState, useEffect} from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(MotivosAprovacaoPcRessalvaContext)
    const { selectedRecurso } = useAbasPorRecursoContext();
    const [formFilter, setFormFilter] = useState({...initialFilter, recurso: selectedRecurso ? selectedRecurso.uuid : ''});

    // Atualiza o formFilter quando o recurso selecionado muda
    useEffect(() => {
        setFormFilter(prevFilter => ({
            ...prevFilter,
            recurso: selectedRecurso ? selectedRecurso.uuid : ''
        }));
    }, [selectedRecurso]);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value,
        });
    };

    const handleSubmitFormFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFilter({
            ...formFilter,
            recurso: selectedRecurso ? selectedRecurso.uuid : ''
        });
    };

    const clearFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        const resetFormFilter = {...initialFilter, recurso: selectedRecurso ? selectedRecurso.uuid : ''};
        setFormFilter(resetFormFilter);
        setFilter(resetFormFilter);
    };
    
    return (
        <>
            <div className="mb-4">
                <h4 className="font-weight-bold mb-0">Refine sua busca</h4>
                <p>
                    Utilize o filtro por referência para localizar motivos de aprovação com ressalvas específicos.
                </p>
            </div>
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
                            placeholder='Digite o motivo de aprovação de PC com ressalvas'
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