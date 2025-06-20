import React, { memo, useEffect } from "react";
import { Form, Row, Col, Flex, InputNumber, Spin } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { Icon } from "../../../../../Globais/UI/Icon";
import { usePostReceitasPrevistasPaa } from "./hooks/usePostReceitasPrevistasPaa";
import { usePatchReceitasPrevistasPaa } from "./hooks/usePatchReceitasPrevistasPaa";
import { formataData } from "../../../../../../utils/FormataData";
import {
  formatMoneyBRL,
  formatMoneyByCentsBRL,
  parseMoneyBRL,
} from "../../../../../../utils/money";
import "./style.css";

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

  const dadosPaaLocalStorage = () => JSON.parse(localStorage.getItem('DADOS_PAA'))

  const data = acaoAssociacao.saldos;
  const isLoading = false;
  const { mutationPost } = usePostReceitasPrevistasPaa(onClose);
  const { mutationPatch } = usePatchReceitasPrevistasPaa(onClose);

  const receitaPrevistaPaa = acaoAssociacao?.receitas_previstas_paa.length
    ? acaoAssociacao?.receitas_previstas_paa[0]
    : null;

  Form.useWatch("saldo_atual_capital", form);
  Form.useWatch("saldo_atual_custeio", form);
  Form.useWatch("saldo_atual_livre", form);

 const valorZeroOuPositivo = (valor) => {
    const val = parseFloat(valor || 0)
    return val < 0 ? 0 : val
 }

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
      const saldo_atual_custeio = receitaPrevistaPaa?.saldo_congelado_custeio || data.saldo_atual_custeio;
      const saldo_atual_capital = receitaPrevistaPaa?.saldo_congelado_capital || data.saldo_atual_capital;
      const saldo_atual_livre = receitaPrevistaPaa?.saldo_congelado_livre || data.saldo_atual_livre;

      form.setFieldsValue({
        saldo_atual_capital: saldo_atual_capital,
        saldo_atual_custeio: saldo_atual_custeio,
        saldo_atual_livre: saldo_atual_livre,
        valor_capital: valor_capital * 100,
        valor_custeio: valor_custeio * 100,
        valor_livre: total_livre * 100,
        total_custeio: valor_custeio + valorZeroOuPositivo(saldo_atual_custeio),
        total_capital: valor_capital + valorZeroOuPositivo(saldo_atual_capital),
        total_livre: total_livre + valorZeroOuPositivo(saldo_atual_livre),
      });
    }
  }, [data, acaoAssociacao]);

  const onValuesChange = (values) => {
    const formValues = form.getFieldsValue();

    if (values.valor_custeio) {
      form.setFieldValue(
        "total_custeio",
        valorZeroOuPositivo(formValues.saldo_atual_custeio) + parseFloat(values.valor_custeio) / 100
      );
    }
    if (values.valor_capital) {
      form.setFieldValue(
        "total_capital",
        valorZeroOuPositivo(formValues.saldo_atual_capital) + parseFloat(values.valor_capital) / 100
      );
    }
    if (values.valor_livre) {
      form.setFieldValue(
        "total_livre",
        valorZeroOuPositivo(formValues.saldo_atual_livre) + parseFloat(values.valor_livre) / 100
      );
    }
  };

  const onSubmit = (values) => {
    const payload = {
      paa: localStorage.getItem("PAA"),
      acao_associacao: acaoAssociacao.uuid,
      previsao_valor_custeio: values.valor_custeio / 100,
      previsao_valor_capital: values.valor_capital / 100,
      previsao_valor_livre: values.valor_livre / 100,
    };

    if (receitaPrevistaPaa) {
      mutationPatch.mutate({ uuid: receitaPrevistaPaa.uuid, payload });
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
      iconProps={
        { style: { fontSize: "16px", marginLeft: 4, color: "#086397" }}
      }
    />
  )

  const toolTipValorNegativo = () => {
    const texto = "O saldo negativo não será computado para o cálculo, será considerado o valor R$0,00."
    return toolTip(texto)
  }

  const toolTipReceitaPrevistaOrientacao = () => {
    const texto = "Orienta-se somar todos os valores recebidos de Custeio, Capital e Livre Aplicação ao longo do último ano."
    return toolTip(texto)
  }

  const getDataCongeladoOuAtual = () => {
    return !!dadosPaaLocalStorage()?.saldo_congelado_em ?
              formataData(dadosPaaLocalStorage()?.saldo_congelado_em, 'DD/MM/YYYY HH:mm') :
              formataData(new Date())
  }

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
              <Col md={8}>
                Saldo em {getDataCongeladoOuAtual()}
              </Col>

              <Col md={8}>
                <Flex align="center">
                  Receita Prevista {toolTipReceitaPrevistaOrientacao()}
                </Flex>
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
                          Custeio {
                            /* Exibe tooltip quando o valor for negativo */
                            (form?.getFieldsValue()?.saldo_atual_custeio||0) < 0 &&
                            toolTipValorNegativo()
                          }
                        </>
                      }
                      name="saldo_atual_custeio"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled
                        controls={false}
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
                      rules={inputRules}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        controls={false}
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
                          Capital {
                            /* Exibe tooltip quando o valor for negativo */
                            (form?.getFieldsValue()?.saldo_atual_capital||0) < 0 &&
                            toolTipValorNegativo()
                          }
                        </>
                      }
                      name="saldo_atual_capital"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled
                        controls={false}
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
                      rules={inputRules}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        controls={false}
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
                          Livre Aplicação {
                            /* Exibe tooltip quando o valor for negativo */
                            (form?.getFieldsValue()?.saldo_atual_livre||0) < 0 &&
                            toolTipValorNegativo()
                          }
                        </>
                      }
                      name="saldo_atual_livre"
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 8 }}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        disabled
                        controls={false}
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
                      rules={inputRules}
                    >
                      <InputNumber
                        placeholder="00,00"
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                        style={{ width: "100%" }}
                        min={0}
                        controls={false}
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
                      controls={false}
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
