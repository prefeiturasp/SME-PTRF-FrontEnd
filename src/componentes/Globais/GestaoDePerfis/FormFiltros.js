import React from "react";

export const FormFiltros = ({
                                stateFiltros,
                                handleChangeFiltros,
                                limpaFiltros,
                                handleSubmitFiltros,
                                grupos,
                                visao_selecionada
                            }) => {
    return (
        <form onSubmit={handleSubmitFiltros} method="post">
            <div className="row mt-3">

                <div className="col">
                    <label htmlFor="filtrar_por_termo">Filtrar por nome ou id de usuário</label>
                    <input
                        value={stateFiltros.filtrar_por_nome}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_nome'
                        type="text"
                        className="form-control"
                        placeholder="Escreva o nome ou id"
                    />
                </div>
                <div className="col">
                    <label htmlFor="filtrar_por_grupo">Filtrar por grupo</label>
                    <select
                        value={stateFiltros.filtrar_por_grupo}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_grupo'
                        id='filtrar_por_grupo'
                        className='form-control'
                    >
                        <option key='' value="">Selecione um tipo</option>
                        {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                            <option key={index} value={grupo.id}>{grupo.nome}</option>
                        ))}
                    </select>
                </div>

                {visao_selecionada === "DRE" || visao_selecionada === "SME" ? (
                        <div className='col-12 mt-3'>
                            <div className='row'>
                                <div className="col">
                                    <label htmlFor="filtrar_por_termo">Filtrar por unidade educacional</label>
                                    <input
                                        value={stateFiltros.filtrar_por_nome_unidade}
                                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                                        name='filtrar_por_nome_unidade'
                                        type="text"
                                        className="form-control"
                                        placeholder="Nome da unidade"
                                    />
                                </div>
                                <div className="col">
                                    <label htmlFor="filtrar_por_grupo">Filtrar por tipo de usuário</label>
                                    <select
                                        value={stateFiltros.filtrar_tipo_de_usuario}
                                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                                        name='filtrar_tipo_de_usuario'
                                        id='filtrar_tipo_de_usuario'
                                        className='form-control'
                                    >
                                        <option value="">Filtrar por tipo de usuário</option>
                                        <option value="True">Servidor</option>
                                        <option value="False">Não Servidor</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ) :
                    <div className="col">
                        <label htmlFor="filtrar_por_grupo">Filtrar por tipo de usuário</label>
                        <select
                            value={stateFiltros.filtrar_tipo_de_usuario}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_tipo_de_usuario'
                            id='filtrar_tipo_de_usuario'
                            className='form-control'
                        >
                            <option value="">Filtrar por tipo de usuário</option>
                            <option value="True">Servidor</option>
                            <option value="False">Não Servidor</option>
                        </select>
                    </div>
                }

                <div className={`${visao_selecionada === "DRE" || visao_selecionada === "SME" ? "col mt-2" : "col-auto mt-4"} text-right`}>
                    <button onClick={() => limpaFiltros()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button type="submit" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </div>
        </form>
    );
};