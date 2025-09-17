import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TiposDeCusteio } from '../index';
import { 
    getTodosTiposDeCusteio,
    getFiltrosTiposDeCusteio,
    postCreateTipoDeCusteio,
    patchAlterarTipoDeCusteio,
    deleteTipoDeCusteio,
 } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { mockData } from '../__fixtures__/mockData';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTodosTiposDeCusteio: jest.fn(),
    postCreateTipoDeCusteio: jest.fn(),
    patchAlterarTipoDeCusteio: jest.fn(),
    deleteTipoDeCusteio: jest.fn(),
    getFiltrosTiposDeCusteio: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
  },
}));

describe("Carrega página de Tipos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getTodosTiposDeCusteio.mockResolvedValue(mockData);
    });

    it("Testa a chamada de getFiltros", async () => {
        getTodosTiposDeCusteio.mockResolvedValueOnce(mockData);
        render(<MemoryRouter><TiposDeCusteio /></MemoryRouter>);

        await waitFor(() => {

            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome).toBeInTheDocument();

            fireEvent.change(filtro_nome, { target: { value: 'Tipo 1' } });
            expect(filtro_nome.value).toBe('Tipo 1');

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getFiltrosTiposDeCusteio).toHaveBeenCalledWith('Tipo 1');
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
        getTodosTiposDeCusteio.mockResolvedValue(mockData)
        render(<MemoryRouter><TiposDeCusteio /></MemoryRouter>);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Tipo Custeio8f71/i)).toBeInTheDocument());
        const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
        expect(filtro_nome).toBeInTheDocument();

        fireEvent.change(filtro_nome, { target: { value: 'Tipo 1' } });
        expect(filtro_nome.value).toBe('Tipo 1');

        const botao_limpar = screen.getByRole('button', { name: /Limpar/i })
        expect(botao_limpar).toBeInTheDocument();
        fireEvent.click(botao_limpar);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Tipo Custeio8f71/i)).toBeInTheDocument());
        await waitFor(() => {
            const filtro_nome = screen.getByLabelText(/filtrar por nome/i)
            expect(filtro_nome.value).toBe('');
        });
    });

    it("carrega no modo Listagem com itens", async () => {
        getTodosTiposDeCusteio.mockResolvedValueOnce(mockData);
        render(<MemoryRouter><TiposDeCusteio /></MemoryRouter>);

        expect(screen.getByText(/Tipo de despesa de custeio/i)).toBeInTheDocument();

        await waitFor(()=> {
            expect(getTodosTiposDeCusteio).toHaveBeenCalledTimes(1);
            const item_tabela = screen.getByText("Tipo Custeio8f71")
            expect(item_tabela).toBeInTheDocument()
        });
    });

});

describe("Testes Operacao CREATE", ()=>{

    it("Renderiza Operacao create sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTodosTiposDeCusteio.mockResolvedValue([])
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar tipo de despesa de custeio/i });
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
        fireEvent.change(input, { target: { value: "Dado de teste" } });
        expect(input.value).toBe("Dado de teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateTipoDeCusteio).toHaveBeenCalled();
        });

    });
    
    it("Renderiza Operacao create falha non_field_errors", async () => {
        postCreateTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este tipo de despesa de custeio já existe." } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTodosTiposDeCusteio.mockResolvedValue([])

        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /Adicionar tipo de despesa de custeio/i });
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
        fireEvent.change(input, { target: { value: "Dado de teste" } });
        expect(input.value).toBe("Dado de teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateTipoDeCusteio).toHaveBeenCalled();
            const msgError = screen.getByText(/Já existe um tipo de despesa de custeio com esse nome/i);
            expect(msgError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao create falha erro response", async () => {
        postCreateTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { nome: "Campo obrigatório" } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTodosTiposDeCusteio.mockResolvedValue([])

        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar tipo de despesa de custeio/i });
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
        fireEvent.change(input, { target: { value: "Dado de teste" } });
        expect(input.value).toBe("Dado de teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateTipoDeCusteio).toHaveBeenCalled();

            const toastCustomError = screen.getByText(/Houve um erro ao tentar criar um tipo de despesa de custeio./i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });

});

describe("Testes Operacao EDIT", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getTodosTiposDeCusteio.mockResolvedValue(mockData);
    });

    it("Renderiza Operacao edit sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("Tipo Custeio8f71");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Tipo Custeio8f71 Atualizado" } });
        expect(input.value).toBe("Tipo Custeio8f71 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarTipoDeCusteio).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao edit erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este tipo de despesa de custeio já existe." } },
        });
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("Tipo Custeio8f71");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Tipo Custeio8f71 Atualizado" } });
        expect(input.value).toBe("Tipo Custeio8f71 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarTipoDeCusteio).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Já existe um tipo de despesa de custeio com esse nome/i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao edit erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const input = screen.getByLabelText("Nome *");
        expect(input).toBeInTheDocument();
        expect(input.value).toBe("Tipo Custeio8f71");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Tipo Custeio8f71 Atualizado" } });
        expect(input.value).toBe("Tipo Custeio8f71 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarTipoDeCusteio).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});

describe("Testes Operacao DELETE", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getTodosTiposDeCusteio.mockResolvedValue(mockData);
    });
    it("Renderiza Operacao delete sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Apagar" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-danger"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeCusteio).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { mensagem: "mensagem de erro" } },
        });
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Apagar" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-danger"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeCusteio).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<MemoryRouter><TiposDeCusteio/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        const botaoFormExcluir = screen.getByRole("button", { name: "Apagar" });
        expect(botaoFormExcluir).toBeInTheDocument();
        expect(botaoFormExcluir).toBeEnabled();
        fireEvent.click(botaoFormExcluir);

        const botoesExcluir = screen.getAllByRole("button", { name: "Excluir" });

        const botaoConfirmarExcluir = botoesExcluir.find(btn => btn.classList.contains("btn-danger"));
        expect(botaoConfirmarExcluir).toBeInTheDocument();
        expect(botaoConfirmarExcluir).toBeEnabled();
        fireEvent.click(botaoConfirmarExcluir);
        await waitFor(() => {
            expect(deleteTipoDeCusteio).toHaveBeenCalled();
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

    it('deve lidar com erro ao criar tipo de despesa de custeio', async () => {
        postCreateTipoDeCusteio.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postCreateTipoDeCusteio(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitidaMock('mensagem de erro');
                    setShowModalInfoUpdateNaoPermitidoMock(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Dado de teste' };

        await handleSubmitModalForm(values);

        expect(postCreateTipoDeCusteio).toHaveBeenCalledWith({
            operacao: 'create',
            nome: 'Dado de teste',
        });
        expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('mensagem de erro');
        expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
    });

    it('deve atualizar tipo de despesa de custeio com sucesso', async () => {
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchAlterarTipoDeCusteio(values.uuid, payload);
            }
        });

        const values = {...mockData[0], operacao: 'update'};

        await handleSubmitModalForm(values);

        expect(patchAlterarTipoDeCusteio).toHaveBeenCalled();
    });

    it('deve criar um tipo de despesa de custeio com sucesso quando operacao é "create"', async () => {
        const mockCarregaTodos = jest.fn();
        const setShowModalForm = jest.fn();

        postCreateTipoDeCusteio.mockResolvedValueOnce({});
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                await postCreateTipoDeCusteio(payload);
                toastCustom.ToastCustomSuccess('Inclusão de tipo de despesa de custeio realizado com sucesso.', 'O tipo de despesa de custeio foi adicionado ao sistema com sucesso.');
                setShowModalForm(false);
                await mockCarregaTodos();
            }
        });

        const values = { operacao: 'create', nome: 'Dado de teste' };

        await handleSubmitModalForm(values);

        expect(postCreateTipoDeCusteio).toHaveBeenCalledWith({ operacao: 'create', nome: 'Dado de teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de tipo de despesa de custeio realizado com sucesso.',
            'O tipo de despesa de custeio foi adicionado ao sistema com sucesso.'
        );
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockCarregaTodos).toHaveBeenCalled();
        expect(values.operacao).toEqual('create');
    });

});
