import React, {useContext, useState} from "react";

export const Filtros = ({
    stateFiltros,
    initialStateFiltros,
    handleSubmitFiltros, 
    limpaFiltros,
    categorias
}) => {

    const [formFilter, setFormFilter] = useState(stateFiltros);
    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };
    const executaFiltros = () => {
        handleSubmitFiltros(formFilter)
    }

    const executaLimpaFiltros = () => {
        limpaFiltros()
        setFormFilter(initialStateFiltros)
    }

    return (
        <>
            <form>
                <div className="form-row align-items-end">
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_nome">Filtrar por nome da Ação PDDE</label>
                            <input
                                data-qa="input-filtro-nome"
                                value={formFilter.filtrar_por_nome}
                                onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                                name='filtrar_por_nome'
                                id="filtrar_por_nome"
                                type="text"
                                className="form-control"
                                placeholder='Busque por nome'
                                style={{display: 'inline-block'}}
                            />

                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="filtrar_por_categoria">Filtrar por categoria</label>
                            <select
                                value={formFilter.filtrar_por_categoria}
                                onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                                name="filtrar_por_categoria"
                                id="filtrar_por_categoria"
                                className="form-control">
                                <option value="">Selecione a categoria</option>
                                {categorias && categorias.results && categorias.results.map((categoria)=>
                                    <option key={categoria.uuid} value={categoria.uuid}>{categoria.nome}</option>
                                )}
                            </select>
                    </div>
                    <div className="form-group col-md-2">
                        <div className="d-flex  justify-content-end mt-n2">
                            <button
                                data-qa="btn-limpar-filtros"
                                onClick={executaLimpaFiltros}
                                type="button"
                                className="btn btn btn-outline-success mt-2 mr-2">
                                Limpar
                            </button>

                            <button
                                data-qa="btn-filtrar"
                                onClick={executaFiltros}
                                type="button"
                                className="btn btn-success mt-2">
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};