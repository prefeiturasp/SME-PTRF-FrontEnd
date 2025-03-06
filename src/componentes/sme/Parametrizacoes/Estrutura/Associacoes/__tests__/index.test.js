import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from "react-router-dom";
import { Associacoes } from '..';
import {
    getTabelaAssociacoes,
    getAssociacaoPorUuid,
    getTodosPeriodos,
    getUnidadePeloCodigoEol,
    postCriarAssociacao,
    patchUpdateAssociacao,
    deleteAssociacao,
    getAcoesAssociacao,
    getContasAssociacao,
    validarDataDeEncerramento,
    getParametrizacoesAssociacoes,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {
    getTagInformacaoAssociacao
} from "../../../../../../services/escolas/Associacao.service";
import { visoesService } from "../../../../../../services/visoes.service";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import * as service from "../../../../../../services/sme/Parametrizacoes.service";
import { Filtros } from '../Filtros';
import {mockListaAssociacoes, mockTabelaAssociacoes, mockListaPeriodos, mockAssociacaoUuid, mockListaAssociacoesPaginated} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";


jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getTabelaAssociacoes: jest.fn(),
    getAssociacaoPorUuid: jest.fn(),
    getTodosPeriodos: jest.fn(),
    getUnidadePeloCodigoEol: jest.fn(),
    postCriarAssociacao: jest.fn(),
    patchUpdateAssociacao: jest.fn(),
    deleteAssociacao: jest.fn(),
    getAcoesAssociacao: jest.fn(),
    getContasAssociacao: jest.fn(),
    validarDataDeEncerramento: jest.fn(),
    getParametrizacoesAssociacoes: jest.fn(),
}));

jest.mock("../../../../../../services/escolas/Associacao.service", ()=>({
    getTagInformacaoAssociacao: jest.fn()
}));

jest.mock("../../../../../../services/visoes.service", ()=>({
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

describe("Carrega página de Associações", () => {
    beforeEach(() => {
        getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
        getParametrizacoesAssociacoes.mockReturnValue(mockListaAssociacoes)
    });

    it("carrega no modo Listagem com itens", async () => {
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Associações/i)).toHaveLength(1);

        await waitFor(()=> expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(1));
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
        getParametrizacoesAssociacoes.mockReturnValue(mockListaAssociacoes)
        getTodosPeriodos.mockReturnValue(mockListaPeriodos);
        getTagInformacaoAssociacao.mockReturnValue([
            {
                "id": "1",
                "nome": "Associação encerrada",
                "descricao": "A associação foi encerrada.",
                "key": "ENCERRADAS"
            },
            {
                "id": "2",
                "nome": "Encerramento de conta pendente",
                "descricao": "Solicitação de encerramento de conta pendente.",
                "key": "ENCERRAMENTO_CONTA_PENDENTE"
            }
        ]);
    });

    it('teste criação sucesso', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getUnidadePeloCodigoEol.mockReturnValue({tipo_unidade: "CEI", nome: "Unidade 007"});
        validarDataDeEncerramento.mockReturnValue(true);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar associação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome*");
        const input_codigo_eol = screen.getByLabelText("Código EOL*");
        const input_periodo_inicial = screen.getByLabelText("Período inicial*");
        const input_data_encerramento = screen.getByLabelText("Data de encerramento");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_codigo_eol).toBeInTheDocument();
        expect(input_codigo_eol).toBeEnabled();
        expect(input_periodo_inicial).toBeInTheDocument();
        expect(input_periodo_inicial).toBeEnabled();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_nome, { target: { value: "Associacao 007" } });
        fireEvent.change(input_codigo_eol, { target: { value: "200007" } });
        fireEvent.change(input_periodo_inicial, { target: { value: "1e8c492b-2edb-4acd-a808-71bdf0d805d5" } });

        fireEvent.click(input_data_encerramento);
        const data = screen.getByText(new Date(2025, 2, 25).getDate())
        fireEvent.click(data);

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(visoesService.getPermissoes).toHaveBeenCalledTimes(3);
            expect(postCriarAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getUnidadePeloCodigoEol.mockReturnValue({tipo_unidade: "CEI", nome: "Unidade 007"});
        validarDataDeEncerramento.mockReturnValue(true);
        visoesService.getPermissoes.mockResolvedValue(true);
        postCriarAssociacao.mockRejectedValueOnce({
                    response: { data: { nome: "Testando erro response" } },
                });
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar associação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome*");
        const input_codigo_eol = screen.getByLabelText("Código EOL*");
        const input_periodo_inicial = screen.getByLabelText("Período inicial*");
        const input_data_encerramento = screen.getByLabelText("Data de encerramento");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_codigo_eol).toBeInTheDocument();
        expect(input_codigo_eol).toBeEnabled();
        expect(input_periodo_inicial).toBeInTheDocument();
        expect(input_periodo_inicial).toBeEnabled();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.change(input_nome, { target: { value: "Associacao 007" } });
        fireEvent.change(input_codigo_eol, { target: { value: "200007" } });
        fireEvent.change(input_periodo_inicial, { target: { value: "1e8c492b-2edb-4acd-a808-71bdf0d805d5" } });

        fireEvent.click(input_data_encerramento);
        const data = screen.getAllByText(new Date().getDate())[0];
        fireEvent.click(data);

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(visoesService.getPermissoes).toHaveBeenCalledTimes(2);
            expect(postCriarAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(1);
        });
    });

    

    it('teste edição sucesso', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getUnidadePeloCodigoEol.mockReturnValue({tipo_unidade: "CEI", nome: "Unidade 007"});
        getAssociacaoPorUuid.mockReturnValue(mockAssociacaoUuid);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });
        
        await waitFor(()=> {
            const input_nome = screen.getByLabelText("Nome*");
            const input_codigo_eol = screen.getByLabelText("Código EOL*");
            const input_periodo_inicial = screen.getByLabelText("Período inicial*");
            const saveButton = screen.getByRole("button", { name: "Salvar" });
            expect(input_nome).toBeInTheDocument();
            expect(input_nome).toBeEnabled();
            expect(input_codigo_eol).toBeInTheDocument();
            expect(input_codigo_eol).not.toBeEnabled();
            expect(input_periodo_inicial).toBeInTheDocument();
            expect(input_periodo_inicial).not.toBeEnabled();

            expect(saveButton).toBeInTheDocument();
            expect(saveButton).toBeEnabled();

            fireEvent.change(input_nome, { target: { value: "Associacao 0070" } });
            fireEvent.click(saveButton);
        });

        await waitFor(()=>{
            expect(patchUpdateAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getUnidadePeloCodigoEol.mockReturnValue({tipo_unidade: "CEI", nome: "Unidade 007"});
        getAssociacaoPorUuid.mockReturnValue(mockAssociacaoUuid);
        visoesService.getPermissoes.mockResolvedValue(true);
        patchUpdateAssociacao.mockRejectedValueOnce({
            response: { data: { nome: "Testando erro response" } },
        });
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });
        
        await waitFor(()=> {
            const input_nome = screen.getByLabelText("Nome*");
            const input_codigo_eol = screen.getByLabelText("Código EOL*");
            const input_periodo_inicial = screen.getByLabelText("Período inicial*");
            const saveButton = screen.getByRole("button", { name: "Salvar" });
            expect(input_nome).toBeInTheDocument();
            expect(input_nome).toBeEnabled();
            expect(input_codigo_eol).toBeInTheDocument();
            expect(input_codigo_eol).not.toBeEnabled();
            expect(input_periodo_inicial).toBeInTheDocument();
            expect(input_periodo_inicial).not.toBeEnabled();

            expect(saveButton).toBeInTheDocument();
            expect(saveButton).toBeEnabled();

            fireEvent.change(input_nome, { target: { value: "Associacao 0070" } });
            fireEvent.click(saveButton);
        });

        await waitFor(()=>{
            expect(patchUpdateAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(1);
        });
    });


    it('teste delete sucesso', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getAssociacaoPorUuid.mockReturnValue(mockAssociacaoUuid);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
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
        await waitFor(() => {
            expect(deleteAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(2);
        });
    });

    it('teste delete erro com response data', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getAssociacaoPorUuid.mockReturnValue(mockAssociacaoUuid);
        visoesService.getPermissoes.mockResolvedValue(true);
        deleteAssociacao.mockRejectedValueOnce({
                response: { data: { mensagem: "mensagem de erro" } },
            });
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
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
        await waitFor(() => {
            expect(deleteAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste delete erro genérico', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getAssociacaoPorUuid.mockReturnValue(mockAssociacaoUuid);
        visoesService.getPermissoes.mockResolvedValue(true);
        deleteAssociacao.mockRejectedValueOnce({
                response: { mensagem: "mensagem de erro" },
            });
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=> {
            const tabela = screen.getByRole('grid');
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
        await waitFor(() => {
            expect(deleteAssociacao).toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(1);
        });
    });

    it('teste fechar modal de criação', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        getUnidadePeloCodigoEol.mockReturnValue({tipo_unidade: "CEI", nome: "Unidade 007"});
        validarDataDeEncerramento.mockReturnValue(true);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar associação" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome*");
        const input_codigo_eol = screen.getByLabelText("Código EOL*");
        const input_periodo_inicial = screen.getByLabelText("Período inicial*");
        const input_data_encerramento = screen.getByLabelText("Data de encerramento");
        const saveButton = screen.getByRole("button", { name: "Salvar" });
        const cancelarButton = screen.getByRole("button", { name: "Cancelar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_codigo_eol).toBeInTheDocument();
        expect(input_codigo_eol).toBeEnabled();
        expect(input_periodo_inicial).toBeInTheDocument();
        expect(input_periodo_inicial).toBeEnabled();

        expect(saveButton).toBeInTheDocument();
        expect(saveButton).toBeEnabled();

        fireEvent.click(cancelarButton);

        await waitFor(()=>{
            expect(visoesService.getPermissoes).toHaveBeenCalledTimes(3);
            expect(postCriarAssociacao).not.toHaveBeenCalled();
            expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(1);
        });
    });
   
});


describe('Teste handle functions', () => {
    beforeEach(() => {
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getTabelaAssociacoes.mockReturnValue(mockTabelaAssociacoes);
        getParametrizacoesAssociacoes.mockReturnValue(mockListaAssociacoes)
        getTodosPeriodos.mockReturnValue(mockListaPeriodos);
        getTagInformacaoAssociacao.mockReturnValue([
            {
                "id": "1",
                "nome": "Associação encerrada",
                "descricao": "A associação foi encerrada.",
                "key": "ENCERRADAS"
            },
            {
                "id": "2",
                "nome": "Encerramento de conta pendente",
                "descricao": "Solicitação de encerramento de conta pendente.",
                "key": "ENCERRAMENTO_CONTA_PENDENTE"
            }
        ]);
    });

    it('test onPageChange', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoesPaginated);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );
        await waitFor(()=>{
                const table = screen.getByRole("grid");
                const rowsLength = table.querySelectorAll("tbody tr").length;
                expect(rowsLength).toEqual(20);
            }
        );

        const button = screen.getByRole('button', {name: /2/i});
        fireEvent.click(button);

        await waitFor(()=>{
            expect(screen.queryByText('ASSOCIACAO DE PAIS E MESTRES DO CEI DR ANTONIO JOAO SILVA')).toBeInTheDocument();
            expect(screen.queryByText('ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA')).not.toBeInTheDocument();
            }
        );
        expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(2);
    });

    it('test envia filtros', async() => {
        const mockListaAssociacoesFiltro = {
            "links": {
                "next": "http://localhost:8000/api/parametrizacoes-associacoes/?filtro_informacoes=&nome=&page=2&page_size=20&unidade__dre__uuid=&unidade__tipo_unidade=",
                "previous": null
            },
            "count": 1,
            "page": 1,
            "page_size": 1,
            "results": [
                {
                    "uuid": "5003fbd5-fd37-40eb-8889-e40042ec7e77",
                    "nome": "ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA",
                    "cnpj": "11.267.355/0001-68",
                    "status_valores_reprogramados": "VALORES_CORRETOS",
                    "data_de_encerramento": null,
                    "tooltip_data_encerramento": null,
                    "tooltip_encerramento_conta": null,
                    "unidade": {
                        "uuid": "acf92a00-3fc7-4c41-8eab-ee54e3864052",
                        "codigo_eol": "200204",
                        "nome_com_tipo": "CECI JARAGUA",
                        "nome_dre": "DIRETORIA REGIONAL DE EDUCACAO PIRITUBA/JARAGUA"
                    },
                    "encerrada": false,
                    "informacoes": []
                }
            ]
        }
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoesFiltro);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );
        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            fireEvent.change(input, { target: { name: 'filtrar_por_associacao', value: 'ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA' } });
            expect(input.value).toEqual("ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA");
        });

        const filtrarButton = screen.getByRole('button', { name: /Filtrar/i });
        fireEvent.click(filtrarButton);

        await waitFor(()=>{
            const tabela = screen.getByRole('grid');
            const linhas = tabela.querySelectorAll('tbody tr');
            expect(linhas.length).toEqual(1);
        });

        expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(2);
    });

    it('test limpaFiltros', async() => {
        getParametrizacoesAssociacoes.mockResolvedValueOnce(mockListaAssociacoes).mockResolvedValueOnce(mockListaAssociacoes);
        visoesService.getPermissoes.mockResolvedValue(true);
        render(
            <MemoryRouter initialEntries={["/parametro-associacoes"]}>
                <Route path="/parametro-associacoes">
                    <Associacoes />
                </Route>
            </MemoryRouter>
        );
        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            fireEvent.change(input, { target: { name: 'filtrar_por_associacao', value: 'ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA' } });
            expect(input.value).toEqual("ASSOCIACAO DE PAIS E MESTRES DO CECI CEI JARAGUA");
        });

        const limparButton = screen.getByRole('button', { name: /limpar/i });
        fireEvent.click(limparButton);

        await waitFor(()=>{
            const input = screen.getByLabelText(/por associação/i);
            expect(input.value).toEqual("");
        });

        expect(getParametrizacoesAssociacoes).toHaveBeenCalledTimes(2);
    });

});
