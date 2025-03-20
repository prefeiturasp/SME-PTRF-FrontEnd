import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AcoesDasAssociacoes } from '..';
import { MemoryRouter, Route, BrowserRouter} from "react-router-dom";

import {
    getListaDeAcoes,
    getParametrizacoesAcoesAssociacoes,
    getAssociacoes,
    getTabelaAssociacoes
    // getFiltrosTiposDeDocumento
} from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postCreateTipoDeDocumento, patchAlterarTipoDeDocumento, deleteTipoDeDocumento } from '../../../../../../services/sme/Parametrizacoes.service';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { mockAcoes, mockSelectAcoes, mockSelectAssociacoes, tabelas } from '../__fixtures__/mockData';

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

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("Carrega página de Acoes das Associações", () => {
    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <AcoesDasAssociacoes />
            </MemoryRouter>
        );
    }
    beforeEach(() => {
        jest.clearAllMocks();
        getAssociacoes.mockResolvedValue(mockSelectAssociacoes);
        getParametrizacoesAcoesAssociacoes.mockResolvedValue(mockAcoes);
        getTabelaAssociacoes.mockResolvedValue(tabelas);
        getListaDeAcoes.mockResolvedValue(mockSelectAcoes);
    });

    it("Testa a chamada de get de Filtros", async () => {
        renderComponent()

        await waitFor(() => {

            const filtro_nome = screen.getByLabelText(/filtrar por nome ou código EOL/i)
            expect(filtro_nome).toBeInTheDocument();

            fireEvent.change(filtro_nome, { target: { value: 'Filtro' } });
            expect(filtro_nome.value).toBe('Filtro');

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getParametrizacoesAcoesAssociacoes).toHaveBeenCalledWith(1, 'Filtro', "", "", []);
        });
    });

    it.skip("Testa a chamada de limpar Filtros", async () => {
        renderComponent()
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
        
        await waitFor(() => {
            const botao_limpar = screen.getByRole('button', { name: /Limpar/i })
            expect(botao_limpar).toBeInTheDocument();
            fireEvent.click(botao_limpar);
        });
    });

});
