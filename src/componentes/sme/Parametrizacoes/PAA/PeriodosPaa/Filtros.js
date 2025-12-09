import React, {useContext, useState} from "react";
import { Form, Button, Row, Col, Input, Select } from "antd";
import { PeriodosPaaContext } from "./context/index";
import { useGetFiltrosOutrosRecursos } from "./hooks/useGetFiltroOutrosRecursos";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(PeriodosPaaContext)
    const [formFilter, setFormFilter] = useState(initialFilter);

    const { data: outrosRecursos } = useGetFiltrosOutrosRecursos()
    const { results: outrosRecursosOptions } = outrosRecursos

    const handleChangeFormFilter = (name, value) => {
        setFormFilter({
            ...formFilter,
            [name]: value
        });
    };

    const handleSubmitFormFilter = (e) => {
        e.preventDefault()
        setCurrentPage(1)
        setFirstPage(0)
        setFilter(formFilter);
    };

    const clearFilter = () => {
        setCurrentPage(1)
        setFirstPage(0)
        setFormFilter(initialFilter);
        setFilter(initialFilter);
    };

    const onKeyDown = (keyEvent) =>{
        if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
            keyEvent.preventDefault();
            handleSubmitFormFilter(keyEvent)
        }
    }
    
    return (
        <>
            <form onSubmit={handleSubmitFormFilter} onKeyDown={onKeyDown}>
                <Row gutter={[12, 12]} style={{justifyContent: "end"}}>
                    <Col flex='auto'>
                        <div>
                            <label htmlFor="referencia">Filtrar por referência</label>
                            <input
                                data-qa="input-filtro-referencia"
                                value={formFilter.referencia}
                                onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                                name='referencia'
                                id="referencia"
                                type="text"
                                maxLength={150}
                                className="form-control w-100"
                                placeholder='Buscar por referência'
                            />
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={10}>
                        <div>
                            <label htmlFor="outro_recurso">Filtrar por Outros Recursos habilitados</label>
                            <select
                                data-qa="input-filtro-outro_recurso"
                                value={formFilter.outro_recurso}
                                onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                                name="outro_recurso"
                                id="outro_recurso"
                                className="form-control"
                                placeholder='Selecione o Outro Recurso'
                            >
                                <option value="">Selecione o Outro Recurso</option>
                                {outrosRecursosOptions?.map((item) => (
                                    <option key={item.uuid} value={item.uuid}>
                                        {item.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </Col>
                    <Col span='auto' style={{alignContent: 'end'}}>
                        <Row gutter={12}>
                            <Col>
                                <button
                                    onClick={clearFilter}
                                    className="btn btn-outline-success">
                                    Limpar
                                </button>
                            </Col>
                            <Col>
                                <button
                                    className="btn btn-success"
                                    type="submit">
                                    Filtrar
                                </button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </form>
        </>
    )
}