import React from "react";
import { Select } from 'antd';
import { useAssociacaoListagemContext } from "../hooks/useAssociacoesListagemContext";
import Loading from "../../../../../../utils/Loading";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";

export const Filtros = () =>{
    const { recursos } = useRecursoSelecionadoContext();
    const {
        isLoadingTabelaAssociacaoListagem,
        dataTabelaAssociacaoListagem,

        draftFilter,
        setDraftFilter,
        handleApplyFilter,
        handleClearFilter,
    } = useAssociacaoListagemContext();

    const { Option } = Select;

    const hasDres = dataTabelaAssociacaoListagem?.dres && dataTabelaAssociacaoListagem.dres.length > 0;
    const hasTiposUnidade = dataTabelaAssociacaoListagem?.tipos_unidade && dataTabelaAssociacaoListagem.tipos_unidade.length > 0;
    const hasFiltroInformacoes = dataTabelaAssociacaoListagem?.filtro_informacoes && dataTabelaAssociacaoListagem.filtro_informacoes.length > 0;

    const handleSubmitForm = (e) => {
        e.preventDefault();
        handleApplyFilter();
    }

    const handleChangeFiltros = (name, value) => {
        setDraftFilter((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleOnChangeMultipleSelectStatus =  async (value) => {
        const name = "informacao"

        setDraftFilter((prevState) => ({
            ...prevState,
            [name]: value
        }));
    }

    if (isLoadingTabelaAssociacaoListagem) {
        return (
            <div className="mt-5">
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            </div>
        )
    }

    return(
            <form onSubmit={handleSubmitForm} id="form-filtros-associacoes">
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="associacao">Filtrar por associação</label>
                        <input
                            value={draftFilter.associacao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='associacao'
                            id="associacao"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da associação'
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="dre">Filtrar por DRE</label>
                        <select
                            value={draftFilter.dre}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='dre'
                            id="dre"
                            className="form-control"
                        >
                            <option value=''>Selecione a DRE</option>
                            {hasDres && dataTabelaAssociacaoListagem.dres.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="tipo_ue">Filtrar pelo tipo de UE</label>
                        <select
                            value={draftFilter.tipo_ue}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='tipo_ue'
                            id="tipo_ue"
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo</option>
                            {hasTiposUnidade && dataTabelaAssociacaoListagem.tipos_unidade.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="recurso_uuid">Filtrar por Recurso</label>
                        <select
                            value={draftFilter.recurso_uuid}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='recurso_uuid'
                            id="recurso_uuid"
                            className="form-control"
                        >
                            <option value=''>Selecione o Recurso</option>
                            {recursos.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="informacao">Filtrar por informações</label>
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Selecione as informações"
                            name="informacao"
                            id="informacao"
                            value={draftFilter.informacao}
                            onChange={handleOnChangeMultipleSelectStatus}
                            className='multiselect-lista-valores-reprogramados'
                        >
                            {hasFiltroInformacoes && dataTabelaAssociacaoListagem.filtro_informacoes.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={handleClearFilter} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button type="submit" className="btn btn-success mt-2" form="form-filtros-associacoes">Filtrar</button>
                </div>
            </form>
    );
};
