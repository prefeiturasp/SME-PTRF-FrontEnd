import React, {useEffect, useState} from "react";


export const Filtros = ({estadoFiltros, mudancasFiltros, enviarFiltrosAssociacao, limparFiltros, tabelaAssociacoes, tecnicosList}) => {
    return (
        <div className="row lista-de-despesas-visible">
            <div className="col-12">
                <form onSubmit={enviarFiltrosAssociacao}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_termo">Filtrar por um unidade educacional</label>
                            <input onChange={(e) => mudancasFiltros(e.target.name, e.target.value)}
                               name="filtrar_por_termo" 
                               id="filtrar_por_termo" 
                               type="text" 
                               className="form-control"
                               placeholder="Escreva o termo que deseja filtrar"
                               value={estadoFiltros.filtrar_por_termo}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_rf">Filtrar por código Eol</label>
                            <input
                               onChange={(e) => mudancasFiltros(e.target.name, e.target.value)}
                               name="filtrar_por_rf" 
                               id="filtrar_por_rf"
                               type="text" 
                               className="form-control"
                               placeholder="Escreva o termo que deseja filtrar"
                               value={estadoFiltros.filtrar_por_rf}
                            />
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="filtrar_por_tecnico">Filtrar por técnico</label>
                            <select 
                                    onChange={(e) => mudancasFiltros(e.target.name, e.target.value)} 
                                    name="filtrar_por_tecnico"
                                    id="filtrar_por_tecnico" 
                                    className="form-control"
                                    value={estadoFiltros.filtrar_por_tecnico}>
                                <option key={0} value="">Selecione o tecnico</option>
                                {tecnicosList && tecnicosList.map(item => (
                                    <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group col-md-6">
                            <label htmlFor="filtar_por_tipo_unidade">Filtrar por tipo de unidade</label>
                            <select 
                                    onChange={(e) => mudancasFiltros(e.target.name, e.target.value)} 
                                    name="filtar_por_tipo_unidade"
                                    id="filtar_por_tipo_unidade" 
                                    className="form-control"
                                    value={estadoFiltros.filtar_por_tipo_unidade}>
                                <option key={0} value="">Selecione um tipo</option>
                                {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                            </select>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end pb-3 mt-3">
                        <button
                            onClick={(e) => {limparFiltros()}
                            }
                            className="btn btn-outline-success mt-2"
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success mt-2 ml-2"
                        >
                            Filtrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 