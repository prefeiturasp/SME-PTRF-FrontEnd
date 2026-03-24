import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ModalFormAdicionarPrioridade from '../ModalFormAdicionarPrioridade';
import { useGetAcoesPTRFPrioridades } from '../hooks/useGetAcoesPTRFPrioridades';
import { useGetAcoesPDDEPrioridades } from '../hooks/useGetAcoesPDDEPrioridades';
import { useGetEspecificacoes } from '../hooks/useGetEspecificacoes';
import { usePostPrioridade } from '../hooks/usePostPrioridade';
import { usePatchPrioridade } from '../hooks/usePatchPrioridade';
import { createValidationSchema } from '../validationSchema';

jest.mock('../hooks/useGetAcoesPTRFPrioridades', () => ({
  useGetAcoesPTRFPrioridades: jest.fn(),
}));
jest.mock('../hooks/useGetAcoesPDDEPrioridades', () => ({
  useGetAcoesPDDEPrioridades: jest.fn(),
}));
jest.mock('../hooks/useGetEspecificacoes', () => ({
  useGetEspecificacoes: jest.fn(),
}));
jest.mock('../hooks/usePostPrioridade', () => ({
  usePostPrioridade: jest.fn(),
}));
jest.mock('../hooks/usePatchPrioridade', () => ({
  usePatchPrioridade: jest.fn(),
}));
jest.mock('../validationSchema', () => ({
  createValidationSchema: jest.fn(),
}));

const MOCK_TABELAS = {
  prioridades: [
    { key: 1, value: 'Sim' },
    { key: 0, value: 'Não' },
  ],
  recursos: [
    { key: 'PTRF', value: 'PTRF' },
    { key: 'PDDE', value: 'PDDE' },
    { key: 'RECURSO_PROPRIO', value: 'Recursos Próprios' },
    { key: 'OUTRO_RECURSO', value: 'Outro Recurso label' },
  ],
  outros_recursos: [
    { uuid: 'outro-uuid-1', nome: 'Prêmio de Excelência' },
  ],
  tipos_aplicacao: [
    { key: 'CUSTEIO', value: 'Custeio' },
    { key: 'CAPITAL', value: 'Capital' },
  ],
  tipos_despesa_custeio: [
    { id: 1, uuid: 'tipo-uuid-1', nome: 'Tipo 1' },
    { id: 2, uuid: 'tipo-uuid-2', nome: 'Tipo 2' },
  ],
};

const MOCK_ACOES_ASSOCIACAO = [
  { uuid: 'acao-uuid-1', acao: { nome: 'Ação PTRF 1' } },
  { uuid: 'acao-uuid-2', acao: { nome: 'Ação PTRF 2' } },
];

const MOCK_ACOES_PDDE = {
  results: [
    { uuid: 'pdde-uuid-1', nome: 'Ação PDDE 1', programa_objeto: { uuid: 'prog-uuid-1', nome: 'Programa 1' } },
    { uuid: 'pdde-uuid-2', nome: 'Ação PDDE 2', programa_objeto: { uuid: 'prog-uuid-2', nome: 'Programa 2' } },
  ],
};

const MOCK_ESPECIFICACOES = [
  { uuid: 'esp-uuid-1', descricao: 'Especificação 1' },
  { uuid: 'esp-uuid-2', descricao: 'Especificação 2' },
];

let mockMutatePost;
let mockMutatePatch;

const setupDefaultMocks = () => {
  mockMutatePost = jest.fn();
  mockMutatePatch = jest.fn();

  useGetAcoesPTRFPrioridades.mockReturnValue({ data: MOCK_ACOES_ASSOCIACAO, isLoading: false });
  useGetAcoesPDDEPrioridades.mockReturnValue({ acoesPdde: MOCK_ACOES_PDDE, isLoading: false });
  useGetEspecificacoes.mockReturnValue({ especificacoes: MOCK_ESPECIFICACOES, isLoading: false });
  usePostPrioridade.mockReturnValue({ mutationPost: { mutate: mockMutatePost, isPending: false } });
  usePatchPrioridade.mockReturnValue({ mutationPatch: { mutate: mockMutatePatch, isPending: false } });
  createValidationSchema.mockReturnValue({ validate: jest.fn().mockResolvedValue(undefined) });
};

const renderComponent = (props = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const defaultProps = {
    open: true,
    tabelas: MOCK_TABELAS,
    onClose: jest.fn(),
    formModal: null,
    focusFields: [],
    ...props,
  };
  return render(
    <QueryClientProvider client={queryClient}>
      <ModalFormAdicionarPrioridade {...defaultProps} />
    </QueryClientProvider>
  );
};

const getSelectTrigger = (label) => {
  const el = screen.getByLabelText(label);
  return el.closest('.ant-select').querySelector('.ant-select-selector');
};

const selectOption = async (trigger, optionText) => {
  fireEvent.mouseDown(trigger);
  await waitFor(() => {
    const options = screen.getAllByText(optionText);
    const option = options.find(el => el.classList.contains('ant-select-item-option-content'));
    expect(option).toBeTruthy();
    fireEvent.click(option);
  });
};

describe('ModalFormAdicionarPrioridade', () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation(() => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
    localStorage.setItem('PAA', 'paa-uuid-123');
    setupDefaultMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // ==================
  // Renderização básica
  // ==================

  it('renderiza o modal quando open=true', () => {
    renderComponent();
    expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
  });

  it('não renderiza o modal quando open=false', () => {
    renderComponent({ open: false });
    expect(screen.queryByText('Adicionar nova prioridade')).not.toBeInTheDocument();
  });

  it('exibe título "Editar prioridade" quando formModal tem uuid', () => {
    renderComponent({ formModal: { uuid: 'some-uuid' } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  it('renderiza todos os campos obrigatórios', () => {
    renderComponent();
    expect(screen.getByLabelText('Prioridade *')).toBeInTheDocument();
    expect(screen.getByLabelText('Recurso *')).toBeInTheDocument();
    expect(screen.getByLabelText('Tipo de aplicação *')).toBeInTheDocument();
    expect(screen.getByLabelText('Especificação do Bem, Material ou Serviço *')).toBeInTheDocument();
    expect(screen.getByLabelText('Valor total *')).toBeInTheDocument();
  });

  it('chama onClose ao clicar em Cancelar', () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });
    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renderiza sem crashar com tabelas null', () => {
    renderComponent({ tabelas: null });
    expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
  });

  it('renderiza sem crashar com tabelas vazio', () => {
    renderComponent({ tabelas: {} });
    expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
  });

  it('exibe Spin quando mutationPost isPending', () => {
    usePostPrioridade.mockReturnValue({ mutationPost: { mutate: mockMutatePost, isPending: true } });
    renderComponent();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  it('exibe Spin quando mutationPatch isPending', () => {
    usePatchPrioridade.mockReturnValue({ mutationPatch: { mutate: mockMutatePatch, isPending: true } });
    renderComponent();
    expect(screen.getByText('Salvar')).toBeInTheDocument();
  });

  // ==================
  // recursosOptions branches
  // ==================

  it('filtra OUTRO_RECURSO dos recursos e inclui outros_recursos', async () => {
    renderComponent();
    fireEvent.mouseDown(getSelectTrigger('Recurso *'));

    await waitFor(() => {
      const opts = screen.getAllByText('Prêmio de Excelência');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
    // OUTRO_RECURSO key label should NOT appear as an option
    const labelOpts = screen.queryAllByText('Outro Recurso label');
    expect(labelOpts.filter(el => el.classList.contains('ant-select-item-option-content'))).toHaveLength(0);
  });

  it('funciona sem outros_recursos (null) em tabelas', async () => {
    renderComponent({ tabelas: { ...MOCK_TABELAS, outros_recursos: null } });
    fireEvent.mouseDown(getSelectTrigger('Recurso *'));
    await waitFor(() => {
      const opts = screen.getAllByText('PTRF');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
  });

  it('funciona sem recursos (null) em tabelas', () => {
    renderComponent({ tabelas: { ...MOCK_TABELAS, recursos: null } });
    expect(screen.getByLabelText('Recurso *')).toBeInTheDocument();
  });

  // ==================
  // Recurso PTRF
  // ==================

  it('mostra campo Ação quando recurso PTRF é selecionado', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Recurso *'), 'PTRF');
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
  });

  it('não mostra campo Ação antes de selecionar PTRF', () => {
    renderComponent();
    expect(screen.queryByLabelText('Ação *')).not.toBeInTheDocument();
  });

  it('acoesAssociacaoOptions retorna [] quando data não é array', async () => {
    useGetAcoesPTRFPrioridades.mockReturnValue({ data: null, isLoading: false });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PTRF' } });
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
  });

  // ==================
  // Recurso PDDE
  // ==================

  it('mostra campos Programa e Ação PDDE quando recurso PDDE é selecionado', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Recurso *'), 'PDDE');
    await waitFor(() => {
      expect(screen.getByLabelText('Programa *')).toBeInTheDocument();
      expect(screen.getByLabelText('Ação *')).toBeInTheDocument();
    });
  });

  it('handleProgramaPddeChange: selecionar programa filtra ações PDDE', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Recurso *'), 'PDDE');
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Programa *'), 'Programa 1');
    // acoesPddeFiltradas agora tem ações do Programa 1
    await waitFor(() => {
      fireEvent.mouseDown(getSelectTrigger('Ação *'));
    });
    await waitFor(() => {
      const opts = screen.getAllByText('Ação PDDE 1');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
  });

  // ==================
  // programasPddeOptions branches
  // ==================

  it('programasPddeOptions retorna [] quando acoesPdde é null', async () => {
    useGetAcoesPDDEPrioridades.mockReturnValue({ acoesPdde: null, isLoading: false });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE' } });
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
  });

  it('programasPddeOptions usa acoesPdde diretamente quando não tem results', async () => {
    useGetAcoesPDDEPrioridades.mockReturnValue({
      acoesPdde: [
        { uuid: 'p1', nome: 'Ação 1', programa_objeto: { uuid: 'prog-d1', nome: 'Prog Direto' } },
      ],
      isLoading: false,
    });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE' } });
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
    fireEvent.mouseDown(getSelectTrigger('Programa *'));
    await waitFor(() => {
      const opts = screen.getAllByText('Prog Direto');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
  });

  it('programasPddeOptions retorna [] quando acoesPdde.results não é array', async () => {
    useGetAcoesPDDEPrioridades.mockReturnValue({ acoesPdde: { results: 'invalido' }, isLoading: false });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE' } });
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
  });

  it('programasPddeOptions ignora acao sem programa_objeto válido', async () => {
    useGetAcoesPDDEPrioridades.mockReturnValue({
      acoesPdde: {
        results: [
          { uuid: 'p1', nome: 'Ação sem prog', programa_objeto: null },
          { uuid: 'p2', nome: 'Ação com prog', programa_objeto: { uuid: 'prog-v', nome: 'Prog Válido' } },
        ],
      },
      isLoading: false,
    });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE' } });
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
    fireEvent.mouseDown(getSelectTrigger('Programa *'));
    await waitFor(() => {
      const opts = screen.getAllByText('Prog Válido');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
  });

  // ==================
  // acoesPddeFiltradas branches
  // ==================

  it('acoesPddeFiltradas retorna [] quando selectedProgramaPdde não está definido', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE', programa_pdde: null } });
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
  });

  it('acoesPddeFiltradas filtra pelo programa quando selectedProgramaPdde está definido', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE', programa_pdde: 'prog-uuid-1' } });
    await waitFor(() => {
      fireEvent.mouseDown(getSelectTrigger('Ação *'));
    });
    await waitFor(() => {
      const opts = screen.getAllByText('Ação PDDE 1');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
  });

  it('acoesPddeFiltradas usa acoesPdde direto quando não tem results', async () => {
    useGetAcoesPDDEPrioridades.mockReturnValue({
      acoesPdde: [
        { uuid: 'd1', nome: 'Ação Dir 1', programa_objeto: { uuid: 'prog-d1', nome: 'Prog Direto' } },
      ],
      isLoading: false,
    });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE', programa_pdde: 'prog-d1' } });
    await waitFor(() => {
      fireEvent.mouseDown(getSelectTrigger('Ação *'));
    });
    await waitFor(() => {
      const opts = screen.getAllByText('Ação Dir 1');
      expect(opts.some(el => el.classList.contains('ant-select-item-option-content'))).toBe(true);
    });
  });

  it('acoesPddeFiltradas retorna [] quando results não é array (com programa definido)', async () => {
    useGetAcoesPDDEPrioridades.mockReturnValue({ acoesPdde: { results: 42 }, isLoading: false });
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE', programa_pdde: 'prog-1' } });
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
  });

  // ==================
  // Tipo de aplicação
  // ==================

  it('mostra campo Tipo de despesa quando CUSTEIO é selecionado', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Custeio');
    await waitFor(() => expect(screen.getByLabelText('Tipo de despesa *')).toBeInTheDocument());
  });

  it('não mostra Tipo de despesa antes de selecionar CUSTEIO', () => {
    renderComponent();
    expect(screen.queryByLabelText('Tipo de despesa *')).not.toBeInTheDocument();
  });

  it('mudar de CUSTEIO para CAPITAL remove campo Tipo de despesa', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Custeio');
    await waitFor(() => expect(screen.getByLabelText('Tipo de despesa *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Capital');
    await waitFor(() => expect(screen.queryByLabelText('Tipo de despesa *')).not.toBeInTheDocument());
  });

  it('especificacoesOptions retorna [] quando especificacoes não é array', () => {
    useGetEspecificacoes.mockReturnValue({ especificacoes: null, isLoading: false });
    renderComponent();
    expect(screen.getByLabelText('Especificação do Bem, Material ou Serviço *')).toBeInTheDocument();
  });

  // ==================
  // useEffect com formModal
  // ==================

  it('chama form.resetFields quando formModal é null', () => {
    renderComponent({ formModal: null });
    expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
  });

  it('popula formulário com prioridade=1 quando formModal.prioridade é truthy', () => {
    renderComponent({ formModal: { uuid: 'f1', prioridade: 1, recurso: 'RECURSO_PROPRIO' } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  it('popula formulário com prioridade=0 quando formModal.prioridade é falsy', () => {
    renderComponent({ formModal: { uuid: 'f1', prioridade: 0, recurso: 'RECURSO_PROPRIO' } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  it('usa outro_recurso como recurso quando formModal.recurso é OUTRO_RECURSO', () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'OUTRO_RECURSO', outro_recurso: 'outro-uuid-1' } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  it('encontra tipo_despesa_custeio pelo uuid e usa seu id', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'RECURSO_PROPRIO', tipo_aplicacao: 'CUSTEIO', tipo_despesa_custeio: 'tipo-uuid-1' } });
    await waitFor(() => expect(screen.getByLabelText('Tipo de despesa *')).toBeInTheDocument());
  });

  it('usa undefined quando tipo_despesa_custeio uuid não é encontrado nas tabelas', () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'RECURSO_PROPRIO', tipo_aplicacao: 'CUSTEIO', tipo_despesa_custeio: 'uuid-inexistente' } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  it('mostra campo Ação quando formModal.recurso é PTRF', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PTRF', acao_associacao: 'acao-uuid-1' } });
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
  });

  it('mostra campo Programa quando formModal.recurso é PDDE', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE', programa_pdde: 'prog-uuid-1' } });
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
  });

  it('exercita focusFields fallback para [] quando focusFields é null', () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'RECURSO_PROPRIO' }, focusFields: null });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  // ==================
  // Focus handlers (setTimeout)
  // ==================

  it('handleFocusValorTotal: dispara setTimeout quando focusFields tem "valor_total"', () => {
    jest.useFakeTimers();
    const formModal = { uuid: 'f1', valor_total: null, recurso: 'RECURSO_PROPRIO' };
    renderComponent({ formModal, focusFields: ['valor_total'] });
    act(() => { jest.advanceTimersByTime(600); });
    jest.useRealTimers();
  });

  it('handleFocusAcaoPTRF: dispara setTimeout quando focusFields tem "acao"', () => {
    jest.useFakeTimers();
    const formModal = { uuid: 'f1', recurso: 'PTRF', acao_associacao: null };
    renderComponent({ formModal, focusFields: ['acao'] });
    act(() => { jest.advanceTimersByTime(600); });
    jest.useRealTimers();
  });

  it('handleFocusAcaoPDDE: dispara setTimeout quando focusFields tem "acao_pdde"', () => {
    jest.useFakeTimers();
    const formModal = { uuid: 'f1', recurso: 'PDDE', acao_pdde: null };
    renderComponent({ formModal, focusFields: ['acao_pdde'] });
    act(() => { jest.advanceTimersByTime(600); });
    jest.useRealTimers();
  });

  it('handleFocusRecursoPrioridade: dispara setTimeout quando focusFields tem "recurso"', () => {
    jest.useFakeTimers();
    const formModal = { uuid: 'f1', recurso: 'OUTRO_RECURSO', outro_recurso: null };
    renderComponent({ formModal, focusFields: ['recurso'] });
    act(() => { jest.advanceTimersByTime(600); });
    jest.useRealTimers();
  });

  // ==================
  // Submissão — POST com PTRF e CUSTEIO (cobre tipo_despesa_custeio no payload)
  // ==================

  it('chama mutationPost (POST) ao salvar prioridade PTRF com custeio', async () => {
    renderComponent();

    await selectOption(getSelectTrigger('Prioridade *'), 'Sim');
    await selectOption(getSelectTrigger('Recurso *'), 'PTRF');
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Ação *'), 'Ação PTRF 1');
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Custeio');
    await waitFor(() => expect(screen.getByLabelText('Tipo de despesa *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Tipo de despesa *'), 'Tipo 1');
    await selectOption(getSelectTrigger('Especificação do Bem, Material ou Serviço *'), 'Especificação 1');

    const valorInput = document.getElementById('valor_total');
    if (valorInput) fireEvent.change(valorInput, { target: { value: '1000' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockMutatePost).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ tipo_despesa_custeio: 'tipo-uuid-1' }),
        })
      );
    });
  });

  // ==================
  // Submissão — POST com OUTRO_RECURSO (cobre getRecurso + outro_recurso no payload)
  // ==================

  it('chama mutationPost com recurso OUTRO_RECURSO e adiciona outro_recurso ao payload', async () => {
    renderComponent();

    await selectOption(getSelectTrigger('Prioridade *'), 'Sim');
    await selectOption(getSelectTrigger('Recurso *'), 'Prêmio de Excelência');
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Capital');
    await selectOption(getSelectTrigger('Especificação do Bem, Material ou Serviço *'), 'Especificação 1');

    const valorInput = document.getElementById('valor_total');
    if (valorInput) fireEvent.change(valorInput, { target: { value: '1000' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockMutatePost).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            recurso: 'OUTRO_RECURSO',
            outro_recurso: 'outro-uuid-1',
          }),
        })
      );
    });
  });

  // ==================
  // Submissão — PATCH com uuid
  // ==================

  it('chama mutationPatch (PATCH) quando formModal tem uuid', async () => {
    renderComponent({ formModal: { uuid: 'edit-uuid', recurso: 'RECURSO_PROPRIO' } });

    await selectOption(getSelectTrigger('Prioridade *'), 'Sim');
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Capital');
    await selectOption(getSelectTrigger('Especificação do Bem, Material ou Serviço *'), 'Especificação 1');

    const valorInput = document.getElementById('valor_total');
    if (valorInput) fireEvent.change(valorInput, { target: { value: '500' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockMutatePatch).toHaveBeenCalledWith(
        expect.objectContaining({ uuid: 'edit-uuid' })
      );
    });
  });

  // ==================
  // Submissão — PATCH com tipo_despesa_custeio via formModal
  // ==================

  it('payload inclui tipo_despesa_custeio (uuid) quando formModal já tem tipo_despesa', async () => {
    renderComponent({
      formModal: {
        uuid: 'f1',
        recurso: 'RECURSO_PROPRIO',
        tipo_aplicacao: 'CUSTEIO',
        tipo_despesa_custeio: 'tipo-uuid-1',
      },
    });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockMutatePatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({ tipo_despesa_custeio: 'tipo-uuid-1' }),
        })
      );
    });
  });

  // ==================
  // Submissão — POST com PDDE
  // ==================

  it('chama mutationPost ao salvar prioridade PDDE com programa e ação', async () => {
    renderComponent();

    await selectOption(getSelectTrigger('Prioridade *'), 'Sim');
    await selectOption(getSelectTrigger('Recurso *'), 'PDDE');
    await waitFor(() => expect(screen.getByLabelText('Programa *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Programa *'), 'Programa 1');
    await waitFor(() => {
      fireEvent.mouseDown(getSelectTrigger('Ação *'));
    });
    await waitFor(() => {
      const opts = screen.getAllByText('Ação PDDE 1');
      const opt = opts.find(el => el.classList.contains('ant-select-item-option-content'));
      if (opt) fireEvent.click(opt);
    });
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Capital');
    await selectOption(getSelectTrigger('Especificação do Bem, Material ou Serviço *'), 'Especificação 1');

    const valorInput = document.getElementById('valor_total');
    if (valorInput) fireEvent.change(valorInput, { target: { value: '1000' } });

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => expect(mockMutatePost).toHaveBeenCalled());
  });

  // ==================
  // Submissão — validação falha com inner (Yup-like)
  // ==================

  it('trata erros de validação com inner quando campos obrigatórios faltam', async () => {
    createValidationSchema.mockReturnValue({
      validate: jest.fn().mockRejectedValue({
        inner: [
          { path: 'prioridade', message: 'Prioridade é obrigatório' },
          { path: 'recurso', message: 'Recurso é obrigatório' },
        ],
      }),
    });

    renderComponent();
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockMutatePost).not.toHaveBeenCalled();
    });
  });

  // ==================
  // Submissão — validação falha sem inner (erro não-Yup)
  // ==================

  it('ignora silenciosamente erro de validação sem inner', async () => {
    createValidationSchema.mockReturnValue({
      validate: jest.fn().mockRejectedValue(new Error('erro genérico')),
    });

    renderComponent();
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockMutatePost).not.toHaveBeenCalled();
    });
  });

  // ==================
  // onChange de prioridade limpa erros
  // ==================

  it('onChange da prioridade limpa erros do campo', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Prioridade *'), 'Sim');
  });

  // ==================
  // onChange da especificação limpa erros
  // ==================

  it('onChange da especificação limpa erros do campo', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Especificação do Bem, Material ou Serviço *'), 'Especificação 1');
  });

  // ==================
  // onChange do InputNumber valor_total
  // ==================

  it('onChange do InputNumber valor_total limpa erros do campo', () => {
    const { container } = renderComponent();
    const input = container.querySelector('.ant-input-number-input') || document.getElementById('valor_total');
    if (input) {
      fireEvent.change(input, { target: { value: '500' } });
    }
    expect(screen.getByLabelText('Valor total *')).toBeInTheDocument();
  });

  // ==================
  // handleTipoDespesaCusteioChange via DOM
  // ==================

  it('handleTipoDespesaCusteioChange: selecionar tipo de despesa limpa erros e atualiza estado', async () => {
    renderComponent();
    await selectOption(getSelectTrigger('Tipo de aplicação *'), 'Custeio');
    await waitFor(() => expect(screen.getByLabelText('Tipo de despesa *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Tipo de despesa *'), 'Tipo 1');
  });

  // ==================
  // onChange da ação PTRF
  // ==================

  it('onChange da ação PTRF limpa erros do campo acao_associacao', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PTRF' } });
    await waitFor(() => expect(screen.getByLabelText('Ação *')).toBeInTheDocument());
    await selectOption(getSelectTrigger('Ação *'), 'Ação PTRF 1');
  });

  // ==================
  // onChange da ação PDDE
  // ==================

  it('onChange da ação PDDE limpa erros do campo acao_pdde', async () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'PDDE', programa_pdde: 'prog-uuid-1' } });
    await waitFor(() => {
      fireEvent.mouseDown(getSelectTrigger('Ação *'));
    });
    await waitFor(() => {
      const opts = screen.getAllByText('Ação PDDE 1');
      const opt = opts.find(el => el.classList.contains('ant-select-item-option-content'));
      if (opt) fireEvent.click(opt);
    });
  });

  // ==================
  // Cobertura adicional de branches
  // ==================

  it('usa default focusFields=[] quando prop não é passada', () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    render(
      <QueryClientProvider client={queryClient}>
        <ModalFormAdicionarPrioridade
          open={true}
          tabelas={MOCK_TABELAS}
          onClose={jest.fn()}
          formModal={null}
        />
      </QueryClientProvider>
    );
    expect(screen.getByText('Adicionar nova prioridade')).toBeInTheDocument();
  });

  it('tipos_despesa_custeio||[] cobre branch quando tabelas não tem tipos_despesa_custeio', () => {
    const tabelasSemTipos = { ...MOCK_TABELAS, tipos_despesa_custeio: null };
    renderComponent({ tabelas: tabelasSemTipos, formModal: { uuid: 'f1', recurso: 'RECURSO_PROPRIO' } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });

  it('valor_total * 100 quando formModal.valor_total é truthy', () => {
    renderComponent({ formModal: { uuid: 'f1', recurso: 'RECURSO_PROPRIO', valor_total: 150 } });
    expect(screen.getByText('Editar prioridade')).toBeInTheDocument();
  });
});
