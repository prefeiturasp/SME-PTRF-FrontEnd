import React from "react";
import { Select } from 'antd';

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, categoriaTabela}) =>{
    const { Option } = Select;

    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-5">
                        <label htmlFor="filtrar_por_nome">Filtrar por nome</label>
                        <input
                            value={1}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="filtrar_por_categoria">Filtrar por categorias</label>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Selecione as categorias"
                            value={1}
                            onChange={(value) => handleChangeFiltros('filtrar_por_categoria', value)}
                            className="categoria-table-multiple-search"
                            required
                        >
                            <Option>Todos</Option>
                        </Select>
                    </div>
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_ativo">Filtrar por status</label>
                        <select
                            value={1}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_ativo'
                            id="filtrar_por_ativo"
                            className="form-control"
                            placeholder="Selecione um tipo"
                        >
                            <option value=''>Selecione o status</option>
                            <option value='True'>Ativo</option>
                            <option value='False'>Inativo</option>
                        </select>
                    </div>
                </div>
                <div className="d-flex  justify-content-end mt-n2">
                    <button onClick={() => limpaFiltros()} type="button" className="btn btn btn-outline-success mt-2 mr-2">Limpar</button>
                    <button onClick={handleSubmitFiltros} type="button" className="btn btn-success mt-2">Filtrar</button>
                </div>
            </form>
        </>
    );
};