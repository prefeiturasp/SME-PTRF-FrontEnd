import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ParametrizacoesMotivosDeEstorno } from '..';
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { 
    postCreateMotivoEstorno,
    patchAlterarMotivoEstorno,
    deleteMotivoEstorno,
    getMotivosEstorno
    } from '../../../../../../services/sme/Parametrizacoes.service';
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import { mockData } from '../__fixtures__/mockData';
import { Filtros } from '../Filtros';

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getMotivosEstorno: jest.fn(),
    postCreateMotivoEstorno: jest.fn(),
    patchAlterarMotivoEstorno: jest.fn(),
    deleteMotivoEstorno: jest.fn(),
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {
      ToastCustomSuccess: jest.fn(),
    },
}));

describe("Carrega página de Motivos de estorno", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Renderiza a mensagem "Carregando..." ao abrir a página', () => {
        render(<ParametrizacoesMotivosDeEstorno />);
        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();
    });

    it("carrega no modo Listagem vazia", async () => {
        getMotivosEstorno.mockResolvedValue([])
        render(
            <ParametrizacoesMotivosDeEstorno />
        );

        await waitFor(()=> expect(getMotivosEstorno).toHaveBeenCalled());
        await waitFor(()=> {
            expect(screen.getByText(/Nenhum resultado encontrado./i)).toBeInTheDocument()
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

    it('deve lidar com erro ao criar motivo de estorno', async () => {
        postCreateMotivoEstorno.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postCreateMotivoEstorno(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitidaMock('Já existe um motivo de estorno com esse nome');
                    setShowModalInfoUpdateNaoPermitidoMock(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateMotivoEstorno).toHaveBeenCalledWith({
            operacao: 'create',
            nome: 'Documento Teste',
        });
        expect(setErroExclusaoNaoPermitidaMock).toHaveBeenCalledWith('Já existe um motivo de estorno com esse nome');
        expect(setShowModalInfoUpdateNaoPermitidoMock).toHaveBeenCalledWith(true);
    });

    it('deve atualizar motivo de estorno com sucesso', async () => {
        patchAlterarMotivoEstorno.mockResolvedValueOnce({});

        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchAlterarMotivoEstorno(values.uuid, payload);
            }
        });

        const values = { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' };

        await handleSubmitModalForm(values);

        expect(patchAlterarMotivoEstorno).toHaveBeenCalledWith(
            '1234',
            { operacao: 'update', uuid: '1234', nome: 'Documento Atualizado' }
        );
    });

    it('deve criar um motivo de estorno com sucesso quando operacao é "create"', async () => {
        const mockCarregaTodos = jest.fn();
        const setShowModalForm = jest.fn();

        postCreateMotivoEstorno.mockResolvedValueOnce({});
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                await postCreateMotivoEstorno(payload);
                toastCustom.ToastCustomSuccess('Inclusão de motivo de estorno realizado com sucesso.', 'O motivo de estorno foi adicionado ao sistema com sucesso.');
                setShowModalForm(false);
                await mockCarregaTodos();
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);

        expect(postCreateMotivoEstorno).toHaveBeenCalledWith({ operacao: 'create', nome: 'Documento Teste' });
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
            'Inclusão de motivo de estorno realizado com sucesso.',
            'O motivo de estorno foi adicionado ao sistema com sucesso.'
        );
        expect(setShowModalForm).toHaveBeenCalledWith(false);
        expect(mockCarregaTodos).toHaveBeenCalled();
        expect(values.operacao).toEqual('create');
    });

    it('deve lidar com erro de "non_field_errors" no create', async () => {
        postCreateMotivoEstorno.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const setErroExclusaoNaoPermitida = jest.fn();
        const setShowModalInfoUpdateNaoPermitido = jest.fn();

        const handleSubmitModalForm = jest.fn(async (values) => {
            try {
                await postCreateMotivoEstorno(values);
            } catch (e) {
                if (e.response.data && e.response.data.non_field_errors) {
                    setErroExclusaoNaoPermitida('Já existe um motivo de estorno com esse nome');
                    setShowModalInfoUpdateNaoPermitido(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Documento Teste' };

        await handleSubmitModalForm(values);
        expect(setErroExclusaoNaoPermitida).toHaveBeenCalledWith('Já existe um motivo de estorno com esse nome');
        expect(setShowModalInfoUpdateNaoPermitido).toHaveBeenCalledWith(true);
    });
});

describe("Testes Operacao CREATE Motivo de estorno", ()=>{

    it("Renderiza Operacao create sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<ParametrizacoesMotivosDeEstorno/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /Adicionar motivo de estorno/i });
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
            expect(postCreateMotivoEstorno).toHaveBeenCalled();
        });

    });
    it("Renderiza Operacao create falha non_field_errors", async () => {
        postCreateMotivoEstorno.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um motivo de estorno com esse nome" } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<ParametrizacoesMotivosDeEstorno/>);

        await waitFor(()=> {
            const button = screen.getByRole('button', { name: /Adicionar motivo de estorno/i });
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
            expect(postCreateMotivoEstorno).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Já existe um motivo de estorno com esse nome/i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });
    it("Renderiza Operacao create falha erro response", async () => {
        postCreateMotivoEstorno.mockRejectedValueOnce({
            response: { data: { nome: "Campo obrigatório" } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

        render(<ParametrizacoesMotivosDeEstorno/>);

        await waitFor(()=> {
            const button = screen.getByText(/Adicionar motivo de estorno/i);
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
            expect(postCreateMotivoEstorno).toHaveBeenCalled();

            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });

    });

});

describe("Testes Operacao EDIT Motivo de estorno", ()=>{

    it("Renderiza Operacao edit sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getMotivosEstorno.mockResolvedValueOnce(mockData);
        render(<ParametrizacoesMotivosDeEstorno/>);

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
            expect(patchAlterarMotivoEstorno).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao edit erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarMotivoEstorno.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Já existe um motivo de estorno com esse nome" } },
        });
        getMotivosEstorno.mockResolvedValueOnce(mockData);
        render(<ParametrizacoesMotivosDeEstorno/>);

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
            expect(patchAlterarMotivoEstorno).toHaveBeenCalled();
            const toastCustomError = screen.getByText("Já existe um motivo de estorno com esse nome");
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao edit erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        patchAlterarMotivoEstorno.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        getMotivosEstorno.mockResolvedValueOnce(mockData);
        render(<ParametrizacoesMotivosDeEstorno/>);

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
            expect(patchAlterarMotivoEstorno).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});

describe("Testes Operacao DELETE Motivo de estorno", ()=>{

    it("Renderiza Operacao delete sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getMotivosEstorno.mockResolvedValueOnce(mockData);
        render(<ParametrizacoesMotivosDeEstorno/>);

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
            expect(deleteMotivoEstorno).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteMotivoEstorno.mockRejectedValueOnce({
            response: { data: { mensagem: "mensagem de erro" } },
        });
        getMotivosEstorno.mockResolvedValueOnce(mockData);
        render(<ParametrizacoesMotivosDeEstorno/>);

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
            expect(deleteMotivoEstorno).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/mensagem de erro/i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });

    it("Renderiza Operacao delete erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        deleteMotivoEstorno.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        getMotivosEstorno.mockResolvedValueOnce(mockData);
        render(<ParametrizacoesMotivosDeEstorno/>);

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
            expect(deleteMotivoEstorno).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa atualização./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});
