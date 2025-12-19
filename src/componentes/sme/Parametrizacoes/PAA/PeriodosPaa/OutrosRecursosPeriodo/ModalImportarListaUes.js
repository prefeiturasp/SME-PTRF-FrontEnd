import {
  memo,
  useState,
  useEffect,
  useMemo,
  useContext,
  useCallback,
} from "react";
import { Form, Row, Col, Flex, Spin, Select } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { useGetTodos as useGetTodosPeriodosPAA } from "../hooks/useGet";
import { usePostOutroRecursoPeriodoImportarUnidades } from "./hooks/usePost";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { OutrosRecursosPeriodosPaaContext } from "./context/index";

const ModalImportarListaUes = ({ outroRecursoPeriodo, onSuccess = () => {} }) => {
  const [form] = Form.useForm();
  const { setShowModalImportarUEs, showModalImportarUEs } = useContext(
    OutrosRecursosPeriodosPaaContext
  );
  const onClose = useCallback(
    () => setShowModalImportarUEs(false),
    [setShowModalImportarUEs]
  );
  const [recursos, setRecursos] = useState([]);
  const [ehModoConfirmacao, setEhModoConfirmacao] = useState(false);
  const mutationImportarUnidades = usePostOutroRecursoPeriodoImportarUnidades();  

  const {
    data: dataPeriodos,
    isLoading: isLoadingPeriodos,
    refetch: refetchPeriodos,
  } = useGetTodosPeriodosPAA();

  useEffect(() => {
    if (showModalImportarUEs) {
      refetchPeriodos();
    } else {
      setRecursos([]);
      form.resetFields();
      setEhModoConfirmacao(false);
    }
  }, [showModalImportarUEs, refetchPeriodos, form]);

  const periodos = useMemo(() => {
    if (!dataPeriodos) return [];

    const { results } = dataPeriodos;

    const listaPeriodosDisponiveis = results.map((item) => ({
      value: item?.uuid,
      label: item?.referencia,
      outros_recursos: item?.outros_recursos,
    }));

    return listaPeriodosDisponiveis;
  }, [dataPeriodos]);

  const periodoSelecionado = Form.useWatch("periodo", form);
  const recursoSelecionado = Form.useWatch("periodo_recurso", form);

  const recursoSelecionadoObj = useMemo(() => {
    const x = recursos.filter((v) => v.value === recursoSelecionado)[0]?.raw;
    return x;
  }, [recursoSelecionado, recursos]);

  const podeContinuar = useMemo(() => {
    const selecionados = Boolean(periodoSelecionado && recursoSelecionado);
    return selecionados || ehModoConfirmacao;
  }, [periodoSelecionado, recursoSelecionado, ehModoConfirmacao]);

  const initialValues = {
    periodo: undefined,
    periodo_recurso: undefined,
  };

  const onSubmit = async (values) => {

     if (!recursoSelecionadoObj.unidades.length) {
        toastCustom.ToastCustomError(
            "Recurso sem unidades",
            "O recurso selecionado não possui unidades especificas para importação"
        );
        return;
    }
    
    if (!ehModoConfirmacao) {
      setEhModoConfirmacao(true);
      return;
    }

    // Vincula unidades
    try {
      const destino_uuid = outroRecursoPeriodo.uuid;
      const origem_uuid = values.periodo_recurso;

      await mutationImportarUnidades.mutateAsync({
        payload: { origem_uuid },
        uuid: destino_uuid,
      });
      onClose();
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  

  return (
    <ModalFormBodyText
      show={showModalImportarUEs}
      onHide={onClose}
      titulo={
        !ehModoConfirmacao
          ? "Importação lista de UEs"
          : "Confirmação de vinculação"
      }
      bodyText={  
          <Form
            form={form}
            onFinish={onSubmit}
            initialValues={initialValues}
            role="form"
            className="p-2"
          >
            <Row
              gutter={[16, 8]}
              className="mt-3"
              style={{ display: ehModoConfirmacao ? "none" : "block" }}
            >
              <Col md={24}>
                <Form.Item
                  label="Selecione o período de onde deseja importar a lista de UEs"
                  name="periodo"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 3 }}
                >
                  <Select
                    placeholder="Selecione o período"
                    style={{ width: "100%" }}
                    options={periodos}
                    loading={isLoadingPeriodos}
                    onChange={(_, option) => {
                      setRecursos([]);
                      form.setFieldsValue({ periodo_recurso: undefined });

                      const outrosRecursosFiltrado =
                        option.outros_recursos.filter(
                          (p) =>
                            p.outro_recurso !==
                            outroRecursoPeriodo.outro_recurso
                        );

                      if (!outrosRecursosFiltrado.length) {
                        toastCustom.ToastCustomError(
                          "Período sem recurso",
                          "O período selecionado não possui recursos associados"
                        );
                        return;
                      }

                      setRecursos(
                        outrosRecursosFiltrado.map((r) => ({
                          value: r.uuid,
                          label: r.outro_recurso_nome,
                          raw: r,
                        }))
                      );
                    }}
                  />
                </Form.Item>
              </Col>

              {recursos?.length ? (
                <Col md={24}>
                  <Form.Item
                    label="Selecione o recurso do período escolhido"
                    name="periodo_recurso"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 3 }}
                  >
                    <Select
                      placeholder="Selecione o recurso"
                      style={{ width: "100%" }}
                      options={recursos}
                    />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>

            {recursoSelecionadoObj ? (
              <div style={{ display: !ehModoConfirmacao ? "none" : "block" }}>
                <p>
                  Você está prestes a vincular{" "}
                  <b className="texto-legenda-cor-4">
                    {recursoSelecionadoObj.unidades.length === 0
                      ? "todas"
                      : recursoSelecionadoObj.unidades.length}{" "}
                    unidade(s)
                  </b>{" "}
                  selecionadas ao recurso{" "}
                  <b className="texto-legenda-cor-4">{outroRecursoPeriodo.outro_recurso_nome}</b>.
                </p>
                <p>
                  Após confirmar, todas a unidades da lista terão acesso a ele,
                  deseja prosseguir com a vinculação?
                </p>
              </div>
            ) : null}

            <Flex gap={16} justify="end" className="mt-3">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => {
                  if (ehModoConfirmacao) {
                    setEhModoConfirmacao(false);
                  } else {
                    onClose();
                  }
                }}
              >
                Cancelar
              </button>

              <Spin spinning={mutationImportarUnidades.isPending}>
                <button
                  type="submit"
                  disabled={!podeContinuar}
                  className="btn btn-can-be-disabled btn-success"
                >
                  {!ehModoConfirmacao ? "Importar" : "Confirmar vinculação"}
                </button>
              </Spin>
            </Flex>
          </Form>    
      }
    />
  );
};

export default memo(ModalImportarListaUes);
