import React, { memo, useCallback, useEffect, useMemo } from "react";
import { Form, Row, Col, Flex, InputNumber, Spin } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Icon } from "../../../../../Globais/UI/Icon";
import { usePostReceitasPrevistasOutrosRecursos } from "./hooks/usePostReceitasPrevistasOutrosRecursosPeriodo";
import { usePatchReceitasPrevistasOutrosRecursosPeriodo } from "./hooks/usePatchReceitasPrevistasOutrosRecursosPeriodo";
import { formatMoneyBRL, formatMoneyByCentsBRL, parseMoneyBRL } from "../../../../../../utils/money";
import "./style.css";

const initialValues = {
  saldo_atual_capital: 0,
  saldo_atual_custeio: 0,
  saldo_atual_livre: 0,
  total_custeio: 0,
  total_capital: 0,
  total_livre: 0,
};

const OutrosRecursosModalForm = ({ open, onClose, data }) => {
  const [form] = Form.useForm();
  const recursoConfig = useMemo(() => data?.outro_recurso_objeto, [data]);
  const isLoading = false;
  const { mutationPost } = usePostReceitasPrevistasOutrosRecursos(onClose);
  const { mutationPatch } = usePatchReceitasPrevistasOutrosRecursosPeriodo(onClose);

  Form.useWatch("saldo_capital", form);
  Form.useWatch("saldo_custeio", form);
  Form.useWatch("saldo_livre", form);
  Form.useWatch("previsao_valor_capital", form);
  Form.useWatch("previsao_valor_custeio", form);
  Form.useWatch("previsao_valor_livre", form);

  const valorZeroOuPositivo = (valor) => {
    const val = parseFloat(valor || 0);
    return val < 0 ? 0 : val;
  };

  useEffect(() => {
    if (data) {
      const {
        saldo_capital,
        saldo_custeio,
        saldo_livre,
        previsao_valor_capital,
        previsao_valor_custeio,
        previsao_valor_livre,
      } = data;

      form.setFieldsValue({
        saldo_capital: valorZeroOuPositivo(saldo_capital) * 100,
        saldo_custeio: valorZeroOuPositivo(saldo_custeio) * 100,
        saldo_livre: valorZeroOuPositivo(saldo_livre) * 100,
        previsao_valor_capital: previsao_valor_capital * 100,
        previsao_valor_custeio: previsao_valor_custeio * 100,
        previsao_valor_livre: previsao_valor_livre * 100,

        // TOTAIS
        total_custeio: previsao_valor_custeio + valorZeroOuPositivo(saldo_custeio),
        total_capital: previsao_valor_capital + valorZeroOuPositivo(saldo_capital),
        total_livre: previsao_valor_livre + valorZeroOuPositivo(saldo_livre),
      });
    }
  }, [data]);

  const onValuesChange = (_, allValues) => {
    const saldoCusteio = Number(allValues.saldo_custeio || 0);
    const previstoCusteio = Number(allValues.previsao_valor_custeio || 0);

    const saldoCapital = Number(allValues.saldo_capital || 0);
    const previstoCapital = Number(allValues.previsao_valor_capital || 0);

    const saldoLivre = Number(allValues.saldo_livre || 0);
    const previstoLivre = Number(allValues.previsao_valor_livre || 0);

    form.setFieldsValue({
      total_custeio: (saldoCusteio + previstoCusteio) / 100,
      total_capital: (saldoCapital + previstoCapital) / 100,
      total_livre: (saldoLivre + previstoLivre) / 100,
    });
  };

  const onSubmit = (values) => {
    const payload = {
      paa: localStorage.getItem("PAA"),
      outro_recurso_periodo: data?.uuid,
      saldo_custeio: values.saldo_custeio / 100,
      saldo_capital: values.saldo_capital / 100,
      saldo_livre: values.saldo_livre / 100,
      previsao_valor_custeio: values.previsao_valor_custeio / 100,
      previsao_valor_capital: values.previsao_valor_capital / 100,
      previsao_valor_livre: values.previsao_valor_livre / 100,
    };

    const { receitas_previstas } = data;

    if (receitas_previstas.length) {
      mutationPatch.mutate({ uuid: receitas_previstas[0].uuid, payload });
    } else {
      mutationPost.mutate({ payload });
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

  const toolTip = (texto) => (
    <Icon
      tooltipMessage={texto}
      icon="faExclamationCircle"
      iconProps={{
        style: { fontSize: "16px", marginLeft: 4},
      }}
    />
  );

  const toolTipValorNegativo = () => {
    const texto = "O saldo negativo não será computado para o cálculo, será considerado o valor R$0,00.";
    return toolTip(texto);
  };

  const toolTipReceitaPrevistaOrientacao = () => {
    const texto =
      "Orienta-se somar todos os valores recebidos de Custeio, Capital e Livre Aplicação ao longo do último ano.";
    return toolTip(texto);
  };

  const ehCampoDesabilitado = useCallback(
    (campoNome) => {
      if (!recursoConfig) return false;

      return !recursoConfig[campoNome];
    },
    [recursoConfig],
  );

  return (
    <ModalFormBodyText
      show={open}
      titulo={`Recurso ${data ? data?.nome : ""}`}
      onHide={onClose}
      size="lg"
      bodyText={
        <Spin spinning={isLoading || mutationPatch.isPending || mutationPost.isPending}>
          <Form
            form={form}
            onFinish={onSubmit}
            onValuesChange={onValuesChange}
            initialValues={initialValues}
            role="form"
            className="p-2"
          >
            <Row gutter={[16, 16]} style={{ marginBottom: 16, color: "rgba(66, 71, 74, 1)" }}>
              <Col md={8}>Saldo reprogramado</Col>

              <Col md={8}>
                <Flex align="center">Receita Prevista {toolTipReceitaPrevistaOrientacao()}</Flex>
              </Col>
              <Col md={8}>Total</Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Flex align="end">
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label={
                        <>
                          Custeio{" "}
                          {
                            /* Exibe tooltip quando o valor for negativo */
                            (form?.getFieldsValue()?.saldo_custeio || 0) < 0 && toolTipValorNegativo()
                          }
                        </>
                      }
                      name="saldo_custeio"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={inputRules}
                    >
                      <InputNumber
                        className="input-number-right"
                        placeholder="00,00"
                        formatter={ehCampoDesabilitado("aceita_custeio") ? () => "-" : formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled={ehCampoDesabilitado("aceita_custeio")}
                        controls={false}
                      />
                    </Form.Item>
                    <Icon icon="faPlus" iconProps={{ className: "pb-3" }} />
                  </Flex>
                </Col>

                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Custeio"
                      name="previsao_valor_custeio"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={inputRules}
                    >
                      <InputNumber
                        className="input-number-right"
                        placeholder="00,00"
                        formatter={ehCampoDesabilitado("aceita_custeio") ? () => "-" : formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        controls={false}
                        disabled={ehCampoDesabilitado("aceita_custeio")}
                      />
                    </Form.Item>
                    <Icon icon="faEquals" iconProps={{ className: "pb-3" }} />
                  </Flex>
                </Col>

                <Col md={8}>
                  <Form.Item label="Custeio" name="total_custeio" labelCol={{ span: 24 }} style={{ marginBottom: 8 }}>
                    <InputNumber
                      className="input-number-right"
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parseMoneyBRL}
                      style={{ width: "100%" }}
                      disabled
                      controls={false}
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
                      label={
                        <>
                          Capital{" "}
                          {
                            /* Exibe tooltip quando o valor for negativo */
                            (form?.getFieldsValue()?.saldo_capital || 0) < 0 && toolTipValorNegativo()
                          }
                        </>
                      }
                      name="saldo_capital"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={inputRules}
                    >
                      <InputNumber
                        className="input-number-right"
                        placeholder="00,00"
                        formatter={ehCampoDesabilitado("aceita_capital") ? () => "-" : formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled={ehCampoDesabilitado("aceita_capital")}
                        controls={false}
                      />
                    </Form.Item>
                    <Icon icon="faPlus" iconProps={{ className: "pb-3" }} />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Capital"
                      name="previsao_valor_capital"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={inputRules}
                    >
                      <InputNumber
                        className="input-number-right"
                        placeholder="00,00"
                        formatter={ehCampoDesabilitado("aceita_capital") ? () => "-" : formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        controls={false}
                        disabled={ehCampoDesabilitado("aceita_capital")}
                      />
                    </Form.Item>
                    <Icon icon="faEquals" iconProps={{ className: "pb-3" }} />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Form.Item label="Capital" name="total_capital" labelCol={{ span: 24 }} style={{ marginBottom: 8 }}>
                    <InputNumber
                      className="input-number-right"
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parseMoneyBRL}
                      style={{ width: "100%" }}
                      disabled
                      controls={false}
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
                      label={
                        <>
                          Livre Aplicação{" "}
                          {
                            /* Exibe tooltip quando o valor for negativo */
                            (form?.getFieldsValue()?.saldo_livre || 0) < 0 && toolTipValorNegativo()
                          }
                        </>
                      }
                      name="saldo_livre"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={inputRules}
                    >
                      <InputNumber
                        className="input-number-right"
                        placeholder="00,00"
                        formatter={ehCampoDesabilitado("aceita_livre_aplicacao") ? () => "-" : formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled={ehCampoDesabilitado("aceita_livre_aplicacao")}
                        controls={false}
                      />
                    </Form.Item>
                    <Icon icon="faPlus" iconProps={{ className: "pb-3" }} />
                  </Flex>
                </Col>
                <Col md={8}>
                  <Flex align="end" gap={8}>
                    <Form.Item
                      label="Livre Aplicação"
                      name="previsao_valor_livre"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                      rules={inputRules}
                    >
                      <InputNumber
                        className="input-number-right"
                        placeholder="00,00"
                        formatter={ehCampoDesabilitado("aceita_livre_aplicacao") ? () => "-" : formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        controls={false}
                        disabled={ehCampoDesabilitado("aceita_livre_aplicacao")}
                      />
                    </Form.Item>
                    <Icon icon="faEquals" iconProps={{ className: "pb-3" }} />
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
                      className="input-number-right"
                      placeholder="00,00"
                      formatter={formatMoneyBRL}
                      parser={parseMoneyBRL}
                      style={{ width: "100%" }}
                      disabled
                      controls={false}
                    />
                  </Form.Item>
                </Col>
              </Flex>
            </Row>

            <Flex gap={16} justify="end" className="mt-3">
              <button type="button" className="btn btn-outline-success" onClick={onClose}>
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

export default memo(OutrosRecursosModalForm);
