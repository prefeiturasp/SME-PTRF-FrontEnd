import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { TiposDeCredito } from '..';
import { getTiposDeCredito, getFiltrosTipoReceita } from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockFiltros, mockTiposReceitas } from '../__fixtures__/mockData';
import { AbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/context/Recursos';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <>{children}</>,
}));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTiposDeCredito: jest.fn(),
    getFiltrosTipoReceita: jest.fn()
}));
jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));
jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

let queryClient;

describe("Carrega página Tipos de Crédito", () => {
    beforeEach(() => {
        const { useRecursoSelecionadoContext } = require('../../../../../../context/RecursoSelecionado')

        queryClient = new QueryClient({
            defaultOptions: {
            queries: { retry: false },
            },
        });

        useRecursoSelecionadoContext.mockReturnValue({
            recursos: [{ uuid: 'r1', nome: 'Recurso 1' }],
        });
    })

    const renderComponent = () => {
        const defaultContextValue = {
            selectedRecurso: {
                uuid: "recurso-uuid",
                nome: "PTRF Básico",
                nome_exibicao: "PTRF Básico",
            },
            setSelectedRecurso: jest.fn(),
            clickBtnEscolheOpcao: {},
            setClickBtnEscolheOpcao: jest.fn(),
        };

        return render(
            <MemoryRouter>
                <AbasPorRecursoContext.Provider value={defaultContextValue}>
                    <QueryClientProvider client={queryClient}>
                        <TiposDeCredito />
                    </QueryClientProvider>
                </AbasPorRecursoContext.Provider>
            </MemoryRouter>
        );
    }

    it('Renderiza a página', async() => {
        getTiposDeCredito.mockResolvedValueOnce(mockTiposReceitas);
        getFiltrosTipoReceita.mockResolvedValueOnce(mockFiltros);
        
        renderComponent()

        await waitFor(() => {
            expect(screen.getByText("Tipos de crédito")).toBeInTheDocument();
        });
    });

    it("Testa filtros", async () => {
        getFiltrosTipoReceita.mockResolvedValueOnce(mockFiltros);
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTiposDeCredito.mockReturnValueOnce(mockTiposReceitas).mockReturnValueOnce(mockTiposReceitas).mockReturnValueOnce(mockTiposReceitas)
        
        renderComponent()

        await waitFor(() => {
            expect(screen.getByTestId("btn-adicionar-tipo-de-credito"));
        });
        const filtroNome = screen.getByLabelText("Filtrar por nome de crédito");
        const filtroTipo = screen.getByLabelText("Filtrar por tipo");
        const filtroClassificacao = screen.getByLabelText("Filtrar por classificação");
        const filtroTipoConta = screen.getByLabelText("Filtrar por classificação");
        const botaoFiltrar = screen.getByTestId("btn-filtrar-tipos-de-credito");
        const botaoLimpar = screen.getByTestId("btn-limpar-filtros-tipos-de-credito");

        expect(filtroNome).toBeInTheDocument();
        expect(filtroTipo).toBeInTheDocument();
        expect(filtroClassificacao).toBeInTheDocument();
        expect(filtroTipoConta).toBeInTheDocument();

        fireEvent.change(filtroNome, { target: { value: 'Tipo de crédito 1' } });
        fireEvent.click(botaoFiltrar);

        expect(getFiltrosTipoReceita).toHaveBeenCalledTimes(1);
        expect(getTiposDeCredito).toHaveBeenCalledTimes(2);

        fireEvent.click(botaoLimpar);
        expect(getTiposDeCredito).toHaveBeenCalledTimes(2);
    });

    it("Testa requests com erro", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        const error = new Error('Erro na requisição')
        getTiposDeCredito.mockRejectedValueOnce(error);
        getFiltrosTipoReceita.mockRejectedValueOnce(error);

        renderComponent()

        await waitFor(() => {
            expect(getTiposDeCredito).toHaveBeenCalled();
            expect(getFiltrosTipoReceita).toHaveBeenCalled();

        });

    });

    it("Testa variações de filtros", async() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTiposDeCredito.mockReturnValue(mockTiposReceitas)
        getFiltrosTipoReceita.mockReturnValue(mockFiltros);

        renderComponent()

        await waitFor(() => {
            expect(screen.getByTestId("btn-adicionar-tipo-de-credito"))
        });
        const filtroTipo = screen.getByLabelText("Filtrar por tipo");
        const filtroClassificacao = screen.getByLabelText("Filtrar por classificação");
        const botaoFiltrar = screen.getByTestId("btn-filtrar-tipos-de-credito");
        const botaoLimpar = screen.getByTestId("btn-limpar-filtros-tipos-de-credito");

        fireEvent.change(filtroTipo, { target: { value: 'e_repasse' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroTipo, { target: { value: 'e_repasse' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroTipo, { target: { value: 'e_rendimento' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroTipo, { target: { value: 'e_devolucao' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroTipo, { target: { value: 'e_estorno' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroClassificacao, { target: { value: 'aceita_capital' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroClassificacao, { target: { value: 'aceita_custeio' } });
        fireEvent.click(botaoFiltrar);

        fireEvent.change(filtroClassificacao, { target: { value: 'aceita_livre' } });
        fireEvent.click(botaoFiltrar);

        expect(getTiposDeCredito).toHaveBeenCalled();

        fireEvent.click(botaoLimpar);
        expect(getTiposDeCredito).toHaveBeenCalled();
    });

});
