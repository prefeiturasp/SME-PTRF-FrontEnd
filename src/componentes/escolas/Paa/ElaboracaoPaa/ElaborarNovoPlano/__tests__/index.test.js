import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ElaborarNovoPlano } from '../index';
import { iniciarAtaPaa } from '../../../../../../services/escolas/AtasPaa.service';

const mockUseLocation = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockUseLocation(),
}));

jest.mock('../../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock('../../../../../Globais/Breadcrumb', () => ({
  __esModule: true,
  default: () => <div data-testid="breadcrumb">Breadcrumb</div>,
}));

jest.mock('../../../../../Globais/TabSelector', () => ({
  __esModule: true,
  default: ({ tabs, activeTab, setActiveTab }) => (
    <div data-testid="tab-selector">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          data-testid={`tab-${tab.id}`}
          onClick={() => setActiveTab(tab.id)}
          aria-selected={activeTab === tab.id}
        >
          {tab.label}
        </button>
      ))}
    </div>
  ),
}));

jest.mock('../LevantamentoDePrioridades', () => ({
  __esModule: true,
  default: () => <div data-testid="levantamento-prioridades">LevantamentoDePrioridades</div>,
}));

jest.mock('../ReceitasPrevistas', () => ({
  __esModule: true,
  default: ({ receitasDestino }) => (
    <div data-testid="receitas-previstas" data-receitas-destino={receitasDestino}>
      ReceitasPrevistas
    </div>
  ),
}));

jest.mock('../Prioridades', () => ({
  __esModule: true,
  default: () => <div data-testid="prioridades">Prioridades</div>,
}));

jest.mock('../Relatorios', () => ({
  __esModule: true,
  default: ({ initialExpandedSections }) => (
    <div
      data-testid="relatorios"
      data-expanded={initialExpandedSections ? JSON.stringify(initialExpandedSections) : undefined}
    >
      Relatórios
    </div>
  ),
}));

jest.mock('../BarraTopoTitulo', () => ({
  __esModule: true,
  default: ({ origem }) => (
    <div data-testid="barra-topo" data-origem={origem || ''}>
      BarraTopoTitulo
    </div>
  ),
}));

jest.mock('../../../../../../services/escolas/AtasPaa.service', () => ({
  iniciarAtaPaa: jest.fn(),
}));

const defaultLocation = { state: null, search: '' };

describe('ElaborarNovoPlano', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    mockUseLocation.mockReturnValue(defaultLocation);
    iniciarAtaPaa.mockResolvedValue();
  });

  describe('Renderização básica', () => {
    it('renderiza PaginasContainer, breadcrumb, título e barra de topo', () => {
      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
      expect(screen.getByText('Plano Anual de Atividades')).toBeInTheDocument();
      expect(screen.getByTestId('barra-topo')).toBeInTheDocument();
    });

    it('renderiza o TabSelector com as quatro abas', () => {
      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('tab-selector')).toBeInTheDocument();
      expect(screen.getByTestId('tab-prioridades')).toHaveTextContent('Levantamento de Prioridades');
      expect(screen.getByTestId('tab-receitas')).toHaveTextContent('Receitas previstas');
      expect(screen.getByTestId('tab-prioridades-list')).toHaveTextContent('Prioridades');
      expect(screen.getByTestId('tab-relatorios')).toHaveTextContent('Relatórios');
    });

    it('exibe LevantamentoDePrioridades como aba inicial por padrão', () => {
      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('levantamento-prioridades')).toBeInTheDocument();
      expect(screen.queryByTestId('receitas-previstas')).not.toBeInTheDocument();
      expect(screen.queryByTestId('prioridades')).not.toBeInTheDocument();
      expect(screen.queryByTestId('relatorios')).not.toBeInTheDocument();
    });

    it('aplica as classes corretas no título', () => {
      render(<ElaborarNovoPlano />);

      const titulo = screen.getByText('Plano Anual de Atividades');
      expect(titulo).toHaveClass('titulo-itens-painel');
      expect(titulo).toHaveClass('mt-5');
    });
  });

  describe('Navegação entre abas', () => {
    it('alterna para a aba "Receitas previstas" ao clicar', () => {
      render(<ElaborarNovoPlano />);

      fireEvent.click(screen.getByTestId('tab-receitas'));

      expect(screen.getByTestId('receitas-previstas')).toBeInTheDocument();
      expect(screen.queryByTestId('levantamento-prioridades')).not.toBeInTheDocument();
    });

    it('alterna para a aba "Prioridades" ao clicar', () => {
      render(<ElaborarNovoPlano />);

      fireEvent.click(screen.getByTestId('tab-prioridades-list'));

      expect(screen.getByTestId('prioridades')).toBeInTheDocument();
      expect(screen.queryByTestId('levantamento-prioridades')).not.toBeInTheDocument();
    });

    it('alterna para a aba "Relatórios" ao clicar', () => {
      render(<ElaborarNovoPlano />);

      fireEvent.click(screen.getByTestId('tab-relatorios'));

      expect(screen.getByTestId('relatorios')).toBeInTheDocument();
      expect(screen.queryByTestId('levantamento-prioridades')).not.toBeInTheDocument();
    });

    it('retorna para a aba "Levantamento de Prioridades" ao clicar após troca', () => {
      render(<ElaborarNovoPlano />);

      fireEvent.click(screen.getByTestId('tab-receitas'));
      fireEvent.click(screen.getByTestId('tab-prioridades'));

      expect(screen.getByTestId('levantamento-prioridades')).toBeInTheDocument();
      expect(screen.queryByTestId('receitas-previstas')).not.toBeInTheDocument();
    });
  });

  describe('Aba inicial via location.state', () => {
    it('inicia na aba "receitas" quando location.state.activeTab é "receitas"', () => {
      mockUseLocation.mockReturnValue({ state: { activeTab: 'receitas' }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('receitas-previstas')).toBeInTheDocument();
      expect(screen.queryByTestId('levantamento-prioridades')).not.toBeInTheDocument();
    });

    it('inicia na aba "prioridades-list" quando location.state.activeTab é "prioridades-list"', () => {
      mockUseLocation.mockReturnValue({ state: { activeTab: 'prioridades-list' }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('prioridades')).toBeInTheDocument();
      expect(screen.queryByTestId('levantamento-prioridades')).not.toBeInTheDocument();
    });

    it('inicia na aba "relatorios" quando location.state.activeTab é "relatorios"', () => {
      mockUseLocation.mockReturnValue({ state: { activeTab: 'relatorios' }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('relatorios')).toBeInTheDocument();
      expect(screen.queryByTestId('levantamento-prioridades')).not.toBeInTheDocument();
    });

    it('inicia na aba padrão quando location.state.activeTab é inválido', () => {
      mockUseLocation.mockReturnValue({ state: { activeTab: 'aba-inexistente' }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('levantamento-prioridades')).toBeInTheDocument();
    });

    it('inicia na aba padrão quando location.state é null', () => {
      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('levantamento-prioridades')).toBeInTheDocument();
    });
  });

  describe('origemBarra passada ao BarraTopoTitulo', () => {
    it('passa origem vazia quando não há estado especial', () => {
      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('barra-topo')).toHaveAttribute('data-origem', '');
    });

    it('passa origem "plano-aplicacao" quando fromPlanoAplicacao é true', () => {
      mockUseLocation.mockReturnValue({ state: { fromPlanoAplicacao: true }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('barra-topo')).toHaveAttribute('data-origem', 'plano-aplicacao');
    });

    it('passa origem "plano-orcamentario" quando fromPlanoOrcamentario é true', () => {
      mockUseLocation.mockReturnValue({ state: { fromPlanoOrcamentario: true }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('barra-topo')).toHaveAttribute('data-origem', 'plano-orcamentario');
    });

    it('passa origem "atividades-previstas" quando fromAtividadesPrevistas é "1" na query', () => {
      mockUseLocation.mockReturnValue({ state: null, search: '?fromAtividadesPrevistas=1' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('barra-topo')).toHaveAttribute('data-origem', 'atividades-previstas');
    });

    it('passa origem "atividades-previstas" quando fromAtividadesPrevistas é "true" na query', () => {
      mockUseLocation.mockReturnValue({ state: null, search: '?fromAtividadesPrevistas=true' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('barra-topo')).toHaveAttribute('data-origem', 'atividades-previstas');
    });

    it('"atividades-previstas" tem prioridade sobre "plano-aplicacao"', () => {
      mockUseLocation.mockReturnValue({
        state: { fromPlanoAplicacao: true },
        search: '?fromAtividadesPrevistas=1',
      });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('barra-topo')).toHaveAttribute('data-origem', 'atividades-previstas');
    });
  });

  describe('receitasDestino passado ao ReceitasPrevistas', () => {
    it('passa receitasDestino quando presente no location.state', () => {
      mockUseLocation.mockReturnValue({
        state: { activeTab: 'receitas', receitasDestino: 'algum-destino' },
        search: '',
      });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('receitas-previstas')).toHaveAttribute(
        'data-receitas-destino',
        'algum-destino'
      );
    });

    it('não possui receitasDestino quando ausente no location.state', () => {
      mockUseLocation.mockReturnValue({ state: { activeTab: 'receitas' }, search: '' });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('receitas-previstas')).not.toHaveAttribute('data-receitas-destino');
    });
  });

  describe('initialExpandedSections passado ao Relatorios', () => {
    it('passa expandedSections quando presente no location.state', () => {
      const expandedSections = ['secao-1', 'secao-2'];
      mockUseLocation.mockReturnValue({
        state: { activeTab: 'relatorios', expandedSections },
        search: '',
      });

      render(<ElaborarNovoPlano />);

      expect(screen.getByTestId('relatorios')).toHaveAttribute(
        'data-expanded',
        JSON.stringify(expandedSections)
      );
    });
  });

  describe('iniciarAtaPaa', () => {
    it('chama iniciarAtaPaa com o UUID do localStorage ao montar quando PAA está presente', async () => {
      localStorage.setItem('PAA', 'uuid-paa-teste');

      render(<ElaborarNovoPlano />);

      await waitFor(() => {
        expect(iniciarAtaPaa).toHaveBeenCalledWith('uuid-paa-teste');
      });
    });

    it('não chama iniciarAtaPaa quando PAA não está no localStorage', async () => {
      render(<ElaborarNovoPlano />);

      await waitFor(() => {
        expect(iniciarAtaPaa).not.toHaveBeenCalled();
      });
    });

    it('captura e loga o erro quando iniciarAtaPaa falha', async () => {
      localStorage.setItem('PAA', 'uuid-paa-erro');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      iniciarAtaPaa.mockRejectedValueOnce(new Error('Erro de ata'));

      render(<ElaborarNovoPlano />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          'Erro ao iniciar ata do PAA:',
          expect.any(Error)
        );
      });

      consoleSpy.mockRestore();
    });
  });
});
