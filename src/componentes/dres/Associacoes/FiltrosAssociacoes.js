import React from "react";

export const FiltrosAssociacoes = ({tabelaAssociacoes, stateFiltros, handleChangeFiltrosAssociacao, handleSubmitFiltrosAssociacao, limpaFiltros}) =>{
    //console.log("Filtros ", tabelaAssociacoes)
    return(
        <>
            <form onSubmit={handleSubmitFiltrosAssociacao}>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <label htmlFor="unidade_escolar_ou_associacao">Filtrar por Unidade Escolar ou Associação</label>
                        <input
                            value={stateFiltros.unidade_escolar_ou_associacao}
                            onChange={(e) => handleChangeFiltrosAssociacao(e.target.name, e.target.value)}
                            name="unidade_escolar_ou_associacao"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="row">
                            <div className="col-md-6">
                                <label htmlFor="regularidade">Filtrar por ação</label>
                                <select
                                    value={stateFiltros.regularidade}
                                    onChange={(e) => handleChangeFiltrosAssociacao(e.target.name, e.target.value)}
                                    name="regularidade"
                                    id="regularidade"
                                    className="form-control"
                                >
                                    <option value="">Selecione uma ação</option>
                                    {tabelaAssociacoes.status_regularidade && tabelaAssociacoes.status_regularidade.length > 0 && tabelaAssociacoes.status_regularidade.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label htmlFor="tipo_de_unidade">Filtrar por ação</label>
                                <select
                                    value={stateFiltros.tipo_de_unidade}
                                    onChange={(e) => handleChangeFiltrosAssociacao(e.target.name, e.target.value)}
                                    name="tipo_de_unidade"
                                    id="tipo_de_unidade"
                                    className="form-control"
                                >
                                    <option value="">Selecione uma ação</option>
                                    {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.map(item => (
                                        <option key={item.id} value={item.id}>{item.nome}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    <button type="bu" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};