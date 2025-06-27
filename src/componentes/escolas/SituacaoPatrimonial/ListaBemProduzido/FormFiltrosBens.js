import { Col, DatePicker, Flex, Form, Input, Row, Select } from "antd";
import momentGenerateConfig from "rc-picker/lib/generate/moment";
const DatePickerCustom = DatePicker.generatePicker(momentGenerateConfig);

export const FormFiltrosBens = ({
  acaoOptions = [],
  tipoContaOptions = [],
  periodoOptions = [],
  onFiltrar,
  onFiltrosChange,
  onLimparFiltros,
  filtroSalvo,
  onCancelarFiltros,
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
      especificacao_bem: "",
      fornecedor: "",
      acao_associacao_uuid: undefined,
      conta_associacao_uuid: undefined,
      periodos_uuid: undefined,
      data_inicio: "",
      data_fim: "",
    });
    onLimparFiltros && onLimparFiltros();
  };

  const handleCancelFilter = () => {
    form.setFieldsValue(filtroSalvo);
    onCancelarFiltros && onCancelarFiltros();
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
            label="Filtro por especificação do material ou serviço"
            name="especificacao_bem"
            labelCol={{ span: 24 }}
          >
            <Input
              name="especificacao_bem"
              placeholder="Digite uma especificação"
              size="large"
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label="Filtrar por fornecedor"
            name="fornecedor"
            labelCol={{ span: 24 }}
          >
            <Input
              name="fornecedor"
              placeholder="Digite um fornecedor"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <Form.Item
            label="Filtrar por ação"
            name="acao_associacao_uuid"
            labelCol={{ span: 24 }}
            allowClear
          >
            <Select
              size="large"
              placeholder="Selecione uma ação"
              options={acaoOptions.map((acao) => {
                return {
                  value: acao.uuid,
                  label: acao.nome,
                };
              })}
            />
          </Form.Item>
        </Col>
        <Col md={12}>
          <Form.Item
            label="Filtrar por conta"
            name="conta_associacao_uuid"
            labelCol={{ span: 24 }}
            allowClear
          >
            <Select
              size="large"
              placeholder="Selecione a conta"
              options={tipoContaOptions.map((conta) => {
                return {
                  value: conta.uuid,
                  label: conta.nome,
                };
              })}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col md={12}>
          <Form.Item
            label="Filtrar por período"
            name="periodos_uuid"
            labelCol={{ span: 24 }}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Selecione o período"
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
            Filtrar por data do documento
          </label>
          <Flex align="baseline">
            <Form.Item name="data_inicio" style={{ width: "100%" }}>
              <DatePickerCustom
                format={"DD/MM/YYYY"}
                className="mt-1"
                style={{ width: "100%" }}
                aria-label="Data do documento início"
                size="large"
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
                size="large"
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
            onClick={handleCancelFilter}
            type="button"
          >
            Cancelar
        </button>
        <button
          className="btn btn-outline-success float-right"
          onClick={handleCleanFilter}
          type="button"
        >
          Limpar Filtros
        </button>
        <button className="btn btn-success float-right">Filtrar</button>
      </Flex>
    </Form>
  );
};
