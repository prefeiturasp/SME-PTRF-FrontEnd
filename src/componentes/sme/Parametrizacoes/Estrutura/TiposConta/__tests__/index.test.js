import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from "react-router-dom";
import { TiposConta } from '..';
import {
    deleteTipoConta,
    getFiltroTiposContas,
    getTiposContas,
    patchTipoConta,
    postTipoConta,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockTiposConta} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

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

describe("Carrega página de Tipos de Conta", () => {
    beforeEach(() => {
        getTiposContas.mockReturnValue(mockTiposConta);
    });

    it("carrega no modo Listagem com itens", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
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
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de conta" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo de conta *");
        const input_banco = screen.getByLabelText("Nome do banco");
        const input_agencia = screen.getByLabelText("Nº da agência");
        const input_conta = screen.getByLabelText("Nº da conta");
        const input_cartao = screen.getByLabelText("Nº do cartão");
        const input_checkbox_1 = screen.getByLabelText("Exibir os dados da conta somente leitura");
        const input_checkbox_2 = screen.getByLabelText("Conta permite encerramento");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();
        expect(input_agencia).toBeInTheDocument();
        expect(input_agencia).toBeEnabled();
        expect(input_conta).toBeInTheDocument();
        expect(input_conta).toBeEnabled();
        expect(input_cartao).toBeInTheDocument();
        expect(input_cartao).toBeEnabled();
        expect(input_checkbox_1).toBeInTheDocument();
        expect(input_checkbox_1).toBeEnabled();
        expect(input_checkbox_2).toBeInTheDocument();
        expect(input_checkbox_2).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });
        fireEvent.change(input_banco, { target: { value: "BTG" } });
        fireEvent.change(input_agencia, { target: { value: "0001" } });
        fireEvent.change(input_conta, { target: { value: "123123" } });
        fireEvent.change(input_cartao, { target: { value: "0001000200030004" } });


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
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de conta" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo de conta *");
        const input_banco = screen.getByLabelText("Nome do banco");
        const input_agencia = screen.getByLabelText("Nº da agência");
        const input_conta = screen.getByLabelText("Nº da conta");
        const input_cartao = screen.getByLabelText("Nº do cartão");
        const saveButton = screen.getByRole("button", { name: "Salvar" });


        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });
        fireEvent.change(input_banco, { target: { value: "BTG" } });
        fireEvent.change(input_agencia, { target: { value: "0001" } });
        fireEvent.change(input_conta, { target: { value: "123123" } });
        fireEvent.change(input_cartao, { target: { value: "0001000200030004" } });

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
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de conta" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo de conta *");
        const input_banco = screen.getByLabelText("Nome do banco");
        const input_agencia = screen.getByLabelText("Nº da agência");
        const input_conta = screen.getByLabelText("Nº da conta");
        const input_cartao = screen.getByLabelText("Nº do cartão");
        const saveButton = screen.getByRole("button", { name: "Salvar" });


        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });
        fireEvent.change(input_banco, { target: { value: "BTG" } });
        fireEvent.change(input_agencia, { target: { value: "0001" } });
        fireEvent.change(input_conta, { target: { value: "123123" } });
        fireEvent.change(input_cartao, { target: { value: "0001000200030004" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo de conta *");
        const input_banco = screen.getByLabelText("Nome do banco");
        const input_agencia = screen.getByLabelText("Nº da agência");
        const input_conta = screen.getByLabelText("Nº da conta");
        const input_cartao = screen.getByLabelText("Nº do cartão");
        const input_checkbox_1 = screen.getByLabelText("Exibir os dados da conta somente leitura");
        const input_checkbox_2 = screen.getByLabelText("Conta permite encerramento");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();
        expect(input_agencia).toBeInTheDocument();
        expect(input_agencia).toBeEnabled();
        expect(input_conta).toBeInTheDocument();
        expect(input_conta).toBeEnabled();
        expect(input_cartao).toBeInTheDocument();
        expect(input_cartao).toBeEnabled();
        expect(input_checkbox_1).toBeInTheDocument();
        expect(input_checkbox_1).toBeEnabled();
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
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const input_nome = screen.getByLabelText("Nome do tipo de conta *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Tipo de conta 007" } });
        fireEvent.click(saveButton);

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
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const input_nome = screen.getByLabelText("Nome do tipo de conta *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        fireEvent.change(input_nome, { target: { value: "Tipo de conta 007" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(patchTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão sucesso', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
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
            expect(deleteTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getTiposContas.mockResolvedValueOnce(mockTiposConta).mockResolvedValueOnce(mockTiposConta);
        deleteTipoConta.mockRejectedValueOnce({
            response: { data: { mensagem: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-conta"]}>
                <Route path="/parametro-tipos-conta">
                    <TiposConta />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
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
            expect(deleteTipoConta).toHaveBeenCalled();
            expect(getTiposContas).toHaveBeenCalledTimes(1);
        });
    });

});