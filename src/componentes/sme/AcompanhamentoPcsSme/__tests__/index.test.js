import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AcompanhamentoPcsSme } from "../index";
import * as DashboardSmeService from "../../../../services/sme/DashboardSme.service";

jest.mock("../../../../services/sme/DashboardSme.service");
jest.mock("../../../../utils/Loading", () => () => <div>Loading...</div>);

describe("AcompanhamentoPcsSme Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state initially", async () => {
        DashboardSmeService.getPeriodos.mockResolvedValue([]);
        render(<AcompanhamentoPcsSme />);
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("loads and displays periodos", async () => {
        const mockPeriodos = [{ uuid: "1", nome: "Periodo 1" }];
        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText((content) => content.includes("Periodo 1"))).toBeInTheDocument();
        });
    });

    it("handles period change", async () => {
        const mockPeriodos = [{ uuid: "1", nome: "Periodo 1" }];
        const mockItensDashboard = {
            cards: [{ quantidade_prestacoes: 10 }],
            resumo_por_dre: [],
            status: "Ativo",
        };

        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue(mockItensDashboard);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText((content) => content.includes("Periodo 1"))).toBeInTheDocument();
        });

        userEvent.selectOptions(screen.getByRole("combobox"), "1");

        await waitFor(() => {
            expect(screen.getByText(/Resumo geral do período/i)).toBeInTheDocument();
        });
    });

    it("displays dashboard data correctly", async () => {
        const mockPeriodos = [{ uuid: "1", nome: "Periodo 1" }];
        const mockItensDashboard = {
            cards: [{ quantidade_prestacoes: 10 }],
            resumo_por_dre: [],
            status: "Ativo",
        };

        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue(mockItensDashboard);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText((content) => content.includes("Periodo 1"))).toBeInTheDocument();
        });

        userEvent.selectOptions(screen.getByRole("combobox"), "1");

        await waitFor(() => {
            expect(screen.getByText(/Resumo geral do período/i)).toBeInTheDocument();
            expect(screen.getByText(/10/i)).toBeInTheDocument();
        });
    });
});