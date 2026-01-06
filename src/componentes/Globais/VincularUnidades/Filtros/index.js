import {useEffect, useState} from "react";
import { Row, Col, Form, Select, Input, Space } from "antd";
import { useGetDres, useGetTiposUnidades } from "../hooks/useGet";

const filtroInicial = {
  nome_ou_codigo: null,
  dre: null,
  tipo_unidade: null,
}

export const Filtros = ({filtros=filtroInicial, onFilterChange, limpaFiltros, extraButtons=null}) => {
    const [form] = Form.useForm();
    const [dres, setDres] = useState([]);
    const [tiposUnidades, setTiposUnidades] = useState([]);

    const { data: dataDres, isLoading: isLoadingDres } = useGetDres();
    const { data: dataTipos, isLoading: isLoadingTipos } = useGetTiposUnidades();

    useEffect(() => {
        setDres(dataDres)
    }, [dataDres]);

    useEffect(() => {
        setTiposUnidades(dataTipos)
    }, [dataTipos]);

    useEffect(() => {
        form.setFieldsValue(filtros);
    }, [filtros, form]);

    const handleLimpaFiltros = () => {
        form.resetFields();
        limpaFiltros(filtroInicial)
    }

    const handleFilter = (values) => {
        onFilterChange(values)
    }

    return(
        <>
            <Form
                className="my-3"
                form={form}
                layout="vertical"
                onFinish={handleFilter}>
                <Row gutter={12}>
                    <Col xs={24} sm={24} md={24} lg={10}>
                        <Form.Item
                            label={'Buscar por nome ou código EOL da unidade'}
                            name="nome_ou_codigo"
                            labelCol={{ span: 24 }}
                            wrapperCol={{ span: 24 }}
                            >
                            <Input allowClear
                                placeholder="Escreva o nome ou o codigo EOL da unidade"
                                />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={7}>
                        <Form.Item
                            label="Filtrar por DRE"
                            name="dre"
                            >
                            <Select
                                loading={isLoadingDres}
                                allowClear
                                placeholder="Selecione uma DRE"
                                options={(dres||[]).map(item => ({
                                    label: item.nome,
                                    value: item.uuid,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={7}>
                        <Form.Item label="Filtrar pelo tipo de UE" name="tipo_unidade">
                            <Select
                                loading={isLoadingTipos}
                                allowClear
                                placeholder="Selecione o tipo de UE"
                                options={(tiposUnidades||[]).map(item => ({
                                    label: item.nome,
                                    value: item.id,
                                }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    {extraButtons && <Col flex='auto'>
                        <Space direction="horizontal">
                            {extraButtons}
                        </Space>
                    </Col>}
                    <Col flex='auto' align="right">
                        <Space direction="horizontal">
                            <button onClick={handleLimpaFiltros} type="button" className="btn btn-outline-success">Limpar</button>
                            <button type="submit" className="btn btn-success">Filtrar</button>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </>
    );
};
