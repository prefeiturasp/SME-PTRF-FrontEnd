import { render, screen } from '@testing-library/react';
import { EspecificacoesMateriaisServicos } from '../index';
import { MateriaisServicosProvider } from '../context/MateriaisServicos';
import { MemoryRouter, Route } from "react-router-dom";
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

jest.mock("../components/Lista", () => ({
    Lista: () => <div>Lista</div>,
}));

jest.mock("../components/Paginacao", () => ({
    Paginacao: () => <div>Paginacao</div>,
}));

describe('EspecificacoesMateriaisServicos', () => {
    const renderComponent = (()=>{
        return render(
            <MemoryRouter initialEntries={["/parametro-especificacoes"]}>
                <Route path="/parametro-especificacoes">
                    <MateriaisServicosProvider>
                        <EspecificacoesMateriaisServicos />
                    </MateriaisServicosProvider>
                </Route>
            </MemoryRouter>
        );
    })
    test('Deve renderizar o título corretamente', () => {
        renderComponent();
        expect(screen.getByText('Especificações de Materiais e Serviços')).toBeInTheDocument();
    });

    test('Deve renderizar os componentes filhos corretamente', () => {
        renderComponent();

        expect(screen.getByText('TopoComBotoes')).toBeInTheDocument();
        expect(screen.getByText('Filtros')).toBeInTheDocument();
        expect(screen.getByText('Lista')).toBeInTheDocument();
        expect(screen.getByText('Paginacao')).toBeInTheDocument();
    });

    test('Deve renderizar a estrutura correta da página', () => {
        renderComponent();

        const pageContent = screen.getByText('Especificações de Materiais e Serviços');
        const pageInnerContent = screen.getByText('TopoComBotoes');

        expect(pageContent).toBeInTheDocument();
        expect(pageInnerContent).toBeInTheDocument();
    });
});
