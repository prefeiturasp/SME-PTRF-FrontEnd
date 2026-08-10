import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { TagsContext, TagsContextProvider } from '../context/TagsContext';

// Mocks dos hooks e utilitários externos
import { useAbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext';
import { useGetTags } from '../hooks/useGetTags';
import { usePostTag } from '../hooks/usePostTag';
import { usePatchTag } from '../hooks/usePatchTag';
import { useDeleteTag } from '../hooks/useDeleteTag';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from '../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes';

jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext');
jest.mock('../hooks/useGetTags');
jest.mock('../hooks/usePostTag');
jest.mock('../hooks/usePatchTag');
jest.mock('../hooks/useDeleteTag');
jest.mock('../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes');

describe('TagsContextProvider', () => {
  // Mocks de funções do React Query / mutações
  const mockMutatePost = jest.fn();
  const mockMutatePatch = jest.fn();
  const mockMutateDelete = jest.fn();

  // Helper para renderizar o contexto usando o wrapper
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const useTestContext = () => renderHook(() => useContext(TagsContext), {
    wrapper: ({ children }) => <TagsContextProvider>{children}</TagsContextProvider>,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Valores padrão dos mocks
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: 'recurso-uuid-123' },
    });

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    useGetTags.mockReturnValue({
      isLoading: false,
      data: [{ id: 1, nome: 'Tag Teste' }],
    });

    usePostTag.mockReturnValue({ mutationPost: { mutate: mockMutatePost } });
    usePatchTag.mockReturnValue({ mutationPatch: { mutate: mockMutatePatch } });
    useDeleteTag.mockReturnValue({ mutationDelete: { mutate: mockMutateDelete } });
  });

  it('deve inicializar os estados com o recurso selecionado', () => {
    const { result } = useTestContext();

    expect(result.current.filters.recurso_uuid).toBe('recurso-uuid-123');
    expect(result.current.draftFilters.recurso_uuid).toBe('recurso-uuid-123');
    expect(result.current.TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES).toBe(true);
    expect(result.current.results).toEqual([{ id: 1, nome: 'Tag Teste' }]);
  });

  describe('Gerenciamento de Filtros', () => {
    it('deve atualizar draftFilters e aplicar ao chamar handleSubmitFiltros', () => {
      const { result } = useTestContext();

      act(() => {
        result.current.handleChangeFiltros('filtrar_por_nome', 'Nova Tag');
      });

      expect(result.current.draftFilters.filtrar_por_nome).toBe('Nova Tag');
      expect(result.current.filters.filtrar_por_nome).toBe(''); // Filtro ativo não mudou ainda

      act(() => {
        result.current.handleSubmitFiltros();
      });

      expect(result.current.filters.filtrar_por_nome).toBe('Nova Tag');
    });

    it('deve resetar os filtros ao chamar limpaFiltros', () => {
      const { result } = useTestContext();

      act(() => {
        result.current.handleChangeFiltros('filtrar_por_nome', 'Texto Temporario');
        result.current.handleSubmitFiltros();
      });

      act(() => {
        result.current.limpaFiltros();
      });

      expect(result.current.draftFilters.filtrar_por_nome).toBe('');
      expect(result.current.filters.filtrar_por_nome).toBe('');
      expect(result.current.filters.recurso_uuid).toBe('recurso-uuid-123');
    });
  });

  describe('Gerenciamento do Modal de Formulário', () => {
    it('deve abrir o modal de criação com as informações padrão', () => {
      const { result } = useTestContext();

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.modalForm.open).toBe(true);
      expect(result.current.modalForm.operacao).toBe('create');
      expect(result.current.modalForm.recurso).toEqual({ uuid: 'recurso-uuid-123' });
    });

    it('deve abrir o modal em modo de edição com os dados da linha', () => {
      const { result } = useTestContext();
      const mockRowData = {
        uuid: 'tag-123',
        nome: 'Tag Existente',
        status: 'ATIVO',
        recurso: 'recurso-uuid-123',
      };

      act(() => {
        result.current.handleOpenModalForm(mockRowData);
      });

      expect(result.current.modalForm.open).toBe(true);
      expect(result.current.modalForm.operacao).toBe('edit');
      expect(result.current.modalForm.nome).toBe('Tag Existente');
    });

    it('deve fechar o modal ao chamar handleClose', () => {
      const { result } = useTestContext();

      act(() => {
        result.current.handleOpenCreateModal();
      });

      expect(result.current.modalForm.open).toBe(true);

      act(() => {
        result.current.handleClose();
      });

      expect(result.current.modalForm.open).toBe(false);
    });
  });

  describe('Submissão e Operações de Mutação', () => {
    it('deve chamar a mutação de criação (Post) quando não houver uuid', () => {
      const { result } = useTestContext();

      const formValues = {
        nome: 'Nova Tag',
        status: 'ATIVO',
        recurso: { uuid: 'recurso-uuid-123' },
      };

      act(() => {
        result.current.handleSubmitFormModal(formValues);
      });

      expect(mockMutatePost).toHaveBeenCalledWith({
        payload: {
          nome: 'Nova Tag',
          status: 'ATIVO',
          recurso: 'recurso-uuid-123',
        },
      });
    });

    it('deve chamar a mutação de atualização (Patch) quando houver uuid', () => {
      const { result } = useTestContext();

      const formValues = {
        uuid: 'tag-uuid-123',
        nome: 'Tag Editada',
        status: 'INATIVO',
        recurso: { uuid: 'recurso-uuid-123' },
      };

      act(() => {
        result.current.handleSubmitFormModal(formValues);
      });

      expect(mockMutatePatch).toHaveBeenCalledWith({
        UUID: 'tag-uuid-123',
        payload: {
          nome: 'Tag Editada',
          status: 'INATIVO',
          recurso: 'recurso-uuid-123',
        },
      });
    });

    it('deve disparar a deleção ao chamar handleDelete', () => {
      const { result } = useTestContext();

      act(() => {
        result.current.handleDelete('tag-uuid-para-deletar');
      });

      expect(mockMutateDelete).toHaveBeenCalledWith('tag-uuid-para-deletar');
    });
  });
});