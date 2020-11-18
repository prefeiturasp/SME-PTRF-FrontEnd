import React from "react";

export const FormFiltros = ({stateFiltros, handleChangeFiltros, limpaFiltros, handleSubmitFiltros, tiposDeUnidade, statusPc}) =>{
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
                        {tiposDeUnidade && tiposDeUnidade.length > 0 && tiposDeUnidade.map((tipo, index) => (
                            <option key={index} value={tipo.id}>{tipo.nome}</option>
                        ))}
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="filtrar_por_status_pc">Filtrar por situação da prestação de contas</label>
                    <select
                        value={stateFiltros.filtrar_por_status_pc}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name='filtrar_por_status_pc'
                        className='form-control'
                    >
                        <option key='' value="">Selecione o status</option>
                        {statusPc && statusPc.length > 0 && statusPc.map((status, index) => (
                            <option key={index} value={status.id}>{status.nome}</option>
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