import React from "react";

export const FormFiltros = ({stateFiltros, handleChangeFiltros, limpaFiltros, handleSubmitFiltros, grupos}) =>{
    return(
        <form onSubmit={handleSubmitFiltros} method="post">
            <div className="row mt-3 mb-3">
                <div className="col">
                    <label htmlFor="filtrar_por_ue">Filtrar por unidade educacional</label>
                    <input
                        value={stateFiltros.filtrar_por_ue}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_ue'
                        type="text"
                        className="form-control"
                        placeholder="Escreva o nome da unidade"
                    />
                </div>

                <div className="col">
                    <label htmlFor="filtrar_por_tipo_unidade">Filtrar por tipo de unidade</label>

                    <select
                        value={stateFiltros.filtrar_por_tipo_unidade}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_tipo_unidade'
                        className='form-control'
                    >
                        <option key='' value="">Selecione um tipo de unidade</option>
                        {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                            <option key={index} value={grupo.id}>{grupo.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="col">
                    <label htmlFor="filtrar_por_situacao">Filtrar por situação da prestação de contas</label>

                    <select
                        value={stateFiltros.filtrar_por_situacao}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_situacao'
                        className='form-control'
                    >
                        <option key='' value="">Selecione o status</option>
                        {grupos && grupos.length > 0 && grupos.map((grupo, index) => (
                            <option key={index} value={grupo.id}>{grupo.nome}</option>
                        ))}
                    </select>
                </div>

                <div className="col-md-3 col-xl-2 text-right mt-4">
                    <button onClick={() => limpaFiltros()} type="reset" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button type="submit" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </div>


        </form>
    );
};