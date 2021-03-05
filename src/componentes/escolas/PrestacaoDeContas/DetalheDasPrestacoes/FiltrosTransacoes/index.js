import React from "react";

export const FiltrosTransacoes = ({conciliado, stateFiltros, tabelasDespesa, handleChangeFiltros, handleSubmitFiltros, limpaFiltros})=>{
    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col">
                        <label htmlFor="filtrar_por_acao">Filtrar por ação</label>
                        <select
                            value={stateFiltros.filtrar_por_acao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name={`filtrar_por_acao_${conciliado}`}
                            id={`filtrar_por_acao_${conciliado}`}
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
                            name={`filtrar_por_lancamento_${conciliado}`}
                            id={`filtrar_por_lancamento_${conciliado}`}
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo de lançamento</option>
                            <option value='CREDITOS'>Créditos</option>
                            <option value='GASTOS'>Gastos</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={() => limpaFiltros(conciliado)} type="button" className="btn btn btn-outline-success mr-2">Limpar</button>
                    <button onClick={()=>handleSubmitFiltros(conciliado)} type="button" className="btn btn-success">Filtrar</button>
                </div>
            </form>
        </>
    )
};