import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Typography,
} from "antd";
import { CloseCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom-v5-compat";
import { formatMoneyBRL } from "../../../../../utils/money";
import { useCallback, useEffect, useState } from "react";
import { getEspecificacoesCapital } from "../../../../../services/escolas/Despesas.service";

const { Text } = Typography;

export const ClassificarBem = ({
  items = [],
  cadastrarBens,
  salvarRascunhoClassificarBens,
  setBemProduzidoItems,
  setHabilitaCadastrarBem,
  habilitaCadastrarBem,
  total = 0,
}) => {
  const navigate = useNavigate();
  const [especificacoes, setEspecificacoes] = useState([]);
  const [form] = Form.useForm();

  const calcularTotalClassificado = (_items = []) => {
    return _items.reduce((acc, item) => {
      const quantidade = item?.quantidade || 0;
      const valor = item?.valor_individual || 0;
      return acc + quantidade * valor;
    }, 0);
  };

  const handleValuesChange = (_, allValues) => {
    const total = calcularTotalClassificado(allValues?.itens || []);
    form.setFieldsValue({ totalClassificado: total });

    const totalFaltante = getTotalFaltante();
    setHabilitaCadastrarBem(totalFaltante === 0);

    setBemProduzidoItems(allValues?.itens);
  };

  const getEspecificacoesData = async () => {
    const response = await getEspecificacoesCapital();
    setEspecificacoes(response);
  };

  useEffect(() => {
    getEspecificacoesData();
  }, []);

  const formatMaskedValue = (value) => {
    const digits = String(value || "")
      .replace(/\D/g, "")
      .slice(0, 16);

    let result = "";

    if (digits.length > 0) result += digits.slice(0, 4);
    if (digits.length >= 5) result += "." + digits.slice(4, 8);
    if (digits.length >= 9) result += "/" + digits.slice(8, 15);
    if (digits.length === 16) result += "-" + digits.slice(15, 16);

    return result;
  };

  const parseMaskedValue = (value) => {
    return value.replace(/\D/g, "").slice(0, 16);
  };

  const onFinish = () => {
    cadastrarBens();
  };

  const getTotalFaltante = useCallback(() => {
    const totalClassificado = form.getFieldValue("totalClassificado");

    const faltam = total - (totalClassificado || 0);
    return faltam;
  }, [total, form]);

  return (
    <div>
      <div
        style={{ backgroundColor: "rgba(245, 246, 248, 1)", height: 100 }}
        className="mt-4"
      >
        <h6 className="text-left pl-3 pt-3 pb-2">
          Valor total do(s) bem(ns) produzido(s):
        </h6>
        <p className="text-left pl-3">
          <strong>{"R$ " + formatMoneyBRL(total)}</strong>
        </p>
      </div>

      <h5 className="mt-5 mb-5">Classifique o bem</h5>

      <Form
        form={form}
        onValuesChange={handleValuesChange}
        onFinish={onFinish}
        layout="vertical"
        initialValues={{ itens: items }}
      >
        <Form.List name="itens">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <div
                  key={key}
                  style={{
                    marginBottom: 24,
                  }}
                >
                  <Flex justify="space-between" align="center">
                    <h6 style={{ color: "#01585e", fontWeight: 600 }}>
                      Item {index + 1}
                    </h6>
                    <Button
                      icon={<CloseCircleFilled />}
                      iconPosition={"left"}
                      type="text"
                      style={{ fontWeight: 600 }}
                      danger
                      onClick={() => remove(index)}
                    >
                      Remover item
                    </Button>
                  </Flex>

                  <hr
                    style={{
                      border: "1px solid #01585e",
                      marginTop: "8px",
                    }}
                  />

                  <Row gutter={[16, 16]}>
                    <Col md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "num_processo_incorporacao"]}
                        label="Número do processo de incorporação"
                        rules={[{ required: true, message: "Obrigatório" }]}
                      >
                        <InputNumber
                          placeholder="Digite número do processo de incorporação"
                          controls={false}
                          formatter={formatMaskedValue}
                          parser={parseMaskedValue}
                          style={{ width: "100%" }}
                          maxLength={19}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={12}>
                      <Form.Item
                        {...restField}
                        name={[name, "especificacao_do_bem"]}
                        label="Especificação do bem"
                        rules={[{ required: true, message: "Obrigatório" }]}
                      >
                        <Select
                          placeholder="Selecione uma especificação"
                          allowClear
                          options={especificacoes.map((especificacao) => {
                            return {
                              label: especificacao.descricao,
                              value: especificacao.uuid,
                            };
                          })}
                          style={{ width: "100%" }}
                          size="small"
                        ></Select>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]}>
                    <Col md={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "quantidade"]}
                        label="Quantidade"
                        rules={[{ required: true, message: "Obrigatório" }]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          controls={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item
                        {...restField}
                        name={[name, "valor_individual"]}
                        label="Valor Individual"
                        rules={[{ required: true, message: "Obrigatório" }]}
                      >
                        <InputNumber
                          min={0}
                          style={{ width: "100%" }}
                          controls={false}
                        />
                      </Form.Item>
                    </Col>
                    <Col md={8}>
                      <Form.Item label="Valor Total">
                        <Form.Item
                          noStyle
                          shouldUpdate={(prev, curr) =>
                            prev.itens?.[name]?.quantidade !==
                              curr.itens?.[name]?.quantidade ||
                            prev.itens?.[name]?.valor_individual !==
                              curr.itens?.[name]?.valor_individual
                          }
                        >
                          {() => {
                            const values = form.getFieldValue(["itens", name]);
                            const total =
                              (values?.quantidade || 0) *
                              (values?.valor_individual || 0);
                            return (
                              <Input
                                disabled
                                readOnly
                                value={`R$ ${total.toFixed(2)}`}
                              />
                            );
                          }}
                        </Form.Item>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              ))}
              <Flex justify="space-between" align="center">
                <Button
                  color="primary"
                  icon={<PlusOutlined />}
                  onClick={() => add()}
                >
                  Adicionar item
                </Button>
                <Form.Item shouldUpdate>
                  {() => {
                    const totalClassificado =
                      form.getFieldValue("totalClassificado") || 0;
                    const faltam = total - totalClassificado;
                    return (
                      <Text
                        style={{
                          color:
                            faltam > 0
                              ? "rgba(195, 0, 3, 1)"
                              : faltam === 0
                              ? "rgba(0, 88, 93, 1)"
                              : "rgba(195, 0, 3, 1)",
                        }}
                      >
                        {faltam > 0
                          ? `Faltam R$${faltam.toFixed(2)} para classificar`
                          : faltam === 0
                          ? `Valor total classificado com sucesso!`
                          : `Excedido em R$${Math.abs(faltam).toFixed(
                              2
                            )} o valor total permitido`}
                      </Text>
                    );
                  }}
                </Form.Item>
              </Flex>
            </>
          )}
        </Form.List>

        <Divider />

        <Flex justify="end" gap={8} className="mt-4">
          <button
            className="btn btn-outline-success float-right"
            type="button"
            onClick={() => navigate("/lista-situacao-patrimonial")}
          >
            Cancelar
          </button>
          <button
            className="btn btn-outline-success float-right"
            type="button"
            onClick={salvarRascunhoClassificarBens}
          >
            Salvar rascunho
          </button>
          <button
            className="btn btn-success float-right"
            type="submit"
            disabled={!habilitaCadastrarBem}
          >
            Cadastrar bem
          </button>
        </Flex>
      </Form>
    </div>
  );
};
