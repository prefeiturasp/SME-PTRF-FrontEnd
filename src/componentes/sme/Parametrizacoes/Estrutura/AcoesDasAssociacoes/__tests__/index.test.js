import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AcoesDasAssociacoes } from '..';
import { MemoryRouter } from "react-router-dom";

import {
    getListaDeAcoes,
    getParametrizacoesAcoesAssociacoes,
    getAssociacoes,
} from "../../../../../../services/sme/Parametrizacoes.service";
import { getTabelaAssociacoes } from "../../../../../../services/dres/Associacoes.service";
import { mockAcoes, mockSelectAcoes, mockSelectAssociacoes, tabelas } from '../__fixtures__/mockData';
import { AbasPorRecursoContext } from '../../../componentes/AbasPorRecurso/context/Recursos';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <>{children}</>,
}));

jest.mock("../TabelaAcoesDasAssociacoes", () => ({
    TabelaAcoesDasAssociacoes: () => <div>TabelaAcoesDasAssociacoes</div>,
  }));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getListaDeAcoes: jest.fn(),
    getAssociacoes: jest.fn(),
    getTabelaAssociacoes: jest.fn(),
    postCreateTipoDeDocumento: jest.fn(),
    patchAlterarTipoDeDocumento: jest.fn(),
    deleteTipoDeDocumento: jest.fn(),
    getParametrizacoesAcoesAssociacoes: jest.fn(),
}));

jest.mock("../../../../../../services/dres/Associacoes.service", () => ({
    getTabelaAssociacoes: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

jest.mock('../../../../../../context/RecursoSelecionado', () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

let queryClient;

describe("Carrega página de Acoes das Associações", () => {
    const defaultContextValue = {
        selectedRecurso: {
            uuid: 'r1',
            nome: "Programa de Transferência de Recursos Financeiros (PTRF) - Básico",
            nome_exibicao: "PTRF Básico",
        },
        setSelectedRecurso: jest.fn(),
        clickBtnEscolheOpcao: {},
        setClickBtnEscolheOpcao: jest.fn(),
    };

    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <AbasPorRecursoContext.Provider value={defaultContextValue}>
                        <AcoesDasAssociacoes />
                    </AbasPorRecursoContext.Provider>
                </QueryClientProvider>
            </MemoryRouter>
        );
    }
    beforeEach(() => {
        const { useRecursoSelecionadoContext } = require('../../../../../../context/RecursoSelecionado')

        jest.clearAllMocks();

        queryClient = new QueryClient({
            defaultOptions: {
            queries: { retry: false },
            },
        });

        useRecursoSelecionadoContext.mockReturnValue({
            recursos: [{ uuid: 'r1', nome: 'Recurso 1' }],
        });

        getAssociacoes.mockResolvedValue(mockSelectAssociacoes);
        getParametrizacoesAcoesAssociacoes.mockResolvedValue(mockAcoes);
        getTabelaAssociacoes.mockResolvedValue(tabelas);
        getListaDeAcoes.mockResolvedValue(mockSelectAcoes);
        getTabelaAssociacoes.mockResolvedValue(tabelas);
    });

    it("Testa a chamada de get de Filtros", async () => {
        renderComponent()

        await waitFor(() => {

            const filtro_nome = screen.getByLabelText(/Filtrar por nome ou código EOL/i)
            expect(filtro_nome).toBeInTheDocument();

            const filtro_acoes = screen.getByLabelText(/Filtrar por ação/i)
            expect(filtro_acoes).toBeInTheDocument();

            const filtro_status = screen.getByLabelText(/Filtrar por status/i)
            expect(filtro_status).toBeInTheDocument();

            fireEvent.change(filtro_nome, { target: { value: 'Filtro' } });
            expect(filtro_nome.value).toBe('Filtro');

            fireEvent.change(filtro_acoes, { target: { value: mockSelectAcoes[0].uuid } });

            fireEvent.change(filtro_status, { target: { value: 'ATIVA' } });

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getParametrizacoesAcoesAssociacoes).toHaveBeenLastCalledWith(
                1,
                'Filtro',
                mockSelectAcoes[0].uuid,
                'ATIVA',
                [],
                'r1',
            );
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
        renderComponent()
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        
        await waitFor(() => {
            const botao_limpar = screen.getByTestId('btn-limpar-filtros-acao-associacao');
            expect(botao_limpar).toBeInTheDocument();
            fireEvent.click(botao_limpar);
        });
    });

});
