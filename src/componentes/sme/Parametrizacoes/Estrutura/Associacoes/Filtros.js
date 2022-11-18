import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, tabelaAssociacoes}) =>{
    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-6">
                        <label htmlFor="filtrar_por_associacao">Filtrar por associação</label>
                        <input
                            value={stateFiltros.filtrar_por_associacao}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_associacao'
                            id="filtrar_por_associacao"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da associação'
                        />
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_acao">Filtrar por DRE</label>
                        <select
                            value={stateFiltros.filtrar_por_dre}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_dre'
                            id="filtrar_por_dre"
                            className="form-control"
                        >
                            <option value=''>Selecione a DRE</option>
                            {tabelaAssociacoes && tabelaAssociacoes.dres && tabelaAssociacoes.dres.length > 0 && tabelaAssociacoes.dres.map(item => (
                                <option key={item.uuid} value={item.uuid}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_tipo_ue">Filtrar pelo tipo de UE</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_ue}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_tipo_ue'
                            id="filtrar_por_tipo_ue"
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo</option>
                            {tabelaAssociacoes && tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={()=>limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};