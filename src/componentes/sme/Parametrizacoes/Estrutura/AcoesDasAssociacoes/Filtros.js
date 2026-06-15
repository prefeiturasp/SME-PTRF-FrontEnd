import React, { useEffect, useState } from "react";

import { Select } from 'antd';
import Loading from "../../../../../utils/Loading";

import { useAcoesDasAssociacoesContext } from "./hooks/useAcoesDasAssociacoesContext";
import { useAbasPorRecursoContext } from "../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

const { Option } = Select;

export const Filtros = () => {
    const { selectedRecurso } = useAbasPorRecursoContext();
    const {
        setFilters,
        initialFilters,
        
        tabelaAssociacoes,
        isLoadingTabela,

        listaTiposDeAcao,
        isLoadingTiposDeAcao,
    } = useAcoesDasAssociacoesContext();

    const [formFilters, setFormFilters] = useState(initialFilters);

    const isLoading = isLoadingTabela || isLoadingTiposDeAcao;

    const handleChangeFiltros = (name, value) => {
        setFormFilters(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        let name = "filtro_informacoes"

        handleChangeFiltros(name, value);
    };

    const handleSubmitFiltros = (event) => {
        event.preventDefault();

        setFilters(prevState => ({
            ...formFilters,
            recurso_uuid: prevState?.recurso_uuid
        }));
    }

    const handleClearFilters = () => {
        setFormFilters(prevState => ({
            ...initialFilters,
            recurso_uuid: prevState?.recurso_uuid
        }));
        setFilters(prevState => ({
            ...initialFilters,
            recurso_uuid: prevState?.recurso_uuid
        }));
    }

    useEffect(() => {
        setFormFilters(initialFilters);
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


    return(
            <form onSubmit={handleSubmitFiltros} id="form-filtros-acoes-associacoes">
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_nome_cod_eol">Filtrar por nome ou código EOL</label>
                        <input
                            value={formFilters.filtrar_por_nome_cod_eol}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome_cod_eol'
                            id="filtrar_por_nome_cod_eol"
                            type="text"
                            className="form-control"
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_acao">Filtrar por ação</label>
                        <select
                            value={formFilters.filtrar_por_acao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_acao'
                            id="filtrar_por_acao"
                            className="form-control"
                        >
                            <option value=''>Selecione a ação</option>
                            {listaTiposDeAcao && listaTiposDeAcao.length > 0 && listaTiposDeAcao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={formFilters.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_status'
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            <option value=''>Selecione o status</option>
                            <option value='ATIVA'>Ativa</option>
                            <option value='INATIVA'>Inativa</option>
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtro_informacoes">Filtrar por informações</label>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Selecione as informações"
                            name="filtro_informacoes"
                            id="filtro_informacoes"
                            value={formFilters.filtro_informacoes}
                            onChange={handleOnChangeMultipleSelectStatus}
                            className='multiselect-lista-valores-reprogramados'
                        >
                            {tabelaAssociacoes.filtro_informacoes && tabelaAssociacoes.filtro_informacoes.length > 0 && tabelaAssociacoes.filtro_informacoes.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
                    </div>                    
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={handleClearFilters} type="button" className="btn btn btn-outline-success mt-2 mr-2" data-testid="btn-limpar-filtros-acao-associacao">
                        Limpar
                    </button>
                    <button type="submit" form="form-filtros-acoes-associacoes" className="btn btn-success mt-2" data-testid="btn-filtrar-acao-associacao">
                        Filtrar
                    </button>
                </div>
            </form>
    );
};