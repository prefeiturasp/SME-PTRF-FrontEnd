import React from "react";
import {DatePickerField} from "../DatePickerField";

export const FormFiltrosNotificacoes = ({tabelaNotificacoes, stateFormFiltros, handleChangeFormFiltros, handleSubmitFormFiltros}) => {
    return (
        <>
            {tabelaNotificacoes &&
            <div className="container-form-filtros mt-4">
                <h5>Filtros</h5>
                <form onSubmit={handleSubmitFormFiltros}>
                    <div className="form-row">
                        <div className="col-12 col-md-6 mt-3">
                            <label htmlFor="tipo_notificacao">Por tipo de notificação</label>
                            <select
                                value={stateFormFiltros.tipos_notificacao}
                                onChange={(e) => handleChangeFormFiltros(e.target.name, e.target.value)}
                                name="tipo_notificacao"
                                id="tipo_notificacao"
                                className="form-control"
                            >
                                <option value="">Selecione tipo de notificação</option>
                                {tabelaNotificacoes.tipos_notificacao && tabelaNotificacoes.tipos_notificacao.length > 0 && tabelaNotificacoes.tipos_notificacao.map((tipo, index) =>
                                    <option key={index} value={tipo.id}>{tipo.nome}</option>
                                )}
                            </select>
                        </div>
                        <div className="col-12 col-md-6 mt-3">
                            <label htmlFor="categoria">Por categoria</label>
                            <select
                                value={stateFormFiltros.tipos_notificacao}
                                onChange={(e) => handleChangeFormFiltros(e.target.name, e.target.value)}
                                name="categoria"
                                id="categoria"
                                className="form-control"
                            >
                                <option value="">Selecione a categoria</option>
                                {tabelaNotificacoes.categorias && tabelaNotificacoes.categorias.length > 0 && tabelaNotificacoes.categorias.map((tipo, index) =>
                                    <option key={index} value={tipo.id}>{tipo.nome}</option>
                                )}
                            </select>
                        </div>

                        <div className="col-12 col-md-6 mt-3">
                            <label htmlFor="remetente">Por remetente da notificação</label>
                            <select
                                value={stateFormFiltros.tipos_notificacao}
                                onChange={(e) => handleChangeFormFiltros(e.target.name, e.target.value)}
                                name="remetente"
                                id="remetente"
                                className="form-control"
                            >
                                <option value="">Selecione o remetente</option>
                                {tabelaNotificacoes.remetentes && tabelaNotificacoes.remetentes.length > 0 && tabelaNotificacoes.remetentes.map((tipo, index) =>
                                    <option key={index} value={tipo.id}>{tipo.nome}</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group col-md-6 mt-3">
                            <label htmlFor="data_inicio">Por período recebido</label>
                            <div className="row align-items-center">
                                <div className="col-12 col-md-5 pr-0">
                                    <DatePickerField
                                        name="data_inicio"
                                        id="data_inicio"
                                        value={stateFormFiltros.data_inicio}
                                        onChange={handleChangeFormFiltros}
                                    />
                                </div>
                                <div className="col-12 col-md-2 p-0 text-md-center">
                                    <span>até</span>
                                </div>
                                <div className="col-12 col-md-5 pl-0">
                                    <DatePickerField
                                        name="data_fim"
                                        id="data_fim"
                                        value={stateFormFiltros.data_fim}
                                        onChange={handleChangeFormFiltros}
                                    />
                                </div>

                            </div>
                            <div className="d-flex justify-content-end pb-3 mt-3">
                                <button className="btn btn-success">Filtrar</button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
            }
        </>
    );
};