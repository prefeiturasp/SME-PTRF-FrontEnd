import { render, screen } from '@testing-library/react';
import { ParametrizacoesMotivosAprovacaoPcRessalva } from '../index';
import { MotivosAprovacaoPcRessalvaProvider } from '../context/MotivosAprovacaoPcRessalva';
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

jest.mock("../components/ExibicaoQuantidade", () => ({
    ExibicaoQuantidade: () => <div data-testid="exibicao-quantidade">ExibicaoQuantidade</div>,
}));

describe('ParametrizacoesMotivosAprovacaoPcRessalva', () => {
    const renderComponent = () => {
        return render(
            <MotivosAprovacaoPcRessalvaProvider>
                <ParametrizacoesMotivosAprovacaoPcRessalva />
            </MotivosAprovacaoPcRessalvaProvider>
        );
    };

    test('Deve renderizar o título corretamente', () => {
        renderComponent();
        expect(screen.getByText('Motivos de aprovação de PC com ressalvas')).toBeInTheDocument();
    });

    test('Deve renderizar os componentes filhos corretamente', () => {
        renderComponent();

        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
        expect(screen.getByTestId('topo-com-botoes')).toBeInTheDocument();
        expect(screen.getByTestId('filtros')).toBeInTheDocument();
        expect(screen.getByTestId('lista')).toBeInTheDocument();
        expect(screen.getByTestId('paginacao')).toBeInTheDocument();
        expect(screen.getByTestId('exibicao-quantidade')).toBeInTheDocument();
        
    });

    test('Deve renderizar a estrutura correta da página', () => {
        renderComponent();

        const pageContent = screen.getByText('Motivos de aprovação de PC com ressalvas');
        const pageInnerContent = screen.getByTestId('topo-com-botoes');
        const pageContainer = screen.getByTestId('paginas-container')

        expect(pageContent).toBeInTheDocument();
        expect(pageInnerContent).toBeInTheDocument();
        expect(pageContainer).toBeInTheDocument();
    });
});
