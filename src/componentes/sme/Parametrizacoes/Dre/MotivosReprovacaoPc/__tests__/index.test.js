import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ParametrizacoesMotivosReprovacaoPc } from '../index';
import { MotivosReprovacaoPcProvider } from '../context/MotivosReprovacaoPc';
import '@testing-library/jest-dom';

// Mock dos componentes filhos para verificar se estão sendo renderizados
jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../components/TopoComBotoes", () => ({
    TopoComBotoes: () => <div data-testid="topo-com-botoes">TopoComBotoes</div>,
}));

jest.mock("../components/Filtros", () => ({
    Filtros: () => <div data-testid="filtros">Filtros</div>,
}));

jest.mock("../components/Lista", () => ({
    Lista: () => <div data-testid="lista">Lista</div>,
}));

jest.mock("../components/Paginacao", () => ({
    Paginacao: () => <div data-testid="paginacao">Paginacao</div>,
}));

jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

describe('ParametrizacoesMotivosReprovacaoPc', () => {
    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <MotivosReprovacaoPcProvider>
                    <ParametrizacoesMotivosReprovacaoPc />
                </MotivosReprovacaoPcProvider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        const { useRecursoSelecionadoContext } = require('../../../../../../context/RecursoSelecionado');

        jest.clearAllMocks();

        useRecursoSelecionadoContext.mockReturnValue({
            recursos: [
                { uuid: 'r1', nome: 'Recurso 1', nome_exibicao: 'Recurso 1' },
                { uuid: 'r2', nome: 'Recurso 2', nome_exibicao: 'Recurso 2' },
            ],
        });
    });

    test('Deve renderizar o título corretamente', () => {
        renderComponent();
        expect(screen.getByText('Motivos de reprovação de PC')).toBeInTheDocument();
    });

    test('Deve renderizar os componentes filhos corretamente', () => {
        renderComponent();

        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
        expect(screen.getByTestId('topo-com-botoes')).toBeInTheDocument();
        expect(screen.getByTestId('filtros')).toBeInTheDocument();
        expect(screen.getByTestId('lista')).toBeInTheDocument();
        
    });

    test('Deve renderizar a estrutura correta da página', () => {
        renderComponent();

        const pageContent = screen.getByText('Motivos de reprovação de PC');
        const pageInnerContent = screen.getByTestId('topo-com-botoes');
        const pageContainer = screen.getByTestId('paginas-container')

        expect(pageContent).toBeInTheDocument();
        expect(pageInnerContent).toBeInTheDocument();
        expect(pageContainer).toBeInTheDocument();
    });
});
