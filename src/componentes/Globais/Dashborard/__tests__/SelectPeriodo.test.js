import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectPeriodo } from "../SelectPeriodo";

const mockExibeDataPT_BR = (data) => `formatado(${data})`;

const PERIODOS = [
    {
        uuid: "uuid-periodo-1",
        referencia: "2023.1",
        data_inicio_realizacao_despesas: "2023-01-01",
        data_fim_realizacao_despesas: "2023-06-30",
    },
    {
        uuid: "uuid-periodo-2",
        referencia: "2023.2",
        data_inicio_realizacao_despesas: "2023-07-01",
        data_fim_realizacao_despesas: "2023-12-31",
    },
];

describe("SelectPeriodo", () => {
    const handleChangePeriodo = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renderiza o label 'Período:'", () => {
        render(
            <SelectPeriodo
                periodosAssociacao={PERIODOS}
                handleChangePeriodo={handleChangePeriodo}
                selectPeriodo="uuid-periodo-1"
                exibeDataPT_BR={mockExibeDataPT_BR}
            />
        );
        expect(screen.getByText("Período:")).toBeInTheDocument();
    });

    it("renderiza as opções de período formatadas", () => {
        const { container } = render(
            <SelectPeriodo
                periodosAssociacao={PERIODOS}
                handleChangePeriodo={handleChangePeriodo}
                selectPeriodo="uuid-periodo-1"
                exibeDataPT_BR={mockExibeDataPT_BR}
            />
        );

        const options = container.querySelectorAll("option");
        expect(options[0].textContent).toBe("2023.1 - formatado(2023-01-01) até formatado(2023-06-30)");
        expect(options[1].textContent).toBe("2023.2 - formatado(2023-07-01) até formatado(2023-12-31)");
    });

    it("usa '-' quando data_inicio_realizacao_despesas é nula", () => {
        const periodos = [
            {
                uuid: "uuid-1",
                referencia: "2023.1",
                data_inicio_realizacao_despesas: null,
                data_fim_realizacao_despesas: "2023-06-30",
            },
        ];

        const { container } = render(
            <SelectPeriodo
                periodosAssociacao={periodos}
                handleChangePeriodo={handleChangePeriodo}
                selectPeriodo="uuid-1"
                exibeDataPT_BR={mockExibeDataPT_BR}
            />
        );

        expect(container.querySelector("option").textContent).toBe("2023.1 - - até formatado(2023-06-30)");
    });

    it("usa '-' quando data_fim_realizacao_despesas é nula", () => {
        const periodos = [
            {
                uuid: "uuid-1",
                referencia: "2023.1",
                data_inicio_realizacao_despesas: "2023-01-01",
                data_fim_realizacao_despesas: null,
            },
        ];

        const { container } = render(
            <SelectPeriodo
                periodosAssociacao={periodos}
                handleChangePeriodo={handleChangePeriodo}
                selectPeriodo="uuid-1"
                exibeDataPT_BR={mockExibeDataPT_BR}
            />
        );

        expect(container.querySelector("option").textContent).toBe("2023.1 - formatado(2023-01-01) até -");
    });

    it("não renderiza opções quando periodosAssociacao é false", () => {
        render(
            <SelectPeriodo
                periodosAssociacao={false}
                handleChangePeriodo={handleChangePeriodo}
                selectPeriodo=""
                exibeDataPT_BR={mockExibeDataPT_BR}
            />
        );

        const select = screen.getByRole("combobox");
        expect(select.options).toHaveLength(0);
    });

    it("chama handleChangePeriodo com o uuid correto ao mudar a seleção", () => {
        render(
            <SelectPeriodo
                periodosAssociacao={PERIODOS}
                handleChangePeriodo={handleChangePeriodo}
                selectPeriodo="uuid-periodo-1"
                exibeDataPT_BR={mockExibeDataPT_BR}
            />
        );

        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "uuid-periodo-2" },
        });

        expect(handleChangePeriodo).toHaveBeenCalledWith("uuid-periodo-2");
    });
});
