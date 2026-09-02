import { render, screen, configure } from "@testing-library/react";
import { MarcoInfoVacancia } from "../MarcoInfoVacancia";

configure({ testIdAttribute: 'data-qa' });

describe("MarcoInfoVacancia", () => {
    it("deve renderizar o período do marco selecionado formatado", () => {
        render(<MarcoInfoVacancia dataInicio="2026-01-01" dataFim="2026-02-28" />);

        expect(screen.getByTestId("marco-info-vacancia")).toBeInTheDocument();
        expect(screen.getByText("Composição a partir de:")).toBeInTheDocument();
        expect(
            screen.getByText("01/01/2026 até 28/02/2026", { exact: false })
        ).toBeInTheDocument();
    });

    it("não deve quebrar quando alguma das datas não for informada", () => {
        render(<MarcoInfoVacancia dataInicio={null} dataFim={null} />);

        expect(screen.getByTestId("marco-info-vacancia")).toBeInTheDocument();
        expect(screen.getByText("até", { exact: false })).toBeInTheDocument();
    });
});
