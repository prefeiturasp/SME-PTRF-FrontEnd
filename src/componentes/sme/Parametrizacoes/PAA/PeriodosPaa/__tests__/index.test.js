import { render, screen } from '@testing-library/react';
import { PeriodosPaa } from '../index';
import { PeriodosPaaProvider } from '../context/index';
import '@testing-library/jest-dom';

// Mock dos componentes filhos para verificar se estão sendo renderizados
jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../TopoComBotoes", () => ({
    TopoComBotoes: () => <div data-testid="topo-com-botoes">TopoComBotoes</div>,
}));

jest.mock("../Filtros", () => ({
    Filtros: () => <div data-testid="filtros">Filtros</div>,
}));

jest.mock("../Tabela", () => ({
    Tabela: () => <div data-testid="lista">Lista</div>,
}));

jest.mock("../Paginacao", () => ({
    Paginacao: () => <div data-testid="paginacao">Paginacao</div>,
}));


describe('PeriodosPaa', () => {
    const renderComponent = () => {
        return render(
            <PeriodosPaaProvider>
                <PeriodosPaa />
            </PeriodosPaaProvider>
        );
    };

    test('Deve renderizar o título corretamente', () => {
        renderComponent();
        expect(screen.getByText('Períodos PAA')).toBeInTheDocument();
    });

    test('Deve renderizar os componentes filhos corretamente', () => {
        renderComponent();

        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
        expect(screen.getByTestId('topo-com-botoes')).toBeInTheDocument();
        expect(screen.getByTestId('filtros')).toBeInTheDocument();
        expect(screen.getByTestId('lista')).toBeInTheDocument();
        expect(screen.getByTestId('paginacao')).toBeInTheDocument();
        
    });

    test('Deve renderizar a estrutura correta da página', () => {
        renderComponent();

        const pageContent = screen.getByText('Períodos PAA');
        const pageInnerContent = screen.getByTestId('topo-com-botoes');
        const pageContainer = screen.getByTestId('paginas-container')

        expect(pageContent).toBeInTheDocument();
        expect(pageInnerContent).toBeInTheDocument();
        expect(pageContainer).toBeInTheDocument();
    });
});
