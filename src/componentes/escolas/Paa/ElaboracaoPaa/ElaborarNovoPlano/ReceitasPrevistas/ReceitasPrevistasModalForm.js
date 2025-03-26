import React, { memo, useEffect } from "react";
import { Form, Row, Col, Flex, InputNumber, Spin } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Icon } from "../../../../../Globais/UI/Icon";
import { useGetSaldoAtual } from "./hooks/useGetSaldoAtual";
import { usePostReceitasPrevistasPaa } from "./hooks/usePostReceitasPrevistasPaa";
import { usePatchReceitasPrevistasPaa } from "./hooks/usePatchReceitasPrevistasPaa";
import { formataData } from "../../../../../../utils/FormataData";
import { formatMoneyBRL } from "../../../../../../utils/money";

const initialValues = {
  saldo_atual_capital: 0,
  saldo_atual_custeio: 0,
  saldo_atual_livre: 0,
  total_custeio: 0,
  total_capital: 0,
  total_livre: 0,
};

const ReceitasPrevistasModalForm = ({ open, onClose, acaoAssociacao }) => {
  const [form] = Form.useForm();

  const { data, isLoading } = useGetSaldoAtual(acaoAssociacao?.uuid);
  const { mutationPost } = usePostReceitasPrevistasPaa(onClose);
  const { mutationPatch } = usePatchReceitasPrevistasPaa(onClose);

  const receitaPrevistaPaa = acaoAssociacao?.receitas_previstas_paa.length
    ? acaoAssociacao?.receitas_previstas_paa[0]
    : null;

  Form.useWatch("saldo_atual_capital", form);
  Form.useWatch("saldo_atual_custeio", form);
  Form.useWatch("saldo_atual_livre", form);

  useEffect(() => {
    if (data && acaoAssociacao) {
      const valor_custeio = receitaPrevistaPaa
        ? parseFloat(receitaPrevistaPaa.previsao_valor_custeio)
        : null;
      const valor_capital = receitaPrevistaPaa
        ? parseFloat(receitaPrevistaPaa.previsao_valor_capital)
        : null;
      const total_livre = receitaPrevistaPaa
        ? parseFloat(receitaPrevistaPaa.previsao_valor_livre)
        : null;
      const saldo_atual_custeio = data.saldo_atual_capital;
      const saldo_atual_capital = data.saldo_atual_capital;
      const saldo_atual_livre = data.saldo_atual_livre;

      form.setFieldsValue({
        saldo_atual_capital: saldo_atual_capital,
        saldo_atual_custeio: saldo_atual_custeio,
        saldo_atual_livre: saldo_atual_livre,
        valor_capital: valor_capital,
        valor_custeio: valor_custeio,
        valor_livre: total_livre,
        total_custeio: valor_custeio + saldo_atual_custeio,
        total_capital: valor_capital + saldo_atual_capital,
        total_livre: total_livre + saldo_atual_livre,
      });
    }
  }, [data, acaoAssociacao]);

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

  const parser = (value) => {
    return value ? parseFloat(value.replace(/\./g, "").replace(",", ".")) : 0;
  };

  const onSubmit = (values) => {
    const payload = {
      acao_associacao: acaoAssociacao.id,
      previsao_valor_custeio: values.valor_custeio,
      previsao_valor_capital: values.valor_capital,
      previsao_valor_livre: values.valor_livre,
    };

    if (receitaPrevistaPaa) {
      mutationPatch.mutate({ uuid: receitaPrevistaPaa.uuid, payload });
    } else {
      mutationPost.mutate({ payload });
    }
  };

  return (
    <ModalFormBodyText
      show={open}
      titulo={`Recurso ${acaoAssociacao ? acaoAssociacao.acao.nome : ""}`}
      onHide={onClose}
      size="lg"
      bodyText={
        <Spin
          spinning={
            isLoading || mutationPatch.isLoading || mutationPost.isLoading
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
              <Col md={8}>Saldo em {formataData(new Date())}</Col>
              <Col md={8}>
                <Flex align="center">
                  Receita Prevista
                  <Icon
                    tooltipMessage="Dica de tela"
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
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
                        parser={parser}
                        style={{ width: "100%" }}
                        disabled
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
                      name="valor_custeio"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
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
                    <InputNumber
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parser}
                      style={{ width: "100%" }}
                      disabled
                    />
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
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
                        parser={parser}
                        style={{ width: "100%" }}
                        disabled
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
                      name="valor_capital"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
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
                    <InputNumber
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parser}
                      style={{ width: "100%" }}
                      disabled
                    />
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
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
                        parser={parser}
                        style={{ width: "100%" }}
                        disabled
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
                      name="valor_livre"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={[{ required: true, message: "Campo obrigatório" }]}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
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
                    <InputNumber
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parser}
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

              <button type="submit" className="btn btn btn-success">
                Salvar
              </button>
            </Flex>
          </Form>
        </Spin>
      }
    />
  );
};

export default memo(ReceitasPrevistasModalForm);
