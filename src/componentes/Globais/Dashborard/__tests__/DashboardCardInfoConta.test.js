import React from "react";
import { render, screen } from "@testing-library/react";
import { DashboardCardInfoConta } from "../DashboardCardInfoConta";

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({
    exibeValorFormatadoPT_BR: jest.fn((valor) => `R$ ${valor}`),
}));

const getCssDestaque = jest.fn((mb) => `pt-1 mb-${mb}`);
const getCorSaldo = jest.fn((valor) => (valor < 0 ? "texto-cor-vermelha" : "texto-cor-verde"));

const INFO_CONTA_COMPLETA = {
    conta_associacao_nome: "Custeio",
    saldo_reprogramado: 1000,
    repasses_no_periodo: 2000,
    outras_receitas_no_periodo: 500,
    despesas_no_periodo: 300,
    saldo_atual_custeio: 800,
    saldo_atual_capital: 400,
    saldo_atual_livre: 200,
    saldo_atual_total: 1400,
};

describe("DashboardCardInfoConta", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não renderiza nada quando info_conta não existe", () => {
        const { container } = render(
            <DashboardCardInfoConta
                acoesAssociacao={{}}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(container.querySelector("h1")).toBeNull();
    });

    it("renderiza o título com o nome da conta", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText("Conta Custeio")).toBeInTheDocument();
    });

    it("renderiza 'Resumo geral da conta' no cabeçalho", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText("Resumo geral da conta")).toBeInTheDocument();
    });

    it("renderiza saldo reprogramado, repasses, outras receitas e despesas", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
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

    it("renderiza saldo custeio quando saldo_atual_custeio é truthy", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Custeio:/)).toBeInTheDocument();
    });

    it("não renderiza saldo custeio quando saldo_atual_custeio é falsy", () => {
        const info = { ...INFO_CONTA_COMPLETA, saldo_atual_custeio: 0 };

        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: info }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/Custeio:/)).toBeNull();
    });

    it("renderiza saldo capital quando saldo_atual_capital é truthy", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/Capital:/)).toBeInTheDocument();
    });

    it("não renderiza saldo capital quando saldo_atual_capital é falsy", () => {
        const info = { ...INFO_CONTA_COMPLETA, saldo_atual_capital: 0 };

        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: info }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/Capital:/)).toBeNull();
    });

    it("renderiza saldo livre (RLA) quando saldo_atual_livre é truthy", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText(/RLA:/)).toBeInTheDocument();
    });

    it("não renderiza saldo livre quando saldo_atual_livre é falsy", () => {
        const info = { ...INFO_CONTA_COMPLETA, saldo_atual_livre: 0 };

        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: info }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.queryByText(/RLA:/)).toBeNull();
    });

    it("renderiza sempre o Total", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(screen.getByText("Total:")).toBeInTheDocument();
    });

    it("chama getCssDestaque com statusPeriodoAssociacao para Outras receitas e Despesa", () => {
        const statusMock = { aceita_alteracoes: true };

        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={statusMock}
            />
        );

        expect(getCssDestaque).toHaveBeenCalledWith(2, statusMock);
        expect(getCssDestaque).toHaveBeenCalledWith(0, statusMock);
    });

    it("chama getCorSaldo com os valores de saldo para aplicar a classe correta", () => {
        render(
            <DashboardCardInfoConta
                acoesAssociacao={{ info_conta: INFO_CONTA_COMPLETA }}
                getCorSaldo={getCorSaldo}
                getCssDestaque={getCssDestaque}
                statusPeriodoAssociacao={false}
            />
        );

        expect(getCorSaldo).toHaveBeenCalledWith(INFO_CONTA_COMPLETA.saldo_atual_custeio);
        expect(getCorSaldo).toHaveBeenCalledWith(INFO_CONTA_COMPLETA.saldo_atual_capital);
        expect(getCorSaldo).toHaveBeenCalledWith(INFO_CONTA_COMPLETA.saldo_atual_livre);
        expect(getCorSaldo).toHaveBeenCalledWith(INFO_CONTA_COMPLETA.saldo_atual_total);
    });
});
