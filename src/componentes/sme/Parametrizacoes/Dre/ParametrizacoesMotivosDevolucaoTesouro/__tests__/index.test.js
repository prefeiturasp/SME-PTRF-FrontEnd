import { render, screen } from '@testing-library/react';
import { ParametrizacoesMotivosDevolucaoTesouro } from '../index';
import { MotivosDevolucaoTesouroProvider } from '../context/MotivosDevolucaoTesouro';
import '@testing-library/jest-dom';

// Mock dos componentes filhos para verificar se estão sendo renderizados
jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div>{children}</div>,
}));

jest.mock("../components/TopoComBotoes", () => ({
    TopoComBotoes: () => <div>TopoComBotoes</div>,
}));

jest.mock("../components/Filtros", () => ({
    Filtros: () => <div>Filtros</div>,
}));

jest.mock("../components/ExibicaoQuantidade", () => ({
    ExibicaoQuantidade: () => <div>ExibicaoQuantidade</div>,
}));

jest.mock("../components/Lista", () => ({
    Lista: () => <div>Lista</div>,
}));

jest.mock("../components/Paginacao", () => ({
    Paginacao: () => <div>Paginacao</div>,
}));

describe('ParametrizacoesMotivosDevolucaoTesouro', () => {
    test('Deve renderizar o título corretamente', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <ParametrizacoesMotivosDevolucaoTesouro />
            </MotivosDevolucaoTesouroProvider>
        );

        expect(screen.getByText('Motivos de devolução ao tesouro')).toBeInTheDocument();
    });

    test('Deve renderizar os componentes filhos corretamente', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <ParametrizacoesMotivosDevolucaoTesouro />
            </MotivosDevolucaoTesouroProvider>
        );

        // Verifica se cada componente está sendo renderizado
        expect(screen.getByText('TopoComBotoes')).toBeInTheDocument();
        expect(screen.getByText('Filtros')).toBeInTheDocument();
        expect(screen.getByText('ExibicaoQuantidade')).toBeInTheDocument();
        expect(screen.getByText('Lista')).toBeInTheDocument();
        expect(screen.getByText('Paginacao')).toBeInTheDocument();
    });

    test('Deve renderizar a estrutura correta da página', () => {
        render(
            <MotivosDevolucaoTesouroProvider>
                <ParametrizacoesMotivosDevolucaoTesouro />
            </MotivosDevolucaoTesouroProvider>
        );

        const pageContent = screen.getByText('Motivos de devolução ao tesouro');
        const pageInnerContent = screen.getByText('TopoComBotoes');
        
        expect(pageContent).toBeInTheDocument();
        expect(pageInnerContent).toBeInTheDocument();
    });
});
