import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { DetalheDasPrestacoes } from "../index";
import { BrowserRouter } from "react-router-dom";
import * as associacaoService from "../../../../../services/escolas/Associacao.service";
import * as receitaService from "../../../../../services/escolas/Receitas.service";
import * as prestacaoService from "../../../../../services/escolas/PrestacaoDeContas.service";
import * as tabelaValoresPendentesService from "../../../../../services/escolas/TabelaValoresPendentesPorAcao.service";
import { SidebarContext } from "../../../../../context/Sidebar";
import { useParams, useLocation } from "react-router-dom";
import { conciliacaoStorageService } from "../../../../../services/storages/Conciliacao.storage.service";

jest.mock("../../../../../services/escolas/TabelaValoresPendentesPorAcao.service");
jest.mock("../../../../../services/escolas/PrestacaoDeContas.service");
jest.mock("../../../../../services/escolas/Receitas.service");
jest.mock("../../../../../services/escolas/Associacao.service");
jest.mock("../../../../../services/escolas/Despesas.service");
jest.mock("../../../../../services/storages/Conciliacao.storage.service");

jest.mock("../../../../../services/auth.service", () => ({
    ASSOCIACAO_UUID: "UUID",
}));

jest.mock("../../../../../services/SideBarLeft.service", () => ({
    SidebarLeftService: { setItemActive: jest.fn() },
}));

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: { getPermissoes: jest.fn().mockReturnValue(false) },
}));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
    useLocation: jest.fn(),
}));

jest.mock("../../../../../utils/ValidacoesAdicionaisFormularios", () => ({
    exibeDataPT_BR: (data) => data,
    trataNumericos: (v) => v,
}));

jest.mock("../../../../../utils/FormataData", () => ({
    formataData: (data) => data,
}));

jest.mock("../../../../../componentes/Globais/ReactNumberFormatInput/indexv2", () => ({
    __esModule: true,
    ReactNumberFormatInputV2: (props) => <input data-testid="number-format-v2" {...props} />,
}));

jest.mock("../../../../../componentes/Globais/ReactNumberFormatInput", () => ({
    __esModule: true,
    ReactNumberFormatInput: (props) => <input data-testid="number-format" {...props} />,
}));

const mockPeriodos = [
    {
        uuid: "periodo-1",
        referencia: "2024.1",
        data_inicio_realizacao_despesas: "2024-01-01",
        data_fim_realizacao_despesas: "2024-06-30",
    },
    {
        uuid: "periodo-2",
        referencia: "2024.2",
        data_inicio_realizacao_despesas: "2024-07-01",
        data_fim_realizacao_despesas: "2024-12-31",
    },
];

const mockContas = [
    { uuid: "conta-1", nome: "Conta Custeio", tipo_conta: { nome: "Custeio" }, solicitacao_encerramento: null },
    { uuid: "conta-2", nome: "Conta Capital", tipo_conta: { nome: "Capital" }, solicitacao_encerramento: null },
];

const mockSidebarContext = { setIrParaUrl: jest.fn() };

const renderComponent = () =>
    render(
        <SidebarContext.Provider value={mockSidebarContext}>
            <BrowserRouter>
                <DetalheDasPrestacoes />
            </BrowserRouter>
        </SidebarContext.Provider>
    );

describe("DetalheDasPrestacoes - alteração de período e conta", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        useParams.mockReturnValue({ periodo_uuid: null, conta_uuid: null });
        useLocation.mockReturnValue({ state: null });

        receitaService.getTabelasReceita.mockResolvedValue({ data: { acoes_associacao: [] } });
        associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao.mockResolvedValue(mockPeriodos);
        associacaoService.getContas.mockResolvedValue(mockContas);
        prestacaoService.getStatusPeriodoPorData.mockResolvedValue({
            prestacao_contas_status: { periodo_bloqueado: true },
        });
        prestacaoService.getObservacoes.mockResolvedValue({
            possui_solicitacao_encerramento: false,
            observacao_uuid: null,
            permite_editar_campos_extrato: false,
        });
        tabelaValoresPendentesService.tabelaValoresPendentes.mockResolvedValue({});

        conciliacaoStorageService.getPeriodoConta.mockReturnValue(null);
        conciliacaoStorageService.setPeriodoConta.mockImplementation(() => {});
    });

    const aguardaCarregamentoInicial = async (periodoSelect) => {
        await waitFor(() => expect(periodoSelect).toBeInTheDocument());
        // Aguarda o carregamento assíncrono dos períodos
        await waitFor(() =>
            expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalled()
        );
    };

    describe("ao alterar o período", () => {
        it("reseta a conta no estado (select de conta volta para vazio)", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await aguardaCarregamentoInicial(periodoSelect);

            // Aguarda pré-seleção inicial via carregaContas
            await waitFor(() => expect(contaSelect.value).toBe("conta-1"));

            // Limpa chamadas do carregamento inicial antes da interação do usuário
            conciliacaoStorageService.setPeriodoConta.mockClear();

            fireEvent.change(periodoSelect, { target: { name: "periodo", value: "periodo-2" } });

            // A conta no estado deve ser resetada imediatamente
            expect(contaSelect.value).toBe("");
        });

        it("preserva a conta no storage ao alterar o período (não apaga a conta salva)", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            await aguardaCarregamentoInicial(periodoSelect);
            await waitFor(() => expect(periodoSelect.value).toBe("periodo-1"));

            conciliacaoStorageService.setPeriodoConta.mockClear();

            fireEvent.change(periodoSelect, { target: { name: "periodo", value: "periodo-2" } });

            // Storage deve ser chamado preservando a conta armazenada
            expect(conciliacaoStorageService.setPeriodoConta).toHaveBeenCalledWith(
                expect.objectContaining({ periodo: "periodo-2", conta: "conta-1" })
            );
        });

        it("pré-seleciona a conta do storage quando ela pertence à lista do novo período", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await aguardaCarregamentoInicial(periodoSelect);
            await waitFor(() => expect(contaSelect.value).toBe("conta-1"));

            conciliacaoStorageService.setPeriodoConta.mockClear();
            // Após trocar período, o storage ainda tem conta-1 (preservada)
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-2", conta: "conta-1" });

            fireEvent.change(periodoSelect, { target: { name: "periodo", value: "periodo-2" } });

            // carregaContas encontra conta-1 na lista e pré-seleciona
            await waitFor(() => expect(contaSelect.value).toBe("conta-1"));
        });

        it("não pré-seleciona conta quando ela não existe na lista do novo período", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({
                periodo: "periodo-1",
                conta: "conta-inexistente",
            });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await aguardaCarregamentoInicial(periodoSelect);

            // carregaContas não encontra 'conta-inexistente' em mockContas → conta permanece vazia
            await waitFor(() => expect(contaSelect.value).toBe(""));
        });

        it("limpa a conta do storage quando ela não pertence à lista do novo período", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({
                periodo: "periodo-1",
                conta: "conta-inexistente",
            });

            renderComponent();

            await waitFor(() =>
                expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalled()
            );

            // carregaContas deve limpar a conta inválida do storage
            await waitFor(() =>
                expect(conciliacaoStorageService.setPeriodoConta).toHaveBeenCalledWith(
                    expect.objectContaining({ conta: "" })
                )
            );
        });
    });

    describe("ao alterar somente a conta", () => {
        it("salva período e nova conta no storage", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const contaSelect = screen.getByLabelText("Conta:");
            await waitFor(() => expect(contaSelect.value).toBe("conta-1"));

            conciliacaoStorageService.setPeriodoConta.mockClear();

            fireEvent.change(contaSelect, { target: { name: "conta", value: "conta-2" } });

            expect(conciliacaoStorageService.setPeriodoConta).toHaveBeenCalledWith(
                expect.objectContaining({ conta: "conta-2" })
            );
        });

        it("não reseta o período ao alterar somente a conta", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await waitFor(() => expect(periodoSelect.value).toBe("periodo-1"));

            fireEvent.change(contaSelect, { target: { name: "conta", value: "conta-2" } });

            // Período não deve mudar
            expect(periodoSelect.value).toBe("periodo-1");
        });

        it("o storage inclui o período atual ao salvar a nova conta", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await waitFor(() => expect(periodoSelect.value).toBe("periodo-1"));

            conciliacaoStorageService.setPeriodoConta.mockClear();

            fireEvent.change(contaSelect, { target: { name: "conta", value: "conta-2" } });

            expect(conciliacaoStorageService.setPeriodoConta).toHaveBeenCalledWith(
                expect.objectContaining({ periodo: "periodo-1", conta: "conta-2" })
            );
        });
    });

    describe("recuperação do estado salvo ao montar o componente", () => {
        it("restaura período e conta do storage na inicialização quando há dado salvo", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({ periodo: "periodo-1", conta: "conta-1" });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await waitFor(() => expect(periodoSelect.value).toBe("periodo-1"));
            await waitFor(() => expect(contaSelect.value).toBe("conta-1"));
        });

        it("inicia com selects vazios quando não há dado no storage", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue(null);

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");
            const contaSelect = screen.getByLabelText("Conta:");

            await waitFor(() =>
                expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalled()
            );

            expect(periodoSelect.value).toBe("");
            expect(contaSelect.value).toBe("");
        });

        it("ignora o período do storage se ele não existir na lista da API", async () => {
            conciliacaoStorageService.getPeriodoConta.mockReturnValue({
                periodo: "periodo-nao-existe",
                conta: "conta-1",
            });

            renderComponent();

            const periodoSelect = screen.getByLabelText("Período:");

            await waitFor(() =>
                expect(associacaoService.getPeriodosDePrestacaoDeContasDaAssociacao).toHaveBeenCalled()
            );

            // Período inválido não deve ser selecionado
            expect(periodoSelect.value).toBe("");
        });
    });
});
