import {useContext, useState} from "react";
import { AtividadesEstatutariasContext } from "./context/index";
import { useGetTabelas } from "./hooks/useGetTabelas";
import { Row, Col } from "antd";

export const Filtros = () => {

    const {setFilter, initialFilter, setCurrentPage, setFirstPage} = useContext(AtividadesEstatutariasContext)
    const [formFilter, setFormFilter] = useState(initialFilter);

    const { data: atividadesEstatutariasTabelas } = useGetTabelas()

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
            <form onSubmit={handleSubmitFormFilter} onKeyDown={onKeyDown} data-testid="form-filtros">
                <Row gutter={16} className="mb-2">
                    <Col span={11}>
                        <label htmlFor="nome">Filtrar por nome da atividade estatutária</label>
                        <input
                            data-qa="input-filtro-nome"
                            data-testid="input-filtro-nome"
                            value={formFilter.nome}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name='nome'
                            id="nome"
                            type="text"
                            maxLength={150}
                            className="form-control w-100"
                            placeholder='Digite o nome da atividade estatutária'
                            style={{display: 'inline-block'}}
                        />
                    </Col>
                    <Col span={7}>
                        <label htmlFor="tipo">Filtrar por tipo</label>
                        <select
                            value={formFilter.tipo}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="tipo"
                            id="tipo"
                            className="form-control"
                        >
                            <option value="">Selecione o tipo</option>
                            {atividadesEstatutariasTabelas?.tipo?.map((item) => (
                                <option key={item.key} value={item.key}>
                                    {item.value}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col span={6}>
                        <label htmlFor="mes">Filtrar por mês</label>
                        <select
                            value={formFilter.mes}
                            onChange={(e) => handleChangeFormFilter(e.target.name, e.target.value)}
                            name="mes"
                            id="mes"
                            className="form-control"
                        >
                            <option value="">Selecione o mês</option>
                            {atividadesEstatutariasTabelas?.mes?.map((item) => (
                                <option key={item.key} value={item.key}>
                                    {item.value}
                                </option>
                            ))}
                        </select>
                    </Col>
                </Row>
                <Row className="my-2">
                    <Col span={24} className="text-right">
                        <button onClick={clearFilter} className="btn btn-outline-success mr-2">
                            Limpar
                        </button>
                        <button className="btn btn-success" type="submit">
                            Filtrar
                        </button>
                    </Col>
                </Row>
            </form>
        </>
    )
}