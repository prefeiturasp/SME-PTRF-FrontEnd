import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, periodosAssociacao, tabelaPrestacoes, exibeDataPT_BR}) => {
    return (
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_periodo">Filtrar por período</label>
                        <select
                            value={stateFiltros.filtrar_por_periodo}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_periodo"
                            id="filtrar_por_periodo"
                            className="form-control"
                        >
                            <option value=''>Selecione um período</option>
                            {periodosAssociacao && periodosAssociacao.map((periodo) =>
                                <option key={periodo.uuid} value={periodo.uuid}>{`${periodo.referencia} - ${periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-"} até ${periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-"}`}</option>
                            )}
                        </select>
                    </div>
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_status"
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            <option value=''>Selecione um status</option>
                            {tabelaPrestacoes.status && tabelaPrestacoes.status.length > 0 && tabelaPrestacoes.status.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={() => limpaFiltros()} type="button" className="btn btn btn-outline-success mr-2">Limpar filtros</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success">Filtrar</button>
                </div>
            </form>
        </>
    );
};