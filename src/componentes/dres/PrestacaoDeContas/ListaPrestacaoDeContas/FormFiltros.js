import React from "react";

export const FormFiltros = ({tabelaAssociacoes, stateFiltros, handleChangeFiltros, handleSubmitFiltros}) => {
    return (
        <>
            <form onSubmit={handleSubmitFiltros}>
                <div className="row mt-3">
                    <div className="col">
                        <label htmlFor="filtrar_por_termo">Filtrar por um termo</label>
                        <input
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_termo'
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>

                    <div className="col">
                        <label htmlFor="filtrar_por_tipo_de_unidade">Filtrar por tipo de unidade</label>
                        <select
                            value={stateFiltros.filtrar_por_tipo_de_unidade}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_tipo_de_unidade"
                            id="filtrar_por_tipo_de_unidade"
                            className="form-control"
                        >
                            <option value="">Selecione um tipo</option>
                            {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col">
                        <label htmlFor="filtrar_por_status">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_status}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name="filtrar_por_status"
                            id="filtrar_por_status"
                            className="form-control"
                        >
                            <option value="">Selecione um status</option>
                            <option value='NAO_RECEBIDA'>Não Recebidas</option>
                            <option value='RECEBIDA'>Recebidas</option>
                            <option value='EM_ANALISE'>Em Análise</option>
                            <option value='DEVOLVIDA'>Devolvidas para acertos</option>
                            <option value='APROVADA'>Aprovadas</option>
                            <option value='REPROVADA'>Reprovadas</option>


                            {/*{tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.map(item => (
                                <option key={item.id} value={item.id}>{item.nome}</option>
                            ))}*/}
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    <button type="submit" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    )
};