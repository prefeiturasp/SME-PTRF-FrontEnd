import React, { useState, useEffect, useMemo } from 'react';
import { Form, Row, Col, Select, Button, Flex } from 'antd';
import { useGetAcoesAssociacao } from '../ReceitasPrevistas/hooks/useGetAcoesAssociacao';
import { useGetAcoesPDDE } from './hooks/useGetAcoesPDDE';
import { useGetEspecificacoes } from './hooks/useGetEspecificacoes';
import { useGetPrioridades } from './hooks/useGetPrioridades';

const { Option } = Select;

export const FormFiltros = ({
  recursos = [],
  prioridadesTabelas = [],
  tipos_aplicacao = [],
  tipos_despesa_custeio = [],
  onFiltrar,
  onFiltrosChange,
  onLimparFiltros,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [form] = Form.useForm();
  const [selectedRecurso, setSelectedRecurso] = useState('');
  const [selectedTipoAplicacao, setSelectedTipoAplicacao] = useState('');
  const [selectedTipoDespesaCusteio, setSelectedTipoDespesaCusteio] = useState('');
  const [selectedProgramaPdde, setSelectedProgramaPdde] = useState('');
  const [selectedAcaoPdde, setSelectedAcaoPdde] = useState('');
  const [filtros, setFiltros] = useState({});

  // Hooks para buscar ações
  const { data: acoesAssociacao, isLoading: isLoadingAcoesAssociacao } = useGetAcoesAssociacao({ enabled: selectedRecurso === 'PTRF' });
  const { acoesPdde, isLoading: isLoadingAcoesPDDE } = useGetAcoesPDDE({ enabled: selectedRecurso === 'PDDE' });
  const { especificacoes, isLoading: isLoadingEspecificacoes } = useGetEspecificacoes(
    selectedTipoAplicacao, 
    selectedTipoAplicacao === 'CUSTEIO' ? selectedTipoDespesaCusteio : ""
  );
  const { isLoading: isLoadingPrioridades, prioridades, quantidade, refetch } = useGetPrioridades(filtros);

  // Método genérico para campos que não têm onChange específico
  const handleFieldChange = (fieldName, value) => {
    onFiltrosChange(fieldName, value);
  };

  const prioridadesOptions = prioridadesTabelas.map(item => ({
    value: item.key,
    label: item.value
  }));

  const recursosOptions = recursos.map(item => ({
    value: item.key,
    label: item.value
  }));

  const tiposAplicacaoOptions = tipos_aplicacao.map(item => ({
    value: item.key,
    label: item.value
  }));

  const tiposDespesaCusteioOptions = tipos_despesa_custeio.map(item => ({
    value: item.id,
    label: item.nome
  }));

  const acoesAssociacaoOptions = acoesAssociacao?.map(item => ({
    value: item.uuid,
    label: item.acao.nome
  })) || [];

  const especificacoesOptions = especificacoes?.map(item => ({
    value: item.uuid,
    label: item.descricao
  })) || [];

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
    
    return Array.from(programasUnicos.entries()).map(([uuid, nome]) => ({
      value: uuid,
      label: nome
    }));
  }, [acoesPdde]);

  const acoesPddeFiltradas = useMemo(() => {
    if (!acoesPdde || !selectedProgramaPdde) return [];
    
    const acoes = acoesPdde.results || acoesPdde;
    if (!acoes || !Array.isArray(acoes)) return [];
    
    return acoes
      .filter(acao => acao.programa_objeto?.uuid === selectedProgramaPdde)
      .map(acao => ({
        value: acao.uuid,
        label: acao.nome
      }));
  }, [acoesPdde, selectedProgramaPdde]);

  const handleToggleFiltros = () => setShowAll(prev => !prev);

  const handleRecursoChange = (value) => {
    setSelectedRecurso(value);
    setSelectedProgramaPdde('');
    setSelectedAcaoPdde('');

    form.setFieldsValue({
      acao_associacao: undefined,
      programa_pdde: undefined,
      acao_pdde: undefined,
      tipo_despesa_custeio: undefined,
      especificacao_material: undefined
    });

    onFiltrosChange('recurso', value);
  };

  const handleProgramaPddeChange = (value) => {
    setSelectedProgramaPdde(value);
    form.setFieldsValue({
      acao_pdde: undefined
    });
    setSelectedAcaoPdde('');
    onFiltrosChange('programa_pdde__uuid', value);
    onFiltrosChange('acao_pdde__uuid', undefined);
  };

  const handleAcaoPddeChange = (value) => {
    setSelectedAcaoPdde(value);
    onFiltrosChange('acao_pdde__uuid', value);
  };

  const handleTipoAplicacaoChange = (value) => {
    setSelectedTipoAplicacao(value);
    form.setFieldsValue({
      tipo_despesa_custeio: undefined,
      especificacao_material: undefined
    });
    setSelectedTipoDespesaCusteio('');

    // Atualizar filtros
    onFiltrosChange('tipo_aplicacao', value);
    onFiltrosChange('tipo_despesa_custeio__uuid', undefined);
    onFiltrosChange('especificacao_material__uuid', undefined);
  };

  const handleTipoDespesaCusteioChange = (value) => {
    setSelectedTipoDespesaCusteio(value);
    form.setFieldsValue({
      especificacao_material: undefined
    });

    const tiposDespesaCusteioUuid = tipos_despesa_custeio?.find(item => item.id == value);
    onFiltrosChange('tipo_despesa_custeio__uuid', tiposDespesaCusteioUuid.uuid);
    onFiltrosChange('especificacao_material__uuid', undefined);
  };

  const onSubmit = (values) => {
    onFiltrar && onFiltrar(values);
  };

  const handleCleanFilter = () => {
    form.setFieldsValue({
      recurso: undefined,
      prioridade: undefined,
      programa_pdde: undefined,
      acao_pdde: undefined,
      tipo_aplicacao: undefined,
      acao_associacao: undefined,
      tipo_despesa_custeio: undefined,
      especificacao_material: undefined
    });
    onLimparFiltros && onLimparFiltros();
  };

  return (
    <Form form={form} layout="vertical" style={{ marginBottom: 24 }} onFinish={onSubmit}>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Form.Item label="Recurso" name="recurso">
            <Select
              placeholder="Selecione o recurso"
              style={{ width: "100%" }}
              options={recursosOptions}
              onChange={handleRecursoChange}
              allowClear
            />
          </Form.Item>
        </Col>
        {!showAll ? (
          <>
          <Col span={16}>
            {/* <Flex gap={8} className="mt-4"> */}
                <button className="btn btn-outline-success mx-2">Filtrar</button>
                <button
                    className="btn btn-success"
                    onClick={handleToggleFiltros}
                    type="button"
                >
                    Mais Filtros
                </button>
            {/* </Flex> */}
          </Col>
          </>
        ) : (
        <>
            <Col span={8}>
              <Form.Item label="Prioridade" name="prioridade">
                <Select 
                  placeholder="Selecione a prioridade"
                  onChange={(value) => handleFieldChange('prioridade', value)}
                  allowClear
                  options={prioridadesOptions}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Programa" name="programa_pdde">
                <Select
                  placeholder="Selecione o programa"
                  style={{ width: "100%" }}
                  options={programasPddeOptions}
                  onChange={handleProgramaPddeChange}
                  loading={isLoadingAcoesPDDE}
                  disabled={selectedRecurso !== 'PDDE'}
                  allowClear
                />
              </Form.Item>
            </Col>
            {selectedRecurso !== 'PDDE' && (
              <Col span={8}>
                <Form.Item label="Ação" name="acao_associacao">
                  <Select
                    placeholder="Selecione a ação"
                    disabled={selectedRecurso !== 'PTRF'}
                    loading={isLoadingAcoesAssociacao}
                    style={{ width: "100%" }}
                    options={acoesAssociacaoOptions}
                    onChange={(value) => handleFieldChange('acao_associacao__uuid', value)}
                    allowClear
                  />
                </Form.Item>
              </Col>
            )}
            {selectedRecurso === 'PDDE' && (
              <Col span={8}>
                <Form.Item label="Ação PDDE" name="acao_pdde">
                  <Select
                    placeholder="Selecione a ação"
                    style={{ width: "100%" }}
                    options={acoesPddeFiltradas}
                    onChange={handleAcaoPddeChange}
                    disabled={!selectedProgramaPdde}
                    allowClear
                  />
                </Form.Item>
              </Col>
            )}
            <Col span={8}>
              <Form.Item label="Tipo de Aplicação" name="tipo_aplicacao">
                <Select 
                  placeholder="Selecione o tipo de aplicação"
                  options={tiposAplicacaoOptions}
                  onChange={handleTipoAplicacaoChange}
                  allowClear
                >
                  {tipos_aplicacao.map(t => (
                    <Option key={t.key} value={t.key}>{t.value}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Tipo de Despesa" name="tipo_despesa_custeio">
                <Select 
                  placeholder="Selecione"
                  options={tiposDespesaCusteioOptions}
                  onChange={handleTipoDespesaCusteioChange}
                  disabled={selectedTipoAplicacao !== 'CUSTEIO'}
                  allowClear
                >
                  {tipos_despesa_custeio.map(t => (
                    <Option key={t.id} value={t.id}>{t.nome}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Especificação de Material, Bens ou Serviços" name="especificacao_material">
                <Select
                  placeholder="Selecione a especificação do bem, material ou serviço"
                  showSearch
                  optionFilterProp="label"
                  style={{ width: "100%" }}
                  options={especificacoesOptions}
                  loading={isLoadingEspecificacoes}
                  onChange={(value) => handleFieldChange('especificacao_material__uuid', value)}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={24}>
                <Flex justify="end" gap={8} className="mt-4">
                    <button
                        className="btn btn-outline-success float-right"
                        onClick={handleToggleFiltros}
                        type="button"
                    >
                        Menos Filtros
                    </button>
                    <button
                        className="btn btn-outline-success float-right"
                        onClick={handleCleanFilter}
                        type="button"
                    >
                        Limpar Filtros
                    </button>
                    <button className="btn btn-success float-right" type="submit">Filtrar</button>
                </Flex>
            </Col>
        </>
      )}
      </Row>
    </Form>
  );
};