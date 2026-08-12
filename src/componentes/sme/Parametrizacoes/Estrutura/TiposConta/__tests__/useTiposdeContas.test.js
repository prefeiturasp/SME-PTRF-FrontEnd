import { renderHook, act } from '@testing-library/react';
import { useTiposContas } from '../hooks/useTiposdeContas';
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';
import { useGetTiposContas } from '../hooks/useGetTiposdeConta';
import { usePatchTiposDeConta } from '../hooks/usePatchTiposdeConta';
import { useDeleteTipodeConta } from '../hooks/useDeleteTiposdeConta';
import { usePostTipoConta } from '../hooks/usePostTiposdeConta';

// Mocks dos hooks e utilitários
jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext', () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes', () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock('../hooks/useGetTiposdeConta', () => ({
  useGetTiposContas: jest.fn(),
}));

jest.mock('../hooks/usePatchTiposdeConta', () => ({
  usePatchTiposDeConta: jest.fn(),
}));

jest.mock('../hooks/useDeleteTiposdeConta', () => ({
  useDeleteTipodeConta: jest.fn(),
}));

jest.mock('../hooks/usePostTiposdeConta', () => ({
  usePostTipoConta: jest.fn(),
}));

describe('Custom Hook - useTiposContas', () => {
  const mockMutatePost = jest.fn();
  const mockMutatePatch = jest.fn();
  const mockMutateDelete = jest.fn();
  const mockRefetch = jest.fn();

  const mockSelectedRecurso = {
    uuid: 'recurso-uuid-123',
  };

  const mockGetResults = [
    { id: 1, uuid: 'uuid-1', nome: 'Conta Corrente' },
    { id: 2, uuid: 'uuid-2', nome: 'Poupança' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: mockSelectedRecurso,
    });

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    useGetTiposContas.mockReturnValue({
      isLoading: false,
      data: mockGetResults,
      refetch: mockRefetch,
    });

    usePostTipoConta.mockReturnValue({
      mutationPost: { mutate: mockMutatePost },
    });

    usePatchTiposDeConta.mockReturnValue({
      mutationPatch: { mutate: mockMutatePatch },
    });

    useDeleteTipodeConta.mockReturnValue({
      mutationDelete: { mutate: mockMutateDelete },
    });
  });

  test('deve inicializar com o estado padrão e sincronizar o recurso_uuid', () => {
    const { result } = renderHook(() => useTiposContas());

    expect(result.current.TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.results).toEqual(mockGetResults);
    expect(result.current.showModalForm).toBe(false);
    expect(result.current.showModalConfirmDeleteTipoConta).toBe(false);

    // Filtros sincronizados com o recurso selecionado
    expect(result.current.draftFiltros.recurso_uuid).toBe('recurso-uuid-123');
    expect(result.current.stateFiltros.recurso_uuid).toBe('recurso-uuid-123');
  });

  test('deve atualizar o recurso_uuid quando selectedRecurso mudar', () => {
    const { result, rerender } = renderHook(() => useTiposContas());

    expect(result.current.draftFiltros.recurso_uuid).toBe('recurso-uuid-123');

    // Muda o recurso mockado
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: 'novo-recurso-456' },
    });

    rerender();

    expect(result.current.draftFiltros.recurso_uuid).toBe('novo-recurso-456');
    expect(result.current.stateFiltros.recurso_uuid).toBe('novo-recurso-456');
  });

  test('deve gerenciar a alteração, submissão e limpeza dos filtros', () => {
    const { result } = renderHook(() => useTiposContas());

    // Altera o filtro temporário (draftFiltros)
    act(() => {
      result.current.handleChangeFiltros('nome', 'Pesquisa Conta');
    });

    expect(result.current.draftFiltros.nome).toBe('Pesquisa Conta');
    // stateFiltros não deve ter mudado ainda
    expect(result.current.stateFiltros.nome).toBe('');

    // Submete os filtros
    act(() => {
      result.current.handleSubmitFiltros();
    });

    expect(result.current.stateFiltros.nome).toBe('Pesquisa Conta');

    // Limpa os filtros
    act(() => {
      result.current.handleLimparFiltros();
    });

    expect(result.current.draftFiltros.nome).toBe('');
    expect(result.current.stateFiltros.nome).toBe('');
    // recurso_uuid deve ser mantido
    expect(result.current.draftFiltros.recurso_uuid).toBe('recurso-uuid-123');
  });

  test('deve abrir o modal de criação com os dados de estado inicial', () => {
    const { result } = renderHook(() => useTiposContas());

    act(() => {
      result.current.handleOpenCreateModal();
    });

    expect(result.current.showModalForm).toBe(true);
    expect(result.current.stateFormModal).toEqual(
      expect.objectContaining({
        operacao: 'create',
        nome: '',
        recurso: { uuid: 'recurso-uuid-123' },
      })
    );
  });

  test('deve abrir e preencher o modal de edição e fechar corretamente', () => {
    const { result } = renderHook(() => useTiposContas());

    const itemParaEditar = {
      id: 10,
      uuid: 'uuid-10',
      nome: 'Conta Capital',
      banco_nome: 'Banco X',
      agencia: '0001',
      numero_conta: '12345',
      numero_cartao: '9876',
      apenas_leitura: true,
      permite_inativacao: false,
      recurso: 'recurso-uuid-123',
    };

    // Preenche o formulário para edição
    act(() => {
      // Dispara o manipulador de edição (diretamente ou simulando a execução do acoesTemplate)
      const buttonJSX = result.current.acoesTemplate(itemParaEditar);
      buttonJSX.props.onClick();
    });

    expect(result.current.showModalForm).toBe(true);
    expect(result.current.stateFormModal).toEqual(
      expect.objectContaining({
        id: 10,
        uuid: 'uuid-10',
        nome: 'Conta Capital',
        operacao: 'edit',
        recurso: { uuid: 'recurso-uuid-123' },
      })
    );

    // Fecha o modal de formulário
    act(() => {
      result.current.handleCloseFormModal();
    });

    expect(result.current.showModalForm).toBe(false);
    expect(result.current.stateFormModal.operacao).toBe('create');
  });

  test('deve disparar mutationPost quando o modal for submetido em modo "create"', () => {
    const { result } = renderHook(() => useTiposContas());

    const payloadNovo = {
      nome: 'Nova Conta',
      banco_nome: 'Banco Brasil',
      agencia: '1111',
      numero_conta: '2222',
      numero_cartao: '',
      apenas_leitura: false,
      permite_inativacao: true,
      recurso: { uuid: 'recurso-uuid-123' },
      operacao: 'create',
    };

    act(() => {
      result.current.handleSubmitModalFormTiposConta(payloadNovo);
    });

    expect(mockMutatePost).toHaveBeenCalledTimes(1);
    expect(mockMutatePost).toHaveBeenCalledWith({
      payload: {
        nome: 'Nova Conta',
        banco_nome: 'Banco Brasil',
        agencia: '1111',
        numero_conta: '2222',
        numero_cartao: '',
        apenas_leitura: false,
        permite_inativacao: true,
        recurso: 'recurso-uuid-123',
      },
    });
  });

  test('deve disparar mutationPatch quando o modal for submetido em modo "edit"', () => {
    const { result } = renderHook(() => useTiposContas());

    const payloadEdicao = {
      uuid: 'uuid-existente-99',
      nome: 'Conta Atualizada',
      banco_nome: 'Banco Y',
      agencia: '3333',
      numero_conta: '4444',
      numero_cartao: '5555',
      apenas_leitura: true,
      permite_inativacao: false,
      recurso: { uuid: 'recurso-uuid-123' },
      operacao: 'edit',
    };

    act(() => {
      result.current.handleSubmitModalFormTiposConta(payloadEdicao);
    });

    expect(mockMutatePatch).toHaveBeenCalledTimes(1);
    expect(mockMutatePatch).toHaveBeenCalledWith({
      UUID: 'uuid-existente-99',
      payload: {
        nome: 'Conta Atualizada',
        banco_nome: 'Banco Y',
        agencia: '3333',
        numero_conta: '4444',
        numero_cartao: '5555',
        apenas_leitura: true,
        permite_inativacao: false,
        recurso: 'recurso-uuid-123',
      },
    });
  });

  test('deve executar a deleção do tipo de conta e controlar o estado da modal de confirmação', () => {
    const { result } = renderHook(() => useTiposContas());

    // Simula a seleção de um item para edição
    act(() => {
      const itemParaExcluir = {
        id: 5,
        uuid: 'uuid-para-excluir',
        nome: 'Conta Exclusao',
        recurso: 'recurso-uuid-123',
      };
      const buttonJSX = result.current.acoesTemplate(itemParaExcluir);
      buttonJSX.props.onClick();
    });

    // Controla abertura e confirmação de exclusão
    act(() => {
      result.current.setShowModalConfirmDeleteTipoConta(true);
    });

    expect(result.current.showModalConfirmDeleteTipoConta).toBe(true);

    // Confirma a exclusão
    act(() => {
      result.current.onDeleteTipoContaTrue();
    });

    expect(mockMutateDelete).toHaveBeenCalledWith('uuid-para-excluir');

    // Fecha a modal de confirmação
    act(() => {
      result.current.handleCloseConfirmDeleteTipoConta();
    });

    expect(result.current.showModalConfirmDeleteTipoConta).toBe(false);
  });
});