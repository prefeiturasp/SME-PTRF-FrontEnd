import { useEffect, useState } from "react";
import { Form, Input, Row, Col, Divider, Flex, Checkbox, Spin, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import { CustomModalConfirm } from "../../../../Globais/Modal/CustomModalConfirm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  deleteTipoDeCusteio,
  getTipoCusteio,
  patchAlterarTipoDeCusteio,
  postCreateTipoDeCusteio,
} from "../../../../../services/sme/Parametrizacoes.service";
import { VincularUnidades } from "./components/VincularUnidades";
import { UnidadesVinculadas } from "./components/UnidadesVinculadas";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const TipoDeDespesaCusteioForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const selecionarTodasState = location.state?.selecionar_todas;

  const { uuid } = useParams();

  const isNew = uuid === undefined;

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES = RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

  Form.useWatch("selecionar_todas", form);

  const fetchTipoCusteio = async () => {
    try {
      const respData = await getTipoCusteio(uuid);
      form.setFieldsValue({
        ...respData,
        selecionar_todas:
          selecionarTodasState !== undefined ? selecionarTodasState : respData.todas_unidades_selecionadas,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isNew) {
      form.setFieldsValue({
        nome: "",
        selecionar_todas: true,
      });
      setLoading(false);
    } else {
      fetchTipoCusteio();
    }
  }, [uuid]);

  const handleSubmit = async (values) => {
    try {
      await form.validateFields();

      const payload = {
        nome: values.nome,
        selecionar_todas: values.selecionar_todas,
      };

      if (uuid) {
        await patchAlterarTipoDeCusteio(uuid, payload);
        toastCustom.ToastCustomSuccess("Sucesso!", "Edição do tipo de despesa de custeio realizado com sucesso.");
        goToParametroTiposCusteio();
      } else {
        const resp = await postCreateTipoDeCusteio(payload);

        toastCustom.ToastCustomSuccess("Sucesso!", "Cadastro do tipo de despesa de custeio realizado com sucesso.");
        if (values.selecionar_todas) {
          goToParametroTiposCusteio();
        } else {
          navigate(`/edicao-tipo-de-despesa-custeio/${resp.uuid}`, {
            state: { selecionar_todas: false },
          });
        }
      }
    } catch (e) {
      if (e.response.data && e.response.data.non_field_errors) {
        toastCustom.ToastCustomError(
          uuid ? "Alteração não permitida" : "Inclusão não permitida",
          "Já existe um tipo de despesa de custeio com esse nome."
        );
      } else {
        toastCustom.ToastCustomError("Erro!", "Houve um erro ao tentar realizar operação.");
        form.setFieldValue("selecionar_todas", true);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTipoDeCusteio(uuid);
      toastCustom.ToastCustomSuccess("Sucesso!", "O tipo de despesa de custeio foi removido do sistema com sucesso.");
      goToParametroTiposCusteio();
    } catch (e) {
      if (e.response && e.response.data && e.response.data.mensagem) {
        const errorMsg = e.response.data.mensagem;
        toastCustom.ToastCustomError("Exclusão não permitida", errorMsg);
      } else {
        toastCustom.ToastCustomError("Houve um erro ao tentar excluir tipo de despesa de custeio.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    CustomModalConfirm({
      dispatch,
      title: "Excluir tipo de despesa de custeio",
      message: "Tem certeza que deseja excluir esse tipo de despesa de custeio?",
      cancelText: "Voltar",
      confirmText: "Excluir",
      dataQa: "modal-confirmar-excluir-tipo-de-despesa-custeio",
      isDanger: true,
      onConfirm: () => handleDelete(),
    });
  };

  const goToParametroTiposCusteio = () => {
    navigate("/parametro-tipos-custeio");
  };

  const handleTodasUnidades = (e) => {
    if (e.target.checked === false && isNew) {
      handleSubmit(form.getFieldsValue());
    }
    form.setFieldValue("selecionar_todas", e.target.checked);
  };

  return (
    <Spin spinning={loading}>
      <Flex justify="flex-end">
        <span>* Preenchimento obrigatório</span>
      </Flex>
      <Form form={form} onFinish={handleSubmit} disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES} role="form">
        <Row>
          <Col md={24}>
            <Form.Item
              label="Nome"
              name="nome"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "Campo obrigatório" }]}
              disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
              <Input name="nome" placeholder="Nome" />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <Flex gutter={8} align="end">
          <h6 className="m-0">Unidades vinculadas ao tipo de despesa de custeio</h6>
          <Tooltip title="Unidades vinculadas ao tipo de despesa de custeio">
            <FontAwesomeIcon
              style={{
                fontSize: "16px",
                marginLeft: 4,
                color: "#086397",
              }}
              icon={faExclamationCircle}
            />
          </Tooltip>
        </Flex>

        <Form.Item
          name="selecionar_todas"
          labelCol={{ span: 24 }}
          className="mt-4"
          valuePropName="checked"
          disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
        >
          <Checkbox onChange={handleTodasUnidades}>Todas as unidades</Checkbox>
        </Form.Item>

        {uuid && form.getFieldValue("selecionar_todas") === false ? (
          <>
            <UnidadesVinculadas UUID={uuid} />
            <h6 className="my-5">Vincular unidades ao tipo de despesa de custeio</h6>
            <VincularUnidades UUID={uuid} />
          </>
        ) : null}

        <Divider />

        <Flex gap="small" justify={uuid ? "space-between" : "flex-end"}>
          {uuid ? (
            <button
              onClick={handleConfirmDelete}
              type="button"
              className="btn btn btn-danger mt-2 mr-2"
              disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
              Excluir
            </button>
          ) : null}
          <Flex gap={16}>
            <div className="p-Y bd-highlight">
              <button type="button" className="btn btn-outline-success" onClick={goToParametroTiposCusteio}>
                Cancelar
              </button>
            </div>

            <div className="p-Y bd-highlight">
              <button
                type="submit"
                className="btn btn btn-success"
                disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
              >
                Salvar
              </button>
            </div>
          </Flex>
        </Flex>
      </Form>
    </Spin>
  );
};
