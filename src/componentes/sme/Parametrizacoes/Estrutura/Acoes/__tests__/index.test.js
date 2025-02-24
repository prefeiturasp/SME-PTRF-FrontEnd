import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from "react-router-dom";
import { Acoes } from '..';
import {
    getListaDeAcoes,
    getAcoesFiltradas,
    postAddAcao,
    putAtualizarAcao,
    deleteAcao,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockAcoes} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getListaDeAcoes: jest.fn(),
    getAcoesFiltradas: jest.fn(),
    postAddAcao: jest.fn(),
    putAtualizarAcao: jest.fn(),
    deleteAcao: jest.fn()
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

describe("Carrega página de Ações", () => {
    beforeEach(() => {
        getListaDeAcoes.mockReturnValue(mockAcoes);
    });

    it("carrega no modo Listagem com itens", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Ações/i)).toHaveLength(1);

        await waitFor(()=> expect(getListaDeAcoes).toHaveBeenCalledTimes(1));
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcoes.mockReturnValue(mockAcoes);
    });

    it('teste criação sucesso', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome da ação *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const input_recursos_externos = screen.getByLabelText("recursos externos");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_posicao).toBeInTheDocument();
        expect(input_posicao).toBeEnabled();
        expect(input_recursos_externos).toBeInTheDocument();
        expect(input_recursos_externos).toBeEnabled();
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "1" } });
        fireEvent.change(input_recursos_externos, { target: { value: true } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro duplicado', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        postAddAcao.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome da ação *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const input_recursos_externos = screen.getByLabelText("recursos externos");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "1" } });
        fireEvent.change(input_recursos_externos, { target: { value: true } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste criação erro genérico', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        postAddAcao.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome da ação *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const input_recursos_externos = screen.getByLabelText("recursos externos");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "1" } });
        fireEvent.change(input_recursos_externos, { target: { value: true } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome da ação *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const input_recursos_externos = screen.getByLabelText("recursos externos");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_posicao).toBeInTheDocument();
        expect(input_posicao).toBeEnabled();
        expect(input_recursos_externos).toBeInTheDocument();
        expect(input_recursos_externos).toBeEnabled();
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro nome duplicado', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        putAtualizarAcao.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome da ação *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição erro genérico', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        putAtualizarAcao.mockRejectedValueOnce({
            response: { data: { error: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome da ação *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão sucesso', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Apagar" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnConfirma = screen.getByRole("button", { name: "Excluir" });
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        deleteAcao
        deleteAcao.mockRejectedValueOnce({
            response: { data: { mensagem: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-acoes"]}>
                <Route path="/parametro-acoes">
                    <Acoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Apagar" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnConfirma = screen.getByRole("button", { name: "Excluir" });
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
        });
    });

});