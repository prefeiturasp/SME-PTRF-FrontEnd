import React, {useEffect, useState} from "react";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useGetTiposContas } from "../../TiposConta/hooks/useGetTiposdeConta";


export const Filtros = () => {
    const {selectedRecurso} = useAbasPorRecursoContext();

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContasDasAssociacoesContext();

    const [formFilter, setFormFilter] = useState(initialFilter);

    useEffect(() => {
        setFormFilter(initialFilter)
    }, [selectedRecurso?.uuid, initialFilter])

    const { data: tiposContas } = useGetTiposContas({ recurso_uuid: selectedRecurso?.uuid });

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = () => {
        setCurrentPage(1);
        setFirstPage(0);

        setFilter(prevState => ({
            ...formFilter,
            page: 1,
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
        <form onSubmit={handleSubmitForm} id="form-filtro-contas-associacoes">
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="filtrar_por_associacao_nome">Filtrar por Unidade Educacional</label>
                        <input
                            value={formFilter.associacao_nome}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='associacao_nome'
                            id="associacao_nome"
                            type="text"
                            className="form-control"
                            placeholder="Filtrar por nome da unidade ou EOL"
                        />
                    </div>
                     <div className="form-group col-md-4">
                        <label htmlFor="tipo_conta_uuid">Filtrar por tipo de conta</label>
                        <select
                            value={formFilter.tipo_conta_uuid}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='tipo_conta_uuid'
                            id="tipo_conta_uuid"
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo de conta</option>
                            {tiposContas && tiposContas.length > 0 && tiposContas.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="status">Filtrar por status</label>
                        <select
                            value={formFilter.status}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='status'
                            id="status"
                            className="form-control"
                        >
                            <option value=''>Selecione o status</option>
                            <option value='ATIVA'>Ativa</option>
                            <option value='INATIVA'>Inativa</option>
                        </select>
                    </div>
                    
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={clearFilter} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button type="submit" form="form-filtro-contas-associacoes" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
    );
}
                    
