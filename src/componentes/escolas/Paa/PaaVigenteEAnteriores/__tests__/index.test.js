import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { PaaVigenteEAnteriores } from '../index';
import { usePaaVigenteEAnteriores } from '../hooks/usePaaVigenteEAnteriores';
import { useDocumentoFinalPaa } from '../hooks/useDocumentoFinalPaa';
import { getStatusAtaPaa, postGerarAtaPaa, getDownloadAtaPaa } from '../../../../../services/escolas/Paa.service';
import { iniciarAtaPaa, obterUrlAtaPaa } from '../../../../../services/escolas/AtasPaa.service';
import { ASSOCIACAO_UUID } from '../../../../../services/auth.service';

jest.mock('../hooks/usePaaVigenteEAnteriores');
jest.mock('../hooks/useDocumentoFinalPaa');
jest.mock('../../../../../services/escolas/Paa.service');
jest.mock('../../../../../services/escolas/AtasPaa.service');
jest.mock('../../../../Globais/ToastCustom', () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
    ToastCustomSuccess: jest.fn(),
  },
}));
jest.mock('../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));
jest.mock('../../../../Globais/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));
jest.mock('../../../../Globais/ModalVisualizarPdf', () => ({
  ModalVisualizarPdf: ({ show, onHide, titulo }) => 
    show ? <div data-testid="modal-pdf">{titulo}</div> : null,
}));
jest.mock('../ModalConfirmaGeracaoAta', () => ({
  ModalConfirmaGeracaoAta: ({ open, onConfirm }) => 
    open ? <button data-testid="modal-confirmar" onClick={onConfirm}>Confirmar</button> : null,
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
const mockVigente = {
  uuid: 'vigente-uuid',
  periodo_paa_objeto: { referencia: '2024 a 2025' },
};
const mockAnteriores = [
  { uuid: 'anterior-uuid-1', periodo_paa_objeto: { referencia: '2023 a 2024' } },
];

describe('PaaVigenteEAnteriores', () => {
  let queryClient;

  const createMockHookReturn = (overrides = {}) => ({
    data: {
      vigente: mockVigente,
      anteriores: mockAnteriores,
    },
    isLoading: false,
    isError: false,
    ...overrides,
  });

  const createMockDocumentoFinalReturn = (overrides = {}) => ({
    statusDocumento: {},
    statusCarregando: {},
    downloadEmAndamento: null,
    visualizacaoEmAndamento: null,
    carregarStatusDocumento: jest.fn(),
    baixarDocumentoFinal: jest.fn(),
    obterUrlDocumentoFinal: jest.fn().mockResolvedValue('blob:url'),
    revogarUrlDocumento: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(ASSOCIACAO_UUID, 'associacao-uuid-test');
    
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    usePaaVigenteEAnteriores.mockReturnValue(createMockHookReturn());
    useDocumentoFinalPaa.mockReturnValue(createMockDocumentoFinalReturn());
    iniciarAtaPaa.mockResolvedValue({ uuid: 'ata-uuid', completa: true });
    getStatusAtaPaa.mockResolvedValue({ status_geracao_pdf: 'NAO_GERADO' });
  });

  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <PaaVigenteEAnteriores />
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  describe('Renderização', () => {
    it('deve renderizar o título e breadcrumb', () => {
      renderComponent();
      expect(screen.getByText('Plano Anual de Atividades')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('deve renderizar o PAA vigente quando carregado', () => {
      renderComponent();
      expect(screen.getByText(/PAA 2024\/2025/)).toBeInTheDocument();
    });

    it('deve renderizar loading quando está carregando', () => {
      usePaaVigenteEAnteriores.mockReturnValue(createMockHookReturn({ isLoading: true }));
      renderComponent();
      expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    });

    it('deve renderizar mensagem quando não há anteriores', () => {
      usePaaVigenteEAnteriores.mockReturnValue(
        createMockHookReturn({ data: { vigente: mockVigente, anteriores: [] } })
      );
      renderComponent();
      expect(screen.getByText(/A sua unidade ainda não possui Planos anteriores/)).toBeInTheDocument();
    });
    
    it('deve renderizar mensagem quando não há Plano vigente', () => {
      usePaaVigenteEAnteriores.mockReturnValue(
        createMockHookReturn({ data: { vigente: null, anteriores: [] } })
      );
      renderComponent();
      expect(screen.getByText(/A sua unidade ainda não possui Plano Vigente/)).toBeInTheDocument();
    });
  });

  describe('Funções auxiliares', () => {
    it('deve formatar referência corretamente', () => {
      renderComponent();
      expect(screen.getByText(/PAA 2024\/2025/)).toBeInTheDocument();
    });

    it('deve exibir status de documento pendente quando não gerado', () => {
      useDocumentoFinalPaa.mockReturnValue(
        createMockDocumentoFinalReturn({
          statusDocumento: { 'vigente-uuid': { status: 'PENDENTE' } },
        })
      );
      renderComponent();
      expect(screen.getByText(/Documento final ainda não gerado/)).toBeInTheDocument();
    });
  });

  describe('Validações de geração de ata', () => {
    it('deve desabilitar botão quando ata não existe', async () => {
      iniciarAtaPaa.mockResolvedValue(null);
      renderComponent();
      await waitFor(() => {
        const botao = screen.queryByText('Gerar ata');
        expect(botao).toBeDisabled();
      });
    });

    it('deve desabilitar botão quando documento não está concluído', async () => {
      useDocumentoFinalPaa.mockReturnValue(
        createMockDocumentoFinalReturn({
          statusDocumento: {
            'vigente-uuid': { status: 'PENDENTE', versao: 'RASCUNHO' },
          },
        })
      );
      renderComponent();
      await waitFor(() => {
        const botao = screen.queryByText('Gerar ata');
        expect(botao).toBeDisabled();
      });
    });
  });

  describe('Interações', () => {
    it('deve abrir/fechar dropdown de anteriores', async () => {
      renderComponent();
      const toggleButton = screen.getAllByAltText(/Abrir|Fechar/)[1];
      await userEvent.click(toggleButton);
      expect(screen.getByText(/PAA 2023\/2024/)).toBeInTheDocument();
    });

    it('deve abrir modal de confirmação ao clicar em gerar ata', async () => {
      iniciarAtaPaa.mockResolvedValue({ uuid: 'ata-uuid', completa: true });
      useDocumentoFinalPaa.mockReturnValue(
        createMockDocumentoFinalReturn({
          statusDocumento: {
            'vigente-uuid': { status: 'CONCLUIDO', versao: 'FINAL', mensagem: 'Documento final gerado' },
          },
        })
      );
      getStatusAtaPaa.mockResolvedValue({ status_geracao_pdf: 'NAO_GERADO' });
      
      renderComponent();
      
      // Aguardar a ata ser carregada e o botão aparecer habilitado
      await waitFor(() => {
        const botao = screen.queryByText('Gerar ata');
        expect(botao).toBeInTheDocument();
        expect(botao).not.toBeDisabled();
      }, { timeout: 3000 });
      
      // Clicar no botão
      const botao = screen.getByText('Gerar ata');
      await userEvent.click(botao);
      
      // Verificar se o modal foi aberto
      await waitFor(() => {
        expect(screen.queryByTestId('modal-confirmar')).toBeInTheDocument();
      });
    });
  });

  describe('Status de ata', () => {
    it('deve exibir status de processamento quando em processamento', async () => {
      iniciarAtaPaa.mockResolvedValue({ uuid: 'ata-uuid' });
      getStatusAtaPaa.mockResolvedValue({ status_geracao_pdf: 'EM_PROCESSAMENTO' });
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText(/Documento sendo gerado/)).toBeInTheDocument();
      });
    });

    it('deve exibir status concluído quando gerada', async () => {
      iniciarAtaPaa.mockResolvedValue({ uuid: 'ata-uuid' });
      getStatusAtaPaa.mockResolvedValue({
        status_geracao_pdf: 'CONCLUIDO',
        alterado_em: '2024-01-01T10:00:00Z',
      });
      renderComponent();
      
      await waitFor(() => {
        expect(screen.getByText(/Documento final gerado em/)).toBeInTheDocument();
      });
    });
  });
});

