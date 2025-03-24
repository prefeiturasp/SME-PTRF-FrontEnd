import React, { memo, useEffect } from "react";
import moment from "moment";
import { Form, Input, Row, Col, Flex, InputNumber } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Icon } from "../../../../../Globais/UI/Icon";
import { useGetSaldoAtual } from "./hooks/useGetSaldoAtual";

const ReceitasPrevistasModalForm = ({ open, onClose, acaoAssociacao }) => {
  const [form] = Form.useForm();

  const { data, isLoading } = useGetSaldoAtual(acaoAssociacao?.uuid);

  Form.useWatch("saldo_atual_capital", form);
  Form.useWatch("saldo_atual_custeio", form);
  Form.useWatch("saldo_atual_livre", form);

  const onValuesChange = (values) => {
    const formValues = form.getFieldsValue();

    if (values.valor_custeio) {
      form.setFieldValue(
        "total_custeio",
        formValues.saldo_atual_custeio + parseFloat(values.valor_custeio)
      );
    }
    if (values.valor_capital) {
      form.setFieldValue(
        "total_capital",
        formValues.saldo_atual_capital + parseFloat(values.valor_capital)
      );
    }
    if (values.valor_livre) {
      form.setFieldValue(
        "total_livre",
        formValues.saldo_atual_livre + parseFloat(values.valor_livre)
      );
    }
  };
  const format = (value) => {
    return value
      ? Number(value).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "00,00";
  };

  const parser = (value) => {
    return value ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : 0;
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        saldo_atual_capital: data.saldo_atual_capital,
        saldo_atual_custeio: data.saldo_atual_custeio,
        saldo_atual_livre: data.saldo_atual_livre,
      });
    }
  }, [data]);

  if (!acaoAssociacao || isLoading) return null;

  return (
    <ModalFormBodyText
      show={open}
      titulo={`Recurso ${acaoAssociacao.nome}`}
      onHide={onClose}
      size="lg"
      bodyText={
        <Form
          form={form}
          onFinish={null}
          onValuesChange={onValuesChange}
          role="form"
          className="p-2"
        >
          <Row
            gutter={[16, 16]}
            style={{ marginBottom: 16, color: "rgba(66, 71, 74, 1)" }}
          >
            <Col md={8}>
              Saldo em {moment(new Date(), "YYYY-MM-DD").format("DD/MM/YYYY")}
            </Col>
            <Col md={8}>Receita Prevista</Col>
            <Col md={8}>Total</Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Flex align="end">
              <Col md={8}>
                <Flex align="end" gap={8}>
                  <Form.Item
                    label="Custeio"
                    name="saldo_atual_custeio"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <Input type="number" placeholder="0,00" disabled />
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
                    name="valor_custeio"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      placeholder="00,00"
                      formatter={format}
                      parser={parser}
                      style={{ width: "100%" }}
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
                  <Input type="number" placeholder="0,00" disabled />
                </Form.Item>
              </Col>
            </Flex>
          </Row>

          <Row gutter={[16, 16]}>
            <Flex align="end">
              <Col md={8}>
                <Flex align="end" gap={8}>
                  <Form.Item
                    label="Capital"
                    name="saldo_atual_capital"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <Input type="number" placeholder="0,00" disabled />
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
                    name="valor_capital"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      placeholder="00,00"
                      formatter={format}
                      parser={parser}
                      style={{ width: "100%" }}
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
                  name="total_capital"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 8 }}
                >
                  <Input type="number" placeholder="0,00" disabled />
                </Form.Item>
              </Col>
            </Flex>
          </Row>

          <Row gutter={[16, 16]}>
            <Flex align="end">
              <Col md={8}>
                <Flex align="end" gap={8}>
                  <Form.Item
                    label="Livre Aplicação"
                    name="saldo_atual_livre"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <Input type="number" placeholder="0,00" disabled />
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
                    name="valor_livre"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 8 }}
                  >
                    <InputNumber
                      placeholder="00,00"
                      formatter={format}
                      parser={parser}
                      style={{ width: "100%" }}
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
                  <Input type="number" placeholder="0,00" disabled />
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

            <button type="submit" className="btn btn btn-success">
              Salvar
            </button>
          </Flex>
        </Form>
      }
    />
  );
};

export default memo(ReceitasPrevistasModalForm);
