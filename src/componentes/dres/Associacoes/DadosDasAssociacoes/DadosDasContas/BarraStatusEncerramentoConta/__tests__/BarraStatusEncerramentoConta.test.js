import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BarraStatusEncerramentoConta } from "../index";

describe("BarraStatusEncerramentoConta", () => {
    it("não exibe texto/classe quando conta é undefined", () => {
        const { container } = render(<BarraStatusEncerramentoConta conta={undefined} />);

        expect(
            screen.queryByText("Solicitação de encerramento da conta negada.")
        ).not.toBeInTheDocument();

        const divCol = container.querySelector(".col-12");
        expect(divCol).not.toHaveClass("barra-status-encerramento-conta-rejeitada");
    });

    it("não exibe texto/classe quando conta não possui solicitacao_encerramento", () => {
        const conta = { nome: "Conta sem solicitação" };
        const { container } = render(<BarraStatusEncerramentoConta conta={conta} />);

        expect(
            screen.queryByText("Solicitação de encerramento da conta negada.")
        ).not.toBeInTheDocument();

        const divCol = container.querySelector(".col-12");
        expect(divCol).not.toHaveClass("barra-status-encerramento-conta-rejeitada");
    });

    it("não exibe texto/classe quando status é APROVADA", () => {
        const conta = { solicitacao_encerramento: { status: "APROVADA" } };
        const { container } = render(<BarraStatusEncerramentoConta conta={conta} />);

        expect(
            screen.queryByText("Solicitação de encerramento da conta negada.")
        ).not.toBeInTheDocument();

        const divCol = container.querySelector(".col-12");
        expect(divCol).not.toHaveClass("barra-status-encerramento-conta-rejeitada");
    });

    it("não exibe texto/classe quando status é um valor diferente de APROVADA/REJEITADA", () => {
        const conta = { solicitacao_encerramento: { status: "PENDENTE" } };
        const { container } = render(<BarraStatusEncerramentoConta conta={conta} />);

        expect(
            screen.queryByText("Solicitação de encerramento da conta negada.")
        ).not.toBeInTheDocument();

        const divCol = container.querySelector(".col-12");
        expect(divCol).not.toHaveClass("barra-status-encerramento-conta-rejeitada");
    });

    it("exibe texto e classe quando status é REJEITADA", () => {
        const conta = { solicitacao_encerramento: { status: "REJEITADA" } };
        const { container } = render(<BarraStatusEncerramentoConta conta={conta} />);

        expect(
            screen.getByText("Solicitação de encerramento da conta negada.")
        ).toBeInTheDocument();

        const divCol = container.querySelector(".col-12");
        expect(divCol).toHaveClass("barra-status-encerramento-conta-rejeitada");

        const icone = container.querySelector("svg");
        expect(icone).toHaveClass("icone-barra-encerramento-conta-rejeitada");
    });
});
