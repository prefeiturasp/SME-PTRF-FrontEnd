import React, {useState} from "react";

export const Filtros = ({
    stateFiltros,
    initialStateFiltros,
    handleSubmitFiltros,
    limpaFiltros,
}) => {
    const [formFilter, setFormFilter] = useState(stateFiltros);

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({...formFilter, [name]: value});
    };

    const executaFiltros = (e) => {
        e && e.preventDefault();
        handleSubmitFiltros(formFilter);
    };

    const executaLimpaFiltros = () => {
        limpaFiltros();
        setFormFilter(initialStateFiltros);
    };

    return (
        <form onSubmit={executaFiltros}>
            <div className="form-row align-items-end">
                <div className="form-group col-md-10">
                    <label htmlFor="filtrar_por_nome_programa">Filtrar por nome do programa</label>
                    <input
                        data-qa="input-filtro-nome-programa"
                        value={formFilter.filtrar_por_nome}
                        onChange={(e) => handleChangeFormFilter("filtrar_por_nome", e.target.value)}
                        name="filtrar_por_nome"
                        id="filtrar_por_nome_programa"
                        type="text"
                        className="form-control"
                        placeholder="Busque por nome"
                    />
                </div>
                <div className="form-group col-md-2">
                    <div className="d-flex justify-content-end mt-n2">
                        <button
                            data-qa="btn-limpar-filtros-programa"
                            onClick={executaLimpaFiltros}
                            type="button"
                            className="btn btn-outline-success mt-2 mr-2">
                            Limpar
                        </button>
                        <button
                            data-qa="btn-filtrar-programa"
                            type="submit"
                            className="btn btn-success mt-2">
                            Filtrar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};
