import { Col, DatePicker, Flex, Form, Input, Row, Select } from "antd";

export const FormFiltrosDespesas = ({
  contaOptions = [],
  periodoOptions = [],
  onFiltrar,
  onLimparFiltros,
}) => {
  const [form] = Form.useForm();

  const handleFilter = (values) => {
    onFiltrar && onFiltrar(values);
  };

  const handleCleanFilter = () => {
    form.setFieldsValue({
      fornecedor: "",
      material_servico: "",
      conta: "",
      periodo: "",
      data_documento_inicio: "",
      data_documento_fim: "",
    });
    onLimparFiltros && onLimparFiltros();
  };
  return (
    <Form form={form} onFinish={handleFilter} role="form">
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <Form.Item
            label="Filtrar por fornecedor"
            name="fornecedor"
            labelCol={{ span: 24 }}
          >
            <Input
              name="fornecedor"
              placeholder="Digite o CNPJ/CPF ou a Razão Social do Fornecedor"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label="Filtrar por Material ou Serviço"
            name="material_servico"
            labelCol={{ span: 24 }}
          >
            <Input
              name="material_servico"
              placeholder="Digite Material ou Serviço"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col md={6}>
          <Form.Item
            label="Filtrar por conta"
            name="conta"
            labelCol={{ span: 24 }}
          >
            <Select
              size="large"
              placeholder="Selecione"
              options={contaOptions.map((tipo) => {
                return {
                  value: tipo.field_name,
                  label: tipo.name,
                };
              })}
            />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label="Filtrar por período"
            name="periodo"
            size="large"
            labelCol={{ span: 24 }}
          >
            <Select
              placeholder="Selecione"
              options={periodoOptions.map((tipo) => {
                return {
                  value: tipo.field_name,
                  label: tipo.name,
                };
              })}
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <label style={{ width: "100%", padding: "5px 0" }}>
            Data do documento
          </label>
          <Flex align="baseline">
            <Form.Item name="data_documento_inicio" style={{ width: "100%" }}>
              <DatePicker
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                aria-label="Data do documento início"
                size="large"
              />
            </Form.Item>

            <span style={{ margin: "0 8px", alignContent: "center" }}>até</span>

            <Form.Item name="data_documento_fim" style={{ width: "100%" }}>
              <DatePicker
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                aria-label="Data do documento fim"
                size="large"
              />
            </Form.Item>
          </Flex>
        </Col>
      </Row>
      <Flex justify="end" gap={8} className="mt-4">
        <button
          className="btn btn-outline-success float-right"
          onClick={handleCleanFilter}
        >
          Limpar Filtros
        </button>
        <button className="btn btn-success float-right">Fitrar</button>
      </Flex>
    </Form>
  );
};
