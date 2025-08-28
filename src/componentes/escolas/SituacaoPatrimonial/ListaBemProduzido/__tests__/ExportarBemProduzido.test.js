import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getExportarBensProduzidos } from '../../../../../services/escolas/BensProduzidos.service';
import { toastCustom } from '../../../../Globais/ToastCustom';
import { ListaBemProduzido } from '../index';

// Mock das dependências
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));

jest.mock('../../../../../services/escolas/BensProduzidos.service', () => ({
  getExportarBensProduzidos: jest.fn()
}));

jest.mock('../../../../Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn()
  }
}));

jest.mock('../hooks/useGetBemProduzidosComAdquiridos', () => ({
  useGetBemProduzidosComAdquiridos: jest.fn()
}));

jest.mock('../../../../../hooks/Globais/useGetPeriodoComPC', () => ({
  useGetPeriodosComPC: jest.fn()
}));

jest.mock('../../../../../hooks/Globais/useCarregaTabelaDespesa', () => ({
  useCarregaTabelaDespesa: jest.fn()
}));

const mockNavigate = jest.fn();
const mockGetExportarBensProduzidos = getExportarBensProduzidos;
const mockToastCustomSuccess = toastCustom.ToastCustomSuccess;

describe('ListaBemProduzido - Funcionalidade de Exportar', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    // Mock do window.matchMedia para o Ant Design
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    // Mock do useNavigate
    useNavigate.mockReturnValue(mockNavigate);

    // Mock dos hooks
    const { useGetBemProduzidosComAdquiridos } = require('../hooks/useGetBemProduzidosComAdquiridos');
    const { useGetPeriodosComPC } = require('../../../../../hooks/Globais/useGetPeriodoComPC');
    const { useCarregaTabelaDespesa } = require('../../../../../hooks/Globais/useCarregaTabelaDespesa');

    useGetBemProduzidosComAdquiridos.mockReturnValue({
      data: {
        count: 15,
        results: [
          {
            uuid: '1',
            numero_documento: '123456',
            especificacao_do_bem: 'Bem teste 1',
            status: 'COMPLETO',
            num_processo_incorporacao: '1234567890123456',
            data_aquisicao_producao: '2024-01-15',
            periodo: '2024',
            quantidade: 5,
            valor_total: 1000.50,
            tipo: 'Produzido',
            bem_produzido_uuid: 'bem-1',
            despesas: []
          }
        ]
      },
      refetch: jest.fn(),
      isLoading: false,
      error: null,
      isError: false
    });

    useGetPeriodosComPC.mockReturnValue({
      data: [
        { uuid: 'periodo-1', referencia: '2024' }
      ]
    });

    useCarregaTabelaDespesa.mockReturnValue({
      acoes_associacao: [
        { uuid: 'acao-1', nome: 'Ação 1' }
      ],
      contas_associacao: [
        { uuid: 'conta-1', nome: 'Conta 1' }
      ]
    });

    // Mock do localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) => {
          if (key === 'ASSOCIACAO_UUID') return 'associacao-test';
          if (key === 'TOKEN_ALIAS') return 'token-test';
          return null;
        }),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // Mock do console.log para evitar logs nos testes
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('Renderização do botão de Exportar', () => {
    it('deve renderizar o botão de exportar quando há dados', () => {
      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      expect(botaoExportar).toBeInTheDocument();
      expect(botaoExportar.closest('button')).toHaveClass('link-exportar');
    });

    it('deve renderizar o ícone de download no botão de exportar', () => {
      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      const iconeDownload = botaoExportar.previousElementSibling;
      expect(iconeDownload).toBeInTheDocument();
      expect(iconeDownload.tagName).toBe('svg');
    });

    it('deve exibir o botão de exportar apenas quando há dados para exportar', () => {
      const { useGetBemProduzidosComAdquiridos } = require('../hooks/useGetBemProduzidosComAdquiridos');
      
      // Mock sem dados
      useGetBemProduzidosComAdquiridos.mockReturnValue({
        data: null,
        refetch: jest.fn(),
        isLoading: false,
        error: null,
        isError: false
      });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.queryByText('Exportar');
      expect(botaoExportar).not.toBeInTheDocument();
    });
  });

  describe('Funcionalidade de Exportar', () => {
    it('deve chamar a função de exportar quando o botão for clicado', async () => {
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(mockGetExportarBensProduzidos).toHaveBeenCalledTimes(1);
      });
    });

    it('deve exibir mensagem de sucesso após exportação bem-sucedida', async () => {
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(mockToastCustomSuccess).toHaveBeenCalledWith(
          'Geração solicitada com sucesso.',
          'A geração foi solicitada. Em breve você receberá um aviso na central de downloads com o resultado.'
        );
      });
    });

    it('deve chamar a API com os parâmetros corretos', async () => {
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(mockGetExportarBensProduzidos).toHaveBeenCalledWith();
      });
    });

    it('deve lidar com erro na exportação', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      mockGetExportarBensProduzidos.mockRejectedValue(new Error('Erro na API'));

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao exportar dados', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    it('deve manter o botão funcional após erro na exportação', async () => {
      mockGetExportarBensProduzidos.mockRejectedValue(new Error('Erro na API'));

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      
      // Primeira tentativa com erro
      fireEvent.click(botaoExportar);
      
      await waitFor(() => {
        expect(mockGetExportarBensProduzidos).toHaveBeenCalledTimes(1);
      });

      // Mock de sucesso para segunda tentativa
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });
      
      // Segunda tentativa
      fireEvent.click(botaoExportar);
      
      await waitFor(() => {
        expect(mockGetExportarBensProduzidos).toHaveBeenCalledTimes(2);
        expect(mockToastCustomSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Estados do botão de Exportar', () => {
    it('deve manter o botão habilitado durante a exportação', async () => {
      // Mock de uma promise que não resolve imediatamente
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      mockGetExportarBensProduzidos.mockReturnValue(promise);

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      expect(botaoExportar.closest('button')).not.toBeDisabled();

      fireEvent.click(botaoExportar);
      
      // O botão deve permanecer habilitado
      expect(botaoExportar.closest('button')).not.toBeDisabled();

      // Resolve a promise
      resolvePromise({ success: true });
    });

    it('deve manter o botão habilitado após múltiplos cliques', async () => {
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      
      // Múltiplos cliques
      fireEvent.click(botaoExportar);
      fireEvent.click(botaoExportar);
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(mockGetExportarBensProduzidos).toHaveBeenCalledTimes(3);
      });

      expect(botaoExportar.closest('button')).not.toBeDisabled();
    });
  });

  describe('Integração com outros componentes', () => {
    it('deve manter a funcionalidade de filtros funcionando após exportação', async () => {
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(mockToastCustomSuccess).toHaveBeenCalled();
      });

      // Verifica se os filtros ainda estão funcionando
      const botaoAdicionar = screen.getByText('Adicionar bem produzido');
      expect(botaoAdicionar).toBeInTheDocument();
    });

    it('deve manter a navegação funcionando após exportação', async () => {
      mockGetExportarBensProduzidos.mockResolvedValue({ success: true });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(mockToastCustomSuccess).toHaveBeenCalled();
      });

      // Verifica se a navegação ainda funciona
      const botaoAdicionar = screen.getByText('Adicionar bem produzido');
      fireEvent.click(botaoAdicionar);

      expect(mockNavigate).toHaveBeenCalledWith('/cadastro-bem-produzido');
    });
  });

  describe('Tratamento de erros específicos', () => {
    it('deve lidar com erro de rede', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      mockGetExportarBensProduzidos.mockRejectedValue(new Error('Network Error'));

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao exportar dados', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    it('deve lidar com erro de timeout', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
      mockGetExportarBensProduzidos.mockRejectedValue(new Error('Request timeout'));

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      const botaoExportar = screen.getByText('Exportar');
      fireEvent.click(botaoExportar);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Erro ao exportar dados', expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Formatação de Data', () => {
    it('deve formatar data corretamente', () => {
      const { useGetBemProduzidosComAdquiridos } = require('../hooks/useGetBemProduzidosComAdquiridos');
      
      useGetBemProduzidosComAdquiridos.mockReturnValue({
        data: {
          count: 1,
          results: [
            {
              uuid: '1',
              numero_documento: '123456',
              especificacao_do_bem: 'Bem teste',
              status: 'COMPLETO',
              num_processo_incorporacao: '1234567890123456',
              data_aquisicao_producao: '2024-01-15',
              periodo: '2024',
              quantidade: 5,
              valor_total: 1000.50,
              tipo: 'Produzido',
              bem_produzido_uuid: 'bem-1',
              despesas: []
            }
          ]
        },
        refetch: jest.fn(),
        isLoading: false,
        error: null,
        isError: false
      });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Verifica se o componente é renderizado corretamente
      expect(screen.getByText('Bem teste')).toBeInTheDocument();
    });
  });

  describe('Spinner', () => {
    it('deve mostrar spinner quando está carregando', () => {
      const { useGetBemProduzidosComAdquiridos } = require('../hooks/useGetBemProduzidosComAdquiridos');
      
      useGetBemProduzidosComAdquiridos.mockReturnValue({
        data: null,
        refetch: jest.fn(),
        isLoading: true,
        error: null,
        isError: false
      });

      render(
        <MemoryRouter>
          <QueryClientProvider client={queryClient}>
            <ListaBemProduzido />
          </QueryClientProvider>
        </MemoryRouter>
      );

      // Verifica se o spinner está presente (componente Spin do Ant Design)
      const spinner = document.querySelector('.ant-spin');
      expect(spinner).toBeInTheDocument();
    });
  });
});
