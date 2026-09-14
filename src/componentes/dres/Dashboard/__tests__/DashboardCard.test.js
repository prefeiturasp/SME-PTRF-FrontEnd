import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DashboardCard } from "../DashboardCard";

const buildCard = (overrides = {}) => ({
    titulo: "Aguardando análise",
    quantidade_prestacoes: 3,
    quantidade_retornadas: 0,
    quantidade_nao_recebida: 0,
    status: "AGUARDANDO_ANALISE",
    ...overrides,
});

describe("DashboardCard", () => {
    it("não renderiza nenhum card quando itensDashboard é falso", () => {
        const { container } = render(
            <DashboardCard itensDashboard={false} handleClickVerPrestacaoes={jest.fn()} />
        );

        expect(container.querySelectorAll(".card").length).toBe(0);
    });

    it("não renderiza nenhum card quando não há a chave cards", () => {
        const { container } = render(
            <DashboardCard itensDashboard={{}} handleClickVerPrestacaoes={jest.fn()} />
        );

        expect(container.querySelectorAll(".card").length).toBe(0);
    });

    it("não renderiza nenhum card quando a lista de cards está vazia", () => {
        const { container } = render(
            <DashboardCard itensDashboard={{ cards: [] }} handleClickVerPrestacaoes={jest.fn()} />
        );

        expect(container.querySelectorAll(".card").length).toBe(0);
    });

    it("renderiza os cards com título e quantidade de prestações", () => {
        render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard({ titulo: "Aguardando análise", quantidade_prestacoes: 5 })] }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        expect(screen.getByText("Aguardando análise")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("exibe o ícone de aviso com o tooltip no plural quando há mais de uma prestação retornada", () => {
        const { container } = render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard({ quantidade_retornadas: 3 })] }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        const span = container.querySelector('[data-tooltip-id="tooltip-card-0"]');
        expect(span).toBeInTheDocument();
        expect(span.getAttribute("data-tooltip-html")).toContain("Existem 3 prestações");
    });

    it("exibe o tooltip no singular quando há apenas uma prestação retornada", () => {
        const { container } = render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard({ quantidade_retornadas: 1 })] }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        const span = container.querySelector('[data-tooltip-id="tooltip-card-0"]');
        expect(span.getAttribute("data-tooltip-html")).toContain("Existe 1 prestação");
    });

    it("exibe o tooltip no plural quando há mais de uma prestação não recebida", () => {
        const { container } = render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard({ quantidade_nao_recebida: 2 })] }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        const span = container.querySelector('[data-tooltip-id="tooltip-card-0"]');
        expect(span.getAttribute("data-tooltip-html")).toContain("2 novas prestações não recebidas");
    });

    it("exibe o tooltip no singular quando há apenas uma prestação não recebida", () => {
        const { container } = render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard({ quantidade_nao_recebida: 1 })] }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        const span = container.querySelector('[data-tooltip-id="tooltip-card-0"]');
        expect(span.getAttribute("data-tooltip-html")).toContain("1 nova prestação não recebida");
    });

    it("não exibe nenhum ícone de aviso quando não há retornadas nem não recebidas", () => {
        const { container } = render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard()] }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        expect(container.querySelector('[data-tooltip-id="tooltip-card-0"]')).not.toBeInTheDocument();
    });

    it("chama handleClickVerPrestacaoes com o status do card ao clicar no botão", () => {
        const handleClickVerPrestacaoes = jest.fn();

        render(
            <DashboardCard
                itensDashboard={{ cards: [buildCard({ status: "DEVOLVIDA" })] }}
                handleClickVerPrestacaoes={handleClickVerPrestacaoes}
            />
        );

        fireEvent.click(screen.getByText("Ver as prestações"));

        expect(handleClickVerPrestacaoes).toHaveBeenCalledWith("DEVOLVIDA");
    });

    it("renderiza múltiplos cards", () => {
        render(
            <DashboardCard
                itensDashboard={{
                    cards: [
                        buildCard({ titulo: "Card A" }),
                        buildCard({ titulo: "Card B" }),
                    ],
                }}
                handleClickVerPrestacaoes={jest.fn()}
            />
        );

        expect(screen.getByText("Card A")).toBeInTheDocument();
        expect(screen.getByText("Card B")).toBeInTheDocument();
    });
});
