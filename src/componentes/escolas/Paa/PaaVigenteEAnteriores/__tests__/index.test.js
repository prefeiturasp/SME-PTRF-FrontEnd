import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { PaaVigenteEAnteriores } from '../index';
import { usePaaVigenteEAnteriores } from '../hooks/usePaaVigenteEAnteriores';
import { ASSOCIACAO_UUID } from '../../../../../services/auth.service';

jest.mock('../hooks/usePaaVigenteEAnteriores');
jest.mock('../../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: () => false,
    getPermissoes: () => false,
  },
}));
jest.mock('../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));
jest.mock('../../../../Globais/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

const mockBlocoDoc = (mensagem, cor = 'grey') => ({
  uuid: null,
  existe_arquivo: false,
  status: {
    status_geracao: 'NAO_GERADO',
    mensagem,
    cor_mensagem: cor,
    versao_documento: 0,
    retificacao: false,
  },
  url: '',
});

const mockVigente = {
  uuid: 'vigente-uuid',
  referencia: '2024 a 2025',
  esta_em_retificacao: false,
  pode_retificar: false,
  original: {
    documento: mockBlocoDoc('Documento pendente de geração.', 'red'),
    ata: mockBlocoDoc('Documento pendente de geração.', 'red'),
  },
  retificacao: null,
};

const mockAnteriores = [
  {
    uuid: 'anterior-uuid-1',
    referencia: '2023 a 2024',
    esta_em_retificacao: false,
    pode_retificar: false,
    original: {
      documento: mockBlocoDoc('Documento pendente de geração.', 'red'),
      ata: mockBlocoDoc('Documento pendente de geração.', 'red'),
    },
    retificacao: null,
  },
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

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem(ASSOCIACAO_UUID, 'associacao-uuid-test');

    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    usePaaVigenteEAnteriores.mockReturnValue(createMockHookReturn());
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <PaaVigenteEAnteriores />
        </QueryClientProvider>
      </MemoryRouter>
    );

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

    it('deve formatar referência corretamente no título do vigente', () => {
      renderComponent();
      expect(screen.getByText(/PAA 2024\/2025/)).toBeInTheDocument();
    });

    it('deve exibir status do plano e da ata quando expandido', () => {
      renderComponent();
      expect(screen.getAllByText('Plano anual').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Ata de apresentação do PAA').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByTestId('plano-mensagem').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Interações', () => {
    it('deve abrir/fechar dropdown de anteriores', async () => {
      renderComponent();
      const toggleButton = screen.getAllByAltText(/Abrir|Fechar/)[1];
      await userEvent.click(toggleButton);
      expect(screen.getByText(/PAA 2023\/2024/)).toBeInTheDocument();
    });
  });
});
