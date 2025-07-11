import { Col, DatePicker, Flex, Form, Input, Row, Select } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
const DatePickerCustom = DatePicker.generatePicker(momentGenerateConfig);

export const FormFiltrosDespesas = ({
  contaOptions = [],
  periodoOptions = [],
  onFiltrar,
  onFiltrosChange,
  onLimparFiltros,
}) => {
  const [form] = Form.useForm();

  const handleFilter = (values) => {
    onFiltrar && onFiltrar(values);
  };

  const onValuesChange = () => {
    const values = form.getFieldsValue();
    onFiltrosChange && onFiltrosChange(values);
  };

  const handleCleanFilter = () => {
    form.setFieldsValue({
      fornecedor: "",
      search: "",
      rateios__conta_associacao__uuid: "",
      periodo__uuid: "",
      data_inicio: "",
      data_fim: "",
    });
    onLimparFiltros && onLimparFiltros();
  };
  return (
    <Form
      form={form}
      onFinish={handleFilter}
      onValuesChange={onValuesChange}
      role="form"
    >
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
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label="Filtrar por Material ou Serviço"
            name="search"
            labelCol={{ span: 24 }}
          >
            <Input name="search" placeholder="Digite Material ou Serviço" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col md={6}>
          <Form.Item
            label="Filtrar por conta"
            name="rateios__conta_associacao__uuid"
            labelCol={{ span: 24 }}
            allowClear
          >
            <Select
              placeholder="Selecione"
              options={contaOptions.map((conta) => {
                return {
                  value: conta.uuid,
                  label: conta.nome,
                };
              })}
            />
          </Form.Item>
        </Col>
        <Col md={6}>
          <Form.Item
            label="Filtrar por período"
            name="periodo__uuid"
            labelCol={{ span: 24 }}
          >
            <Select
              placeholder="Selecione"
              allowClear
              options={periodoOptions.map((tipo) => {
                return {
                  value: tipo.uuid,
                  label: tipo.referencia,
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
            <Form.Item name="data_inicio" style={{ width: "100%" }}>
              <DatePickerCustom
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                aria-label="Data do documento início"
                disabledDate={(current) => {
                  const dataFim = form.getFieldValue("data_fim");
                  return dataFim && current && current.isAfter(dataFim, "day");
                }}
              />
            </Form.Item>

            <span style={{ margin: "0 8px", alignContent: "center" }}>até</span>

            <Form.Item name="data_fim" style={{ width: "100%" }}>
              <DatePickerCustom
                format={"DD/MM/YYYY"}
                style={{ width: "100%" }}
                aria-label="Data do documento fim"
                disabledDate={(current) => {
                  const dataInicio = form.getFieldValue("data_inicio");
                  return (
                    dataInicio && current && current.isBefore(dataInicio, "day")
                  );
                }}
              />
            </Form.Item>
          </Flex>
        </Col>
      </Row>
      <Flex justify="end" gap={8} className="mt-4">
        <button
          className="btn btn-outline-success float-right"
          onClick={handleCleanFilter}
          type="button"
        >
          Limpar Filtros
        </button>
        <button className="btn btn-success float-right">Fitrar</button>
      </Flex>
    </Form>
  );
};
