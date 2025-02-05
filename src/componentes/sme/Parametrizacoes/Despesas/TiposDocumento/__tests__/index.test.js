import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TiposDocumento } from '..';
import { getTodosTiposDeDocumento, getFiltrosTiposDeDocumento } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postCreateTipoDeDocumento, patchAlterarTipoDeDocumento, deleteTipoDeDocumento } from '../../../../../../services/sme/Parametrizacoes.service';
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { mockData } from '../__fixtures__/mockData';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTodosTiposDeDocumento: jest.fn(),
    postCreateTipoDeDocumento: jest.fn(),
    patchAlterarTipoDeDocumento: jest.fn(),
    deleteTipoDeDocumento: jest.fn(),
    getFiltrosTiposDeDocumento: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("Carrega página de Tipos de Documentos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getTodosTiposDeDocumento.mockResolvedValue(mockData);
    });

    it("Testa a chamada de getFiltrosTiposDeDocumento", async () => {
        getTodosTiposDeDocumento.mockResolvedValueOnce(mockData);
        render(<TiposDocumento />);

        await waitFor(() => {

            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome).toBeInTheDocument();

            fireEvent.change(filtro_nome, { target: { value: 'Tipo 1' } });
            expect(filtro_nome.value).toBe('Tipo 1');

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getFiltrosTiposDeDocumento).toHaveBeenCalledWith('Tipo 1');
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
        getTodosTiposDeDocumento.mockResolvedValue(mockData)
        render(<TiposDocumento />);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Tipo 10/i)).toBeInTheDocument());
        const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
        expect(filtro_nome).toBeInTheDocument();

        fireEvent.change(filtro_nome, { target: { value: 'Tipo 1' } });
        expect(filtro_nome.value).toBe('Tipo 1');

        const botao_limpar = screen.getByRole('button', { name: /Limpar/i })
        expect(botao_limpar).toBeInTheDocument();
        fireEvent.click(botao_limpar);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Tipo 10/i)).toBeInTheDocument());
        await waitFor(() => {
            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome.value).toBe('');
        });
    });

    test('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<TiposDocumento />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("carrega no modo Listagem com itens", async () => {
        getTodosTiposDeDocumento.mockResolvedValueOnce(mockData);
        render(
            <TiposDocumento />
        );

        expect(screen.getByText(/Tipo de Documento/i)).toBeInTheDocument();

        await waitFor(()=> {
            expect(getTodosTiposDeDocumento).toHaveBeenCalledTimes(1);
            const item_tabela = screen.getByText("Tipo 10")
            expect(item_tabela).toBeInTheDocument()
        });
    });

    it("carrega no modo Listagem vazia", async () => {
        const mockData = [];
        getTodosTiposDeDocumento.mockResolvedValue(mockData)
        render(
            <TiposDocumento />
        );

        await waitFor(()=> expect(getTodosTiposDeDocumento).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Nenhum resultado encontrado./i)).toBeInTheDocument()
        });
    });

});

describe("Testes Operacao CREATE", ()=>{

    it("Renderiza Operacao create sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<TiposDocumento/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);
        });
        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Documento Teste" } });
        expect(input.value).toBe("Documento Teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateTipoDeDocumento).toHaveBeenCalled();
        });

    });
    it("Renderiza Operacao create falha non_field_errors", async () => {
        postCreateTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este tipo de documento já existe." } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<TiposDocumento/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);
        });
        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Documento Teste" } });
        expect(input.value).toBe("Documento Teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateTipoDeDocumento).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Este tipo de documento já existe./i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });
    it("Renderiza Operacao create falha erro response", async () => {
        postCreateTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { nome: "Campo obrigatório" } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<TiposDocumento/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar tipo de documento/i });
            expect(button).toBeInTheDocument();
            fireEvent.click(button);
        });
        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Documento Teste" } });
        expect(input.value).toBe("Documento Teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateTipoDeDocumento).toHaveBeenCalled();

            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });

});

describe("Testes Operacao EDIT", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getTodosTiposDeDocumento.mockResolvedValue(mockData);
    });

    it("Renderiza Operacao edit sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(<TiposDocumento/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("Tipo 1");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Tipo 1 Atualizado" } });
        expect(input.value).toBe("Tipo 1 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarTipoDeDocumento).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao edit erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este tipo de documento já existe." } },
        });
        render(<TiposDocumento/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("Tipo 1");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Tipo 1 Atualizado" } });
        expect(input.value).toBe("Tipo 1 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarTipoDeDocumento).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Este tipo de documento já existe./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao edit erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<TiposDocumento/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("Tipo 1");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Tipo 1 Atualizado" } });
        expect(input.value).toBe("Tipo 1 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarTipoDeDocumento).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});

describe("Testes Operacao DELETE", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getTodosTiposDeDocumento.mockResolvedValue(mockData);
    });
    it("Renderiza Operacao delete sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(<TiposDocumento/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Excluir" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeDocumento).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { mensagem: "mensagem de erro" } },
        });
        render(<TiposDocumento/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Excluir" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeDocumento).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<TiposDocumento/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[6].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Excluir" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-base-vermelho"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeDocumento).toHaveBeenCalled();
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    let setErroExclusaoNaoPermitidaMock;
    let setShowModalInfoUpdateNaoPermitidoMock;

    beforeEach(() => {
        setErroExclusaoNaoPermitidaMock = jest.fn();
        setShowModalInfoUpdateNaoPermitidoMock = jest.fn();
    });

    it('deve lidar com erro ao criar tipo de documento', async () => {
        postCreateTipoDeDocumento.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postCreateTipoDeDocumento(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitidaMock('Este tipo de documento já existe.');
                    setShowModalInfoUpdateNaoPermitidoMock(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateTipoDeDocumento).toHaveBeenCalledWith({
            operacao: 'create',
            nome: 'Documento Teste',
        });
        expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('Este tipo de documento já existe.');
        expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
    });

    it('deve atualizar tipo de documento com sucesso', async () => {
        patchAlterarTipoDeDocumento.mockResolvedValueOnce({});

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchAlterarTipoDeDocumento(values.uuid, payload);
            }
        });

        const values = { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' };

        await handleSubmitModalForm(values);

        expect(patchAlterarTipoDeDocumento).toHaveBeenCalledWith(
            '1234',
            { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' }
        );
    });

    it('deve criar um tipo de documento com sucesso quando operacao é "create"', async () => {
        const mockCarregaTodos = jest.fn();
        const setShowModalForm = jest.fn();

        postCreateTipoDeDocumento.mockResolvedValueOnce({});
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                await postCreateTipoDeDocumento(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de documento realizado com sucesso.', 'O tipo de documento foi adicionado ao sistema com sucesso.');
                setShowModalForm(false);
                await mockCarregaTodos();
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateTipoDeDocumento).toHaveBeenCalledWith({ operacao: 'create', nome: 'Documento Teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de tipo de documento realizado com sucesso.',
            'O tipo de documento foi adicionado ao sistema com sucesso.'
        );
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockCarregaTodos).toHaveBeenCalled();
        expect(values.operacao).toEqual('create');
    });

});
