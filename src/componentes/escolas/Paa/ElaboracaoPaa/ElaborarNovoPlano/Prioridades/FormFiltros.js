import { useState, useMemo } from 'react';
import { Form, Row, Col, Select, Flex } from 'antd';
import { useGetAcoesAssociacao } from '../ReceitasPrevistas/hooks/useGetAcoesAssociacao';
import { useGetAcoesPDDE } from './hooks/useGetAcoesPDDE';
import { useGetEspecificacoes } from './hooks/useGetEspecificacoes';
import { RECURSOS_PRIORIDADE } from '../../../../../../constantes/prioridades';

export const FormFiltros = ({
  tabelas= {},
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

  // Hooks para buscar ações
  const { data: acoesAssociacao } = useGetAcoesAssociacao({ enabled: selectedRecurso === 'PTRF' });
  const { acoesPdde } = useGetAcoesPDDE({ enabled: selectedRecurso === 'PDDE' });
  const { especificacoes } = useGetEspecificacoes(
    selectedTipoAplicacao, 
    selectedTipoAplicacao === 'CUSTEIO' ? selectedTipoDespesaCusteio : ""
  );

  // Método genérico para campos que não têm onChange específico
  const handleFieldChange = (fieldName, value) => {
    onFiltrosChange(fieldName, value);
  };

  const prioridadesOptions = (tabelas?.prioridades||[]).map(item => ({
    value: item.key,
    label: item.value
  }));

  const recursosOptions = [
    ...(Array.isArray(tabelas?.recursos)
      ? tabelas.recursos.filter((item) => item.key !== "OUTRO_RECURSO").map(item => ({
          value: item.key,
          label: item.value,
        }))
      : []),

    ...(Array.isArray(tabelas?.outros_recursos)
      ? tabelas.outros_recursos.map(item => ({
          value: item.uuid,
          label: item.nome,
          parent: "OUTRO_RECURSO"
        }))
      : []),
  ];

  const tiposAplicacaoOptions = (tabelas?.tipos_aplicacao||[]).map(item => ({
    value: item.key,
    label: item.value
  }));

  const tiposDespesaCusteioOptions = Array.isArray(tabelas?.tipos_despesa_custeio) ? tabelas?.tipos_despesa_custeio.map(item => ({
    value: item.id, // considera id para reaproveitamento de API de Especificacoes com filtro em ?tipos_custeio=<id>
    label: item.nome
  })): [];

  const acoesAssociacaoOptions = (acoesAssociacao||[]).map(item => ({
    value: item.uuid,
    label: item.acao.nome
  }));

  const especificacoesOptions = (especificacoes||[]).map(item => ({
    value: item.uuid,
    label: item.descricao
  }));

  const programasPddeOptions = useMemo(() => {
    // A lista de programa é extraída da lista de ações PDDE.
    // Podendo haver várias Açoes com o mesmo programa PDDE.
    // Considerando isso, esta função extrai apenas os objetos únicos de programas PDDE
    if (!acoesPdde) {
      return [];
    }

    const acoes = acoesPdde?.results || acoesPdde;

    if (!acoes || !Array.isArray(acoes)) {
      return [];
    }

    const programas_unicos = [
      ...new Map(
        acoes
          .map(acao => ({...acao.programa_objeto}))
          .map(item => [item.uuid, item])
        ).values()
    ]

    const programas = programas_unicos.map(item => ({
      value: item.uuid,
      label: item.nome
    }))
    return programas
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

  const handleToggleFiltros = () => setShowAll(prev => !prev);

  const ehOutroRecurso = (recurso) => {
    const recursosPadrao = [
      RECURSOS_PRIORIDADE.PTRF,
      RECURSOS_PRIORIDADE.PDDE,
      RECURSOS_PRIORIDADE.RECURSO_PROPRIO,
    ]
    if (!recursosPadrao.includes(recurso)){
      return RECURSOS_PRIORIDADE.OUTRO_RECURSO
    } else {
      return recurso
    }
  };
  
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

    if(value && ehOutroRecurso(value) ===  RECURSOS_PRIORIDADE.OUTRO_RECURSO) {
      onFiltrosChange('outro_recurso__uuid', value);
    } else {
      onFiltrosChange('outro_recurso__uuid', undefined);
    }

    onFiltrosChange('recurso', value ? ehOutroRecurso(value) : null);
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

    const tiposDespesaCusteioUuid = (tabelas?.tipos_despesa_custeio||[]).find(item => item.id === value);
    onFiltrosChange('tipo_despesa_custeio__uuid', tiposDespesaCusteioUuid?.uuid);
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
    setSelectedRecurso('');
    setSelectedProgramaPdde('');
    setSelectedAcaoPdde('');
    setSelectedTipoAplicacao('');
    setSelectedTipoDespesaCusteio('');
    onLimparFiltros && onLimparFiltros();
  };

  return (
    <Form form={form} layout="vertical" style={{ marginBottom: 24 }} onFinish={onSubmit}>
      <Row gutter={16} align="middle">
        <Col span={8}>
          <Form.Item label="Filtrar por recurso" name="recurso">
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
              <button className="btn btn-outline-success mx-2">Filtrar</button>
              <button
                  className="btn btn-success"
                  onClick={handleToggleFiltros}
                  type="button"
              >
                  Mais Filtros
              </button>
          </Col>
          </>
        ) : (
        <>
            <Col span={8}>
              <Form.Item label="Filtrar por prioridade" name="prioridade">
                <Select 
                  placeholder="Selecione a prioridade"
                  onChange={(value) => handleFieldChange('prioridade', value)}
                  allowClear
                  options={prioridadesOptions}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Filtrar por programa" name="programa_pdde">
                <Select
                  placeholder="Selecione o programa"
                  style={{ width: "100%" }}
                  options={programasPddeOptions}
                  onChange={handleProgramaPddeChange}
                  disabled={selectedRecurso !== 'PDDE'}
                  allowClear
                />
              </Form.Item>
            </Col>
            {selectedRecurso !== 'PDDE' && (
              <Col span={8}>
                <Form.Item label="Filtrar por ação" name="acao_associacao">
                  <Select
                    placeholder="Selecione a ação"
                    disabled={selectedRecurso !== 'PTRF'}
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
                <Form.Item label="Filtrar por ação" name="acao_pdde">
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
              <Form.Item label="Filtrar por tipo de aplicação" name="tipo_aplicacao">
                <Select 
                  placeholder="Selecione o tipo de aplicação"
                  options={tiposAplicacaoOptions}
                  onChange={handleTipoAplicacaoChange}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Filtrar por tipo de despesa" name="tipo_despesa_custeio">
                <Select 
                  placeholder="Selecione o tipo de despesa"
                  options={tiposDespesaCusteioOptions}
                  onChange={handleTipoDespesaCusteioChange}
                  disabled={selectedTipoAplicacao !== 'CUSTEIO'}
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Filtrar por especificação de material, bens ou serviços" name="especificacao_material">
                <Select
                  placeholder="Selecione a especificação do bem, material ou serviço"
                  showSearch
                  optionFilterProp="label"
                  style={{ width: "100%" }}
                  options={especificacoesOptions}
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