import { render, screen, fireEvent } from '@testing-library/react';
import { ElaborarNovoPlano } from '../ElaborarNovoPlano';
import { PaginasContainer } from '../../../../../paginas/PaginasContainer';

jest.mock('../../../../../paginas/PaginasContainer', () => ({
  PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock('../../../../Globais/Breadcrumb', () => () => <nav data-testid="breadcrumb">Breadcrumb</nav>);
jest.mock('../../../../Globais/TabSelector', () => ({ tabs, activeTab, setActiveTab }) => (
  <div data-testid="tab-selector">
    {tabs.map((tab) => (
      <button key={tab.id} onClick={() => setActiveTab(tab.id)} data-testid={`tab-${tab.id}`}>
        {tab.label}
      </button>
    ))}
  </div>
));

jest.mock('../ElaborarNovoPlano/LevantamentoDePrioridades', () => () => <div data-testid="levantamento-de-prioridades">Levantamento de Prioridades</div>);
jest.mock('../ElaborarNovoPlano/ReceitasPrevistas', () => () => <div data-testid="receitas-previstas">Receitas Previstas</div>);
jest.mock('../ElaborarNovoPlano/Prioridades', () => () => <div data-testid="prioridades">Prioridades</div>);
jest.mock('../ElaborarNovoPlano/Relatorios', () => () => <div data-testid="relatorios">Relatórios</div>);
jest.mock('../ElaborarNovoPlano/BarraTopoTitulo', () => () => <div data-testid="barra-topo-titulo">Barra Topo</div>);

describe('ElaborarNovoPlano Component', () => {
  test('renderiza corretamente com breadcrumb e aba inicial', () => {
    render(<ElaborarNovoPlano />);

    expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByText('Plano Anual de Atividades')).toBeInTheDocument();
    expect(screen.getByTestId('barra-topo-titulo')).toBeInTheDocument();
    expect(screen.getByTestId('tab-selector')).toBeInTheDocument();
    expect(screen.getByTestId('levantamento-de-prioridades')).toBeInTheDocument();
  });

  test('alterna as abas corretamente', () => {
    render(<ElaborarNovoPlano />);

    fireEvent.click(screen.getByTestId('tab-receitas'));
    expect(screen.getByTestId('receitas-previstas')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('tab-prioridades-list'));
    expect(screen.getByTestId('prioridades')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('tab-relatorios'));
    expect(screen.getByTestId('relatorios')).toBeInTheDocument();
  });
});
