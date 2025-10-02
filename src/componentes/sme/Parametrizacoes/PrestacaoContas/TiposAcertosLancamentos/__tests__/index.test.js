import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ParametrizacoesTiposAcertosLancamentos } from '..';
import {
    getListaDeAcertosLancamentos,
    getAcertosLancamentosFiltrados,
    postAddAcertosLancamentos,
    putAtualizarAcertosLancamentos,
    getTabelaCategoria,
    deleteAcertosLancamentos,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockTiposAcertosLancamentos, mockTabelas} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getListaDeAcertosLancamentos: jest.fn(),
    getAcertosLancamentosFiltrados: jest.fn(),
    postAddAcertosLancamentos: jest.fn(),
    putAtualizarAcertosLancamentos: jest.fn(),
    getTabelaCategoria: jest.fn(),
    deleteAcertosLancamentos: jest.fn()
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

describe("Carrega página de Tipos de acertos em lançamentos", () => {
    beforeEach(() => {
        getListaDeAcertosLancamentos.mockReturnValue(mockTiposAcertosLancamentos);
        getTabelaCategoria.mockReturnValue(mockTabelas);
    });

    it("carrega no modo Listagem com itens", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Tipo de acertos em lançamentos/i)).toHaveLength(1);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(1);
        });
    });
});

describe("Teste dos filtros", () => {
    beforeEach(() => {
        getListaDeAcertosLancamentos.mockReturnValue(mockTiposAcertosLancamentos);
        getTabelaCategoria.mockReturnValue(mockTabelas);
    });

    it("Teste filtro de nome", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.change(input_nome, { target: { value: "Enviar justificativa" } });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(1);
            expect(getAcertosLancamentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro de categoria", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_categoria = screen.getByLabelText("Filtrar por categorias");
        fireEvent.change(input_categoria, { target: { value: "a" } });
        await waitFor(() => {
            const categoria = screen.queryByTitle('Devolução ao tesouro');
            fireEvent.click(categoria);
        })
        await waitFor(() => {
            const categoria2 = screen.queryByTitle('Ajustes externos');
            fireEvent.click(categoria2);
        })

        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(2);
            expect(getAcertosLancamentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro limpar", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_limpar = screen.getByRole("button", { name: "Limpar" });
        fireEvent.change(input_nome, { target: { value: "Enviar justificativa" } });
        fireEvent.click(botao_limpar);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(2);
            expect(getAcertosLancamentosFiltrados).toHaveBeenCalledTimes(0);
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcertosLancamentos.mockReturnValue(mockTiposAcertosLancamentos);
        getTabelaCategoria.mockReturnValue(mockTabelas);
    });

    it('teste criação sucesso', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acerto em lançamentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

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
        fireEvent.change(input_categoria, { target: { value: "DEVOLUCAO" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro duplicado', async() => {;
        postAddAcertosLancamentos.mockRejectedValueOnce({
                    response: { data: { non_field_errors: "Testando erro response" } },
                });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acerto em lançamentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

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
        fireEvent.change(input_categoria, { target: { value: "DEVOLUCAO" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste criação erro genérico', async() => {;
        postAddAcertosLancamentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }},
            request: { responseText: JSON.stringify({ detail: 'Erro de teste' })}
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acerto em lançamentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

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
        fireEvent.change(input_categoria, { target: { value: "DEVOLUCAO" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(postAddAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
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
            expect(putAtualizarAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro genérico', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        putAtualizarAcertosLancamentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
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
            expect(putAtualizarAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Atualização não permitida")).toBeInTheDocument();
            expect(screen.getByText("Testando erro response")).toBeInTheDocument();
            
        });
    });

    it('teste edição erro nome duplicado', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        putAtualizarAcertosLancamentos.mockRejectedValue({
            response: { data: { mensagem: "Nome duplicado" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const radioPodeAlterarSim = screen.getByLabelText("Sim", { selector: 'input[id="pode_alterar_saldo_conciliacao_sim"]' });
        const radioPodeAlterarNao = screen.getByLabelText("Não", { selector: 'input[id="pode_alterar_saldo_conciliacao_nao"]' });
        const radioAtivoSim = screen.getByLabelText("Sim", { selector: 'input[id="ativo-sim"]' });
        const radioAtivoNao = screen.getByLabelText("Não", { selector: 'input[id="ativo-nao"]' });

        fireEvent.click(radioPodeAlterarSim);
        expect(radioPodeAlterarSim).toBeChecked();
        expect(radioPodeAlterarNao).not.toBeChecked();

        fireEvent.click(radioPodeAlterarNao);
        expect(radioPodeAlterarSim).not.toBeChecked();
        expect(radioPodeAlterarNao).toBeChecked();

        fireEvent.click(radioAtivoSim);
        expect(radioAtivoSim).toBeChecked();
        expect(radioAtivoNao).not.toBeChecked();

        fireEvent.click(radioAtivoNao);
        expect(radioAtivoSim).not.toBeChecked();
        expect(radioAtivoNao).toBeChecked();

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
            expect(putAtualizarAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Atualização não permitida")).toBeInTheDocument();
            expect(screen.getByText("Já existe um lançamento com esse nome.")).toBeInTheDocument(); 
        });
    });

    it('teste exclusão sucesso', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

         await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir", selector: ".btn-danger" });
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
            expect(deleteAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos);
        deleteAcertosLancamentos.mockRejectedValue({
            response: { data: { mensagem: "Erro genérico" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

         await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir", selector: ".btn-danger" });
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
            expect(deleteAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Exclusão não permitida")).toBeInTheDocument();
            expect(screen.getByText("Erro genérico")).toBeInTheDocument();
        });
    });
});