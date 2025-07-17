import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AcompanhamentoPcsSme } from "../index";
import * as DashboardSmeService from "../../../../services/sme/DashboardSme.service";

jest.mock("../../../../services/sme/DashboardSme.service");
jest.mock("../../../../utils/Loading", () => () => <div>Loading...</div>);

const mockPeriodos = [
    {
        uuid: "uuid1",
        nome: "Período 1",
        data_fim_realizacao_despesas: "2023-12-31",
        data_inicio_realizacao_despesas: "2023-01-01",
        referencia: "2023"
    }
];
const exibeOpcao = `2023 - 01/01/2023 até 31/12/2023`

const mockItensDashboard = {
  cards: [
    { quantidade_prestacoes: 42 },
    { nome: "Item 1" },
    { nome: "Item 2" },
  ],
  status: { cor_idx: 1, status_txt: "Ativo" },
  resumo_por_dre: [{ dre: "DRE 1" }]
};

describe("AcompanhamentoPcsSme Component", () => {
    beforeEach(() => {
        jest.spyOn(DashboardSmeService, "getPeriodos").mockResolvedValue(mockPeriodos);
        jest.spyOn(DashboardSmeService, "getItensDashboardSme").mockResolvedValue(mockItensDashboard);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("renders loading state initially", async () => {
        render(<AcompanhamentoPcsSme />);
        expect(screen.getByText(/0 unidades/i)).toBeInTheDocument();
    });

    it("loads and displays periodos", async () => {
        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);

        render(<AcompanhamentoPcsSme />);
        
        await waitFor(() => {
            expect(screen.getByText(exibeOpcao)).toBeInTheDocument();
        });
    });

    it("handles period change", async () => {
        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue(mockItensDashboard);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText(exibeOpcao)).toBeInTheDocument();
        });

        userEvent.selectOptions(screen.getByRole("combobox"), "uuid1");

        await waitFor(() => {
            expect(screen.getByText(/Resumo geral do período/i)).toBeInTheDocument();
        });
    });

    it("displays dashboard data correctly", async () => {
        const mockItensDashboard = {
            cards: [{ quantidade_prestacoes: 10 }],
            resumo_por_dre: [],
            status: "Ativo",
        };

        DashboardSmeService.getPeriodos.mockResolvedValue(mockPeriodos);
        DashboardSmeService.getItensDashboardSme.mockResolvedValue(mockItensDashboard);

        render(<AcompanhamentoPcsSme />);

        await waitFor(() => {
            expect(screen.getByText(exibeOpcao)).toBeInTheDocument();
        });

        userEvent.selectOptions(screen.getByRole("combobox"), "uuid1");

        await waitFor(() => {
            expect(screen.getByText(/Resumo geral do período/i)).toBeInTheDocument();
            expect(screen.getByText(/10/i)).toBeInTheDocument();
        });
    });
});