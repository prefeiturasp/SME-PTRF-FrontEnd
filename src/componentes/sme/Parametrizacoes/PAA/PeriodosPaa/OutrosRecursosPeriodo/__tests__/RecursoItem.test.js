import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecursoItem } from '../RecursoItem';
import * as useGetHook from '../hooks/useGet';
import * as usePatchHook from '../hooks/usePatch';
import * as usePostHook from '../hooks/usePost';
import * as toastModule from '../../../../../../Globais/ToastCustom';

// Mock dos módulos
jest.mock('../hooks/useGet');
jest.mock('../hooks/usePatch');
jest.mock('../hooks/usePost');
jest.mock('../../../../../../Globais/BadgeCustom', () => ({
  BadgeCustom: ({ buttonlabel, buttoncolor }) => (
    <div data-testid="badge-custom" style={{ color: buttoncolor }}>
      {buttonlabel}
    </div>
  )
}));
jest.mock('../VincularUnidades', () => ({
  VincularUnidades: ({ outroRecursoPeriodo }) => (
    <div data-testid="vincular-unidades">
      Vincular Unidades - {outroRecursoPeriodo?.uuid || 'sem uuid'}
    </div>
  )
}));
jest.mock('../../../../../../Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn()
  }
}));

describe('RecursoItem', () => {
  let queryClient;

  const mockRecurso = {
    uuid: 'recurso-123',
    nome: 'Recurso de Teste',
    aceita_capital: true,
    aceita_custeio: true,
    aceita_livre_aplicacao: false
  };

  const mockOutroRecursoPeriodo = {
    uuid: 'recurso-periodo-456',
    periodo_paa: 'periodo-789',
    outro_recurso: 'recurso-123',
    ativo: true,
    uso_associacao: 'Todas'
  };

  const periodoUuid = 'periodo-789';

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    // Mocks padrão
    useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
      data: { results: [] },
      isLoading: false,
      refetch: jest.fn()
    });

    usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false
    });

    usePostHook.usePostOutroRecursoPeriodo.mockReturnValue({
      mutateAsync: jest.fn(),
      isPending: false
    });

    jest.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      recurso: mockRecurso,
      periodoUuid: periodoUuid,
      ...props
    };

    return render(
      <QueryClientProvider client={queryClient}>
        <RecursoItem {...defaultProps} />
      </QueryClientProvider>
    );
  };

  describe('Renderização inicial', () => {
    test('deve renderizar o nome do recurso', () => {
      renderComponent();

      expect(screen.getByText('Recurso de Teste')).toBeInTheDocument();
    });

    test('deve renderizar o switch desativado quando não há recurso período cadastrado', () => {
      renderComponent();

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toBeInTheDocument();
      expect(switchElement).not.toBeChecked();
    });

    test('deve renderizar labels dos campos booleanos aceitos', () => {
      renderComponent();

      expect(screen.getByText('Capital • Custeio')).toBeInTheDocument();
    });

    test('deve renderizar "-" quando nenhum campo booleano está ativo', () => {
      const recursoSemCampos = {
        ...mockRecurso,
        aceita_capital: false,
        aceita_custeio: false,
        aceita_livre_aplicacao: false
      };

      renderComponent({ recurso: recursoSemCampos });

      const secondaryTexts = screen.getAllByText('-');
      expect(secondaryTexts.length).toBeGreaterThan(0);
    });

    test('deve renderizar todos os três campos quando todos estão ativos', () => {
      const recursoComTodosCampos = {
        ...mockRecurso,
        aceita_capital: true,
        aceita_custeio: true,
        aceita_livre_aplicacao: true
      };

      renderComponent({ recurso: recursoComTodosCampos });

      expect(screen.getByText('Capital • Custeio • Livre aplicação')).toBeInTheDocument();
    });
  });

  describe('Estado com recurso período existente', () => {
    test('deve renderizar switch ativado quando recurso período está ativo', async () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeChecked();
      });
    });

    test('deve renderizar badge de uso associação quando existe recurso período', async () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Uso associação')).toBeInTheDocument();
        expect(screen.getByTestId('badge-custom')).toHaveTextContent('Todas');
      });
    });

    test('deve renderizar badge laranja quando uso associação é "Específicas"', async () => {
      const recursoPeriodoEspecificas = {
        ...mockOutroRecursoPeriodo,
        uso_associacao: 'Específicas'
      };

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [recursoPeriodoEspecificas] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        const badge = screen.getByTestId('badge-custom');
        expect(badge).toHaveTextContent('Específicas');
        expect(badge).toHaveStyle({ color: 'orange' });
      });
    });

    test('deve mostrar ícone de expansão quando existe recurso período', async () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        const collapseHeader = screen.getByRole('button');
        expect(collapseHeader).toBeInTheDocument();
      });
    });
  });

  describe('Interações com Switch', () => {
    test('deve criar novo recurso período ao ativar switch quando não existe', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue({});
      const mockRefetch = jest.fn();

      usePostHook.usePostOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        refetch: mockRefetch
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          payload: {
            periodo_paa: periodoUuid,
            outro_recurso: mockRecurso.uuid
          }
        });
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    test('deve atualizar recurso período ao desativar switch quando já existe', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue({});
      const mockRefetch = jest.fn();

      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: mockRefetch
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('switch')).toBeChecked();
      });

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(mockMutateAsync).toHaveBeenCalledWith({
          uuid: mockOutroRecursoPeriodo.uuid,
          payload: { ativo: false }
        });
        expect(mockRefetch).toHaveBeenCalled();
      });
    });

    test('deve exibir toast de sucesso ao ativar recurso', async () => {
      const mockMutateAsync = jest.fn().mockResolvedValue({});

      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [{ ...mockOutroRecursoPeriodo, ativo: false }] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(toastModule.toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          'Recurso ativado com sucesso.'
        );
      });
    });

    test('deve exibir toast de erro ao falhar ativação', async () => {
      const errorResponse = {
        response: {
          data: {
            detail: 'Erro ao ativar recurso'
          }
        }
      };

      const mockMutateAsync = jest.fn().mockRejectedValue(errorResponse);

      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [{ ...mockOutroRecursoPeriodo, ativo: false }] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(toastModule.toastCustom.ToastCustomError).toHaveBeenCalledWith(
          'Erro ao ativar recurso',
          'Erro ao ativar recurso'
        );
      });
    });
  });

  describe('Collapse e Expansão', () => {
    test('deve renderizar VincularUnidades ao expandir collapse', async () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument();
      });

      const collapseButton = screen.getByRole('button');
      fireEvent.click(collapseButton);

      await waitFor(() => {
        expect(screen.getByTestId('vincular-unidades')).toBeInTheDocument();
        expect(screen.getByText(`Vincular Unidades - ${mockOutroRecursoPeriodo.uuid}`)).toBeInTheDocument();
      });
    });

    test('não deve mostrar ícone de expansão quando não há recurso período', () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      // Verifica que não há ícone de chevron
      const collapseElement = screen.getByText('Recurso de Teste').closest('.ant-collapse');
      expect(collapseElement).toBeInTheDocument();
    });
  });

  describe('Estados de Loading', () => {
    test('deve mostrar spinner durante carregamento inicial', () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: null,
        isLoading: true,
        refetch: jest.fn()
      });

      renderComponent();

      const spinners = document.querySelectorAll('.ant-spin-spinning');
      expect(spinners.length).toBeGreaterThan(0);
    });

    test('deve mostrar spinner durante mutação POST', () => {
      usePostHook.usePostOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: true
      });

      renderComponent();

      const spinners = document.querySelectorAll('.ant-spin-spinning');
      expect(spinners.length).toBeGreaterThan(0);
    });

    test('deve mostrar spinner durante mutação PATCH', async () => {
      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: jest.fn(),
        isPending: true
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const spinners = document.querySelectorAll('.ant-spin-spinning');
      expect(spinners.length).toBeGreaterThan(0);
    });
  });

  describe('Filtros e Queries', () => {
    test('deve buscar recurso período com filtros corretos', () => {
      renderComponent();

      expect(useGetHook.useGetOutrosRecursosPeriodoPaa).toHaveBeenCalledWith({
        periodo_paa_uuid: periodoUuid,
        outro_recurso_uuid: mockRecurso.uuid
      });
    });

    test('deve encontrar recurso período correto nos resultados', async () => {
      const outrosRecursos = [
        { ...mockOutroRecursoPeriodo, uuid: 'outro-1' },
        mockOutroRecursoPeriodo,
        { ...mockOutroRecursoPeriodo, uuid: 'outro-2' }
      ];

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: outrosRecursos },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        const switchElement = screen.getByRole('switch');
        expect(switchElement).toBeChecked();
      });
    });
  });

  describe('Tratamento de erros', () => {
    test('deve tratar erro com non_field_errors', async () => {
      const errorResponse = {
        response: {
          data: {
            non_field_errors: ['Erro de validação']
          }
        }
      };

      const mockMutateAsync = jest.fn().mockRejectedValue(errorResponse);

      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(toastModule.toastCustom.ToastCustomError).toHaveBeenCalledWith(
          'Erro ao desativar recurso',
          ['Erro de validação']
        );
      });
    });

    test('deve tratar erro com mensagem', async () => {
      const errorResponse = {
        response: {
          data: {
            mensagem: 'Mensagem de erro customizada'
          }
        }
      };

      const mockMutateAsync = jest.fn().mockRejectedValue(errorResponse);

      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(toastModule.toastCustom.ToastCustomError).toHaveBeenCalledWith(
          'Erro ao desativar recurso',
          'Mensagem de erro customizada'
        );
      });
    });

    test('deve usar mensagem padrão quando erro não tem detalhes', async () => {
      const errorResponse = {
        response: {
          data: {}
        }
      };

      const mockMutateAsync = jest.fn().mockRejectedValue(errorResponse);

      usePatchHook.usePatchOutroRecursoPeriodo.mockReturnValue({
        mutateAsync: mockMutateAsync,
        isPending: false
      });

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [mockOutroRecursoPeriodo] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      await waitFor(() => {
        expect(toastModule.toastCustom.ToastCustomError).toHaveBeenCalledWith(
          'Erro ao desativar recurso',
          'Falha ao atualizar recurso'
        );
      });
    });
  });

  describe('Casos de fluxos', () => {

    test('deve lidar com dados vazios', () => {
      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      const switchElement = screen.getByRole('switch');
      expect(switchElement).not.toBeChecked();
    });

    test('deve renderizar "-" quando uso_associacao está undefined', async () => {
      const recursoPeriodoSemUso = {
        ...mockOutroRecursoPeriodo,
        uso_associacao: undefined
      };

      useGetHook.useGetOutrosRecursosPeriodoPaa.mockReturnValue({
        data: { results: [recursoPeriodoSemUso] },
        isLoading: false,
        refetch: jest.fn()
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Uso associação')).toBeInTheDocument();
      });
    });
  });
});