import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FiqueDeOlho } from '..';
import { 
    patchAlterarFiqueDeOlhoPrestacoesDeContas,
    patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre } from "../../../../../../services/sme/Parametrizacoes.service";
import { getFiqueDeOlhoPrestacoesDeContas } from "../../../../../../services/escolas/PrestacaoDeContas.service";
import { getFiqueDeOlhoRelatoriosConsolidados } from "../../../../../../services/dres/RelatorioConsolidado.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockAssociacoesPC, mockDiretoriasPC } from '../__fixtures__/mockData';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    patchAlterarFiqueDeOlhoPrestacoesDeContas: jest.fn(),
    patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre: jest.fn()
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

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("Carrega página fique de olho", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getFiqueDeOlhoPrestacoesDeContas.mockResolvedValueOnce(mockAssociacoesPC).mockResolvedValueOnce(mockDiretoriasPC);
        getFiqueDeOlhoRelatoriosConsolidados.mockResolvedValueOnce(mockDiretoriasPC).mockResolvedValueOnce(mockAssociacoesPC);
    });

    it('Renderiza a página', async() => {
        render(
            <MemoryRouter>
                <FiqueDeOlho />
            </MemoryRouter>
        );
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText(/ASSOCIAÇÕES - Prestação de Contas/i)).toBeInTheDocument();
            expect(screen.getByText(/Acompanhamento Prestação de Contas/i)).toBeInTheDocument();
        });
    });

    it("Testa edição associacoes", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(
            <MemoryRouter>
                <FiqueDeOlho />
            </MemoryRouter>
        );

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            const tabela = screen.getByRole("grid");
            const rows = tabela.querySelectorAll("tbody tr");
            expect(rows).toHaveLength(2);
            const row = rows[0]
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(2);
            const actionsCell = cells[1]
            const botaoEditar = actionsCell.querySelector("button");
            expect(botaoEditar).toBeInTheDocument();
            fireEvent.click(botaoEditar);
        });
        const botaoSalvar = screen.getByRole('button', {name: "Salvar"});
        fireEvent.click(botaoSalvar);
        expect(patchAlterarFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoRelatoriosConsolidados).toHaveBeenCalledTimes(1);
    });

    it("Testa edição associacoes erro", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarFiqueDeOlhoPrestacoesDeContas.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro 007" } },
        });
        render(
            <MemoryRouter>
                <FiqueDeOlho />
            </MemoryRouter>
        );

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            const tabela = screen.getByRole("grid");
            const rows = tabela.querySelectorAll("tbody tr");
            expect(rows).toHaveLength(2);
            const row = rows[0]
            const cells = row.querySelectorAll("td");
            expect(cells).toHaveLength(2);
            const actionsCell = cells[1]
            const botaoEditar = actionsCell.querySelector("button");
            expect(botaoEditar).toBeInTheDocument();
            fireEvent.click(botaoEditar);
        });
        const botaoSalvar = screen.getByRole('button', {name: "Salvar"});
        fireEvent.click(botaoSalvar);
        expect(patchAlterarFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoRelatoriosConsolidados).toHaveBeenCalledTimes(1);
    });

    it("Testa edição dre", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(
            <MemoryRouter>
                <FiqueDeOlho />
            </MemoryRouter>
        );

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            const tabela = screen.getByRole("grid");
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
        const botaoSalvar = screen.getByRole('button', {name: "Salvar"});
        fireEvent.click(botaoSalvar);
        expect(patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoRelatoriosConsolidados).toHaveBeenCalledTimes(1);
    });

    it("Testa edição dre erro", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Erro 007" } },
        });
        render(
            <MemoryRouter>
                <FiqueDeOlho />
            </MemoryRouter>
        );

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(() => {
            const tabela = screen.getByRole("grid");
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
        const botaoSalvar = screen.getByRole('button', {name: "Salvar"});
        fireEvent.click(botaoSalvar);
        expect(patchAlterarFiqueDeOlhoRelatoriosConsolidadosDre).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoPrestacoesDeContas).toHaveBeenCalledTimes(1);
        expect(getFiqueDeOlhoRelatoriosConsolidados).toHaveBeenCalledTimes(1);
    });

});