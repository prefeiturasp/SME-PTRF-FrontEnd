import { memo, useState, useMemo, useEffectseRef } from "react";
import { useDispatch } from "react-redux";
import { Form, Row, Col, Flex, Spin, Typography, Select } from 'antd';
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { usePostImportarPrioridades } from "./hooks/usePostImportarPrioridades";
import { importaPrioridadesValidationSchema } from "./validationSchema";
import { CustomModalConfirm } from "../../../../../Globais/Modal/CustomModalConfirm";
import { toastCustom } from "../../../../../Globais/ToastCustom";

const ModalImportarPrioridades = ({ open, onClose, paas }) => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();

  const { mutationImportarPrioridades } = usePostImportarPrioridades(onClose);

  const isLoading = false;
  const initialValues = {
    uuid_paa_anterior: undefined,
  }

  const paasOptions = Array.isArray(paas) ? paas.map(item => ({
    value: item.uuid,
    label: item?.periodo_paa_objeto?.referencia
  })) : [];

  const onSubmit = async (values) => {
    try {
      const validationSchema = importaPrioridadesValidationSchema();
      await validationSchema.validate(values, { abortEarly: false });

      const uuid_paa_atual = localStorage.getItem("PAA")
      const uuid_paa_anterior = values.uuid_paa_anterior
      
      mutationImportarPrioridades.mutate(
        { uuid_paa_atual, uuid_paa_anterior, confirmar: 0},
        {
        onError: (e) => {
          if (e?.response?.data?.confirmar) {
            CustomModalConfirm({
              dispatch,
              title: "Confirma importação?",
              message: e.response.data.confirmar,
              cancelText: "Cancelar",
              confirmText: "Confirmar",
              dataQa: "modal-confirmar-importar-prioridades",
              isDanger: true,
              onConfirm: () => {
                mutationImportarPrioridades.mutate({
                  uuid_paa_atual,
                  uuid_paa_anterior,
                  confirmar: 1,
                });
                onClose();
              },
            });
          } else {
            const mensagemDeErro = e?.response?.data?.mensagem || "Houve um erro ao importar prioridades.";
            toastCustom.ToastCustomError(mensagemDeErro);
            console.error(e)
          }
        },
      }
      );
      
    } catch (validationErrors) {
      if (validationErrors.inner) {
        const errors = {};
        validationErrors.inner.forEach(error => {
          errors[error.path] = error.message;
        });
        const errorKeys = Object.keys(errors);
        form.setFields(
          Array.isArray(errorKeys) ? errorKeys.map(key => ({
            name: key,
            errors: [errors[key]]
          })) : []
        );
      }
    }
  };
  
  return (
    <ModalFormBodyText
      show={open}
      onHide={onClose}
      titulo={`Importação de PAA anterior`}
      // size="lg"
      bodyText={
        <Spin spinning={ isLoading }>
          <Form
            form={form}
            onFinish={onSubmit}
            initialValues={initialValues}
            role="form"
            className="p-2"
            >
            <Typography.Text>
                Selecione o ano em que deseja importar os dados para o PAA atual.
            </Typography.Text>
            <Row gutter={[16, 8]} className="mt-3">
              <Col md={24}>
                <Form.Item
                  label="Ano:"
                  name="uuid_paa_anterior"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 3 }}>
                  <Select
                    placeholder="Selecione um PAA"
                    style={{ width: "100%" }}
                    options={paasOptions}
                    onChange={() => form.setFields([{ name: 'uuid_paa_anterior', errors: [] }])}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Flex gap={16} justify="end" className="mt-3">
              <Spin spinning={mutationImportarPrioridades.isPending}>
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </Spin>
              <Spin spinning={mutationImportarPrioridades.isPending}>
                <button
                  type="submit"
                  className="btn btn btn-success btn-sm">
                  Importar
                </button>
              </Spin>
            </Flex>
          </Form>
        </Spin>
      }
    />
  );
};

export default memo(ModalImportarPrioridades);
