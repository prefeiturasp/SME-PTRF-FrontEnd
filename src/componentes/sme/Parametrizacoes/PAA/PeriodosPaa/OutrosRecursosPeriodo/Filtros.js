import {useContext, useState} from "react";
import { Row, Col } from "antd";
import { OutrosRecursosPeriodosPaaContext } from "./context/index";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(OutrosRecursosPeriodosPaaContext)
    const [formFilter, setFormFilter] = useState(initialFilter);

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
        <form onSubmit={handleSubmitFormFilter} onKeyDown={onKeyDown} className="mb-3">
            <Row gutter={12}>
                <Col flex='auto'>
                    <div >
                        <label htmlFor="nome">Nome do Recurso</label>
                        <input
                            data-qa="input-filtro-nome"
                            value={formFilter.nome}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='nome'
                            id="nome"
                            type="text"
                            maxLength={150}
                            className="form-control w-100"
                            placeholder='Digite o nome do recurso'
                        />
                    </div>
                </Col>
                <Col style={{alignContent: "end"}}>
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
    )
}