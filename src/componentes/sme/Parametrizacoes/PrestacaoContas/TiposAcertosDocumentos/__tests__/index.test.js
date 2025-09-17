import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ParametrizacoesTiposAcertosDocumentos } from '..';
import {
    getListaDeAcertosDocumentos,
    getAcertosDocumentosFiltrados,
    postAddAcertosDocumentos,
    putAtualizarAcertosDocumentos,
    deleteAcertosDocumentos,
    getTabelaDocumento,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockTiposAcertosDocumentos, mockTabelas} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getListaDeAcertosDocumentos: jest.fn(),
    getAcertosDocumentosFiltrados: jest.fn(),
    postAddAcertosDocumentos: jest.fn(),
    putAtualizarAcertosDocumentos: jest.fn(),
    deleteAcertosDocumentos: jest.fn(),
    getTabelaDocumento: jest.fn()
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

describe("Carrega página de Tipos de acertos em documentos", () => {
    beforeEach(() => {
        getListaDeAcertosDocumentos.mockReturnValue(mockTiposAcertosDocumentos);
        getTabelaDocumento.mockReturnValue(mockTabelas);
    });

    it("carrega no modo Listagem com itens", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Tipo de acertos em documentos/i)).toHaveLength(2);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(1);
        });
    });
});

describe("Teste dos filtros", () => {
    beforeEach(() => {
        getListaDeAcertosDocumentos.mockResolvedValue(mockTiposAcertosDocumentos);
        getTabelaDocumento.mockResolvedValue(mockTabelas);
    });

    it("Teste filtro de nome", async () => {
        getListaDeAcertosDocumentos.mockResolvedValue(mockTiposAcertosDocumentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.change(input_nome, { target: { value: "Incluir documento" } });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(1);
            expect(getAcertosDocumentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro de categoria", async () => {
        getListaDeAcertosDocumentos.mockResolvedValue(mockTiposAcertosDocumentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_categoria = screen.getByLabelText("Filtrar por categorias");
        fireEvent.change(input_categoria, { target: { value: "a" } });
        await waitFor(() => {
            const categoria = screen.queryByTitle('Inclusão de crédito');
            fireEvent.click(categoria);
        })
        await waitFor(() => {
            const categoria2 = screen.queryByTitle('Inclusão de gasto');
            fireEvent.click(categoria2);
        })

        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(2);
            expect(getAcertosDocumentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro limpar", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_limpar = screen.getByRole("button", { name: "Limpar" });
        fireEvent.change(input_nome, { target: { value: "Incluir documento" } });
        fireEvent.click(botao_limpar);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(2);
            expect(getAcertosDocumentosFiltrados).toHaveBeenCalledTimes(0);
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcertosDocumentos.mockReturnValue(mockTiposAcertosDocumentos);
        getTabelaDocumento.mockReturnValue(mockTabelas);
    });

    it('teste criação sucesso', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acertos em documentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_documentos = screen.getByLabelText("Documentos Prestações *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_documentos).toBeInTheDocument();
        expect(input_documentos).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo documento 007" } });        
        fireEvent.change(input_categoria, { target: { value: "INCLUSAO_CREDITO" } });
        fireEvent.input(input_documentos, { target: { value: '6' } });
        await waitFor(() => {
            const documento = screen.queryByTitle('teste');
            fireEvent.click(documento);
        })

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro duplicado', async() => {;
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        postAddAcertosDocumentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acertos em documentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_documentos = screen.getByLabelText("Documentos Prestações *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_documentos).toBeInTheDocument();
        expect(input_documentos).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo documento 007" } });        
        fireEvent.change(input_categoria, { target: { value: "INCLUSAO_CREDITO" } });
        fireEvent.input(input_documentos, { target: { value: '6' } });
        await waitFor(() => {
            const documento = screen.queryByTitle('teste');
            fireEvent.click(documento);
        })

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste criação erro genérico', async() => {;    
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        postAddAcertosDocumentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }},
            request: { responseText: JSON.stringify({ detail: 'Erro de teste' })}
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acertos em documentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_documentos = screen.getByLabelText("Documentos Prestações *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_documentos).toBeInTheDocument();
        expect(input_documentos).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo documento 007" } });        
        fireEvent.change(input_categoria, { target: { value: "INCLUSAO_CREDITO" } });
        fireEvent.input(input_documentos, { target: { value: '6' } });
        await waitFor(() => {
            const documento = screen.queryByTitle('teste');
            fireEvent.click(documento);
        })

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro genérico', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos);
        putAtualizarAcertosDocumentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" }}
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição erro nome duplicado', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos);
        putAtualizarAcertosDocumentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }}
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão sucesso', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(deleteAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos);
        deleteAcertosDocumentos.mockRejectedValue({
            response: { data: { mensagem: "Erro genérico" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(deleteAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Exclusão não permitida")).toBeInTheDocument();
            expect(screen.getByText("Erro genérico")).toBeInTheDocument();
        });
    });
});