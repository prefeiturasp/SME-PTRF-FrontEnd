import React, {useContext, useState} from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";
import { useGetTabelas } from "../hooks/useGetTabelas";

export const Filtros = () => {
    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(MateriaisServicosContext);
    const [formFilter, setFormFilter] = useState(initialFilter);

    const { data: tabelas } = useGetTabelas();

    const opcoes_filtro_ativa = [
        { nome: 'Sim', valor: 1 },
        { nome: 'Não', valor: 0 }
    ]

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setFirstPage(0)
        setFilter(formFilter);
    };

    const clearFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFormFilter(initialFilter);
        setFilter(initialFilter);
    };
    
    return (
        <>
            <form onSubmit={handleSubmitFormFilter}>
                <div className="form-row">
                    <div className="form-group col-md-4">
                        <label htmlFor="descricao">Filtrar por descrição</label>
                        <input
                            value={formFilter.descricao}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='descricao'
                            id="descricao"
                            type="text"
                            className="form-control"
                            placeholder='Escreva a descrição'
                        />
                    </div>

                    <div className="form-group col-md-3">
                        <label htmlFor="aplicacao_recurso">Filtrar por tipo de aplicação</label>
                        <select
                            value={formFilter.aplicacao_recurso}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="aplicacao_recurso"
                            id="aplicacao_recurso"
                            className="form-control">

                            <option value="">Selecione a aplicação</option>
                            {tabelas && tabelas.aplicacao_recursos && tabelas.aplicacao_recursos.map((aplicacao)=>
                                <option key={aplicacao.id} value={aplicacao.id}>{aplicacao.nome}</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group col-md-3">
                        <label htmlFor="tipo_custeio">Filtrar por tipo de custeio</label>
                        <select
                            value={formFilter.tipo_custeio}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="tipo_custeio"
                            id="tipo_custeio"
                            className="form-control">

                            <option value="">Selecione o tipo</option>
                            {tabelas && tabelas.tipos_custeio && tabelas.tipos_custeio.map((tipo_custeio)=>
                                <option key={tipo_custeio.uuid} value={tipo_custeio.uuid}>{tipo_custeio.nome}</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="ativa">Está ativa?</label>
                        <select
                            value={formFilter.ativa}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="ativa"
                            id="ativa"
                            className="form-control">

                            <option value="">Selecione</option>
                            {opcoes_filtro_ativa.map((status)=>
                                <option key={status.valor} value={status.valor}>{status.nome}</option>
                            )}
                        </select>
                    </div>
                    <div className="from-group col-md-12">
                        <div className="d-flex bd-highlight mb-4 justify-content-end">
                            <button 
                                onClick={clearFilter}
                                type="button" 
                                className="btn btn-outline-success mt-2 mr-2">
                                Limpar
                            </button>

                            <button 
                                onClick={handleSubmitFormFilter}
                                type="button" 
                                className="btn btn-success mt-2">
                                Filtrar
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
