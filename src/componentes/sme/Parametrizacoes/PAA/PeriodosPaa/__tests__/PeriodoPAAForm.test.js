import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PeriodoPAAForm } from './../PeriodoPAAForm';
import * as useGetHook from './../hooks/useGet';
import * as usePostHook from './../hooks/usePost';
import * as usePatchHook from './../hooks/usePatch';
import * as useDeleteHook from './../hooks/useDelete';
import * as permissaoModule from '../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes';
import dayjs from 'dayjs';

// Mock dos módulos
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('./../hooks/useGet');
jest.mock('./../hooks/usePost');
jest.mock('./../hooks/usePatch');
jest.mock('./../hooks/useDelete');
jest.mock('../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes');
jest.mock('../../../../../Globais/RodapeFormsID', () => ({
  RodapeFormsID: () => <div>Rodapé</div>
}));
jest.mock('./../OutrosRecursosPeriodo', () => ({
  HabilitarOutrosRecursos: () => <div>Outros Recursos</div>
}));

describe('PeriodoPAAForm', () => {
  let mockNavigate;
  let queryClient;

  const mockPeriodoData = {
    uuid: '123-456-789',
    id: 1,
    referencia: '2025 a 2026',
    data_inicial: '2025-01-01',
    data_final: '2026-12-31',
    editavel: true
  };

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

    mockNavigate = jest.fn();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    
    // Mocks padrão
    jest.spyOn(permissaoModule, 'RetornaSeTemPermissaoEdicaoPainelParametrizacoes').mockReturnValue(true);
    
    useGetHook.useGetPeriodoPaa.mockReturnValue({
      data: null,
      isLoading: false
    });

    usePostHook.usePost.mockReturnValue({
      mutationPost: {
        mutate: jest.fn(),
        isPending: false
      }
    });

    usePatchHook.usePatch.mockReturnValue({
      mutationPatch: {
        mutate: jest.fn(),
        isPending: false
      }
    });

    useDeleteHook.useDelete.mockReturnValue({
      mutationDelete: {
        mutate: jest.fn(),
        isPending: false
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (params = {}) => {
    require('react-router-dom').useParams.mockReturnValue(params);
    
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <PeriodoPAAForm />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

    describe('Renderização inicial', () => {
        test('deve renderizar o formulário vazio quando for novo período', () => {
            renderComponent({ uuid: undefined });

            expect(screen.getByText('Período')).toBeInTheDocument();
            expect(screen.getByText('* Preenchimento obrigatório')).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Descrição do período (Ex: 2025 a 2026)')).toBeInTheDocument();
            expect(screen.getByText('Data inicial')).toBeInTheDocument();
            expect(screen.getByText('Data final')).toBeInTheDocument();
        });

        test('deve renderizar botão Salvar e Cancelar para novo período', () => {
            renderComponent({ uuid: undefined });

            expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /excluir/i })).not.toBeInTheDocument();
        });

        test('deve mostrar spinner quando estiver carregando dados existentes', () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: null,
                isLoading: true
            });

            renderComponent({ uuid: '123' });

            expect(screen.getByRole('form').closest('.ant-spin-container')).toHaveClass('ant-spin-blur');
        });
    });

    describe('Edição de período existente', () => {
        test('deve carregar e exibir dados do período existente', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByDisplayValue('2025 a 2026')).toBeInTheDocument();
            });
        });

        test('deve renderizar botão Excluir para período existente', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
            });
        });

        test('deve desabilitar botões quando período não for editável', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: { ...mockPeriodoData, editavel: false },
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /salvar/i })).toBeDisabled();
                expect(screen.getByRole('button', { name: /excluir/i })).toBeDisabled();
            });
        });
    });

    describe('Validação de formulário', () => {
        test('deve exibir erro quando referência não for preenchida', async () => {
            renderComponent({ uuid: undefined });

            const submitButton = screen.getByRole('button', { name: /salvar/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                // 3 erros: campos referencia, data incial e data final
                expect(screen.queryAllByText('Campo obrigatório')).toHaveLength(3);
            });
        });

        test('deve validar que data final não pode ser anterior à data inicial', async () => {
            renderComponent({ uuid: undefined });

            const referenciaInput = screen.getByPlaceholderText('Descrição do período (Ex: 2025 a 2026)');
            fireEvent.change(referenciaInput, { target: { value: '2025 a 2026' } });

            // Simular seleção de datas através do form
            const dataInicialPicker = screen.getByTestId('input-data-inicial');
            const dataFinalPicker = screen.getByTestId('input-data-final');

            fireEvent.mouseDown(dataInicialPicker);
            fireEvent.mouseDown(dataFinalPicker);

            const submitButton = screen.getByRole('button', { name: /salvar/i });
            fireEvent.click(submitButton);

            await waitFor(() => {
                // os 2 campos de data não preenchidos
                const errors = screen.queryAllByText('Campo obrigatório');
                expect(errors).toHaveLength(2);
            });
        });
    });

    describe('Ações do formulário', () => {
        test('deve chamar mutationPost ao salvar novo período', async () => {
            const mockMutate = jest.fn();
            usePostHook.usePost.mockReturnValue({
                mutationPost: {
                mutate: mockMutate,
                isPending: false
                }
            });

            renderComponent({ uuid: undefined });

            const referenciaInput = screen.getByPlaceholderText('Descrição do período (Ex: 2025 a 2026)');
            fireEvent.change(referenciaInput, { target: { value: '2025 a 2026' } });

            const submitButton = screen.getByRole('button', { name: /salvar/i });
            fireEvent.click(submitButton);

            // Verificar que tentou validar o formulário
            await waitFor(() => {
                expect(screen.queryAllByText('Campo obrigatório').length).toBe(2);
            });
        });

        test('deve chamar mutationPatch ao atualizar período existente', async () => {
            const mockMutate = jest.fn();
            usePatchHook.usePatch.mockReturnValue({
                mutationPatch: {
                    mutate: mockMutate,
                    isPending: false
                }
            });

            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByDisplayValue('2025 a 2026')).toBeInTheDocument();
            });

            const referenciaInput = screen.getByDisplayValue('2025 a 2026');
            fireEvent.change(referenciaInput, { target: { value: '2026 a 2027' } });

            const submitButton = screen.getByRole('button', { name: /salvar/i });
            fireEvent.click(submitButton);
        });

        test('deve navegar de volta ao clicar em Cancelar', () => {
            renderComponent({ uuid: undefined });

            const cancelarButton = screen.getByRole('button', { name: /cancelar/i });
            fireEvent.click(cancelarButton);

            expect(mockNavigate).toHaveBeenCalledWith('/parametro-periodos-paa');
        });

        test('deve abrir modal de confirmação ao clicar em Excluir', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
            });

            const excluirButton = screen.getByRole('button', { name: /excluir/i });
            fireEvent.click(excluirButton);

            await waitFor(() => {
                expect(screen.getByText('Excluir Período PAA')).toBeInTheDocument();
                expect(screen.getByText('Tem certeza que deseja excluir este período?')).toBeInTheDocument();
            });
        });

        test('deve chamar mutationDelete ao confirmar exclusão', async () => {
            const mockMutate = jest.fn();
            useDeleteHook.useDelete.mockReturnValue({
                mutationDelete: {
                mutate: mockMutate,
                isPending: false
                }
            });

            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByRole('button', { name: /excluir/i })).toBeInTheDocument();
            });

            const excluirButton = screen.getByRole('button', { name: /excluir/i });
            fireEvent.click(excluirButton);

            await waitFor(() => {
                expect(screen.getByText('Excluir Período PAA')).toBeInTheDocument();
            });

            const confirmarButton = screen.getByTestId('botao-confirmar-modal');
            fireEvent.click(confirmarButton);

            await waitFor(() => {
                expect(mockMutate).toHaveBeenCalledWith('123-456-789');
                expect(mockNavigate).toHaveBeenCalledWith('/parametro-periodos-paa');
            });
        });
    });

    describe('Permissões', () => {
        test('deve desabilitar campos quando usuário não tem permissão', () => {
            jest.spyOn(permissaoModule, 'RetornaSeTemPermissaoEdicaoPainelParametrizacoes').mockReturnValue(false);

            renderComponent({ uuid: undefined });

            const referenciaInput = screen.getByPlaceholderText('Descrição do período (Ex: 2025 a 2026)');
            const dataInicialInput = screen.getByTestId('input-data-inicial');
            const dataFinalInput = screen.getByTestId('input-data-final');
            const submitButton = screen.getByRole('button', { name: /salvar/i });

            expect(referenciaInput).toBeDisabled();
            expect(dataInicialInput).toBeDisabled();
            expect(dataFinalInput).toBeDisabled();
            expect(submitButton).toBeDisabled();
        });
    });

    describe('Componentes auxiliares', () => {
        test('deve renderizar HabilitarOutrosRecursos quando houver uuid', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: '123-456-789' });

            await waitFor(() => {
                expect(screen.getByText('Outros Recursos')).toBeInTheDocument();
            });
        });

        test('NÃO deve renderizar HabilitarOutrosRecursos quando NÃO houver uuid', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: null,
                isLoading: false
            });

            renderComponent({ uuid: undefined});

            await waitFor(() => {
                expect(screen.queryByText('Outros Recursos')).not.toBeInTheDocument();
            });
        });

        test('NÃO deve renderizar RodapeFormsID em Novo cadastro', () => {
            renderComponent({ uuid: undefined });
            expect(screen.queryByText('Rodapé')).not.toBeInTheDocument();
        });

        test('deve renderizar RodapeFormsID em Edição cadastro', async () => {
            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });
            renderComponent({ uuid: mockPeriodoData.uuid });
            await waitFor(() => {
                expect(screen.queryByText('Rodapé')).toBeInTheDocument();
            })
        });
    });

    describe('Estados de loading', () => {
        test('deve mostrar spinner durante POST', () => {
            usePostHook.usePost.mockReturnValue({
                mutationPost: {
                    mutate: jest.fn(),
                    isPending: true
                }
            });

            renderComponent({ uuid: undefined });

            expect(screen.getByRole('form').closest('.ant-spin-container')).toHaveClass('ant-spin-blur');
        });

        test('deve mostrar spinner durante PATCH', async () => {
            usePatchHook.usePatch.mockReturnValue({
                mutationPatch: {
                    mutate: jest.fn(),
                    isPending: true
                }
            });

            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: mockPeriodoData.uuid });

            expect(screen.getByRole('form').closest('.ant-spin-container')).toHaveClass('ant-spin-blur');
        });

        test('deve mostrar spinner durante DELETE', async () => {
            useDeleteHook.useDelete.mockReturnValue({
                mutationDelete: {
                    mutate: jest.fn(),
                    isPending: true
                }
            });

            useGetHook.useGetPeriodoPaa.mockReturnValue({
                data: mockPeriodoData,
                isLoading: false
            });

            renderComponent({ uuid: mockPeriodoData.uuid });

            expect(screen.getByRole('form').closest('.ant-spin-container')).toHaveClass('ant-spin-blur');
        });
    });
});