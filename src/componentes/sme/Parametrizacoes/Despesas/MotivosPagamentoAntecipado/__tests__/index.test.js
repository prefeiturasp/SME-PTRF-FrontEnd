import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MotivosPagamentoAntecipado } from '..';
import { getTodosMotivosPagamentoAntecipado } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { 
    postCreateMotivoPagamentoAntecipado,
    patchAlterarMotivoPagamentoAntecipado,
    deleteMotivoPagamentoAntecipado,
    getFiltrosMotivosPagamentoAntecipado
    } from '../../../../../../services/sme/Parametrizacoes.service';
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockData } from '../__fixtures__/mockData';
import { Filtros } from '../../MotivosPagamentoAntecipado/Filtros';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTodosMotivosPagamentoAntecipado: jest.fn(),
    postCreateMotivoPagamentoAntecipado: jest.fn(),
    patchAlterarMotivoPagamentoAntecipado: jest.fn(),
    deleteMotivoPagamentoAntecipado: jest.fn(),
    getFiltrosMotivosPagamentoAntecipado: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
      ToastCustomSuccess: jest.fn(),
    },
}));

describe("Carrega página de Motivos de pagamento antecipado", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<MotivosPagamentoAntecipado />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("carrega no modo Listagem vazia", async () => {
        getTodosMotivosPagamentoAntecipado.mockResolvedValue([])
        render(
            <MotivosPagamentoAntecipado />
        );

        await waitFor(()=> expect(getTodosMotivosPagamentoAntecipado).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Não existem motivos de pagamento antecipado cadastrados, clique no botão "Adicionar motivo de pagamento antecipado" para começar./i)).toBeInTheDocument()
        });
    });
});


describe('Teste handleSubmitModalForm', () => {
    let carregaTodosMock;
    let setShowModalFormMock;
    let setErroExclusaoNaoPermitidaMock;
    let setShowModalInfoUpdateNaoPermitidoMock;

    beforeEach(() => {
        carregaTodosMock = jest.fn();
        setShowModalFormMock = jest.fn();
        setErroExclusaoNaoPermitidaMock = jest.fn();
        setShowModalInfoUpdateNaoPermitidoMock = jest.fn();
    });

    it('deve lidar com erro ao criar motivo de pagamento antecipado', async () => {
        postCreateMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postCreateMotivoPagamentoAntecipado(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitidaMock('Este motivo de pagamento antecipado já existe.');
                    setShowModalInfoUpdateNaoPermitidoMock(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateMotivoPagamentoAntecipado).toHaveBeenCalledWith({
            operacao: 'create',
            nome: 'Documento Teste',
        });
        expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('Este motivo de pagamento antecipado já existe.');
        expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
    });

    it('deve atualizar motivo de pagamento antecipado com sucesso', async () => {
        patchAlterarMotivoPagamentoAntecipado.mockResolvedValueOnce({});

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchAlterarMotivoPagamentoAntecipado(values.uuid, payload);
            }
        });

        const values = { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' };

        await handleSubmitModalForm(values);

        expect(patchAlterarMotivoPagamentoAntecipado).toHaveBeenCalledWith(
            '1234',
            { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' }
        );
    });

    it('deve criar um motivo de pagamento antecipado com sucesso quando operacao é "create"', async () => {
        const mockCarregaTodos = jest.fn();
        const setShowModalForm = jest.fn();

        postCreateMotivoPagamentoAntecipado.mockResolvedValueOnce({});
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                await postCreateMotivoPagamentoAntecipado(payload);
                toastCustom.ToastCustomSuccess('Inclusão de motivo de pagamento antecipado realizado com sucesso.', 'O motivo de pagamento antecipado foi adicionado ao sistema com sucesso.');
                setShowModalForm(false);
                await mockCarregaTodos();
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateMotivoPagamentoAntecipado).toHaveBeenCalledWith({ operacao: 'create', nome: 'Documento Teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de motivo de pagamento antecipado realizado com sucesso.',
            'O motivo de pagamento antecipado foi adicionado ao sistema com sucesso.'
        );
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockCarregaTodos).toHaveBeenCalled();
        expect(values.operacao).toEqual('create');
    });

    it('deve lidar com erro de "non_field_errors" no create', async () => {
        postCreateMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const setErroExclusaoNaoPermitida = jest.fn();
        const setShowModalInfoUpdateNaoPermitido = jest.fn();

        const handleSubmitModalForm = jest.fn(async (values) => {
            try {
                await postCreateMotivoPagamentoAntecipado(values);
            } catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Este motivo de pagamento antecipado já existe.');
                    setShowModalInfoUpdateNaoPermitido(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);
        expect(setErroExclusaoNaoPermitida).toHaveBeenCalledWith('Este motivo de pagamento antecipado já existe.');
        expect(setShowModalInfoUpdateNaoPermitido).toHaveBeenCalledWith(true);
    });
});

describe("Testes Operacao CREATE Motivo de pagamento antecipado", ()=>{

    it("Renderiza Operacao create sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar motivo de pagamento antecipado/i });
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
        fireEvent.change(input, { target: { value: "Motivo Teste" } });
        expect(input.value).toBe("Motivo Teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateMotivoPagamentoAntecipado).toHaveBeenCalled();
        });

    });
    it("Renderiza Operacao create falha non_field_errors", async () => {
        postCreateMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este motivo de pagamento antecipado já existe." } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar motivo de pagamento antecipado/i });
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
            expect(postCreateMotivoPagamentoAntecipado).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Este motivo de pagamento antecipado já existe./i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });
    it("Renderiza Operacao create falha erro response", async () => {
        postCreateMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { nome: "Campo obrigatório" } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /adicionar motivo de pagamento antecipado/i });
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
        fireEvent.change(input, { target: { value: "Motivo Teste" } });
        expect(input.value).toBe("Motivo Teste");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateMotivoPagamentoAntecipado).toHaveBeenCalled();

            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });

});

describe("Testes Operacao EDIT Motivo de pagamento antecipado", ()=>{

    it("Renderiza Operacao edit sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTodosMotivosPagamentoAntecipado.mockResolvedValueOnce(mockData);
        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
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
        expect(input.value).toBe("Motivo 1");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Motivo 1 Atualizado" } });
        expect(input.value).toBe("Motivo 1 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarMotivoPagamentoAntecipado).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao edit erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este motivo de pagamento antecipado já existe." } },
        });
        getTodosMotivosPagamentoAntecipado.mockResolvedValueOnce(mockData);
        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
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
        expect(input.value).toBe("Motivo 1");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Motivo 1 Atualizado" } });
        expect(input.value).toBe("Motivo 1 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarMotivoPagamentoAntecipado).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Este motivo de pagamento antecipado já existe./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao edit erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        getTodosMotivosPagamentoAntecipado.mockResolvedValueOnce(mockData);
        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
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
        expect(input.value).toBe("Motivo 1");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(input, { target: { value: "Motivo 1 Atualizado" } });
        expect(input.value).toBe("Motivo 1 Atualizado");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarMotivoPagamentoAntecipado).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});

describe("Testes Operacao DELETE Motivo de pagamento antecipado", ()=>{

    it("Renderiza Operacao delete sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTodosMotivosPagamentoAntecipado.mockResolvedValueOnce(mockData);
        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
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
            expect(deleteMotivoPagamentoAntecipado).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { mensagem: "mensagem de erro" } },
        });
        getTodosMotivosPagamentoAntecipado.mockResolvedValueOnce(mockData);
        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
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
            expect(deleteMotivoPagamentoAntecipado).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/mensagem de erro/i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao delete erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteMotivoPagamentoAntecipado.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        getTodosMotivosPagamentoAntecipado.mockResolvedValueOnce(mockData);
        render(<MotivosPagamentoAntecipado/>);

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[1].querySelector('button');
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
            expect(deleteMotivoPagamentoAntecipado).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});
