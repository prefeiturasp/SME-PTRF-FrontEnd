import React from "react";
import {DatePickerField} from "../../../../Globais/DatePickerField";

export const FiltrosConferenciaDeLancamentos = ({stateFiltros, tabelasDespesa, handleChangeFiltros, handleSubmitFiltros, limpaFiltros})=>{

    return(
        <>
            <form>
                <div className="form-row align-items-center">
                    <div className="form-group col-md-4">
                        <label htmlFor="data_inicio">Filtrar por intervalo de datas</label>
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
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_acao">Filtrar por ação</label>
                        <select
                            value={stateFiltros.filtrar_por_acao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_acao`}
                            id={`filtrar_por_acao`}
                            className="form-control"
                        >
                            <option value=''>Selecione a ação</option>
                            {tabelasDespesa && tabelasDespesa.acoes_associacao && tabelasDespesa.acoes_associacao.length > 0 && tabelasDespesa.acoes_associacao.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_lancamento">Filtrar por tipo de lançamento</label>
                        <select
                            value={stateFiltros.filtrar_por_lancamento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_lancamento`}
                            id={`filtrar_por_lancamento`}
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo de lançamento</option>
                            <option value='CREDITOS'>Créditos</option>
                            <option value='GASTOS'>Gastos</option>
                        </select>
                    </div>
                </div>

                <div className="form-row align-items-center">
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_numero_de_documento">Filtrar por número de documento</label>
                        <input value={stateFiltros.filtrar_por_numero_de_documento}
                               onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                               name="filtrar_por_numero_de_documento"
                               id="filtrar_por_numero_de_documento"
                               type="text"
                               className="form-control"
                               placeholder="Digite o número"
                        />
                    </div>
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_tipo_de_documento">Filtrar por tipo de documento</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_documento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_tipo_de_documento`}
                            id={`filtrar_por_tipo_de_documento`}
                            className="form-control"
                        >
                            <option value="">Selecione o tipo</option>
                            {tabelasDespesa && tabelasDespesa.tipos_documento && tabelasDespesa.tipos_documento.length > 0 && tabelasDespesa.tipos_documento.map(item =>
                                <option className='form-control' key={item.id} value={item.id}>{item.nome}</option>
                            )}
                        </select>
                    </div>

                    <div className="form-group col">
                        <label htmlFor="filtrar_por_tipo_de_pagamento">Filtrar por tipo de transação/pagamento</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_pagamento}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_tipo_de_pagamento`}
                            id={`filtrar_por_tipo_de_pagamento`}
                            className="form-control"
                        >
                            <option key='' value="">Selecione o tipo</option>
                            {tabelasDespesa.tipos_transacao && tabelasDespesa.tipos_transacao.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn-success ml-md-2 mt-1">Limpar</button>
                    <button onClick={()=>handleSubmitFiltros()} type="button" className="btn btn-success ml-md-2 mt-1">Filtrar</button>
                </div>
            </form>
        </>
    )
};