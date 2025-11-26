import {useContext, useState} from "react";
import { Col, Input, Row } from 'antd'
import { OutrosRecursosPaaContext } from "./context/index";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(OutrosRecursosPaaContext)
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
        <>
            <form onSubmit={handleSubmitFormFilter} onKeyDown={onKeyDown}>
                <Row gutter={12}>
                    <Col flex="auto">
                        <div>
                            <label htmlFor="nome">Filtrar por nome do recurso</label>
                            <Input
                                data-qa="input-filtro-nome"
                                data-testid="input-filtro-nome"
                                value={formFilter.nome}
                                onChange={(e) => handleChangeFormFilter("nome", e.target.value)}
                                name="nome"
                                id="nome"
                                maxLength={150}
                                placeholder="Digite o nome do recurso"
                                className="w-100"
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
        </>
    )
}