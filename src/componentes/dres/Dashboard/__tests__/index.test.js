import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { DreDashboard } from "../index";
import { getPeriodos, getItensDashboard } from "../../../../services/dres/Dashboard.service";
import { PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO } from "../../../../services/auth.service";
import { visoesService } from "../../../../services/visoes.service";

jest.mock("../../../../services/dres/Dashboard.service", () => ({
    getPeriodos: jest.fn(),
    getItensDashboard: jest.fn(),
}));

jest.mock("../../../../services/visoes.service", () => ({
    visoesService: {
        getDadosDoUsuarioLogado: jest.fn(),
    },
}));

let mockLocationState = undefined;
let capturedNavigateProps = null;

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useLocation: () => ({ state: mockLocationState, pathname: "/" }),
    Navigate: (props) => {
        capturedNavigateProps = props;
        return <div data-testid="navigate-mock" />;
    },
}));

const periodosDuplo = [
    { uuid: "p1", referencia: "1º Período 2024", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
    { uuid: "p2", referencia: "2º Período 2024", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
];

const itensDashboardMock = {
    total_associacoes_dre: 8,
    cards: [
        { titulo: "Aguardando análise", quantidade_prestacoes: 4, quantidade_retornadas: 0, quantidade_nao_recebida: 0, status: "AGUARDANDO_ANALISE" },
    ],
};

const renderComponent = () =>
    render(
        <MemoryRouter>
            <DreDashboard />
        </MemoryRouter>
    );

describe("DreDashboard", () => {
    beforeEach(() => {
        mockLocationState = undefined;
        capturedNavigateProps = null;
        localStorage.clear();

        visoesService.getDadosDoUsuarioLogado.mockReturnValue({
            unidade_selecionada: { tipo_unidade: "DRE", uuid: "dre-uuid" },
        });
        getPeriodos.mockResolvedValue(periodosDuplo);
        getItensDashboard.mockResolvedValue(itensDashboardMock);
    });

    it("exibe o Loading enquanto os itens do dashboard do período selecionado ainda estão sendo carregados", async () => {
        getItensDashboard.mockImplementation(() => new Promise(() => {}));

        renderComponent();

        expect(await screen.findByText("Carregando...")).toBeInTheDocument();
    });

    it("quando há mais de um período, seleciona automaticamente o penúltimo e carrega os itens do dashboard", async () => {
        renderComponent();

        await waitFor(() => {
            expect(getItensDashboard).toHaveBeenCalledWith("p2");
        });

        expect(await screen.findByText("8 unidades")).toBeInTheDocument();
        expect(screen.getByText("Aguardando análise")).toBeInTheDocument();
        expect(localStorage.getItem(PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO)).toBe("p2");
    });

    it("quando há apenas um período, seleciona automaticamente esse período", async () => {
        getPeriodos.mockResolvedValue([periodosDuplo[0]]);

        renderComponent();

        await waitFor(() => {
            expect(getItensDashboard).toHaveBeenCalledWith("p1");
        });
    });

    it("quando não há períodos retornados, não seleciona nenhum e não busca itens do dashboard", async () => {
        getPeriodos.mockResolvedValue([]);

        renderComponent();

        await waitFor(() => {
            expect(getPeriodos).toHaveBeenCalled();
        });

        expect(await screen.findByLabelText("Período:")).toBeInTheDocument();
        expect(getItensDashboard).not.toHaveBeenCalled();
    });

    it("utiliza o período armazenado no localStorage quando não foi acessado pela sidebar", async () => {
        localStorage.setItem(PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO, "p1");

        renderComponent();

        await waitFor(() => {
            expect(getItensDashboard).toHaveBeenCalledWith("p1");
        });
    });

    it("ignora o período armazenado no localStorage quando acessado pela sidebar", async () => {
        localStorage.setItem(PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO, "p1");
        mockLocationState = { acessadoPelaSidebar: true };

        renderComponent();

        await waitFor(() => {
            expect(getItensDashboard).toHaveBeenCalledWith("p2");
        });
    });

    it("busca a unidade DRE selecionada ao carregar os períodos", async () => {
        renderComponent();

        await waitFor(() => {
            expect(getPeriodos).toHaveBeenCalledWith("dre-uuid");
        });
    });

    it("troca o período ao selecionar outra opção no select, atualizando o dashboard e o localStorage", async () => {
        renderComponent();
        await screen.findByText("8 unidades");

        getItensDashboard.mockResolvedValue({
            total_associacoes_dre: 3,
            cards: [],
        });

        fireEvent.change(screen.getByLabelText("Período:"), { target: { value: "p1" } });

        await waitFor(() => {
            expect(getItensDashboard).toHaveBeenCalledWith("p1");
        });

        expect(await screen.findByText("3 unidades")).toBeInTheDocument();
        expect(localStorage.getItem(PERIODO_SELECIONADO_DRE_ACOMPANHAMENTO)).toBe("p1");
    });

    it("navega para a lista de prestações com status TODOS ao clicar em 'Ver todas as prestações'", async () => {
        renderComponent();
        await screen.findByText("8 unidades");

        fireEvent.click(screen.getByText("Ver todas as prestações"));

        await waitFor(() => {
            expect(capturedNavigateProps).not.toBeNull();
        });

        expect(capturedNavigateProps.to.pathname).toBe("/dre-lista-prestacao-de-contas/p2/TODOS");
        expect(capturedNavigateProps.replace).toBe(true);
    });

    it("navega para a lista de prestações com o status do card ao clicar em 'Ver as prestações'", async () => {
        renderComponent();
        await screen.findByText("Aguardando análise");

        fireEvent.click(screen.getByText("Ver as prestações"));

        await waitFor(() => {
            expect(capturedNavigateProps).not.toBeNull();
        });

        expect(capturedNavigateProps.to.pathname).toBe("/dre-lista-prestacao-de-contas/p2/AGUARDANDO_ANALISE");
    });
});
