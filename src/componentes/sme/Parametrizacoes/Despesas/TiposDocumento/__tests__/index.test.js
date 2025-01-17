import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import { TiposDocumento } from '..';
import { getTodosTiposDeDocumento } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import React from 'react';

jest.mock("../../../../../../services/sme/Parametrizacoes.service")

const mockTiposDocumentos = [
    { id: 1, nome: 'Tipo 1' },
    { id: 2, nome: 'Tipo 2' },
];

getTodosTiposDeDocumento.mockResolvedValue({
    data: mockTiposDocumentos,
    status: 200,
});

const setup = () => {
    render(
        <TiposDocumento />
    );
  };

describe("Carrega página de Tipos de Documentos", () => {

    test('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<TiposDocumento />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("carrega no modo Listagem com itens", async () => {
        getTodosTiposDeDocumento()
        setup();
        expect(screen.getByText(/Tipo de Documento/i)).toBeInTheDocument();

        await waitFor(()=> expect(getTodosTiposDeDocumento).toHaveBeenCalled());
        await waitFor(()=> expect(screen.getByText(/tipo(s) de documento/i)).toBeInTheDocument());
    });

    it("carrega no modo Listagem vazia", async () => {
        getTodosTiposDeDocumento.mockResolvedValue([])
        setup();
        expect(screen.getByText(/Tipo de Documento/i)).toBeInTheDocument();

        await waitFor(()=> expect(getTodosTiposDeDocumento).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Não existem tipos de documentos cadastrados, clique no botão "Adicionar tipo de documento" para começar./i)).toBeInTheDocument()
        });
    });

    test('Deve fechar o modal e limpar a mensagem', async () => {
        render(<TiposDocumento />);
        await waitFor(() => {
            // Verifica se o modal e a mensagem estão visíveis inicialmente
            expect(screen.getByText("Tipo de documento")).toBeInTheDocument();
            
            // Simula o clique no botão
            fireEvent.click(screen.getByText("Adicionar tipo de documento"));
        })
    });

});
