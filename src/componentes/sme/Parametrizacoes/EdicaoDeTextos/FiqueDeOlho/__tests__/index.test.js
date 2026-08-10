import React from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FiqueDeOlho } from '..';
import {
    patchAlterarFiqueDeOlhoPrestacoesDeContas,
    patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre,
    getFiqueDeOlho,
    getTabelaFiqueDeOlho,
    postFiqueDeOlho,
    patchFiqueDeOlho
} from "../../../../../../services/sme/Parametrizacoes.service";
import { getFiqueDeOlhoPrestacoesDeContas } from "../../../../../../services/escolas/PrestacaoDeContas.service";
import { getFiqueDeOlhoRelatoriosConsolidados } from "../../../../../../services/dres/RelatorioConsolidado.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockAssociacoesPC, mockDiretoriasPC, mockTextosFiqueDeOlho } from '../__fixtures__/mockData';
import { AbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/context/Recursos";
import { useGetFiqueDeOlho } from '../hooks/useGetFiqueDeOlho';
import { usePostFiqueDeOlho } from '../hooks/usePostFiqueDeOlho';
import { usePatchFiqueDeOlho } from '../hooks/usePatchFiqueDeOlho';
import { FiqueDeOlhoContext } from '../context/FiqueDeOlho';

jest.mock("../hooks/useGetFiqueDeOlho");
jest.mock("../hooks/usePostFiqueDeOlho");

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    patchAlterarFiqueDeOlhoPrestacoesDeContas: jest.fn(),
    patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre: jest.fn(),
    getFiqueDeOlho: jest.fn(),
    getTabelaFiqueDeOlho: jest.fn(),
    postFiqueDeOlho: jest.fn(),
    patchFiqueDeOlho: jest.fn(),
}));
jest.mock("../../../../../../services/escolas/PrestacaoDeContas.service", ()=>({
    getFiqueDeOlhoPrestacoesDeContas: jest.fn()
}));
jest.mock("../../../../../../services/dres/RelatorioConsolidado.service", ()=>({
    getFiqueDeOlhoRelatoriosConsolidados: jest.fn()
}));
jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock('../../../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: () => ({ recursoSelecionado: null }),
}));

jest.mock('../../../../../Globais/EditorWysiwyg', () => ({
    __esModule: true,
    default: ({ handleSubmitEditor }) => (
        <button onClick={() => handleSubmitEditor('')}>Salvar</button>
    ),
}));

jest.mock("../../../componentes/AbasPorRecurso", () => ({
    AbasPorRecurso: () => <div data-testid="abas-por-recurso"></div>,
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

const mockMutationPostMutate = jest.fn();
const mockMutationPatchMutate = jest.fn();

const contexto = {
  setShowModalForm: jest.fn(),
  setStateFormModal: jest.fn(),
  setBloquearBtnSalvarForm: jest.fn(),
  handleEditFormModal: jest.fn(),
  handleExcluirMotivo: jest.fn(),
  showModalConfirmacaoExclusao: { is_open: false, motivo_uuid: '' },
  filter: { page: 1, page_size: 10  },
  mutationPatch: { mutate: mockMutationPatchMutate }
}

describe("Carrega página fique de olho", () => {
    const defaultContextValue = {
        selectedRecurso: {
            nome: "Programa de Transferência de Recursos Financeiros (PTRF) - Básico",
            nome_exibicao: "PTRF Básico",
        },
        setSelectedRecurso: jest.fn(),
        clickBtnEscolheOpcao: {},
        setClickBtnEscolheOpcao: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        getFiqueDeOlhoPrestacoesDeContas.mockResolvedValueOnce(mockAssociacoesPC).mockResolvedValueOnce(mockDiretoriasPC);
        getFiqueDeOlhoRelatoriosConsolidados.mockResolvedValueOnce(mockDiretoriasPC).mockResolvedValueOnce(mockAssociacoesPC);

        useGetFiqueDeOlho.mockReturnValue({
          isLoading: false,
          data: { results: mockTextosFiqueDeOlho },
        });

        usePostFiqueDeOlho.mockReturnValue({
          mutationPost: { mutate: mockMutationPostMutate },
        });

        getTabelaFiqueDeOlho.mockResolvedValue({
            tipos_de_texto: [],
        });

        // usePatchFiqueDeOlho.mockReturnValue({
        //   mutationPatch: { mutate: mockMutationPatchMutate },
        // });
    });

    const component = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
            },
        });

        return render(
            <QueryClientProvider client={queryClient}>
                <FiqueDeOlhoContext.Provider value={contexto}>
                    <AbasPorRecursoContext.Provider value={defaultContextValue}>
                        <MemoryRouter>
                            <FiqueDeOlho />
                        </MemoryRouter>
                    </AbasPorRecursoContext.Provider>
                </FiqueDeOlhoContext.Provider>
            </QueryClientProvider>
        )
    }

    it('Renderiza a página', async() => {
        component();
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/ASSOCIAÇÕES - Prestação de Contas/i)).toBeInTheDocument();
            expect(screen.getByText(/DIRETORIAS - Consolidado das PCs/i)).toBeInTheDocument();
        });
    });

    it("Deve confirmar a alteração do fique de olho", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        component();

        expect(screen.getAllByText(/Carregando.../i)[0]).toBeInTheDocument();

        await waitFor(() => {
            const tabela = screen.getByTestId("tabela-lista-fique-de-olho");
            const rows = tabela.querySelectorAll("tbody tr");
            expect(rows).toHaveLength(2);
            const row = rows[1]
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(2);
            const actionsCell = cells[1]
            const botaoEditar = actionsCell.querySelector("button");
            expect(botaoEditar).toBeInTheDocument();
            fireEvent.click(botaoEditar);
        });
        const botaoSalvar = screen.getByTestId('btn-salvar-formulario-fique-de-olho');
        fireEvent.click(botaoSalvar);

        await waitFor(() => {
            expect(patchFiqueDeOlho).toHaveBeenCalledTimes(1);
        });
    });

    it("Deve acontecer um erro ao alterar o fique de olho", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchFiqueDeOlho.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro 007" } },
        });

        component();

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            const tabela = screen.getByTestId("tabela-lista-fique-de-olho");
            const rows = tabela.querySelectorAll("tbody tr");
            expect(rows).toHaveLength(2);
            const row = rows[1]
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(2);
            const actionsCell = cells[1]
            const botaoEditar = actionsCell.querySelector("button");
            expect(botaoEditar).toBeInTheDocument();
            fireEvent.click(botaoEditar);
        });
        const botaoSalvar = screen.getByTestId('btn-salvar-formulario-fique-de-olho');
        fireEvent.click(botaoSalvar);

        await waitFor(() => {
            expect(patchFiqueDeOlho).toHaveBeenCalledTimes(1);

            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao atualizar o fique de olho",
                "Erro 007"
            );
        });
    });

});
