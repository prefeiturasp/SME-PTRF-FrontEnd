import React, { memo, useState, useMemo } from "react";
import { Form, Row, Col, Flex, InputNumber, Spin, Input, Select } from "antd";
import { ModalFormBodyText } from "../../../../../Globais/ModalBootstrap";
import { useGetAcoesAssociacao } from "../ReceitasPrevistas/hooks/useGetAcoesAssociacao";
import { useGetEspecificacoes } from "./hooks/useGetEspecificacoes";
import { useGetAcoesPDDE } from "./hooks/useGetAcoesPDDE";
import { usePostPrioridade } from "./hooks/usePostPrioridade";
import { createValidationSchema } from "./validationSchema";
import {
  formatMoneyByCentsBRL,
  parseMoneyBRL,
} from "../../../../../../utils/money";


const ModalFormAdicionarPrioridade = ({ open, onClose, data }) => {
  const [form] = Form.useForm();
  const [selectedRecurso, setSelectedRecurso] = useState('');
  const [selectedTipoAplicacao, setSelectedTipoAplicacao] = useState('');
  const [selectedTipoDespesaCusteio, setSelectedTipoDespesaCusteio] = useState('');
  const [selectedProgramaPdde, setSelectedProgramaPdde] = useState('');
  
  const { data: acoesAssociacao, isLoading: isLoadingAcoes } = useGetAcoesAssociacao({
    enabled: selectedRecurso === 'PTRF'
  });
  const { acoesPdde, isLoading: isLoadingAcoesPdde } = useGetAcoesPDDE({
    enabled: selectedRecurso === 'PDDE'
  });
  const { especificacoes, isLoading: isLoadingEspecificacoes } = useGetEspecificacoes(
    selectedTipoAplicacao, 
    selectedTipoAplicacao === 'CUSTEIO' ? selectedTipoDespesaCusteio : ""
  );
  const { mutationPost } = usePostPrioridade(onClose);
  const isLoading = false;
  const initialValues = {
    prioridade: undefined,
    recurso: undefined,
    tipo_aplicacao: undefined,
    tipo_despesa_custeio: undefined,
    especificacao_material: undefined,
    valor_total: undefined
  }

  const prioridadesOptions = Array.isArray(data.prioridades) ? data.prioridades.map(item => ({
    value: item.key,
    label: item.value
  })) : [];

  const recursosOptions = Array.isArray(data.recursos) ? data.recursos.map(item => ({
    value: item.key,
    label: item.value
  })) : [];

  const tiposAplicacaoOptions = Array.isArray(data.tipos_aplicacao) ? data.tipos_aplicacao.map(item => ({
    value: item.key,
    label: item.value
  })) : [];

  const tiposDespesaCusteioOptions = Array.isArray(data.tipos_despesa_custeio) ? data.tipos_despesa_custeio.map(item => ({
    value: item.id,
    label: item.nome
  })) : [];

  const acoesAssociacaoOptions = Array.isArray(acoesAssociacao) ? acoesAssociacao.map(item => ({
    value: item.uuid,
    label: item.acao.nome
  })) : [];

  const programasPddeOptions = useMemo(() => {
    if (!acoesPdde) {
      return [];
    }

    const acoes = acoesPdde.results || acoesPdde;
    
    if (!acoes || !Array.isArray(acoes)) {
      return [];
    }
    
    const programasUnicos = new Map();
    acoes.forEach((acao) => {
      if (acao.programa_objeto?.uuid && acao.programa_objeto?.nome) {
        programasUnicos.set(acao.programa_objeto.uuid, acao.programa_objeto.nome);
      }
    });
    
    const entries = Array.from(programasUnicos.entries());
    return Array.isArray(entries) ? entries.map(([uuid, nome]) => ({
      value: uuid,
      label: nome
    })) : [];
  }, [acoesPdde]);

  const acoesPddeFiltradas = useMemo(() => {
    if (!acoesPdde || !selectedProgramaPdde) return [];
    
    const acoes = acoesPdde.results || acoesPdde;
    if (!acoes || !Array.isArray(acoes)) return [];
    
    const acoesFiltradas = (acoes || []).filter(acao => acao.programa_objeto?.uuid === selectedProgramaPdde);
    return Array.isArray(acoesFiltradas) ? acoesFiltradas.map(acao => ({
      value: acao.uuid,
      label: acao.nome
    })) : [];
  }, [acoesPdde, selectedProgramaPdde]);

  const especificacoesOptions = Array.isArray(especificacoes) ? especificacoes.map(item => ({
    value: item.uuid,
    label: item.descricao
  })) : [];

  const onSubmit = async (values) => {
    try {
      const validationSchema = createValidationSchema(selectedRecurso, selectedTipoAplicacao);
      await validationSchema.validate(values, { abortEarly: false });

      const tiposDespesaCusteioUuid = data.tipos_despesa_custeio?.find(item => item.id == values.tipo_despesa_custeio);

      const payload = {
        paa: localStorage.getItem("PAA"),
        ...values,
        ...(values.tipo_despesa_custeio && { tipo_despesa_custeio: tiposDespesaCusteioUuid.uuid }),
        valor_total: values.valor_total / 100
      };
      
      mutationPost.mutate({ payload });
      
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

  const handleRecursoChange = (value) => {
    setSelectedRecurso(value);
    setSelectedProgramaPdde('');

    form.setFieldsValue({
      acao_associacao: undefined,
      programa_pdde: undefined,
      acao_pdde: undefined,
      tipo_despesa_custeio: undefined,
      especificacao_material: undefined
    });

    form.setFields([
      { name: 'acao_associacao', errors: [] },
      { name: 'programa_pdde', errors: [] },
      { name: 'acao_pdde', errors: [] },
      { name: 'recurso', errors: [] }
    ]);
  };

  const handleProgramaPddeChange = (value) => {
    setSelectedProgramaPdde(value);
    form.setFieldsValue({
      acao_pdde: undefined
    });
    form.setFields([
      { name: 'acao_pdde', errors: [] },
      { name: 'programa_pdde', errors: [] }
    ]);
  };

  const handleTipoAplicacaoChange = (value) => {
    setSelectedTipoAplicacao(value);
    form.setFieldsValue({
      tipo_despesa_custeio: undefined,
      especificacao_material: undefined
    });
    setSelectedTipoDespesaCusteio('');
    form.setFields([
      { name: 'tipo_despesa_custeio', errors: [] },
      { name: 'tipo_aplicacao', errors: [] }
    ]);
  };

  const handleTipoDespesaCusteioChange = (value) => {
    setSelectedTipoDespesaCusteio(value);
    form.setFieldsValue({
      especificacao_material: undefined
    });
    form.setFields([
      { name: 'tipo_despesa_custeio', errors: [] }
    ]);
  };

  return (
    <ModalFormBodyText
      show={open}
      onHide={onClose}
      titulo="Adicionar nova prioridade"
      size="lg"
      bodyText={
        <Spin
          spinning={
            isLoading
          }
        >
          <Form
            form={form}
            onFinish={onSubmit}
            initialValues={initialValues}
            role="form"
            className="p-2"
          >

            <Row gutter={[16, 8]}>
              <Col md={12}>
                <Form.Item
                  label="Prioridade *"
                  name="prioridade"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 4 }}
                >
                  <Select
                    placeholder="Selecione a prioridade"
                    style={{ width: "100%" }}
                    options={prioridadesOptions}
                    onChange={() => form.setFields([{ name: 'prioridade', errors: [] }])}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Recurso *"
                  name="recurso"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 4 }}
                >
                  <Select
                    placeholder="Selecione o recurso"
                    style={{ width: "100%" }}
                    options={recursosOptions}
                    onChange={handleRecursoChange}
                    allowClear
                  />
                </Form.Item>
              </Col>

              {selectedRecurso === 'PTRF' && (
                <Col md={12}>
                  <Form.Item
                    label="Ação *"
                    name="acao_associacao"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 4 }}
                  >
                    <Select
                      placeholder="Selecione a ação"
                      style={{ width: "100%" }}
                      options={acoesAssociacaoOptions}
                      loading={isLoadingAcoes}
                      onChange={() => form.setFields([{ name: 'acao_associacao', errors: [] }])}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}

              {selectedRecurso === 'PDDE' && (
                <Col md={12}>
                  <Form.Item
                    label="Programa *"
                    name="programa_pdde"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 4 }}
                  >
                    <Select
                      placeholder="Selecione o programa"
                      style={{ width: "100%" }}
                      options={programasPddeOptions}
                      onChange={handleProgramaPddeChange}
                      loading={isLoadingAcoesPdde}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}

              {selectedRecurso === 'PDDE' && (
                <Col md={12}>
                  <Form.Item
                    label="Ação *"
                    name="acao_pdde"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 4 }}
                  >
                    <Select
                      placeholder="Selecione a ação"
                      style={{ width: "100%" }}
                      options={acoesPddeFiltradas}
                      onChange={() => form.setFields([{ name: 'acao_pdde', errors: [] }])}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}

              <Col md={12}>
                <Form.Item
                  label="Tipo de aplicação *"
                  name="tipo_aplicacao"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 4 }}
                >
                  <Select
                    placeholder="Selecione o tipo de aplicação"
                    style={{ width: "100%" }}
                    options={tiposAplicacaoOptions}
                    onChange={handleTipoAplicacaoChange}
                    allowClear
                  />
                </Form.Item>
              </Col>

              {selectedTipoAplicacao === 'CUSTEIO' && (
                <Col md={12}>
                  <Form.Item
                    label="Tipo de despesa *"
                    name="tipo_despesa_custeio"
                    labelCol={{ span: 24 }}
                    style={{ marginBottom: 4 }}
                  >
                    <Select
                      placeholder="Selecione o tipo de despesa"
                      style={{ width: "100%" }}
                      options={tiposDespesaCusteioOptions}
                      onChange={handleTipoDespesaCusteioChange}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              )}

              <Col md={12}>
                <Form.Item
                  label="Especificação do Bem, Material ou Serviço *"
                  name="especificacao_material"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 4 }}
                >
                  <Select
                    placeholder="Selecione a especificação do bem, material ou serviço"
                    showSearch
                    optionFilterProp="label"
                    style={{ width: "100%" }}
                    options={especificacoesOptions}
                    loading={isLoadingEspecificacoes}
                    onChange={() => form.setFields([{ name: 'especificacao_material', errors: [] }])}
                    allowClear
                  />
                </Form.Item>
              </Col>

              <Col md={12}>
                <Form.Item
                  label="Valor total *"
                  name="valor_total"
                  labelCol={{ span: 24 }}
                  style={{ marginBottom: 4 }}
                >
                  <InputNumber
                    placeholder="00,00"
                    formatter={formatMoneyByCentsBRL}
                    parser={parseMoneyBRL}
                    min={0}
                    controls={false}
                    style={{ width: "100%" }}
                    onChange={() => form.setFields([{ name: 'valor_total', errors: [] }])}
                  />
                </Form.Item>
              </Col>
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

export default memo(ModalFormAdicionarPrioridade);
