import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { ContasDasAssociacoes } from '..';
import {
    postContasAssociacoes,
    patchContasAssociacoes,
    deleteContasAssociacoes,
    getAssociacoes,
    getContasAssociacoesFiltros,
    getFiltrosDadosContasAssociacoes
} from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { Filtros } from '../Filtros';
import contasAssociacoes from "../__fixtures__/contasAssociacoes";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";


jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    postContasAssociacoes: jest.fn(),
    patchContasAssociacoes: jest.fn(),
    deleteContasAssociacoes: jest.fn(),
    getAssociacoes: jest.fn(),
    getContasAssociacoesFiltros: jest.fn(),
    getFiltrosDadosContasAssociacoes: jest.fn()
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
  }));

describe("Carrega página de Contas de Associações", () => {
    beforeEach(() => {
        const tipos_contas = [
            {uuid: 'ba8b96ef-f05c-41f3-af10-73753490c111', nome: 'Tipo 1'},
            {uuid: 'ba8b96ef-f05c-41f3-af10-73753490c222', nome: 'Tipo 2'}
        ];
        getFiltrosDadosContasAssociacoes.mockResolvedValue(tipos_contas);
    });

    it('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<ContasDasAssociacoes />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("carrega no modo Listagem com itens", async () => {
        const mockData = {
            results: [
                {
                    associacao_dados: {nome: "Associação 1"},
                    tipo_conta_dados: {nome: "Tipo 1"},
                    status: "ATIVA"
                }
            ]
        };
        getContasAssociacoesFiltros.mockResolvedValueOnce(mockData);
        render(
            <ContasDasAssociacoes />
        );
        expect(screen.getByText(/Contas das Associações/i)).toBeInTheDocument();

        await waitFor(()=> expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(1));
    });

    it("carrega no modo Listagem vazia", async () => {
        const mockData = [];
        getContasAssociacoesFiltros.mockResolvedValue(mockData)
        render(
            <ContasDasAssociacoes />
        );

        await waitFor(()=> expect(getContasAssociacoesFiltros).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Não existem contas de associações cadastradas, clique no botão "Adicionar conta de associação" para começar./i)).toBeInTheDocument()
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        const mock_associacoes = [
            {
                uuid: "ba8b96ef-f05c-41f3-af10-73753490c545",
                nome: "Associação 1",
            },
            {
                uuid: "ba8b96ef-f05c-41f3-af10-73753490c544",
                nome: "Associação 2",
            }
        ]
        getAssociacoes.mockResolvedValueOnce(mock_associacoes);
        const mock_filtros = {
            tipos_contas: [
                {
                    uuid: "ba8b96ef-f05c-41f3-af10-73753490c545",
                    nome: "Tipo A",
                },
                {
                    uuid: "ba8b96ef-f05c-41f3-af10-73753490c542",
                    nome: "Tipo B",
                }
            ]
        }
        getFiltrosDadosContasAssociacoes.mockResolvedValueOnce(mock_filtros);
    });

    it.skip('teste criação sucesso', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full).mockResolvedValueOnce(mock_contas_associacoes_full);
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar conta de associação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        
        const input_associacao = screen.getByLabelText("Associação *");
        const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
        const input_status = screen.getByLabelText("Status *");
        const input_banco = screen.getByLabelText("Banco");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_associacao).toBeInTheDocument();
        expect(input_associacao).toBeEnabled();
        expect(input_tipo_conta).toBeInTheDocument();
        expect(input_status).toBeInTheDocument();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        // fireEvent.change(input_associacao, { target: { value: "Associacao 1" } });
        const autocompleteInput = screen.getByRole('searchbox');
        userEvent.type(autocompleteInput, 'Associação');

        
            const suggestionsList = screen.getByRole('listbox'); // Exemplo: Adapte o seletor conforme sua estrutura
            console.log("innerhtml")
            console.log(suggestionsList.innerHTML);
            const suggestions = suggestionsList.querySelectorAll('li');
            console.log("suggestions");
            console.log(suggestions);
            expect(suggestions).toHaveLength(2);
        
        // Simula a seleção da primeira sugestão (ajuste o seletor conforme sua estrutura)
        // const firstSuggestion = screen.getAllByRole('option')[0];
        // await userEvent.click(firstSuggestion);


        // fireEvent.change(input_tipo_conta, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c542" } });
        // fireEvent.change(input_status, { target: { value: "ATIVA" } });
        // fireEvent.change(input_banco, { target: { value: "Santander" } });
        // console.log("*****************************")
        // console.log(input_associacao.value);
        // console.log(input_tipo_conta.value);
        // console.log(input_status.value);

        // fireEvent.click(saveButton);

        // const errorMessage = screen.getByText('Associação é obrigatório');
        // expect(errorMessage).toBeInTheDocument();

        // await waitFor(()=>{
        //     expect(postContasAssociacoes).toHaveBeenCalled();
        //     expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(2);
        // });
    });

    it.skip('teste criação falha duplicidade', async() => {
        postContasAssociacoes.mockRejectedValueOnce({response: {data: {non_field_errors: ["Esta conta de associacao já existe."]}}});
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar conta de associação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        const input_associacao = screen.getByLabelText("Associação *");
        const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
        const input_status = screen.getByLabelText("Status *");
        const input_banco = screen.getByLabelText("Banco");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_associacao).toBeInTheDocument();
        expect(input_associacao).toBeEnabled();
        expect(input_tipo_conta).toBeInTheDocument();
        expect(input_status).toBeInTheDocument();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_associacao, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c001" } });
        fireEvent.change(input_tipo_conta, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c542" } });
        fireEvent.change(input_status, { target: { value: "ATIVA" } });
        fireEvent.change(input_banco, { target: { value: "Santander" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postContasAssociacoes).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Esta conta de associacao já existe./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it.skip('teste criação falha genérica', async() => {
        postContasAssociacoes.mockRejectedValueOnce(
            {
                response: {
                    data: {
                        associacao: ["This field is required."]
                    }
                }
            }
        );
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar conta de associação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        const input_associacao = screen.getByLabelText("Associação *");
        // // const input_associacao = screen.getByTestId('associacao_nome');
        // const input_associacao = screen.getByRole('searchbox', { name: 'selectedAssociacao' });
        const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
        const input_status = screen.getByLabelText("Status *");
        const input_banco = screen.getByLabelText("Banco");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_associacao).toBeInTheDocument();
        expect(input_associacao).toBeEnabled();
        expect(input_tipo_conta).toBeInTheDocument();
        expect(input_status).toBeInTheDocument();
        expect(input_banco).toBeInTheDocument();
        expect(input_banco).toBeEnabled();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_associacao, { target: { value: "Associacao 1" } });
        fireEvent.change(input_tipo_conta, { target: { value: "ba8b96ef-f05c-41f3-af10-73753490c542" } });
        fireEvent.change(input_status, { target: { value: "ATIVA" } });
        fireEvent.change(input_banco, { target: { value: "Santander" } });
        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postContasAssociacoes).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Erro ao criar conta de associacao. Tente novamente./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it.skip('teste edição sucesso', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full).mockResolvedValueOnce(mock_contas_associacoes_full);
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        
        const input_associacao = screen.getByLabelText("Associação *");
        const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
        const input_status = screen.getByLabelText("Status *");
        const input_banco = screen.getByLabelText("Banco");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_associacao).toBeInTheDocument();
        expect(input_associacao.value).toBe("Associação 1");
        expect(input_tipo_conta).toBeInTheDocument();
        expect(input_tipo_conta.value).toBe("ba8b96ef-f05c-41f3-af10-73753490c542");
        expect(input_status).toBeInTheDocument();
        expect(input_banco).toBeInTheDocument();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_banco, { target: { value: "Santander" } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(patchContasAssociacoes).toHaveBeenCalled();
            expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(2);
        });
    });

    it.skip('teste edição falha non_field_errors', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full);
        patchContasAssociacoes.mockRejectedValueOnce({response: {data: {non_field_errors: ["Esta conta de associacao já existe."]}}});
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        
        const input_associacao = screen.getByLabelText("Associação *");
        const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
        const input_status = screen.getByLabelText("Status *");
        const input_banco = screen.getByLabelText("Banco");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_associacao).toBeInTheDocument();
        expect(input_associacao.value).toBe("Associação 1");
        expect(input_tipo_conta).toBeInTheDocument();
        expect(input_tipo_conta.value).toBe("ba8b96ef-f05c-41f3-af10-73753490c542");
        expect(input_status).toBeInTheDocument();
        expect(input_banco).toBeInTheDocument();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_banco, { target: { value: "Santander" } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(patchContasAssociacoes).toHaveBeenCalled();
            expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(1);
            const toastCustomError = screen.getByText(/Esta conta de associacao já existe./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it.skip('teste edição erro genérico', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full);
        patchContasAssociacoes.mockRejectedValueOnce(
            {
                response: {
                    data: {
                        associacao: ["This field is required."]
                    }
                }
            }
        );
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        
        const input_associacao = screen.getByLabelText("Associação *");
        const input_tipo_conta = screen.getByLabelText("Tipos de conta *");
        const input_status = screen.getByLabelText("Status *");
        const input_banco = screen.getByLabelText("Banco");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_associacao).toBeInTheDocument();
        expect(input_associacao.value).toBe("Associação 1");
        expect(input_tipo_conta).toBeInTheDocument();
        expect(input_tipo_conta.value).toBe("ba8b96ef-f05c-41f3-af10-73753490c542");
        expect(input_status).toBeInTheDocument();
        expect(input_banco).toBeInTheDocument();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_banco, { target: { value: "Santander" } });

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(patchContasAssociacoes).toHaveBeenCalled();
            expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(1);
            const toastCustomError = screen.getByText(/Erro ao atualizar conta de associacao. Tente novamente./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it('teste delete sucesso', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full).mockResolvedValueOnce(mock_contas_associacoes_full);
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const btnRemover = screen.getByRole("button", { name: "Apagar" });
        expect(btnRemover).toBeInTheDocument();
        expect(btnRemover).toBeEnabled();
        fireEvent.click(btnRemover);
        const btnConfirma = screen.getByRole("button", { name: "Excluir" });
        expect(btnConfirma).toBeInTheDocument();
        expect(btnConfirma).toBeEnabled();
        fireEvent.click(btnConfirma);

        await waitFor(() => {
            expect(deleteContasAssociacoes).toHaveBeenCalled();
            expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(2);
        });
    });

    it('teste delete falha', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full);
        deleteContasAssociacoes.mockRejectedValueOnce({
            response: { data: { mensagem: "mensagem de erro" } },
        });
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const btnRemover = screen.getByRole("button", { name: "Apagar" });
        expect(btnRemover).toBeInTheDocument();
        expect(btnRemover).toBeEnabled();
        fireEvent.click(btnRemover);
        const btnConfirma = screen.getByRole("button", { name: "Excluir" });
        expect(btnConfirma).toBeInTheDocument();
        expect(btnConfirma).toBeEnabled();
        fireEvent.click(btnConfirma);

        await waitFor(() => {
            expect(deleteContasAssociacoes).toHaveBeenCalled();
            expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(1);
            const toastCustomError = screen.getByText(/mensagem de erro/i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it('teste delete erro genérico', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full);
        deleteContasAssociacoes.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<ContasDasAssociacoes/>);
        
        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const btnRemover = screen.getByRole("button", { name: "Apagar" });
        expect(btnRemover).toBeInTheDocument();
        expect(btnRemover).toBeEnabled();
        fireEvent.click(btnRemover);
        const btnConfirma = screen.getByRole("button", { name: "Excluir" });
        expect(btnConfirma).toBeInTheDocument();
        expect(btnConfirma).toBeEnabled();
        fireEvent.click(btnConfirma);

        await waitFor(() => {
            expect(deleteContasAssociacoes).toHaveBeenCalled();
            expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(1);
            const toastCustomError = screen.getByText(/Houve um problema ao realizar esta operação, tente novamente./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});


describe('Teste handle functions', () => {
    beforeEach(() => {
        const mock_associacoes = [
            {
                uuid: "ba8b96ef-f05c-41f3-af10-73753490c545",
                nome: "Associação 1",
            },
            {
                uuid: "ba8b96ef-f05c-41f3-af10-73753490c544",
                nome: "Associação 2",
            }
        ]
        getAssociacoes.mockResolvedValueOnce(mock_associacoes);
        const mock_filtros = {
            tipos_de_conta: [
                {
                    uuid: "ba8b96ef-f05c-41f3-af10-73753490c545",
                    nome: "Tipo A",
                },
                {
                    uuid: "ba8b96ef-f05c-41f3-af10-73753490c542",
                    nome: "Tipo B",
                }
            ]
        }
        getFiltrosDadosContasAssociacoes.mockResolvedValueOnce(mock_filtros);
    });

    it('test onPageChange', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        const mock_contas_associacoes_paginated = { 
            count: 21,
            page: 2,
            page_size: 20,
            results: contasAssociacoes.slice(20, 21)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full).mockResolvedValueOnce(mock_contas_associacoes_paginated);
        render(<ContasDasAssociacoes/>);
        await waitFor(()=>{
                const table = screen.getByRole("grid");
                const rowsLength = table.querySelectorAll("tbody tr").length;
                expect(rowsLength).toEqual(20);
            }
        );

        const button = screen.getByRole('button', {name: /2/i});
        fireEvent.click(button);

        await waitFor(()=>{
            expect(screen.queryByText('Associação 21')).toBeInTheDocument();
            expect(screen.queryByText('Associação 20')).not.toBeInTheDocument();
            }
        );
        expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(2);
    });

    it('test limpaFiltros', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full).mockResolvedValueOnce(mock_contas_associacoes_full);
        render(<ContasDasAssociacoes/>);
        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            fireEvent.change(input, { target: { name: 'filtrar_por_associacao_nome', value: 'Associação 1' } });
            expect(input.value).toEqual("Associação 1");
        });

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            expect(input.value).toEqual("");
        });

        expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(2);
    });

    it('test handleChangeFiltros', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full);
        render(<ContasDasAssociacoes/>);
        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            fireEvent.change(input, { target: { name: 'filtrar_por_associacao_nome', value: 'Associação 1' } });
            expect(input.value).toEqual("Associação 1");
        });

        expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(1);
        
    });

    it('test handleSubmitFiltros', async() => {
        const mock_contas_associacoes_full = { 
            count: 21,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 20)};
        const mock_contas_associacoes_filtered = { 
            count: 1,
            page: 1,
            page_size: 20,
            results: contasAssociacoes.slice(0, 1)};
        getContasAssociacoesFiltros.mockResolvedValueOnce(mock_contas_associacoes_full).mockResolvedValueOnce(mock_contas_associacoes_filtered);
        render(<ContasDasAssociacoes/>);
        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            fireEvent.change(input, { target: { name: 'filtrar_por_associacao_nome', value: 'Associação 1' } });
        });

        const filtrarButton = screen.getByRole('button', { name: /filtrar/i });
        fireEvent.click(filtrarButton);

        await waitFor(()=>{
            expect(screen.queryByText('Associação 1')).toBeInTheDocument();
            expect(screen.queryByText('Associação 2')).not.toBeInTheDocument();
            }
        );
        expect(getContasAssociacoesFiltros).toHaveBeenCalledTimes(2);
        
    });
});