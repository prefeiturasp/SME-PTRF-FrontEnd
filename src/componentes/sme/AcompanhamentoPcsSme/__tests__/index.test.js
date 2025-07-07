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

    it("loads and displays periodos", async () => {
        const mockPeriodos = [{
            uuid: "1",
            referencia: "2023.1",
            data_inicio_realizacao_despesas: "2023-01-01",
            data_fim_realizacao_despesas: "2023-12-31"
        }];
        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue({
            cards: [],
            resumo_por_dre: [],
            status: "Ativo",
        });

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText("2023.1 - 01/01/2023 até 31/12/2023")).toBeInTheDocument();
        });
    });

    it("handles period change", async () => {
        const mockPeriodos = [{
            uuid: "1",
            referencia: "2023.1",
            data_inicio_realizacao_despesas: "2023-01-01",
            data_fim_realizacao_despesas: "2023-12-31"
        }];
        const mockItensDashboard = {
            cards: [{ quantidade_prestacoes: 10 }],
            resumo_por_dre: [],
            status: "Ativo",
        };

        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue(mockItensDashboard);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText("2023.1 - 01/01/2023 até 31/12/2023")).toBeInTheDocument();
        });

        userEvent.selectOptions(screen.getByRole("combobox"), "1");

        await waitFor(() => {
            expect(screen.getByText(/Resumo geral do período/i)).toBeInTheDocument();
        });
    });

    it("displays dashboard data correctly", async () => {
        const mockPeriodos = [{
            uuid: "1",
            referencia: "2023.1",
            data_inicio_realizacao_despesas: "2023-01-01",
            data_fim_realizacao_despesas: "2023-12-31"
        }];
        const mockItensDashboard = {
            cards: [{ quantidade_prestacoes: 10 }],
            resumo_por_dre: [],
            status: "Ativo",
        };

        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue(mockItensDashboard);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText("2023.1 - 01/01/2023 até 31/12/2023")).toBeInTheDocument();
        });

        userEvent.selectOptions(screen.getByRole("combobox"), "1");

        await waitFor(() => {
            expect(screen.getByText(/Resumo geral do período/i)).toBeInTheDocument();
            expect(screen.getByText(/10/i)).toBeInTheDocument();
        });
    });
});