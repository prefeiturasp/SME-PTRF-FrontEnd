import React from "react";
import {DatePickerField} from "../../../Globais/DatePickerField";

export const FormFiltros = ({tabelaAssociacoes, tabelaPrestacoes, stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, toggleMaisFiltros, setToggleMaisFiltros, tecnicosList}) => {
    return (
        <>
            <form method="post">
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                        <input
                            value={stateFiltros.filtrar_por_termo}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_termo'
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>

                    <div className="col">
                        <label htmlFor="filtrar_por_tipo_de_unidade">Filtrar por tipo de unidade</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_unidade}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_tipo_de_unidade"
                            id="filtrar_por_tipo_de_unidade"
                            className="form-control"
                        >
                            <option value="">Selecione um tipo</option>
                            {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element=> element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_status"
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            {tabelaPrestacoes.status && tabelaPrestacoes.status.length > 0 && tabelaPrestacoes.status.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className={`collapse mt-3 ${toggleMaisFiltros ? 'show' : ''}`} id="">
                    <div className='row'>
                        <div className="col">
                            <label htmlFor="filtrar_por_tecnico_atribuido">Filtrar por técnico atribuído</label>
                            <select
                                value={stateFiltros.filtrar_por_tecnico_atribuido}
                                onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                                name="filtrar_por_tecnico_atribuido"
                                id="filtrar_por_tecnico_atribuido"
                                className="form-control"
                            >
                                <option value="">Selecione um servidor</option>
                                {tecnicosList && tecnicosList.length > 0 && tecnicosList.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_data_inicio">Filtrar por período</label>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-5 pr-0">
                                    <DatePickerField
                                        name="filtrar_por_data_inicio"
                                        id="filtrar_por_data_inicio"
                                        value={stateFiltros.filtrar_por_data_inicio}
                                        onChange={handleChangeFiltros}
                                    />
                                </div>
                                <div className="col-12 col-md-2 p-0 text-md-center ">
                                    <span>até</span>
                                </div>
                                <div className="col-12 col-md-5 pl-0">
                                    <DatePickerField
                                        name="filtrar_por_data_fim"
                                        id="filtrar_por_data_fim"
                                        value={stateFiltros.filtrar_por_data_fim}
                                        onChange={handleChangeFiltros}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button
                        type="button"
                        onClick={() => setToggleMaisFiltros(!toggleMaisFiltros)}
                        className="btn btn-outline-success mt-2 mr-2"
                    >
                        {toggleMaisFiltros ? 'Menos filtros' : 'Mais Filtros'}
                    </button>
                    <button onClick={() => limpaFiltros()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button
                        onClick={handleSubmitFiltros}
                        type="button"
                        className="btn btn-success mt-2"
                    >
                        Filtrar
                    </button>
                </div>
            </form>
        </>
    )
};