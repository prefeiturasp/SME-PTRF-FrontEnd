import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { TiposDeCredito } from '..';
import { getTiposDeCredito, getFiltrosTiposDeCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockFiltros, mockTiposReceitas } from '../__fixtures__/mockData';


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn()
}));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTiposDeCredito: jest.fn(),
    getFiltrosTiposDeCredito: jest.fn()
}));
jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));


describe("Carrega página Tipos de Crédito", () => {

    it('Renderiza a página', async() => {
        getTiposDeCredito.mockResolvedValueOnce(mockTiposReceitas);
        getFiltrosTiposDeCredito.mockResolvedValueOnce(mockFiltros);
        render(
            <MemoryRouter>
                    <TiposDeCredito />
            </MemoryRouter>
        );
        await waitFor(() => {
            expect(screen.getByText("Tipos de crédito")).toBeInTheDocument();
        });
    });

    it("Testa filtros", async () => {
        getFiltrosTiposDeCredito.mockResolvedValueOnce(mockFiltros);
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTiposDeCredito.mockReturnValueOnce(mockTiposReceitas).mockReturnValueOnce(mockTiposReceitas).mockReturnValueOnce(mockTiposReceitas)
        render(
            <MemoryRouter>
                <TiposDeCredito />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole("button", {name: "+ Adicionar tipo de crédito"}))
        });
        const filtroNome = screen.getByLabelText("Filtrar por nome de crédito");
        const filtroTipo = screen.getByLabelText("Filtrar por tipo");
        const filtroClassificacao = screen.getByLabelText("Filtrar por classificação");
        const filtroTipoConta = screen.getByLabelText("Filtrar por classificação");
        const botaoFiltrar = screen.getByRole("button", {name: "Filtrar"})
        const botaoLimpar = screen.getByRole("button", {name: "Limpar"})

        expect(filtroNome).toBeInTheDocument();
        expect(filtroTipo).toBeInTheDocument();
        expect(filtroClassificacao).toBeInTheDocument();
        expect(filtroTipoConta).toBeInTheDocument();

        fireEvent.change(filtroNome, { target: { value: 'Tipo de crédito 1' } });
        fireEvent.click(botaoFiltrar);

        expect(getFiltrosTiposDeCredito).toHaveBeenCalledTimes(1);
        expect(getTiposDeCredito).toHaveBeenCalledTimes(2);

        fireEvent.click(botaoLimpar);
        expect(getTiposDeCredito).toHaveBeenCalledTimes(3);
    });

    it("Testa requests com erro", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        const error = new Error('Erro na requisição')
        getTiposDeCredito.mockRejectedValueOnce(error);
        getFiltrosTiposDeCredito.mockRejectedValueOnce(error);
        render(
            <MemoryRouter>
                <TiposDeCredito />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(getTiposDeCredito).toHaveBeenCalledTimes(1);
            expect(getFiltrosTiposDeCredito).toHaveBeenCalledTimes(1);

        });

    });

    it("Testa variações de filtros", async() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTiposDeCredito.mockReturnValue(mockTiposReceitas)
        getFiltrosTiposDeCredito.mockReturnValue(mockFiltros);
        render(
            <MemoryRouter>
                <TiposDeCredito />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole("button", {name: "+ Adicionar tipo de crédito"}))
        });
        const filtroTipo = screen.getByLabelText("Filtrar por tipo");
        const filtroClassificacao = screen.getByLabelText("Filtrar por classificação");
        const botaoFiltrar = screen.getByRole("button", {name: "Filtrar"})
        const botaoLimpar = screen.getByRole("button", {name: "Limpar"})

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

        expect(getFiltrosTiposDeCredito).toHaveBeenCalledTimes(1);
        expect(getTiposDeCredito).toHaveBeenCalledTimes(9);

        fireEvent.click(botaoLimpar);
        expect(getTiposDeCredito).toHaveBeenCalledTimes(10);
    });

});
