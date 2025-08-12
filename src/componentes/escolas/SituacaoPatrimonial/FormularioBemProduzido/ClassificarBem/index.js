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
import { useNavigate } from "react-router-dom";
import { formatMoneyBRL, parseMoneyCentsBRL } from "../../../../../utils/money";
import { useCallback, useEffect, useState } from "react";
import { getEspecificacoesCapital } from "../../../../../services/escolas/Despesas.service";
import {
  formatProcessoIncorporacao,
  parsetFormattedProcessoIncorporacao,
} from "../../../../../utils/Mascaras";

const { Text } = Typography;

export const ClassificarBem = ({
  items = [],
  salvar,
  salvarRacuscunho,
  setBemProduzidoItems,
  setHabilitaCadastrarBem,
  habilitaCadastrarBem,
  total = 0,
  statusCompletoBemProduzido,
  uuid,
}) => {
  const navigate = useNavigate();
  const [especificacoes, setEspecificacoes] = useState([]);
  const [form] = Form.useForm();

  const calcularTotalClassificado = useCallback((_items = []) => {
    const total = _items.reduce((acc, item) => {
      const quantidade = Number(item?.quantidade) || 0;
      const valor = Number(item?.valor_individual) || 0;
      return acc + quantidade * valor;
    }, 0);
    return total;
  }, []);

  const verificarCamposPreenchidos = useCallback((_items = []) => {
    if (!_items || _items.length === 0) return false;

    return _items.every((item) => {
      const numProcesso = item?.num_processo_incorporacao;
      const especificacao = item?.especificacao_do_bem;
      const quantidade = Number(item?.quantidade);
      const valorIndividual = Number(item?.valor_individual);

      const especificacaoValida =
        especificacao &&
        ((typeof especificacao === "string" && especificacao.trim() !== "") ||
          (typeof especificacao === "object" && especificacao?.uuid));

      return (
        numProcesso &&
        numProcesso.toString().trim() !== "" &&
        especificacaoValida &&
        quantidade > 0 &&
        valorIndividual > 0
      );
    });
  }, []);

  const handleValuesChange = (_, allValues) => {
    const total = calcularTotalClassificado(allValues?.itens || []);
    form.setFieldsValue({ totalClassificado: total });

    // Aguarda o próximo tick para garantir que o form foi atualizado
    setTimeout(() => {
      const totalFaltante = getTotalFaltante();
      const camposPreenchidos = verificarCamposPreenchidos(
        allValues?.itens || []
      );
      setHabilitaCadastrarBem(totalFaltante === 0 && camposPreenchidos);
    }, 0);

    const itensProcessados =
      allValues?.itens?.map((item) => ({
        ...item,
        especificacao_do_bem:
          typeof item.especificacao_do_bem === "object" &&
          item.especificacao_do_bem?.uuid
            ? item.especificacao_do_bem.uuid
            : item.especificacao_do_bem,
      })) || [];

    setBemProduzidoItems(itensProcessados);
  };

  const getEspecificacoesData = async () => {
    const response = await getEspecificacoesCapital();
    setEspecificacoes(response);
  };

  useEffect(() => {
    getEspecificacoesData();
  }, []);

  useEffect(() => {
    if (!items.length) {
      form.setFieldsValue({
        itens: [
          {
            num_processo_incorporacao: "",
            quantidade: null,
            valor_individual: null,
            especificacao_do_bem: null,
          },
        ],
      });
    } else {
      const transformedItems = items.map((item) => ({
        ...item,
        especificacao_do_bem:
          item.especificacao_do_bem?.uuid || item.especificacao_do_bem,
      }));

      form.setFieldsValue({
        itens: transformedItems,
      });
    }
  }, [items, form]);

  const onFinish = () => {
    salvar();
  };

  const getTotalFaltante = useCallback(() => {
    const totalClassificado = form.getFieldValue("totalClassificado");

    const faltam = total - (totalClassificado || 0);
    return faltam;
  }, [total, form]);

  // Recalcula o total quando os items mudarem
  useEffect(() => {
    if (items && items.length > 0) {
      const totalClassificado = calcularTotalClassificado(items);
      form.setFieldsValue({ totalClassificado });

      setTimeout(() => {
        const totalFaltante = getTotalFaltante();
        const camposPreenchidos = verificarCamposPreenchidos(items);
        setHabilitaCadastrarBem(totalFaltante === 0 && camposPreenchidos);
      }, 0);
    } else {
      // Se não há items, desabilita o botão
      setHabilitaCadastrarBem(false);
    }
  }, [
    items,
    form,
    getTotalFaltante,
    verificarCamposPreenchidos,
    calcularTotalClassificado,
  ]);

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
        initialValues={{ itens: [] }}
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
                          formatter={formatProcessoIncorporacao}
                          parser={parsetFormattedProcessoIncorporacao}
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
                          optionFilterProp="label"
                          showSearch
                          allowClear
                          style={{ width: "100%" }}
                          options={(especificacoes || []).map(
                            (especificacao) => {
                              return {
                                label: especificacao.descricao,
                                value: especificacao.uuid,
                              };
                            }
                          )}
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
                        rules={[
                          { required: true, message: "Obrigatório" },
                          {
                            validator(_, value) {
                              if (value > 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                "O valor deve ser maior que 0"
                              );
                            },
                          },
                        ]}
                      >
                        <InputNumber
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
                        rules={[
                          { required: true, message: "Obrigatório" },
                          {
                            validator(_, value) {
                              if (value > 0) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                "O valor deve ser maior que 0"
                              );
                            },
                          },
                        ]}
                      >
                        <InputNumber
                          style={{ width: "100%" }}
                          controls={false}
                          prefix="R$"
                          parser={parseMoneyCentsBRL}
                          formatter={formatMoneyBRL}
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
                                value={`R$ ${formatMoneyBRL(total)}`}
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
                  onClick={() =>
                    add({
                      num_processo_incorporacao: "",
                      especificacao_do_bem: "",
                      quantidade: "",
                      valor_individual: "",
                    })
                  }
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
                          ? `Faltam R$${formatMoneyBRL(
                              faltam
                            )} para classificar`
                          : faltam === 0
                          ? `Valor total classificado com sucesso!`
                          : `O valor total indicado no(s) item(ns) excede o valor das despesas informadas`}
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
            onClick={salvarRacuscunho}
          >
            {uuid ? "Salvar" : "Salvar rascunho"}
          </button>
        </Flex>
      </Form>
    </div>
  );
};
