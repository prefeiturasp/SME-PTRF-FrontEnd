import { render, screen } from '@testing-library/react';
import { ParametrizacoesRepasses } from '../index';
import { RepassesProvider } from '../context/Repasse';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

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

jest.mock("../../../componentes/AbasPorRecurso", () => ({
    AbasPorRecurso: () => <div>AbasPorRecurso</div>,
}));

describe("Carrega página de Repasses", () => {
    const renderComponent = (()=>{
        const queryClient = new QueryClient();
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={["/parametro-repasse"]}>
                    <Routes>
                        <Route path="/parametro-repasse" element={<RepassesProvider><ParametrizacoesRepasses /></RepassesProvider>} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    })

    it('Deve renderizar o título corretamente', () => {
        renderComponent();
        expect(screen.getAllByText('Repasses')[0]).toBeInTheDocument();
    });

    it('Deve renderizar os componentes filhos corretamente', () => {
        renderComponent();

        expect(screen.getByText('AbasPorRecurso')).toBeInTheDocument();
        expect(screen.getByText('TopoComBotoes')).toBeInTheDocument();
        expect(screen.getByText('Filtros')).toBeInTheDocument();
        expect(screen.getByText('Lista')).toBeInTheDocument();
        expect(screen.getByText('Paginacao')).toBeInTheDocument();
    });

});