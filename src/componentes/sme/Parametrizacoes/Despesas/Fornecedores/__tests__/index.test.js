import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Fornecedores } from '../index';
import {
    getFornecedores,
    getFiltrosFornecedores,
    postCreateFornecedor,
    patchAlterarFornecedor,
    deleteFornecedor
 } from "../../../../../../services/sme/Parametrizacoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { visoesService, visoesService as vs } from "../../../../../../services/visoes.service";
import { mockListaFornecedores } from '../__fixtures__/mockData';


jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getFornecedores: jest.fn(),
    postCreateFornecedor: jest.fn(),
    patchAlterarFornecedor: jest.fn(),
    deleteFornecedor: jest.fn(),
    getFiltrosFornecedores: jest.fn(),
}));

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {
      getPermissoes: jest.fn(),
      getDadosDoUsuarioLogado: jest.fn(),
      getItemUsuarioLogado: jest.fn(),
      featureFlagAtiva: jest.fn(),
    }
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

describe("Carrega página de registros", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getFornecedores.mockResolvedValue(mockListaFornecedores);
    });

    it("Testa a chamada de getFiltros", async () => {
        getFornecedores.mockResolvedValue(mockListaFornecedores);
        getFiltrosFornecedores.mockResolvedValue(mockListaFornecedores);
        render(<MemoryRouter><Fornecedores /></MemoryRouter>);

        await waitFor(() => {

            const campoCPFCNPJ = screen.getByLabelText(/filtrar por CNPJ/i)
            expect(campoCPFCNPJ).toBeInTheDocument();

            fireEvent.change(campoCPFCNPJ, { target: { value: '0123' } });
            expect(campoCPFCNPJ.value).toBe('0123');

        });
        fireEvent.click(screen.getByRole('button', { name: /filtrar/i }));
        await waitFor(() => {
            expect(getFiltrosFornecedores).toHaveBeenCalledWith("",'0123');
        });
    });

    it("Testa a chamada de limpar Filtros", async () => {
        getFornecedores.mockResolvedValue(mockListaFornecedores)
        render(<MemoryRouter><Fornecedores /></MemoryRouter>);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Fornecedor abcd-10/i)).toBeInTheDocument());
        const campoDocumento = screen.getByLabelText(/filtrar por cnpj/i)
        expect(campoDocumento).toBeInTheDocument();

        fireEvent.change(campoDocumento, { target: { value: '01234' } });
        expect(campoDocumento.value).toBe('01234');

        const botao_limpar = screen.getByRole('button', { name: /Limpar/i })
        expect(botao_limpar).toBeInTheDocument();
        fireEvent.click(botao_limpar);

        expect(screen.getByText(/Carregando.../i)).toBeInTheDocument();

        await waitFor(()=> expect(screen.getByText(/Fornecedor abcd-10/i)).toBeInTheDocument());
        await waitFor(() => {
            const campoDocumento = screen.getByLabelText(/filtrar por cnpj/i)
            expect(campoDocumento.value).toBe('');
        });
    });

    it("carrega no modo Listagem com itens", async () => {
        getFornecedores.mockResolvedValueOnce(mockListaFornecedores);
        render(<MemoryRouter><Fornecedores /></MemoryRouter>);

        expect(screen.getByText(/Fornecedores/i)).toBeInTheDocument();

        await waitFor(()=> {
            expect(getFornecedores).toHaveBeenCalledTimes(1);
            const item_tabela = screen.getByText("Fornecedor abcd-10")
            expect(item_tabela).toBeInTheDocument()
        });
    });

});

describe("Testes Permissões condicionais para DRE e SME", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Testa permissão quando a visão é DRE", async () => {
        visoesService.getItemUsuarioLogado.mockReturnValue('DRE');
        visoesService.getPermissoes.mockReturnValue(true);
        getFornecedores.mockResolvedValue([])
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const btnAdicionar = screen.getByRole('button', { name: /adicionar fornecedor/i });
            expect(btnAdicionar).toBeInTheDocument();
            expect(btnAdicionar).toBeEnabled();
        });
    });

    it("Tem permissão quando a visão é SME", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        getFornecedores.mockResolvedValue([])
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const btnAdicionar = screen.getByRole('button', { name: /adicionar fornecedor/i });
            expect(btnAdicionar).toBeInTheDocument();
            expect(btnAdicionar).toBeEnabled();
            fireEvent.click(btnAdicionar);
        });
    });

})

describe("Testes Operacao CREATE", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("Renderiza Operacao create sucesso - permissão baseada na DRE", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        getFornecedores.mockResolvedValue([])
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const btnAdicionar = screen.getByRole('button', { name: /adicionar fornecedor/i });
            expect(btnAdicionar).toBeInTheDocument();
            expect(btnAdicionar).toBeEnabled();
            fireEvent.click(btnAdicionar);
        });
    });

    it("Renderiza Operacao create falha response no campo", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        postCreateFornecedor.mockRejectedValueOnce({
            response: { data: { cpf_cnpj: ["Este fornecedor já existe."] } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getFornecedores.mockResolvedValue([])

        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const btnAdd = screen.getByRole('button', { name: /adicionar fornecedor/i });
            expect(btnAdd).toBeInTheDocument();
            expect(btnAdd).toBeEnabled();
            fireEvent.click(btnAdd);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const campoNome = screen.getByLabelText("Nome do Fornecedor *");
        expect(campoNome).toBeInTheDocument();
        expect(campoNome.value).toBe("");
        const campoDocumento = screen.getByLabelText("CPF / CNPJ *");
        expect(campoDocumento).toBeInTheDocument();
        expect(campoDocumento.value).toBe("");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();

        fireEvent.change(campoNome, { target: { value: "Dado de teste" } });
        expect(campoNome.value).toBe("Dado de teste");
        fireEvent.change(campoDocumento, { target: { value: "01234567890" } });
        expect(campoDocumento.value).toBe("012.345.678-90");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateFornecedor).toHaveBeenCalledWith({"cpf_cnpj": "012.345.678-90", "nome": "Dado de teste"});
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Erro ao criar fornecedor', 'Não foi possível criar o fornecedor'
            );
        });
    });

    it("Renderiza Operacao create falha response non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        postCreateFornecedor.mockRejectedValueOnce({
            response: { data: { non_field_errors: ["Mensagem de erro"] } },
        });
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getFornecedores.mockResolvedValue([])

        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const btnAdd = screen.getByRole('button', { name: /adicionar fornecedor/i });
            expect(btnAdd).toBeInTheDocument();
            expect(btnAdd).toBeEnabled();
            fireEvent.click(btnAdd);
        });
        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const campoNome = screen.getByLabelText("Nome do Fornecedor *");
        expect(campoNome).toBeInTheDocument();
        expect(campoNome.value).toBe("");
        const campoDocumento = screen.getByLabelText("CPF / CNPJ *");
        expect(campoDocumento).toBeInTheDocument();
        expect(campoDocumento.value).toBe("");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();

        fireEvent.change(campoNome, { target: { value: "Dado de teste" } });
        expect(campoNome.value).toBe("Dado de teste");
        fireEvent.change(campoDocumento, { target: { value: "01234567890" } });
        expect(campoDocumento.value).toBe("012.345.678-90");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(postCreateFornecedor).toHaveBeenCalledWith({"cpf_cnpj": "012.345.678-90", "nome": "Dado de teste"});
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Erro ao criar fornecedor', 'Não foi possível criar o fornecedor'
            );
        });
    });
});

describe("Testes Operacao EDIT", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getFornecedores.mockResolvedValue(mockListaFornecedores);
    });

    it("Renderiza Operacao edit sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const campoNome = screen.getByLabelText("Nome do Fornecedor *");
        expect(campoNome).toBeInTheDocument();
        expect(campoNome.value).toBe("Fornecedor abcd-10");

        const campoDoc = screen.getByLabelText("CPF / CNPJ *");
        expect(campoDoc).toBeInTheDocument();
        expect(campoDoc.value).toBe("00.000.000/0001-10");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();
        fireEvent.change(campoNome, { target: { value: "Fornecedor abcd-10 Atualizado" } });
        expect(campoNome.value).toBe("Fornecedor abcd-10 Atualizado");
        fireEvent.change(campoDoc, { target: { value: "01234567890" } });
        expect(campoDoc.value).toBe("012.345.678-90");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarFornecedor).toHaveBeenCalled();
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
                'Edição do fornecedor realizado com sucesso.', `O fornecedor foi editado no sistema com sucesso.`
            )
        });
    });

    it("Renderiza Operacao edit erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        patchAlterarFornecedor.mockRejectedValueOnce({
            response: { data: { non_field_errors: "Este fornecedor já existe." } },
        });
        getFornecedores.mockResolvedValue(mockListaFornecedores)
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const campoNome = screen.getByLabelText("Nome do Fornecedor *");
        expect(campoNome).toBeInTheDocument();
        expect(campoNome.value).toBe("Fornecedor abcd-10");

        const campoDoc = screen.getByLabelText("CPF / CNPJ *");
        expect(campoDoc).toBeInTheDocument();
        expect(campoDoc.value).toBe("00.000.000/0001-10");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();

        fireEvent.change(campoNome, { target: { value: "Fornecedor abcd-10 Atualizado" } });
        expect(campoNome.value).toBe("Fornecedor abcd-10 Atualizado");
        fireEvent.change(campoDoc, { target: { value: "01234567890" } });
        expect(campoDoc.value).toBe("012.345.678-90");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarFornecedor).toHaveBeenCalled();
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                'Erro ao editar fornecedor', `Não foi possível editar o fornecedor`
            );
        });
    });

    it("Renderiza Operacao edit erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        patchAlterarFornecedor.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();
        const campoNome = screen.getByLabelText("Nome do Fornecedor *");
        expect(campoNome).toBeInTheDocument();
        expect(campoNome.value).toBe("Fornecedor abcd-10");

        const campoDoc = screen.getByLabelText("CPF / CNPJ *");
        expect(campoDoc).toBeInTheDocument();
        expect(campoDoc.value).toBe("00.000.000/0001-10");

        const btnSalvar = screen.getByRole("button", { name: "Salvar" });
        expect(btnSalvar).toBeInTheDocument();
        expect(btnSalvar).toBeEnabled();

        fireEvent.change(campoNome, { target: { value: "Fornecedor abcd-10 Atualizado" } });
        expect(campoNome.value).toBe("Fornecedor abcd-10 Atualizado");
        fireEvent.change(campoDoc, { target: { value: "01234567890" } });
        expect(campoDoc.value).toBe("012.345.678-90");
        fireEvent.click(btnSalvar);
        await waitFor(() => {
            expect(patchAlterarFornecedor).toHaveBeenCalled();
            const toastCustomError = screen.getByText(/Houve um erro ao tentar fazer essa operação./i);
            expect(toastCustomError).toBeInTheDocument();
        });
    });
});

describe("Testes Operacao DELETE", ()=>{
    beforeEach(() => {
        jest.clearAllMocks();
        getFornecedores.mockResolvedValue(mockListaFornecedores);
    });
    it("Renderiza Operacao delete sucesso", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
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
            expect(deleteFornecedor).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro non_field_errors", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        deleteFornecedor.mockRejectedValueOnce({
            response: { data: { non_field_errors: "mensagem de erro" } },
        });
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
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
            expect(deleteFornecedor).toHaveBeenCalled();
        });
    });

    it("Renderiza Operacao delete erro response", async () => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        visoesService.getPermissoes.mockReturnValue(true);
        deleteFornecedor.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(<MemoryRouter><Fornecedores/></MemoryRouter>);

        await waitFor(()=> {
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[2].querySelector('button');
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
            expect(deleteFornecedor).toHaveBeenCalled();
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    const setErroExclusaoNaoPermitida = jest.fn();
    const setShowModalInfoNaoPermitido = jest.fn();


    it('deve lidar com erro ao criar fornecedor', async () => {
        postCreateFornecedor.mockRejectedValueOnce({
            response: { data: { non_field_errors: true } },
        });

        const handleSubmitModalFormFornecedores = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'create') {
                try {
                    await postCreateFornecedor(payload);
                } catch (e) {
                    setErroExclusaoNaoPermitida('mensagem de erro');
                    setShowModalInfoNaoPermitido(true);
                }
            }
        });

        const values = { operacao: 'create', nome: 'Dado de teste', cpf_cnpj: '01234567890' };

        await handleSubmitModalFormFornecedores(values);

        expect(postCreateFornecedor).toHaveBeenCalledWith(values);
        expect(setErroExclusaoNaoPermitida).toHaveBeenCalledWith('mensagem de erro');
        expect(setShowModalInfoNaoPermitido).toHaveBeenCalledWith(true);
    });

    it('deve atualizar fornecedor com sucesso', async () => {
        const handleSubmitModalForm = jest.fn(async (values) => {
            let payload = { ...values };
            if (values.operacao === 'update') {
                await patchAlterarFornecedor(values.uuid, payload);
            }
        });

        const values = {...mockListaFornecedores[0], operacao: 'update'};

        await handleSubmitModalForm(values);

        expect(patchAlterarFornecedor).toHaveBeenCalled();
    });

});
