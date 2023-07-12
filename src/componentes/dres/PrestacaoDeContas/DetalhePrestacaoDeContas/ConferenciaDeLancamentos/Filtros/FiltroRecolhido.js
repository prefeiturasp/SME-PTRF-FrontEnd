import React from "react";
import {Botoes} from "./Botoes";

export const FiltroRecolhido = ({stateFiltros, tabelasDespesa, handleChangeFiltros, btnMaisFiltros, setBtnMaisFiltros, limpaFiltros, handleSubmitFiltros}) => {
    return(
        <div className="d-flex bd-highlight mt-3 mb-3 container-cabecalho align-items-end ">
            <div className="flex-grow-1">
                <label htmlFor="filtrar_por_acao">Ação</label>
                <select
                    value={stateFiltros.filtrar_por_acao}
                    onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                    name={`filtrar_por_acao`}
                    id={`filtrar_por_acao`}
                    className="form-control"
                >
                    <option value=''>Selecione</option>
                    {tabelasDespesa && tabelasDespesa.acoes_associacao && tabelasDespesa.acoes_associacao.length > 0 && tabelasDespesa.acoes_associacao.map(item => (
                        <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                    ))}
                </select>
            </div>
            <div className="pl-2 pr-2 pb-0 bd-highlight">
                <Botoes
                    btnMaisFiltros={btnMaisFiltros}
                    setBtnMaisFiltros={setBtnMaisFiltros}
                    limpaFiltros={limpaFiltros}
                    handleSubmitFiltros={handleSubmitFiltros}
                />
            </div>
        </div>
    )

}