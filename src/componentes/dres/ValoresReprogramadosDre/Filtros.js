import React from "react";
import { Select } from 'antd';

export const Filtros = ({
    stateFiltros,
    handleChangeFiltros,
    handleOnChangeMultipleSelectStatus,
    handleSubmitFiltros,
    limpaFiltros,
    tabelaAssociacoes,
    tabelaValoresReprogramados
}) => {

    const { Option } = Select;

    return(
        <form onSubmit={handleSubmitFiltros}>
            <section className="row mt-3">
                <section className="col-4">
                    <label htmlFor="filtro_search">Filtrar por Nome ou cód. EOL</label>
                    <input
                        value={stateFiltros.filtro_search}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name="filtro_search"
                        id="filtro_search"
                        type="text"
                        className="form-control"
                        placeholder="Escreva o termo que deseja filtrar"
                    />
                </section>

                <section className="col-4">
                    <label htmlFor="">Filtro por tipo de unidade</label>
                    <select
                        value={stateFiltros.filtro_tipo_unidade}
                        onChange={(e) => handleChangeFiltros(e.target.name, e.target.value)}
                        name="filtro_tipo_unidade"
                        id="filtro_tipo_unidade"
                        className="form-control"
                    >
                        <option value="">Selecione um tipo</option>
                        {tabelaAssociacoes.tipos_unidade && tabelaAssociacoes.tipos_unidade.length > 0 && tabelaAssociacoes.tipos_unidade.filter(element=> element.id !== 'ADM' && element.id !== 'DRE' && element.id !== 'IFSP' && element.id !== 'CMCT').map(item => (
                            <option key={item.id} value={item.id}>{item.nome}</option>
                        ))}
                    </select>
                </section>

                <section className="col-4">
                    <label htmlFor="filtro_status">Filtrar por status</label>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Selecione o status"
                        name="filtro_status"
                        id="filtro_status"
                        value={stateFiltros.filtro_status}
                        onChange={handleOnChangeMultipleSelectStatus}
                        className='multiselect-lista-valores-reprogramados'
                    >
                        {tabelaValoresReprogramados.status && tabelaValoresReprogramados.status.length > 0 && tabelaValoresReprogramados.status.map(item => (
                            <Option key={item.id} value={item.id}>{item.nome}</Option>
                        ))}
                    </Select>
                </section>
            </section>

            <section className="d-flex justify-content-end pb-3 mt-3">
                <button 
                    type="button" 
                    onClick={()=>limpaFiltros()} 
                    className="btn btn btn-outline-success mt-2 mr-2">
                        Limpar
                </button>
                <button type="submit" className="btn btn-success mt-2">Filtrar</button>
            </section>
            
        </form>
    )
}