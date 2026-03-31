import React from "react";
import { render, screen } from "@testing-library/react";
import { BarraDeStatusPeriodoAssociacao } from "../BarraDeStatusPeriodoAssociacao";

describe("BarraDeStatusPeriodoAssociacao", () => {
    it("não renderiza nada quando statusPeriodoAssociacao é false", () => {
        const { container } = render(
            <BarraDeStatusPeriodoAssociacao statusPeriodoAssociacao={false} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("não renderiza nada quando statusPeriodoAssociacao é null", () => {
        const { container } = render(
            <BarraDeStatusPeriodoAssociacao statusPeriodoAssociacao={null} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("não renderiza nada quando statusPeriodoAssociacao é objeto vazio", () => {
        const { container } = render(
            <BarraDeStatusPeriodoAssociacao statusPeriodoAssociacao={{}} />
        );
        expect(container.firstChild).toBeNull();
    });

    it("renderiza a barra com texto e cor quando statusPeriodoAssociacao é válido", () => {
        const status = {
            prestacao_contas_status: {
                texto_status: "Em apresentação",
                legenda_cor: "azul",
            },
        };

        const { container } = render(
            <BarraDeStatusPeriodoAssociacao statusPeriodoAssociacao={status} />
        );

        expect(screen.getByText("Em apresentação")).toBeInTheDocument();
        expect(container.firstChild).toHaveClass("barra-status-legenda-cor-azul");
    });

    it("renderiza texto vazio quando texto_status não está definido", () => {
        const status = {
            prestacao_contas_status: {
                texto_status: null,
                legenda_cor: "verde",
            },
        };

        const { container } = render(
            <BarraDeStatusPeriodoAssociacao statusPeriodoAssociacao={status} />
        );

        expect(container.firstChild).toHaveClass("barra-status-legenda-cor-verde");
        expect(container.querySelector("p")).toHaveTextContent("");
    });

    it("usa string vazia para legenda_cor quando não definida", () => {
        const status = {
            prestacao_contas_status: {
                texto_status: "Algum status",
                legenda_cor: null,
            },
        };

        const { container } = render(
            <BarraDeStatusPeriodoAssociacao statusPeriodoAssociacao={status} />
        );

        expect(container.firstChild).toHaveClass("barra-status-legenda-cor-");
        expect(screen.getByText("Algum status")).toBeInTheDocument();
    });
});
