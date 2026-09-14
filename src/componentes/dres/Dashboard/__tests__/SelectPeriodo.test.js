import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SelectPeriodo } from "../SelectPeriodo";
import { exibeDataPT_BR } from "../../../../utils/ValidacoesAdicionaisFormularios";

jest.mock("../../../../utils/ValidacoesAdicionaisFormularios", () => ({
    exibeDataPT_BR: jest.fn(),
}));

describe("SelectPeriodo", () => {
    beforeEach(() => {
        // resetMocks (react-scripts) limpa a implementação a cada teste
        exibeDataPT_BR.mockImplementation((data) => `formatado(${data})`);
    });

    it("renderiza o select sem opções quando periodos não é informado", () => {
        render(
            <SelectPeriodo periodos={false} periodoEscolhido={false} handleChangePeriodos={jest.fn()} />
        );

        expect(screen.getByLabelText("Período:")).toBeInTheDocument();
        expect(screen.queryAllByRole("option").length).toBe(0);
    });

    it("renderiza uma opção por período formatando as datas de início e fim", () => {
        const periodos = [
            {
                uuid: "p1",
                referencia: "1º Período 2024",
                data_inicio_realizacao_despesas: "2024-01-01",
                data_fim_realizacao_despesas: "2024-06-30",
            },
        ];

        render(
            <SelectPeriodo periodos={periodos} periodoEscolhido="p1" handleChangePeriodos={jest.fn()} />
        );

        expect(
            screen.getByText("1º Período 2024 - formatado(2024-01-01) até formatado(2024-06-30)")
        ).toBeInTheDocument();
    });

    it("exibe '-' quando as datas de início ou fim não estão preenchidas", () => {
        const periodos = [
            {
                uuid: "p1",
                referencia: "1º Período 2024",
                data_inicio_realizacao_despesas: null,
                data_fim_realizacao_despesas: null,
            },
        ];

        render(
            <SelectPeriodo periodos={periodos} periodoEscolhido="p1" handleChangePeriodos={jest.fn()} />
        );

        expect(screen.getByText("1º Período 2024 - - até -")).toBeInTheDocument();
    });

    it("chama handleChangePeriodos com o uuid selecionado ao alterar o select", () => {
        const periodos = [
            { uuid: "p1", referencia: "1º Período", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
            { uuid: "p2", referencia: "2º Período", data_inicio_realizacao_despesas: null, data_fim_realizacao_despesas: null },
        ];
        const handleChangePeriodos = jest.fn();

        render(
            <SelectPeriodo periodos={periodos} periodoEscolhido="p1" handleChangePeriodos={handleChangePeriodos} />
        );

        fireEvent.change(screen.getByLabelText("Período:"), { target: { value: "p2" } });

        expect(handleChangePeriodos).toHaveBeenCalledWith("p2");
    });
});
