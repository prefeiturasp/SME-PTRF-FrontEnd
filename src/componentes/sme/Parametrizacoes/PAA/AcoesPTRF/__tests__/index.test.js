import { render, screen } from '@testing-library/react';
import { AcoesPTRFPaa } from '../index';
import { AcoesPTRFPaaProvider } from '../context/index';
import '@testing-library/jest-dom';

// Mock dos componentes filhos para verificar se estão sendo renderizados
jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

jest.mock("../Tabela", () => ({
    Tabela: () => <div data-testid="lista">Lista</div>,
}));

describe('AcoesPTRFPaa', () => {
    const renderComponent = () => {
        return render(
            <AcoesPTRFPaaProvider>
                <AcoesPTRFPaa />
            </AcoesPTRFPaaProvider>
        );
    };

    test('Deve renderizar o título corretamente', () => {
        renderComponent();
        expect(screen.getByText('Receitas previstas das Ações PTRF')).toBeInTheDocument();
    });

    test('Deve renderizar os componentes filhos corretamente', () => {
        renderComponent();

        expect(screen.getByTestId('paginas-container')).toBeInTheDocument();
        expect(screen.getByTestId('lista')).toBeInTheDocument();
    });

    test('Deve renderizar a estrutura correta da página', () => {
        renderComponent();

        const pageContainer = screen.getByTestId('paginas-container')

        expect(pageContainer).toBeInTheDocument();
    });
});
