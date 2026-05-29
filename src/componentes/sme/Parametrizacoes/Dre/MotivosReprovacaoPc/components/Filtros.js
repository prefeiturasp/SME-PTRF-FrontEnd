import React, { useEffect, useState} from "react";
import { useMotivosReprovacaoPcContext } from "../hooks/useMotivoReprovacaoContext"
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const Filtros = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();

    const { setFilter, initialFilter } = useMotivosReprovacaoPcContext();
    const [formFilter, setFormFilter] = useState(initialFilter);

    useEffect(() => {
        setFormFilter(initialFilter)
    }, [selectedRecurso?.uuid])

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = () => {
        setFilter(prevState => ({
            ...formFilter,
            recurso_uuid: prevState?.recurso_uuid
        }));
    };

    const clearFilter = () => {
        setFormFilter(initialFilter);
        setFilter(prevState => ({
            ...initialFilter,
            recurso_uuid: prevState?.recurso_uuid
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();

        handleSubmitFormFilter()
    }
    
    return (
        <div className="d-flex bd-highlight align-items-end mt-4 mb-4">
            <div className="flex-grow-1 bd-highlight mr-4">
                <form onSubmit={handleSubmitForm} id="form-filtros-motivos-reprovacao-pc" data-qa="form-filtros-motivos-reprovacao-pc">
                    <label htmlFor="motivo">Filtrar por motivo de reprovação de PC</label>
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
            <div className="bd-highlight d-flex align-items-end">
                <button
                    type="button"
                    onClick={clearFilter}
                    className="btn btn-outline-success mr-2"
                >
                    Limpar
                </button>

                <button
                    type="submit"
                    form="form-filtros-motivos-reprovacao-pc"
                    className="btn btn-success"
                >
                    Filtrar
                </button>
            </div>
        </div>
    )
}