import React, {useContext, useState, useEffect} from "react";
import { RepassesContext } from "../context/Repasse";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import Loading from "../../../../../../utils/Loading";

export const Filtros = () => {
    const { 
        setFilter, 
        initialFilter, 
        setCurrentPage, 
        setFirstPage, 
        tabelas, 
        isLoading
    } = useContext(RepassesContext);
    const [formFilter, setFormFilter] = useState(initialFilter);
    const { selectedRecurso } = useAbasPorRecursoContext();

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFiltros = (event) => {
        event.preventDefault();

        setCurrentPage(1)
        setFirstPage(0)
        setFilter(prevState => ({
            ...formFilter,
            recurso_uuid: prevState?.recurso_uuid
        }));
    }

    const handleClearFilters = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFormFilter(prevState => ({
            ...initialFilter,
            recurso_uuid: prevState?.recurso_uuid
        }));
        setFilter(prevState => ({
            ...initialFilter,
            recurso_uuid: prevState?.recurso_uuid
        }));
    }

    useEffect(() => {
        setFormFilter(initialFilter);
    }, [selectedRecurso])

    if (isLoading) {
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
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-8">
                        <label htmlFor="search">Filtrar por associação / Unidade educacional</label>
                        <input
                            value={formFilter.search}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='search'
                            id="search"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da associação'
                        />
                    </div>

                    <div className="form-group col-md-4">
                        <label htmlFor="periodo">Filtrar por período</label>
                        <select
                            value={formFilter.periodo}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="periodo"
                            id="periodo"
                            className="form-control"
                        >
                            <option value="">Selecione o período</option>
                            {tabelas && tabelas.periodos && tabelas.periodos.map((periodo)=>
                                <option key={periodo.uuid} value={periodo.uuid}>{periodo.referencia}</option>
                            )}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="conta">Filtrar por conta</label>
                        <select
                            value={formFilter.conta}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="conta"
                            id="conta"
                            className="form-control"
                        >
                            <option value="">Selecione a conta</option>
                            {tabelas && tabelas.tipos_contas && tabelas.tipos_contas.map((tipo_conta)=>
                                <option key={tipo_conta.uuid} value={tipo_conta.uuid}>{tipo_conta.nome}</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group col-md-3">
                        <label htmlFor="acao">Filtrar por ação</label>
                        <select
                            value={formFilter.acao}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="acao"
                            id="acao"
                            className="form-control"
                        >
                            <option value="">Selecione a ação</option>
                            {tabelas && tabelas.acoes && tabelas.acoes.map((acao)=>
                                <option key={acao.uuid} value={acao.uuid}>{acao.nome}</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group col-md-3">
                        <label htmlFor="status">Filtrar por status</label>
                        <select
                            value={formFilter.status}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="status"
                            id="status"
                            className="form-control"
                        >
                            <option value="">Selecione o status</option>
                            {tabelas && tabelas.status && tabelas.status.map((status)=>
                                <option key={status.id} value={status.id}>{status.nome}</option>
                            )}
                        </select>
                    </div>

                    <div className="from-group col-md-3">
                        <div className="d-flex bd-highlight justify-content-end mt-4">
                            <button 
                                onClick={handleClearFilters}
                                type="button" 
                                className="btn btn-outline-success mt-2 mr-2"
                            >
                                Limpar
                            </button>

                            <button 
                                onClick={handleSubmitFiltros}
                                type="button" 
                                className="btn btn-success mt-2"
                            >
                                Filtrar
                            </button>
                        </div>

                    </div>
                </div>
            </form>
        </>
    )
}