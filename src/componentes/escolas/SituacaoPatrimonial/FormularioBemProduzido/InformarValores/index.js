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
import { useNavigate } from "react-router-dom-v5-compat";
import { useDispatch } from "react-redux";
import { CustomModalConfirm } from "../../../../Globais/Modal/CustomModalConfirm";
import { BarraAcaoEmLote } from "./BarraAcaoEmLote";
import { usePostExluirDespesaBemProduzidoEmLote } from "../hooks/usePostExluirDespesaBemProduzidoEmLote";

export const InformarValores = ({
  uuid,
  despesas: data = [],
  salvarRascunhoInformarValores,
}) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [expandedRows, setExpandedRows] = useState(null);
  const [despesasSelecionadas, setDespesasSelecionadas] = useState([]);
  const [total, setTotal] = useState(0);

  const { mutationPost: mutationPostExcluirLote } =
    usePostExluirDespesaBemProduzidoEmLote(setDespesasSelecionadas);

  useEffect(() => {
    if (data.length) {
      const despesasComValoresIniciais = data.map((bemProduzido) => ({
        rateios: bemProduzido.despesa.rateios.map((rateio) => ({
          uuid: rateio.uuid,
          bem_produzido_despesa_uuid: bemProduzido.bem_produzido_despesa_uuid,
          valor_utilizado: null,
        })),
      }));

      form.setFieldsValue({
        despesas: despesasComValoresIniciais,
      });

      const total = despesasComValoresIniciais.reduce((acc, despesa) => {
        return (
          acc +
          despesa.rateios.reduce((sum, rateio) => {
            return sum + (rateio.valor_utilizado / 100 ?? 0);
          }, 0)
        );
      }, 0);

      setTotal(total);
    }
  }, [data]);

  const dataTemplate = (rowData, column) => {
    return formataData(rowData.data_documento);
  };

  const moneyTemplate = (rowData, column) => {
    return "R$ " + formatMoneyBRL(rowData.despesa.valor_total);
  };

  const handleSaveRascunho = (values) => {
    const validationErrors = validateDespesas(values);

    if (validationErrors.length > 0) {
      CustomModalConfirm({
        dispatch,
        title: "Atenção!",
        message: "Informe pelo menos um valor utilizado por despesa.",
        cancelText: "Ok",
        dataQa: "modal-confirmar-salvar-processo-SEI",
      });
    }

    const rateiosComValores = values.despesas.flatMap((despesa) =>
      despesa.rateios
        .filter(
          (rateio) =>
            rateio.valor_utilizado !== null && rateio.valor_utilizado !== 0
        )
        .map((rateio) => ({
          uuid: rateio.uuid,
          bem_produzido_despesa: rateio.bem_produzido_despesa_uuid,
          valor_utilizado: rateio.valor_utilizado / 100,
        }))
    );

    salvarRascunhoInformarValores(rateiosComValores);
  };

  const expandedRowTemplate = (item) => {
    const index = data.findIndex(
      (row) =>
        row.bem_produzido_despesa_uuid === item.bem_produzido_despesa_uuid
    );

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
            const rateio = data[index].despesa.rateios[rateioIndex];

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
                      rateio.especificacao_material_servico.descricao
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
                      rateio.conta_associacao.tipo_conta.nome
                    )}
                  </div>
                  <div className="col-md-8">
                    {despesaItem(
                      `Valor disponível para utilização:`,
                      "R$ " + formatMoneyBRL(rateio.valor_disponivel)
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
                            if (rateio.valor_disponivel === 0)
                              return Promise.resolve();
                            if (value / 100 > rateio.valor_disponivel)
                              return Promise.reject(
                                new Error(
                                  "Maior que o valor disponível para utilização"
                                )
                              );
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber
                        placeholder="0,00"
                        style={{ width: "100%" }}
                        controls={false}
                        disabled={rateio.valor_disponivel === 0}
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
            const total = allValues.despesas
              ?.flatMap((d) => d.rateios || [])
              .reduce(
                (sum, r) => sum + (Number(r.valor_utilizado / 100) || 0),
                0
              );

            setTotal(total);
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
            <Column field="despesa.periodo_referencia" header="Período" />
            <Column field="despesa.numero_documento" header="Nº do documento" />
            <Column
              field="despesa.data_documento"
              header="Data do documento"
              body={dataTemplate}
            />
            <Column
              field="despesa.tipo_documento.nome"
              header="Tipo de Documento"
            />
            <Column
              field="despesa.valor_total"
              header="Valor"
              body={moneyTemplate}
            />
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
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button className="btn btn-outline-success float-right">
              Salvar rascunho
            </button>
          </Flex>
        </Form>
      </div>
    </div>
  );
};
