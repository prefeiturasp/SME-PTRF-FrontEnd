import React from "react";

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, tabelaAssociacoes}) =>{
    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-5">
                        <label htmlFor="filtrar_por_associacao">Filtrar por associação</label>
                        <input
                            value={stateFiltros.filtrar_por_unidade}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_unidade'
                            id="filtrar_por_unidade"
                            type="text"
                            className="form-control"
                            placeholder='Escreva o nome da associação'
                        />
                    </div>
                    <div className="form-group col-5">
                        <label htmlFor="filtrar_por_tipo_ue">Filtrar pelo tipo de UE</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_ue}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_tipo_ue'
                            id="filtrar_por_tipo_ue"
                            className="form-control"
                        >
                            <option value=''>Selecione o tipo</option>
                            {tabelaAssociacoes && tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0  && tabelaAssociacoes.tipos_unidade.filter(elemento=> elemento.nome !== 'ADM' && elemento.nome !== 'DRE').map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group col-2">
                        <button onClick={handleSubmitFiltros} type="button" className="btn btn-success float-right" style={{marginTop: "1.9em"}}>Filtrar</button>
                    </div>
                </div>
            </form>
        </>
    );
};