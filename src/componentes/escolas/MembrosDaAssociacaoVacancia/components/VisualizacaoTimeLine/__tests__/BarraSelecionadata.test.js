import { render, screen, fireEvent } from "@testing-library/react";

import { BarraSelecionaData } from "../BarraSelecionadata";
import useDataTemplate from "../../../../../../hooks/Globais/useDataTemplate";

jest.mock("../../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../../../../Globais/DatePickerField", () => ({
    DatePickerField: ({ name, value, onChange, ...props }) => (
        <input name={name} value={value || ""} onChange={(event) => onChange(name, event.target.value)} {...props} />
    ),
}));

describe("BarraSelecionaData", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
    const onSelecionarData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useDataTemplate.mockReturnValue((_, __, value) => value);
    });

    it("exibe o seletor de data com o valor selecionado e os limites do mandato", () => {
        render(
            <BarraSelecionaData mandato={mandato} marcos={[]} dataSelecionada="2026-03-01" onSelecionarData={onSelecionarData} />
        );

        const seletor = document.querySelector('[dataqa="seletor-data-timeline"]');
        expect(seletor).toHaveValue("2026-03-01");
        expect(seletor.getAttribute("mindate")).toContain("2026");
        expect(seletor.getAttribute("maxdate")).toContain("2026");
    });

    it("chama onSelecionarData com a data escolhida no seletor", () => {
        render(
            <BarraSelecionaData mandato={mandato} marcos={[]} dataSelecionada="2026-03-01" onSelecionarData={onSelecionarData} />
        );

        const seletor = document.querySelector('[dataqa="seletor-data-timeline"]');
        fireEvent.change(seletor, { target: { value: "2026-05-20" } });

        expect(onSelecionarData).toHaveBeenCalledWith("2026-05-20");
    });

    it("não exibe o período de 'Movimentação no cargo' quando a data selecionada não está em nenhum marco", () => {
        render(
            <BarraSelecionaData mandato={mandato} marcos={[]} dataSelecionada="2026-03-01" onSelecionarData={onSelecionarData} />
        );

        const bloco = document.querySelector('[data-qa="marco-atual-timeline"]');
        expect(bloco.querySelector("div")).toHaveTextContent("");
    });

    it("exibe o período do marco atual quando a data selecionada está contida nele", () => {
        const marcos = [
            { inicio: "2026-01-01", fim: "2026-03-14" },
            { inicio: "2026-03-15", fim: "2026-12-31" },
        ];

        render(
            <BarraSelecionaData mandato={mandato} marcos={marcos} dataSelecionada="2026-05-01" onSelecionarData={onSelecionarData} />
        );

        expect(screen.getByText("2026-03-15 até 2026-12-31")).toBeInTheDocument();
    });

    it("exibe o botão 'Hoje' e chama onSelecionarData com a data de hoje ao clicar (mandato cobre o presente)", () => {
        render(
            <BarraSelecionaData
                mandato={{ data_inicial: "2020-01-01", data_final: "2030-12-31" }}
                marcos={[]}
                dataSelecionada="2026-03-01"
                onSelecionarData={onSelecionarData}
            />
        );

        fireEvent.click(screen.getByRole("button", { name: "Hoje" }));

        expect(onSelecionarData).toHaveBeenCalledWith(expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/));
    });

    it("não exibe o botão 'Hoje' quando o mandato não cobre a data atual", () => {
        render(
            <BarraSelecionaData
                mandato={{ data_inicial: "2000-01-01", data_final: "2001-12-31" }}
                marcos={[]}
                dataSelecionada="2000-03-01"
                onSelecionarData={onSelecionarData}
            />
        );

        expect(screen.queryByRole("button", { name: "Hoje" })).not.toBeInTheDocument();
    });

    it("navega para o marco seguinte e anterior via os botões de seta, respeitando os limites", () => {
        const marcos = [
            { inicio: "2026-01-01", fim: "2026-03-14" },
            { inicio: "2026-03-15", fim: "2026-12-31" },
        ];

        render(
            <BarraSelecionaData mandato={mandato} marcos={marcos} dataSelecionada="2026-03-01" onSelecionarData={onSelecionarData} />
        );

        const botoesDeSeta = screen
            .getAllByRole("button", { name: "" })
            .filter((botao) => botao.querySelector("svg"));
        const [chevronEsquerdo, chevronDireito] = botoesDeSeta;

        // no marco mais antigo (index 0): não há marco mais recente nesta direção -> desabilitado
        expect(chevronEsquerdo).toBeDisabled();
        expect(chevronDireito).toBeEnabled();

        fireEvent.click(chevronDireito);
        expect(onSelecionarData).toHaveBeenCalledWith("2026-03-15");
    });

    it("não quebra quando mandato e marcos não são informados", () => {
        expect(() =>
            render(<BarraSelecionaData dataSelecionada={undefined} onSelecionarData={onSelecionarData} />)
        ).not.toThrow();
    });
});
