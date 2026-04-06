import React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardCard } from "../DashboardCard";

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({
    exibeValorFormatadoPT_BR: jest.fn((valor) => `R$ ${valor}`),
    exibeDataPT_BR: jest.fn((data) => `formatado(${data})`),
    exibeDateTimePT_BR: jest.fn((data) => `datetime(${data})`),
}));

jest.mock("../../../Globais/Mensagens/MsgImgLadoDireito", () => ({
    MsgImgLadoDireito: ({ texto }) => <div data-testid="msg-img">{texto}</div>,
}));

jest.mock("../../../../assets/img/img-404.svg", () => "img-404.svg");

const getCssDestaque = jest.fn((mb) => `pt-1 mb-${mb}`);
const getCorSaldo = jest.fn((valor) => (valor < 0 ? "texto-cor-vermelha" : "texto-cor-verde"));

const ACAO_PTRF = {
    acao_associacao_nome: "PTRF",
    saldo_reprogramado: 1000,
    repasses_no_periodo: 500,
    outras_receitas_no_periodo: 200,
    despesas_no_periodo: 100,
    saldo_atual_custeio: 800,
    saldo_atual_capital: 300,
    saldo_atual_livre: 100,
    saldo_atual_total: 1200,
};

const ACAO_NAO_PTRF = {
    acao_associacao_nome: "PDDE",
    saldo_reprogramado: 2000,
    repasses_no_periodo: 1000,
    outras_receitas_no_periodo: 0,
    despesas_no_periodo: 500,
    saldo_atual_custeio: 0,
    saldo_atual_capital: 0,
    saldo_atual_livre: 0,
    saldo_atual_total: 1500,
};

const ACOES_ASSOCIACAO = {
    info_acoes: [ACAO_PTRF],
    data_prevista_repasse: "2024-01-15",
    ultima_atualizacao: "2024-01-10T10:00:00",
};

describe("DashboardCard", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("exibe MsgImgLadoDireito quando info_acoes está vazio", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ info_acoes: [], ultima_atualizacao: null }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByTestId("msg-img")).toBeInTheDocument();
        expect(screen.getByTestId("msg-img")).toHaveTextContent(
            "Para a exibição dos dados do período atual é necessário concluir o período anterior."
        );
    });

    it("exibe MsgImgLadoDireito quando info_acoes não existe", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ ultima_atualizacao: null }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByTestId("msg-img")).toBeInTheDocument();
    });

    it("renderiza os cards de ações quando info_acoes tem itens", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByTestId("msg-img")).toBeNull();
        expect(screen.getByText("PTRF")).toBeInTheDocument();
    });

    it("renderiza o nome da ação no cabeçalho do card", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText("PTRF")).toBeInTheDocument();
    });

    it("renderiza campos de valor: saldo reprogramado, repasses, outras receitas, despesa", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Saldo reprogramado:/)).toBeInTheDocument();
        expect(screen.getByText(/Repasses no período:/)).toBeInTheDocument();
        expect(screen.getByText(/Outras receitas:/)).toBeInTheDocument();
        expect(screen.getByText(/Despesa:/)).toBeInTheDocument();
    });

    it("renderiza 'Próx. repasse a partir de:' quando ação é PTRF", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Próx. repasse a partir de:/)).toBeInTheDocument();
    });

    it("não renderiza 'Próx. repasse a partir de:' quando ação não é PTRF", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ info_acoes: [ACAO_NAO_PTRF], ultima_atualizacao: null }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/Próx. repasse a partir de:/)).toBeNull();
    });

    it("exibe data_prevista_repasse formatada quando não é 'None'", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        const { exibeDataPT_BR } = require("../../../../utils/ValidacoesAdicionaisFormularios");
        expect(exibeDataPT_BR).toHaveBeenCalledWith("2024-01-15");
    });

    it("exibe string vazia quando data_prevista_repasse é 'None'", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ ...ACOES_ASSOCIACAO, data_prevista_repasse: "None" }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        const { exibeDataPT_BR } = require("../../../../utils/ValidacoesAdicionaisFormularios");
        expect(exibeDataPT_BR).not.toHaveBeenCalledWith("None");
    });

    it("renderiza saldo custeio quando saldo_atual_custeio é truthy", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Custeio:/)).toBeInTheDocument();
    });

    it("não renderiza saldo custeio quando saldo_atual_custeio é falsy", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ info_acoes: [ACAO_NAO_PTRF], ultima_atualizacao: null }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/Custeio:/)).toBeNull();
    });

    it("renderiza saldo capital quando saldo_atual_capital é truthy", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Capital:/)).toBeInTheDocument();
    });

    it("não renderiza saldo capital quando saldo_atual_capital é falsy", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ info_acoes: [ACAO_NAO_PTRF], ultima_atualizacao: null }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/Capital:/)).toBeNull();
    });

    it("renderiza saldo livre (RLA) quando saldo_atual_livre é truthy", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/RLA:/)).toBeInTheDocument();
    });

    it("não renderiza saldo livre quando saldo_atual_livre é falsy", () => {
        render(
            <DashboardCard
                acoesAssociacao={{ info_acoes: [ACAO_NAO_PTRF], ultima_atualizacao: null }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/RLA:/)).toBeNull();
    });

    it("renderiza sempre o Total", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });

    it("renderiza a última atualização", () => {
        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        const { exibeDateTimePT_BR } = require("../../../../utils/ValidacoesAdicionaisFormularios");
        expect(exibeDateTimePT_BR).toHaveBeenCalledWith("2024-01-10T10:00:00");
        expect(screen.getByText(/Última atualização:/)).toBeInTheDocument();
    });

    it("renderiza múltiplos cards quando há várias ações", () => {
        const acoes = {
            info_acoes: [ACAO_PTRF, ACAO_NAO_PTRF],
            ultima_atualizacao: null,
            data_prevista_repasse: "2024-01-15",
        };

        render(
            <DashboardCard
                acoesAssociacao={acoes}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText("PTRF")).toBeInTheDocument();
        expect(screen.getByText("PDDE")).toBeInTheDocument();
    });

    it("chama getCssDestaque com statusPeriodoAssociacao para Outras receitas e Despesa", () => {
        const statusMock = { aceita_alteracoes: true };

        render(
            <DashboardCard
                acoesAssociacao={ACOES_ASSOCIACAO}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={statusMock}
            />
        );

        expect(getCssDestaque).toHaveBeenCalledWith(4, statusMock);
        expect(getCssDestaque).toHaveBeenCalledWith(0, statusMock);
    });
});
