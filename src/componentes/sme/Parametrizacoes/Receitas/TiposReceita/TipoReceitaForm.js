import { useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  Radio,
  Divider,
  Flex,
  Checkbox,
  Spin,
} from "antd";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useDispatch } from "react-redux";
import { useGetFiltrosTiposReceita } from "./hooks/useGetFiltrosTiposReceita";
import { usePostTipoReceita } from "./hooks/usePostTipoReceita";
import { usePatchTipoReceita } from "./hooks/usePatchTipoReceita";
import { useGetTipoReceita } from "./hooks/useGetTipoReceita";
import { useDeleteTipoReceita } from "./hooks/useDeleteTipoReceita";
import { CustomModalConfirm } from "../../../../Globais/Modal/CustomModalConfirm";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { useNavigate } from "react-router-dom-v5-compat";
import { EscolheUnidade } from "../../../../Globais/EscolheUnidade";
import { UnidadesAssociadas } from "./components/UnidadesAssociadas/Lista";

const { TextArea } = Input;

export const TipoReceitaForm = () => {
  const [form] = Form.useForm();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uuid } = useParams();

  const { data: filtros } = useGetFiltrosTiposReceita();
  const { mutationPost } = usePostTipoReceita();
  const { mutationPatch } = usePatchTipoReceita();
  const { mutationDelete } = useDeleteTipoReceita();
  const { data, isLoading } = useGetTipoReceita(uuid);

  const TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES =
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes();

  Form.useWatch("todas_unidades", form);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        tipos_conta: data.tipos_conta.map((tipoConta) => tipoConta.uuid),
        categoria: getValorCategoria({
          e_rendimento: data.e_rendimento,
          e_devolucao: data.e_devolucao,
          e_estorno: data.e_estorno,
          e_repasse: data.e_repasse,
        }),
        aceita: getValorAceita({
          aceita_capital: data.aceita_capital,
          aceita_custeio: data.aceita_custeio,
          aceita_livre: data.aceita_livre,
        }),
        detalhes: data.detalhes.map((detalhe) => detalhe.id),
      });
    }
  }, [data]);

  const {
    tiposContaOpcoes = filtros.tipos_contas,
    aceitaOpcoes = filtros.aceita,
    categoriaOpcoes = filtros.tipos,
    detalhesOpcoes = filtros.detalhes,
  } = filtros;

  const getValorAceita = (opcoes) => {
    let aceita = [];
    if (opcoes.aceita_capital) {
      aceita.push("aceita_capital");
    }
    if (opcoes.aceita_custeio) {
      aceita.push("aceita_custeio");
    }
    if (opcoes.aceita_livre) {
      aceita.push("aceita_livre");
    }
    return aceita;
  };

  const getValorCategoria = (opcoes) => {
    if (opcoes.e_rendimento) {
      return "e_rendimento";
    } else if (opcoes.e_devolucao) {
      return "e_devolucao";
    } else if (opcoes.e_estorno) {
      return "e_estorno";
    } else if (opcoes.e_repasse) {
      return "e_repasse";
    } else {
      return "";
    }
  };

  const handleSubmit = (values) => {
    let payload = {
      nome: values.nome,
      tipos_conta: values.tipos_conta,
      unidades: [],
      detalhes: values.detalhes,
      mensagem_usuario: values.mensagem_usuario,
      possui_detalhamento: values.possui_detalhamento,
      e_recursos_proprios: values.e_recursos_proprios,
      e_rendimento: values.categoria === "e_rendimento" ? true : false,
      e_devolucao: values.categoria === "e_devolucao" ? true : false,
      e_estorno: values.categoria === "e_estorno" ? true : false,
      e_repasse: values.categoria === "e_repasse" ? true : false,
      aceita_capital: values.aceita.includes("aceita_capital") ? true : false,
      aceita_custeio: values.aceita.includes("aceita_custeio") ? true : false,
      aceita_livre: values.aceita.includes("aceita_livre") ? true : false,
    };

    if (uuid) {
      mutationPatch.mutate({ UUID: data.uuid, payload: payload });
    } else {
      mutationPost.mutate({ payload: payload });
    }
  };

  const handleDelete = async (uuid) => {
    CustomModalConfirm({
      dispatch,
      title: "Apagar tipo de crédito",
      message: "Tem certeza que deseja apagar esse tipo de crédito?",
      cancelText: "Voltar",
      confirmText: "Apagar",
      dataQa: "modal-confirmar-apagar-tipo-de-credito",
      isDanger: true,
      onConfirm: () => mutationDelete.mutate(uuid),
    });
  };

  const handleCancelar = () => {
    navigate("/parametro-tipos-receita");
  };

  const handleSelecaoUnidadeSuporte = (unidadeSelecionada) => {};

  const onFieldsChange = (values) => {
    console.log(values);
  };

  const handleTodasUnidades = (e) => {
    form.setFieldValue("todas_unidades", e.target.checked);
  };

  return (
    <Spin spinning={isLoading}>
      <Form form={form} onFinish={handleSubmit} onFieldsChange={onFieldsChange}>
        <Row>
          <Col md={24}>
            <Form.Item
              label="Nome"
              name="nome"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              rules={[{ required: true, message: "Campo obrigatório" }]}
            >
              <Input placeholder="Nome do tipo de crédito" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col md={8}>
            <Form.Item
              label="Categoria"
              name="categoria"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Selecione"
                options={categoriaOpcoes.map((tipo) => {
                  return {
                    value: tipo.field_name,
                    label: tipo.name,
                  };
                })}
              />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Form.Item label="Aceita" name="aceita" labelCol={{ span: 24 }}>
              <Select
                placeholder="Selecione"
                mode="multiple"
                options={aceitaOpcoes.map((aceita) => {
                  return {
                    value: aceita.field_name,
                    label: aceita.name,
                  };
                })}
              ></Select>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item
              label="Recursos externos"
              name="e_recursos_proprios"
              labelCol={{ span: 24 }}
            >
              <Radio.Group
                name="radiogroup"
                options={[
                  { value: true, label: "Sim" },
                  { value: false, label: "Não" },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col md={8}>
            <Form.Item
              label="Deve exibir detalhamento?"
              name="possui_detalhamento"
              labelCol={{ span: 24 }}
            >
              <Radio.Group
                name="radiogroup"
                defaultValue={1}
                options={[
                  { value: true, label: "Sim" },
                  { value: false, label: "Não" },
                ]}
              />
            </Form.Item>
          </Col>
          <Col md={16}>
            <Form.Item
              label="Detalhamento"
              name="detalhes"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Selecione"
                mode="multiple"
                options={detalhesOpcoes.map((detalhe) => {
                  return {
                    value: detalhe.id,
                    label: detalhe.nome,
                  };
                })}
              ></Select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col md={24}>
            <Form.Item
              label="Tipos de conta"
              name="tipos_conta"
              labelCol={{ span: 24 }}
            >
              <Select
                placeholder="Selecione"
                mode="multiple"
                options={tiposContaOpcoes.map((tipoConta) => {
                  return { label: tipoConta.nome, value: tipoConta.uuid };
                })}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col md={24}>
            <Form.Item
              label="Mensagem para o usuário"
              name="mensagem_usuario"
              labelCol={{ span: 24 }}
            >
              <TextArea autoSize={{ minRows: 6, maxRows: 6 }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <h6>Unidades vinculadas ao tipo de crédito</h6>

        <Form.Item
          name="todas_unidades"
          labelCol={{ span: 24 }}
          className="mt-4"
        >
          <Checkbox defaultValue={false} onChange={handleTodasUnidades}>
            Todas as unidades
          </Checkbox>
        </Form.Item>

        {form.getFieldValue("todas_unidades") !== true ? (
          <>
            <UnidadesAssociadas />
            <EscolheUnidade onSelecionaUnidade={handleSelecaoUnidadeSuporte} />
          </>
        ) : null}

        <Divider />

        <Row>
          <Col xs={12}>
            <span className="mt-5">Uuid {data?.uuid}</span>
          </Col>
          <Col xs={12}>
            <span className="mt-5">ID {data?.id}</span>
          </Col>
        </Row>

        <Divider />

        <Flex gap="small" justify="space-between">
          {uuid ? (
            <button
              onClick={handleDelete}
              type="button"
              className="btn btn btn-danger mt-2 mr-2"
              disabled={!TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES}
            >
              Apagar
            </button>
          ) : null}
          <Flex gap={16}>
            <div className="p-Y bd-highlight">
              <button
                type="button"
                className="btn btn-outline-success"
                onClick={handleCancelar}
              >
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
