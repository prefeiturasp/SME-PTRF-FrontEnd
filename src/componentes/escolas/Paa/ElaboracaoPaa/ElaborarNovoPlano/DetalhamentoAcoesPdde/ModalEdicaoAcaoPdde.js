import React, { memo, useEffect } from "react";
import { Form, Row, Col, Flex, InputNumber, Spin } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Icon } from "../../../../../Globais/UI/Icon";
import { usePatchAcaoPdde } from './hooks/usePatchAcaoPdde';
import {
  formatMoneyBRL,
  formatMoneyByCentsBRL,
  parseMoneyBRL,
} from "../../../../../../utils/money";

const initialValues = {
  saldo_valor_capital: 0,
  saldo_valor_custeio: 0,
  saldo_valor_livre_aplicacao: 0,
  previsao_valor_custeio: 0,
  previsao_valor_capital: 0,
  previsao_valor_livre_aplicacao: 0,
  total_custeio: 0,
  total_capital: 0,
  total_livre: 0,
};

const ModalEdicaoAcaoPdde = ({ open, onClose, acaoPdde }) => {
  const [form] = Form.useForm();

  const isLoading = false;
  const { mutationPatch } = usePatchAcaoPdde(onClose);

  Form.useWatch("saldo_valor_capital", form);
  Form.useWatch("saldo_valor_custeio", form);
  Form.useWatch("saldo_valor_livre_aplicacao", form);
  Form.useWatch("previsao_valor_custeio", form);
  Form.useWatch("previsao_valor_capital", form);
  Form.useWatch("previsao_valor_livre_aplicacao", form);

  useEffect(() => {
    if (acaoPdde) {
      form.setFieldsValue({
        saldo_valor_capital: parseFloat(acaoPdde.saldo_valor_capital || 0) * 100,
        saldo_valor_custeio: parseFloat(acaoPdde.saldo_valor_custeio || 0) * 100,
        saldo_valor_livre_aplicacao: parseFloat(acaoPdde.saldo_valor_livre_aplicacao || 0) * 100,
        previsao_valor_custeio: parseFloat(acaoPdde.previsao_valor_custeio || 0) * 100,
        previsao_valor_capital: parseFloat(acaoPdde.previsao_valor_capital || 0) * 100,
        previsao_valor_livre_aplicacao: parseFloat(acaoPdde.previsao_valor_livre_aplicacao || 0) * 100,
        total_custeio: parseFloat(acaoPdde.saldo_valor_custeio || 0) + parseFloat(acaoPdde.previsao_valor_custeio || 0),
        total_capital: parseFloat(acaoPdde.saldo_valor_capital || 0) + parseFloat(acaoPdde.previsao_valor_capital || 0),
        total_livre: parseFloat(acaoPdde.saldo_valor_livre_aplicacao || 0) + parseFloat(acaoPdde.previsao_valor_livre_aplicacao || 0),
      });
    }
  }, [acaoPdde, form, open]);

  const onValuesChange = (values) => {
    const formValues = form.getFieldsValue();
    
    const saldoCusteio = (formValues.saldo_valor_custeio || 0) / 100;
    const previsaoCusteio = (formValues.previsao_valor_custeio || 0) / 100;
    const saldoCapital = (formValues.saldo_valor_capital || 0) / 100;
    const previsaoCapital = (formValues.previsao_valor_capital || 0) / 100;
    const saldoLivre = (formValues.saldo_valor_livre_aplicacao || 0) / 100;
    const previsaoLivre = (formValues.previsao_valor_livre_aplicacao || 0) / 100;
  
    form.setFieldsValue({
      total_custeio: saldoCusteio + previsaoCusteio,
      total_capital: saldoCapital + previsaoCapital,
      total_livre: saldoLivre + previsaoLivre,
    });
  };

  const onSubmit = (values) => {
    const payload = {
      acao_associacao: acaoPdde.id,
      saldo_valor_custeio: values.saldo_valor_custeio / 100,
      saldo_valor_capital: values.saldo_valor_capital  / 100,
      saldo_valor_livre_aplicacao: values.saldo_valor_livre_aplicacao  / 100,
      previsao_valor_custeio: values.previsao_valor_custeio / 100,
      previsao_valor_capital: values.previsao_valor_capital / 100,
      previsao_valor_livre_aplicacao: values.previsao_valor_livre_aplicacao / 100,
      nome: acaoPdde.nome,
      categoria: acaoPdde.categoria_objeto.id,
    };

    if (acaoPdde.uuid) {
      mutationPatch.mutate({ uuid: acaoPdde.uuid, payload });
    }
  };

  const inputRules = [
    { required: true, message: "Campo obrigatório" },
    {
      type: "number",
      min: 0,
      message: "O valor deve ser maior ou igual a zero",
    },
  ];

  return (
    <ModalFormBodyText
      show={open}
      titulo={`Editar Recurso ${acaoPdde ? acaoPdde.nome : ""}`}
      onHide={onClose}
      size="lg"
      bodyText={
        <Spin
          spinning={
            isLoading || mutationPatch.isLoading
          }
        >
          <Form
            form={form}
            onFinish={onSubmit}
            onValuesChange={onValuesChange}
            initialValues={initialValues}
            role="form"
            className="p-2"
          >
            <Row
              gutter={[16, 16]}
              style={{ marginBottom: 16, color: "rgba(66, 71, 74, 1)" }}
            >
              <Col md={8}>
                <Flex align="center">
                  Saldo reprogramado
                  <Icon
                    tooltipMessage="Orienta-se somar todos os valores recebidos de Custeio, Capital e Livre Aplicação ao longo do último ano."
                    icon="faExclamationCircle"
                    iconProps={{
                      style: {
                        fontSize: "16px",
                        marginLeft: 4,
                        color: "#086397",
                      },
                    }}
                  />
                </Flex>
              </Col>
              <Col md={8}>
                <Flex align="center">
                  Receita prevista 
                </Flex>
              </Col>
              <Col md={8}>Total</Col>
            </Row>

            {/* Custeio Row */}
            <Row gutter={[16, 16]}>
              <Flex align="end">
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Custeio"
                      name="saldo_valor_custeio"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={acaoPdde && acaoPdde.aceita_custeio ? inputRules : null}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled={acaoPdde && !acaoPdde.aceita_custeio}
                      />
                    </Form.Item>
                    <Icon
                      icon="icone-soma-primary"
                      iconProps={{ className: "pb-3" }}
                    />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Custeio"
                      name="previsao_valor_custeio"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={acaoPdde && acaoPdde.aceita_custeio ? inputRules : null}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        disabled={acaoPdde && !acaoPdde.aceita_custeio}
                      />
                    </Form.Item>
                    <Icon
                      icon="icone-igual-primary"
                      iconProps={{ className: "pb-3" }}
                    />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Custeio"
                    name="total_custeio"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parseMoneyBRL}
                      style={{ width: "100%" }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Flex>
            </Row>

            {/* Capital Row */}
            <Row gutter={[16, 16]}>
              <Flex align="end">
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Capital"
                      data-testid="saldo_valor_capital"
                      name="saldo_valor_capital"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={acaoPdde && acaoPdde.aceita_capital ? inputRules : null}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled={acaoPdde && !acaoPdde.aceita_capital}
                      />
                    </Form.Item>
                    <Icon
                      icon="icone-soma-primary"
                      iconProps={{ className: "pb-3" }}
                    />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Capital"
                      name="previsao_valor_capital"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={acaoPdde && acaoPdde.aceita_capital ? inputRules : null}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        disabled={acaoPdde && !acaoPdde.aceita_capital}
                      />
                    </Form.Item>
                    <Icon
                      icon="icone-igual-primary"
                      iconProps={{ className: "pb-3" }}
                    />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Capital"
                    name="total_capital"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parseMoneyBRL}
                      style={{ width: "100%" }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Flex>
            </Row>

            {/* Livre Aplicação Row */}
            <Row gutter={[16, 16]}>
              <Flex align="end">
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Livre Aplicação"
                      name="saldo_valor_livre_aplicacao"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={acaoPdde && acaoPdde.aceita_livre_aplicacao ? inputRules : null}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled={acaoPdde && !acaoPdde.aceita_livre_aplicacao}
                      />
                    </Form.Item>
                    <Icon
                      icon="icone-soma-primary"
                      iconProps={{ className: "pb-3" }}
                    />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Livre Aplicação"
                      name="previsao_valor_livre_aplicacao"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={acaoPdde && acaoPdde.aceita_livre_aplicacao ? inputRules : null}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        disabled={acaoPdde && !acaoPdde.aceita_livre_aplicacao}
                      />
                    </Form.Item>
                    <Icon
                      icon="icone-igual-primary"
                      iconProps={{ className: "pb-3" }}
                    />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Form.Item
                    label="Livre Aplicação"
                    name="total_livre"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parseMoneyBRL}
                      style={{ width: "100%" }}
                      disabled
                    />
                  </Form.Item>
                </Col>
              </Flex>
            </Row>

            <Flex gap={16} justify="end" className="mt-3">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={onClose}
              >
                Cancelar
              </button>

              <button 
                type="submit" 
                className="btn btn btn-success"
                disabled={acaoPdde && !acaoPdde.aceita_livre_aplicacao && !acaoPdde.aceita_capital && !acaoPdde.aceita_custeio}
              >
                Salvar
              </button>
            </Flex>
          </Form>
        </Spin>
      }
    />
  );
};

export default memo(ModalEdicaoAcaoPdde);