import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AssociacaoEPeriodoDoCabecalho from "../AssociacaoEPeriodoDoCabecalho";
import { getPeriodos } from "../../../../../services/sme/DashboardSme.service";

jest.mock("../../../../../services/sme/DashboardSme.service", () => ({
    getPeriodos: jest.fn(),
}));

describe("AssociacaoEPeriodoDoCabecalho", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("não deve renderizar nada quando prestacaoDeContas estiver vazio", () => {
        const { container } = render(<AssociacaoEPeriodoDoCabecalho prestacaoDeContas={{}} />);
        expect(container).toBeEmptyDOMElement();
        expect(getPeriodos).not.toHaveBeenCalled();
    });

    it("deve exibir o nome da associação mesmo sem periodo_uuid", () => {
        render(<AssociacaoEPeriodoDoCabecalho prestacaoDeContas={{ associacao: { nome: "Associação Teste" } }} />);
        expect(screen.getByText("Associação Teste")).toBeInTheDocument();
        expect(getPeriodos).not.toHaveBeenCalled();
    });

    it("deve carregar e exibir o período formatado com data de início e fim", async () => {
        getPeriodos.mockResolvedValue([
            {
                uuid: "p1",
                referencia: "2024.1",
                data_inicio_realizacao_despesas: "2024-01-01",
                data_fim_realizacao_despesas: "2024-06-30",
            },
        ]);

        const { container } = render(
            <AssociacaoEPeriodoDoCabecalho
                prestacaoDeContas={{ periodo_uuid: "p1", associacao: { nome: "Associação Teste" } }}
            />
        );

        await waitFor(() => {
            expect(container.querySelector(".fonte-16").textContent).toBe("Período: 2024.1 - 01/01/2024 até 30/06/2024");
        });
        expect(getPeriodos).toHaveBeenCalledWith("p1");
    });

    it("deve exibir '-' quando as datas de início/fim não estiverem preenchidas", async () => {
        getPeriodos.mockResolvedValue([
            { uuid: "p1", referencia: "2024.1", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
        ]);

        const { container } = render(
            <AssociacaoEPeriodoDoCabecalho
                prestacaoDeContas={{ periodo_uuid: "p1", associacao: { nome: "Associação Teste" } }}
            />
        );

        await waitFor(() => {
            expect(container.querySelector(".fonte-16").textContent).toBe("Período: 2024.1 - - até -");
        });
    });
});
