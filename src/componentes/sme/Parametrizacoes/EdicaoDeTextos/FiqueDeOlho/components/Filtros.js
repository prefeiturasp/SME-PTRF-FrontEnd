import React, { useEffect, useState} from "react";
import { useFiqueDeOlhoContext } from "../hooks/useFiqueDeOlhoContext"
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import Loading from "../../../../../../utils/Loading";

export const Filtros = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();

    const { setFilter, initialFilter, isLoadingTabelaFiqueDeOlho, dataTabelaFiqueDeOlho } = useFiqueDeOlhoContext();
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

    if (isLoadingTabelaFiqueDeOlho) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        );
    }

    return (
        <form onSubmit={handleSubmitForm} id="form-filtros-fique-de-olho">
            <div className="d-flex bd-highlight mt-2 mb-3">
                <div className="p-Y d-flex flex-column flex-grow-1 bd-highlight mr-4">
                    <label htmlFor="filtrar_por_referencia">Filtre por tipo de texto</label>
                    <select
                        value={formFilter.tipo_texto}
                        onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                        name='tipo_texto'
                        id="tipo_texto"
                        className="form-control"
                    >
                        <option value=''>Todos</option>
                        {
                            dataTabelaFiqueDeOlho?.tipos_de_texto?.map((tipo) =>
                                <option
                                    data-qa={`option-tipo-texto-${tipo[0]}`}
                                    key={tipo[0]}
                                    value={tipo[0]}
                                >
                                    {tipo[1]}
                                </option>
                            )
                        }
                    </select>

                </div>
                <div className="d-flex align-items-end p-Y bd-highlight">
                    <button
                        data-qa="btn-limpar-filtros"
                        onClick={clearFilter}
                        type="button"
                        className="btn btn btn-outline-success mr-2"
                    >
                        Limpar
                    </button>

                    <button
                        data-qa="btn-filtrar"
                        type="submit"
                        className="btn btn-success"
                        form="form-filtros-fique-de-olho"
                    >
                        Filtrar
                    </button>
                </div>
            </div>
        </form>
    )
}
