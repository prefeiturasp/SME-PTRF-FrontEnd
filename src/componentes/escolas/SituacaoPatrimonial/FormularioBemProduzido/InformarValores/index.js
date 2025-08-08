import React, { useEffect, useState } from "react";
import { Flex, Form, InputNumber } from "antd";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { formataData } from "../../../../../utils/FormataData";
import {
  formatMoneyBRL,
  formatMoneyByCentsBRL,
  parseMoneyBRL,
} from "../../../../../utils/money";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { CustomModalConfirm } from "../../../../Globais/Modal/CustomModalConfirm";
import { BarraAcaoEmLote } from "./BarraAcaoEmLote";
import { usePostExluirDespesaBemProduzidoEmLote } from "../hooks/usePostExluirDespesaBemProduzidoEmLote";
import { useWatch } from "antd/es/form/Form";

export const InformarValores = ({
  uuid,
  despesas: data = [],
  salvarRacuscunho,
  setRateiosComValores,
  rateiosComValores,
  setHabilitaClassificarBem,
  step,
  statusCompletoBemProduzido
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState(null);
  const [despesasSelecionadas, setDespesasSelecionadas] = useState([]);
  const [total, setTotal] = useState(0);
  const [formValues, setFormValues] = useState({});

  const { mutationPost: mutationPostExcluirLote } =
    usePostExluirDespesaBemProduzidoEmLote(setDespesasSelecionadas);

  useEffect(() => {
    if ((!rateiosComValores || rateiosComValores.length === 0) && data.length) {
      const rateios = [];
      data.forEach(despesa => {
        (despesa.rateios || []).forEach(rateio => {
          rateios.push({
            uuid: rateio.uuid,
            bem_produzido_despesa: despesa.bem_produzido_despesa_uuid,
            valor_utilizado: Number(rateio.bem_produzido_rateio_valor_utilizado) || 0,
          });
        });
      });
      setRateiosComValores(rateios);
    }
    // eslint-disable-next-line
  }, []);

  // Função para calcular o total de todas as despesas
  const calcularTotalDespesas = (valoresForm) => {
    if (!valoresForm?.despesas) return 0;
    
    return (valoresForm.despesas || []).reduce((total, despesaForm, despesaIdx) => {
      if (!despesaForm || !Array.isArray(despesaForm.rateios)) return total;
      const despesaData = data[despesaIdx];
      return total + despesaForm.rateios.reduce((soma, rateioForm, rateioIdx) => {
        // Se o valor foi alterado no formulário, usa ele; senão, usa o valor original do backend
        let valorUtilizado = rateioForm?.valor_utilizado;
        if (valorUtilizado == null || valorUtilizado === undefined) {
          valorUtilizado =
            despesaData?.rateios?.[rateioIdx]?.bem_produzido_rateio_valor_utilizado != null
              ? Number(despesaData.rateios[rateioIdx].bem_produzido_rateio_valor_utilizado) * 100
              : 0;
        }
        return soma + (Number(valorUtilizado) / 100);
      }, 0);
    }, 0);
  };

  useEffect(() => {
    if (data.length) {
      const despesasComValoresIniciais = data.map((despesa) => ({
        rateios: despesa.rateios.map((rateio) => ({
          uuid: rateio.uuid,
          valor_utilizado: rateio.bem_produzido_rateio_valor_utilizado != null
          ? Math.round(Number(rateio.bem_produzido_rateio_valor_utilizado) * 100) // para centavos
          : null,
        })),
      }));

      despesasComValoresIniciais.forEach((despesa) => {
        despesa.rateios.forEach((rateio) => {
          const rateioComValor = rateiosComValores.find((r) => r.uuid === rateio.uuid);
          if (rateioComValor) {
            rateio.valor_utilizado = rateioComValor.valor_utilizado * 100;
          }
        })
      })

      form.setFieldsValue({
        despesas: despesasComValoresIniciais,
      });
      setFormValues({ despesas: despesasComValoresIniciais });
    }
  }, [data]);

  useEffect(() => {
    const total = calcularTotalDespesas(form.getFieldValue());
    setTotal(total);
  }, [step]);

  const dataTemplate = (rowData, column) => {
    return formataData(rowData.data_documento);
  };

  const moneyTemplate = (rowData, column) => {
    return "R$ " + formatMoneyBRL(rowData.valor_total);
  };

  const onValuesChange = () => {
    const values = form.getFieldValue();
    const rateiosComValores = getRateiosComValores();
    const validationErrors = validateDespesas(values);

    const peloMenosUmRateioPorDespesa = (values.despesas || []).every(
      (despesa) => (despesa.rateios || []).some((rateio) => rateio.valor_utilizado > 0)
    );
    setHabilitaClassificarBem(validationErrors.length === 0 && peloMenosUmRateioPorDespesa);
    setRateiosComValores(rateiosComValores);
  };

  useEffect(() => {
    const values = form.getFieldValue();
    const peloMenosUmRateioPorDespesa = (values?.despesas || []).every(
      (despesa) => (despesa.rateios || []).some((rateio) => Number(rateio.valor_utilizado) > 0)
    );
    setHabilitaClassificarBem(peloMenosUmRateioPorDespesa);
  }, [step, form]);

  const handleSaveRascunho = (values) => {
    const validationErrors = validateDespesas(values);

    if (validationErrors.length > 0) {
      return CustomModalConfirm({
        dispatch,
        title: "Atenção!",
        message: "Informe pelo menos um valor utilizado por despesa.",
        cancelText: "Ok",
      });
    }

    salvarRacuscunho();
  };

  const getRateiosComValores = () => {
    const values = form.getFieldValue();

    const rateiosComValores = values.despesas.flatMap((despesa) =>
      despesa.rateios.map((rateio) => ({
          uuid: rateio.uuid,
          bem_produzido_despesa: rateio.bem_produzido_despesa_uuid,
          valor_utilizado: rateio.valor_utilizado != null ? rateio.valor_utilizado / 100 : 0,
        }))
    );

    return rateiosComValores;
  };

  const expandedRowTemplate = (item) => {
    const index = data.findIndex((row) => row.uuid === item.uuid);

    const despesaItem = (title, valor) => (
      <div className="d-flex">
        <span>
          <strong>{title}</strong>
        </span>
        <p className="pl-1 m-0">{valor}</p>
      </div>
    );

    return (
      <Form.List name={["despesas", index, "rateios"]}>
        {(rateiosFields) =>
          rateiosFields.map(({ key: rateioKey, name: rateioIndex }) => {
            const rateio = data[index].rateios[rateioIndex];

            const valorUtilizadoForm = formValues?.despesas?.[index]?.rateios?.[rateioIndex]?.valor_utilizado;
            const valorUtilizado =
              valorUtilizadoForm != null && valorUtilizadoForm !== undefined
                ? valorUtilizadoForm
                : rateio.bem_produzido_rateio_valor_utilizado != null
                  ? Number(rateio.bem_produzido_rateio_valor_utilizado) * 100
                  : 0;

            return (
              <div key={rateioKey} className="mt-4">
                <h6 style={{ color: "#01585e", fontWeight: 600 }}>
                  Despesa {rateioIndex + 1}
                  <hr style={{ border: "1px solid #01585e" }} />
                </h6>

                <div className="row">
                  <div className="col-md-4">
                    {despesaItem(
                      "Aplicação do recurso:",
                      rateio.aplicacao_recurso
                    )}
                  </div>
                  <div className="col-md-8">
                    {despesaItem(
                      "Especificação do material ou serviço:",
                      rateio?.especificacao_material_servico?.descricao
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    {despesaItem("Ação:", rateio.acao_associacao.acao.nome)}
                  </div>
                  <div className="col-md-8">
                    {despesaItem(
                      `Valor total da despesa ${rateioIndex + 1}:`,
                      "R$ " + formatMoneyBRL(rateio.valor_rateio)
                    )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4">
                    {despesaItem(
                      `Conta:`,
                      rateio?.conta_associacao?.tipo_conta?.nome
                    )}
                  </div>
                  <div className="col-md-8">
                    {despesaItem(
                      `Valor disponível para utilização:`,
                      "R$ " + formatMoneyBRL(
                        Math.max(
                          (Number(rateio.valor_disponivel) || 0) +
                          (Number(rateio.bem_produzido_rateio_valor_utilizado) || 0) -
                          (Number(valorUtilizado) / 100),
                          0
                        )
                      )
                    )}
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <div className="col-md-3">
                    <Form.Item
                      label="Valor utilizado:"
                      name={[rateioIndex, "valor_utilizado"]}
                      labelCol={{ span: 24 }}
                      style={{ marginBottom: 12, fontWeight: 700 }}
                      rules={[
                        {
                          validator(_, value) {
                            const valorDigitado = Number(toNumber(value)) / 100;
                            const valorDisponivel =
                              Number(toNumber(rateio.valor_disponivel)) +
                              Number(toNumber(rateio.bem_produzido_rateio_valor_utilizado));
                            const valorDigitadoFixed = Math.round(valorDigitado * 100) / 100;
                            const valorDisponivelFixed = Math.round(valorDisponivel * 100) / 100;

                            if (valorDigitadoFixed > valorDisponivelFixed) {
                              setHabilitaClassificarBem(false);
                              return Promise.reject(
                                new Error("Maior que o valor disponível para utilização")
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="0,00"
                        style={{ width: "100%" }}
                        controls={false}
                        disabled={rateio.valor_disponivel - parseFloat(rateio.bem_produzido_rateio_valor_utilizado) === 0}
                        formatter={formatMoneyByCentsBRL}
                        parser={parseMoneyBRL}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
            );
          })
        }
      </Form.List>
    );
  };

  const validateDespesas = (formValues) => {
    const errors = [];
    const despesas = formValues.despesas || [];

    data.forEach((dataItem, despesaIndex) => {
      const formDespesa = despesas[despesaIndex];
      const rateios = formDespesa?.rateios || [];

      const hasValidValue = rateios.some(
        (rateio) =>
          rateio?.valor_utilizado !== null &&
          rateio?.valor_utilizado !== undefined &&
          rateio?.valor_utilizado > 0
      );

      if (!hasValidValue) {
        errors.push({
          despesaIndex: despesaIndex,
          message: `Despesa ${
            despesaIndex + 1
          }: Informe pelo menos um valor utilizado por despesa`,
        });
      }
    });

    return errors;
  };

  const handleExcluirDespesa = () => {
    const bemProduzidoDespesasUUIDs = despesasSelecionadas.map(
      (despesa) => despesa.bem_produzido_despesa_uuid
    );

    CustomModalConfirm({
      dispatch,
      title: "Excluir despesa",
      message: "Tem certeza que deseja excluir a despesa selecionada?",
      cancelText: "Voltar",
      confirmText: "Excluir",
      isDanger: true,
      onConfirm: () =>
        mutationPostExcluirLote.mutate({
          uuid: uuid,
          payload: { uuids: bemProduzidoDespesasUUIDs },
        }),
    });
  };

  function toNumber(val) {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <h5 className="mt-5 mb-5">
          Informar valores utilizados na produção do bem
        </h5>

        <p className="mb-2">
          Exibindo <span className="total">{data.length}</span> items
        </p>

        {despesasSelecionadas.length > 0 ? (
          <BarraAcaoEmLote
            setDespesasSelecionadas={setDespesasSelecionadas}
            despesasSelecionadas={despesasSelecionadas}
            handleExcluirDespesa={handleExcluirDespesa}
          />
        ) : null}

        <Form
          form={form}
          onFinish={handleSaveRascunho}
          layout="vertical"
          onValuesChange={(changed, allValues) => {
            const total = calcularTotalDespesas(allValues);
            setTotal(total);
            setFormValues(allValues);
            onValuesChange(changed);
          }}
        >
          <DataTable
            value={data}
            autoLayout={true}
            selection={despesasSelecionadas}
            onSelectionChange={(e) => setDespesasSelecionadas(e.value)}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={expandedRowTemplate}
          >
            <Column selectionMode="multiple" style={{ width: "3em" }} />
            <Column field="periodo_referencia" header="Período" />
            <Column field="numero_documento" header="Nº do documento" />
            <Column
              field="data_documento"
              header="Data do documento"
              body={dataTemplate}
            />
            <Column field="tipo_documento.nome" header="Tipo de Documento" />
            <Column field="valor_total" header="Valor" body={moneyTemplate} />
            <Column expander style={{ width: "5%", borderLeft: "none" }} />
          </DataTable>

          <div
            style={{ backgroundColor: "rgba(245, 246, 248, 1)", height: 100 }}
            className="mt-4"
          >
            <h6 className="text-right pr-3 pt-3 pb-2">
              Valor total do(s) bem(ns) produzido(s):
            </h6>
            <p className="text-right pr-3">
              <strong>{"R$ " + formatMoneyBRL(total)}</strong>
            </p>
          </div>

          <Flex justify="end" gap={8} className="mt-4">
            <button
              className="btn btn-outline-success float-right"
              type="button"
              onClick={() => navigate("/lista-situacao-patrimonial")}
            >
              Cancelar
            </button>
            <button className="btn btn-outline-success float-right">
              {uuid ? "Salvar" : "Salvar rascunho"}
            </button>
          </Flex>
        </Form>
      </div>
    </div>
  );
};
