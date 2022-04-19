import React from "react";

export const FiltrosTransacoes = ({conciliado, stateFiltros, tabelasDespesa, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, handleChangeCheckBoxOrdenarPorImposto, stateCheckBoxOrdenarPorImposto})=>{
    return(
        <>
            <form>
                <div className="form-row align-items-center">
                    <div className="form-group col-5">
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

                    <div className="justify-content-end">
                        <button onClick={()=>handleSubmitFiltros(conciliado)} type="button" className="btn btn-success ml-md-2 mt-3">Filtrar</button>
                    </div>
                </div>
                <div className="form-group form-check">
                    <input
                        onChange={(e)=>handleChangeCheckBoxOrdenarPorImposto(e.target.checked, e.target.name)}
                        name={`checkOerdenarPorImposto_${conciliado}`}
                        id={`checkOerdenarPorImposto_${conciliado}`}
                        type="checkbox"
                        className="form-check-input"
                    />
                    <label className="form-check-label" htmlFor={`checkOerdenarPorImposto_${conciliado}`}>Ordenar com imposto vinculados às despesas</label>
                </div>
            </form>
        </>
    )
};