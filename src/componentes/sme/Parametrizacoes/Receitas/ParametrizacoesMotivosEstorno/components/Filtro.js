import React, { useEffect, useState } from "react";

import { useMotivosEstornoContext } from "../hooks/useMotivosEstornoContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

export const Filtro = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const { setFilter, initialFilter } = useMotivosEstornoContext();
    const [formFilter, setFormFilter] = useState(initialFilter);

    useEffect(() => {
        setFormFilter(initialFilter);
    }, [selectedRecurso?.uuid, initialFilter]);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value,
        });
    };

    const handleSubmitFormFilter = () => {
        setFilter((prevState) => ({
            ...formFilter,
            recurso_uuid: prevState?.recurso_uuid,
        }));
    };

    const clearFilter = () => {
        setFormFilter(initialFilter);
        setFilter((prevState) => ({
            ...initialFilter,
            recurso_uuid: prevState?.recurso_uuid,
        }));
    };

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleSubmitFormFilter();
    };

    return (
        <div className="d-flex bd-highlight align-items-end mt-2">
            <div className="py-2 flex-grow-1 bd-highlight">
                <form
                    onSubmit={handleSubmitForm}
                    id="form-filtros-motivos-estorno"
                    data-qa="form-filtros-motivos-estorno"
                >
                    <label htmlFor="motivo">Filtrar por nome</label>
                    <input
                        value={formFilter.motivo}
                        onChange={(e) => {
                            handleChangeFormFilter(
                                e.target.name,
                                e.target.value,
                            );
                        }}
                        name="motivo"
                        id="motivo"
                        type="text"
                        className="form-control"
                        placeholder="Busque por motivo"
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
                    type="submit"
                    form="form-filtros-motivos-estorno"
                    className="btn btn-success"
                >
                    Filtrar
                </button>
            </div>
        </div>
    );
};
