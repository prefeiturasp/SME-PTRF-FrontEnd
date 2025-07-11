import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
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

const renderComponent = () => {
    render(
        <MemoryRouter initialEntries={["/parametro-acoes"]}>
            <Routes>
                <Route path="/parametro-acoes" element={<Acoes />} />
            </Routes>
        </MemoryRouter>
    );
};

describe("Carrega página de Ações", () => {
    beforeEach(() => {
        getListaDeAcoes.mockReturnValue(mockAcoes);
    });

    it("carrega no modo Listagem com itens", async () => {
        renderComponent();
        expect(screen.getAllByText(/Ações/i)).toHaveLength(1);

        await waitFor(()=> expect(getListaDeAcoes).toHaveBeenCalledTimes(1));
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcoes.mockReturnValue(mockAcoes);
    });

    it('teste fechamento da modal do formulário', async() => {
        postAddAcao.mockResolvedValueOnce({});
        renderComponent();

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
        }
    );
        const botaoCancelar = screen.getByRole("button", { name: "Cancelar" });
        expect(botaoCancelar).toBeInTheDocument();
        fireEvent.click(botaoCancelar);

        await waitFor(()=>{
            expect(botaoCancelar).not.toBeInTheDocument();
        });

    });

    it('teste criação sucesso', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        postAddAcao.mockResolvedValueOnce({});
        renderComponent();

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "AAAAAA" } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro genérico', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        postAddAcao.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        renderComponent();

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "AAAAAA" } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Houve um erro ao tentar criar ação.")).toBeInTheDocument();
        });
    });

    it('teste criação erro non_field_errors', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        postAddAcao.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Testando erro non field error" } },
        });
        renderComponent();

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar ação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "AAAAAA" } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Já existe uma ação com esse nome.")).toBeInTheDocument();
        });
    });

    it('teste edição sucesso', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        renderComponent();

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome *");
        const input_posicao = screen.getByLabelText("Posição nas pesquisas");

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.change(input_posicao, { target: { value: "ZZZZZZ" } });

        const saveButton = screen.getByRole("button", { name: "Salvar" });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro genérico', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        putAtualizarAcao.mockRejectedValueOnce({
            response: { data: { error: "Testando erro response" } },
        });
        renderComponent();

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Houve um erro ao tentar fazer essa atualização.")).toBeInTheDocument();
        });
    });

    it('teste edição erro non_field_errors', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        putAtualizarAcao.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        renderComponent();

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Ação 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Já existe uma ação com esse nome.")).toBeInTheDocument();

        });
    });

    it('teste exclusão sucesso', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        renderComponent();

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnConfirma = screen.getByTestId("botao-confirmar-modal");
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteAcao).toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste cancelamento da exclusão', async() => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        renderComponent();

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnCancela = screen.getByTestId("botao-cancelar-confirmacao-modal");
            expect(btnCancela).toBeInTheDocument();
            expect(btnCancela).toBeEnabled();
            fireEvent.click(btnCancela);
        });

        await waitFor(()=>{
            expect(deleteAcao).not.toHaveBeenCalled();
            expect(getListaDeAcoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão erro', async() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes).mockResolvedValueOnce(mockAcoes);
        deleteAcao.mockRejectedValueOnce({
            response: { data: { mensagem: "Testando erro response" } },
        });
        renderComponent()

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnConfirma = screen.getByTestId("botao-confirmar-modal");
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

describe('Testes de Filtros', () => {

    it("Testa a chamada de getFiltrosTiposDeDocumento", async () => {
        getListaDeAcoes.mockResolvedValueOnce(mockAcoes);
        renderComponent();

        await waitFor(() => {

            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome).toBeInTheDocument();

            fireEvent.change(filtro_nome, { target: { value: 'Ação 1' } });
            expect(filtro_nome.value).toBe('Ação 1');

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getAcoesFiltradas).toHaveBeenCalledWith('Ação 1');
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
        getListaDeAcoes.mockResolvedValue(mockAcoes)
        renderComponent();

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Educom - Imprensa Jovem/i)).toBeInTheDocument());
        const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
        expect(filtro_nome).toBeInTheDocument();

        fireEvent.change(filtro_nome, { target: { value: 'Ação 1' } });
        expect(filtro_nome.value).toBe('Ação 1');

        const botao_limpar = screen.getByRole('button', { name: /Limpar/i })
        expect(botao_limpar).toBeInTheDocument();
        fireEvent.click(botao_limpar);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Educom - Imprensa Jovem/i)).toBeInTheDocument());
        await waitFor(() => {
            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome.value).toBe('');
        });
    });
});