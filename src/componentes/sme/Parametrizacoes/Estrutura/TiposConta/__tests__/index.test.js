import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TiposConta } from '..';
import {
    deleteTipoConta,
    getTiposContas,
    patchTipoConta,
    postTipoConta,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockTiposConta} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <>{children}</>,
}));

jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
    useAbasPorRecursoContext: () => ({
        selectedRecurso: { uuid: "test-uuid", nome: "Test Recurso" },
        setSelectedRecurso: jest.fn(),
    }),
}));

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    deleteTipoConta: jest.fn(),
    getFiltroTiposContas: jest.fn(),
    getTiposContas: jest.fn(),
    patchTipoConta: jest.fn(),
    postTipoConta: jest.fn()
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../componentes/AbasPorRecurso", () => ({
    AbasPorRecurso: () => <div data-testid="abas-por-recurso">Abas</div>,
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
    useRecursoSelecionadoContext: () => ({
        isLoading: false,
        recursos: [{ uuid: "test-uuid", nome: "Test Recurso", nome_exibicao: "Test" }],
    }),
}));

// Helper function para renderizar com QueryClientProvider
const renderWithQueryClient = (component) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>
    );
};

describe("Carrega página de Tipos de Conta", () => {
    beforeEach(() => {
        getTiposContas.mockReturnValue(mockTiposConta);
    });

    it("carrega no modo Listagem com itens", async () => {
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Tipos de conta/i)).toHaveLength(1);

        await waitFor(()=> expect(getTiposContas).toHaveBeenCalledTimes(1));
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTiposContas.mockReturnValue(mockTiposConta);
    });

    it('teste criação sucesso', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de conta" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
        });

        await screen.findByText("* Preenchimento obrigatório");

        // Ativar o switch para mostrar os campos bancários
        const switchVinculado = await screen.findByRole("switch");
        fireEvent.click(switchVinculado);

        const input_nome = await screen.findByLabelText("Nome do tipo de conta *");
        const input_banco = await screen.findByLabelText("Nome do banco");
        const input_agencia = await screen.findByLabelText("Nº da agência");
        const input_conta = await screen.findByLabelText("Nº da conta");
        // Nº do cartão foi removido do formulário, então o teste relacionado a esse campo foi comentado
        // const input_cartao = await screen.findByLabelText("Nº do cartão");
        const input_checkbox_2 = await screen.findByLabelText("Conta permite encerramento");
        const saveButton = await screen.findByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();
        expect(input_agencia).toBeInTheDocument();
        expect(input_agencia).toBeEnabled();
        expect(input_conta).toBeInTheDocument();
        expect(input_conta).toBeEnabled();
        // Nº do cartão foi removido do formulário, então o teste relacionado a esse campo foi comentado
        // expect(input_cartao).toBeInTheDocument();
        // expect(input_cartao).toBeEnabled();
        expect(input_checkbox_2).toBeInTheDocument();
        expect(input_checkbox_2).toBeEnabled();
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });
        fireEvent.change(input_banco, { target: { value: "BTG" } });
        fireEvent.change(input_agencia, { target: { value: "0001" } });
        fireEvent.change(input_conta, { target: { value: "123123" } });
        // fireEvent.change(input_cartao, { target: { value: "0001000200030004" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro duplicado', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        postTipoConta.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de conta" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
        });

        await screen.findByText("* Preenchimento obrigatório");

        const input_nome = await screen.findByLabelText("Nome do tipo de conta *");
        
        // Ativar o switch para mostrar os campos bancários
        const switchVinculado = await screen.findByRole("switch");
        fireEvent.click(switchVinculado);

        const input_banco = await screen.findByLabelText("Nome do banco");
        const input_agencia = await screen.findByLabelText("Nº da agência");
        const input_conta = await screen.findByLabelText("Nº da conta");
        // Nº do cartão foi removido do formulário, então o teste relacionado a esse campo foi comentado
        // const input_cartao = await screen.findByLabelText("Nº do cartão");
        const saveButton = await screen.findByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });
        fireEvent.change(input_banco, { target: { value: "BTG" } });
        fireEvent.change(input_agencia, { target: { value: "0001" } });
        fireEvent.change(input_conta, { target: { value: "123123" } });
        // fireEvent.change(input_cartao, { target: { value: "0001000200030004" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

    it('teste criação erro genérico', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        postTipoConta.mockRejectedValueOnce({
            response: { data: { message: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de conta" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
        });

        await screen.findByText("* Preenchimento obrigatório");

        const input_nome = await screen.findByLabelText("Nome do tipo de conta *");
        
        // Ativar o switch para mostrar os campos bancários
        const switchVinculado = await screen.findByRole("switch");
        fireEvent.click(switchVinculado);

        const input_banco = await screen.findByLabelText("Nome do banco");
        const input_agencia = await screen.findByLabelText("Nº da agência");
        const input_conta = await screen.findByLabelText("Nº da conta");
        // Nº do cartão foi removido do formulário, então o teste relacionado a esse campo foi comentado
        // const input_cartao = await screen.findByLabelText("Nº do cartão");
        const saveButton = await screen.findByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });
        fireEvent.change(input_banco, { target: { value: "BTG" } });
        fireEvent.change(input_agencia, { target: { value: "0001" } });
        fireEvent.change(input_conta, { target: { value: "123123" } });
        // fireEvent.change(input_cartao, { target: { value: "0001000200030004" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await screen.findByText("* Preenchimento obrigatório");

        const input_nome = await screen.findByLabelText("Nome do tipo de conta *");
        
        // Ativar o switch para mostrar os campos bancários
        const switchVinculado = await screen.findByRole("switch");
        fireEvent.click(switchVinculado);

        const input_banco = await screen.findByLabelText("Nome do banco");
        const input_agencia = await screen.findByLabelText("Nº da agência");
        const input_conta = await screen.findByLabelText("Nº da conta");
        const input_checkbox_2 = await screen.findByLabelText("Conta permite encerramento");
        const saveButton = await screen.findByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();
        expect(input_agencia).toBeInTheDocument();
        expect(input_agencia).toBeEnabled();
        expect(input_conta).toBeInTheDocument();
        expect(input_conta).toBeEnabled();
        expect(input_checkbox_2).toBeInTheDocument();
        expect(input_checkbox_2).toBeEnabled();

        fireEvent.change(input_nome, { target: { value: "Tipo de conta 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(patchTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro nome duplicado', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        patchTipoConta.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=>{
            const input_nome = screen.getByLabelText("Nome do tipo de conta *");
            const saveButton = screen.getByRole("button", { name: "Salvar" });

            fireEvent.change(input_nome, { target: { value: "Tipo de conta 007" } });
            fireEvent.click(saveButton);
        });

        await waitFor(()=>{
            expect(patchTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição erro genérico', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        patchTipoConta.mockRejectedValueOnce({
            response: { data: { mensagem: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=>{
            const input_nome = screen.getByLabelText("Nome do tipo de conta *");
            const saveButton = screen.getByRole("button", { name: "Salvar" });

            fireEvent.change(input_nome, { target: { value: "Tipo de conta 007" } });
            fireEvent.click(saveButton);
        });

        await waitFor(()=>{
            expect(patchTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão sucesso', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const buttons = screen.getAllByRole("button", { name: "Excluir" });
            const btnRemover = buttons[0];
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const buttons = screen.getAllByRole("button", { name: "Excluir" });
            const btnConfirma = buttons[buttons.length - 1];
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        deleteTipoConta.mockRejectedValueOnce({
            response: { data: { mensagem: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Routes>
                    <Route path="/parametro-tipos-conta" element={<TiposConta />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        await waitFor(()=> {
            const buttons = screen.getAllByRole("button", { name: "Excluir" });
            const btnRemover = buttons[0];
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const buttons = screen.getAllByRole("button", { name: "Excluir" });
            const btnConfirma = buttons[buttons.length - 1];
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

});