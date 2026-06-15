import React, { useState, useEffect} from "react";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useMotivosAprovacaoPcRessalvaContext } from "../hooks/useMotivoAprovacaoComRessalvaContext"

export const Filtros = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const { setFilter, initialFilter } = useMotivosAprovacaoPcRessalvaContext();

    const [formFilter, setFormFilter] = useState(initialFilter);

    // Atualiza o formFilter quando o recurso selecionado muda
    useEffect(() => {
        setFormFilter(initialFilter);
    }, [selectedRecurso]);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value,
        });
    };

    const handleSubmitFormFilter = (e) => {
        e.preventDefault();

        setFilter(prevState => ({
            ...formFilter,
            recurso: prevState?.recurso ?? '',
        }));
    };

    const clearFilter = () => {
        setFormFilter(initialFilter);
        setFilter(prevState => ({
            ...initialFilter,
            recurso: prevState?.recurso ?? '',
        }));
    };
    
    return (
        <div className="d-flex bd-highlight align-items-end mt-2">
            <div className="flex-grow-1 bd-highlight mr-4">
                <form id="form-filtros-motivos-aprovacao-ressalva-pc" onSubmit={handleSubmitFormFilter}>
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
                    form="form-filtros-motivos-aprovacao-ressalva-pc"
                    className="btn btn-success"
                >
                    Filtrar
                </button>
            </div>
        </div>
    )
}