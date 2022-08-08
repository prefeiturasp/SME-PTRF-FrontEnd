import React from "react";
import { Select } from 'antd';

export const Filtros = ({stateFiltros, handleChangeFiltros, handleSubmitFiltros, limpaFiltros, categoriaTabela, documentoTabela}) =>{
    const { Option } = Select;

    return(
        <>
            <form>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="filtrar_por_nome">Filtrar por nome</label>
                        <input
                            value={stateFiltros.filtrar_por_nome}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_nome'
                            id="filtrar_por_nome"
                            type="text"
                            className="form-control"
                            placeholder="Escreva o termo que deseja filtrar"
                        />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="filtrar_por_categoria">Filtrar por categorias</label>
                        <Select
                            mode="multiple"
                            allowClear
                            placeholder="Selecione as categorias"
                            value={stateFiltros.filtrar_por_categoria}
                            onChange={(value) => handleChangeFiltros('filtrar_por_categoria', value)}
                            className="categorias-table-multiple-search"
                            required
                        >
                            {categoriaTabela && categoriaTabela.length > 0 && categoriaTabela.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                            <Option>Todos</Option>
                        </Select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="filtrar_por_documento_prestacao">Filtrar por tipo documentos de prestação</label>
                        <Select
                            mode="multiple"
                            placeholder="Selecione os documentos de prestação"
                            value={stateFiltros.filtrar_por_documento_prestacao}
                            onChange={(value) => handleChangeFiltros('filtrar_por_documento_prestacao', value)}
                            className="documentos-table-multiple-search"
                            allowClear
                            required
                        >
                            {documentoTabela && documentoTabela.length > 0 && documentoTabela.map(item => (
                                <Option key={item.id} value={item.id}>{item.nome}</Option>
                            ))}
                            <Option value='all'>Todos</Option>
                        </Select>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="filtrar_por_ativo">Filtrar por status</label>
                        <select
                            value={stateFiltros.filtrar_por_ativo}
                            onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                            name='filtrar_por_ativo'
                            id="filtrar_por_ativo"
                            className="form-control"
                            placeholder="Selecione um tipo"
                        >
                            <option>Selecione o status</option>
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