import React from "react";
import {render, screen} from "@testing-library/react";
import ExibeMotivos from "../ExibeMotivosPagamentoAntecipadoNoForm";

const values = (extra = {}) => ({
    data_documento: "2026-03-10",
    data_transacao: "2026-03-01",
    motivos_pagamento_antecipado: [{id: 1, motivo: "Motivo A"}, {id: 2, motivo: "Motivo B"}],
    outros_motivos_pagamento_antecipado: "Outro motivo",
    ...extra,
});

describe("ExibeMotivosPagamentoAntecipadoNoForm", () => {
    it("exibe motivos e outros motivos quando pagamento é anterior ao documento", () => {
        render(<ExibeMotivos values={values()} />);
        expect(screen.getByText("Justificativa(s) de pagamento antecipado")).toBeInTheDocument();
        expect(screen.getByText("Motivo A")).toBeInTheDocument();
        expect(screen.getByText("Motivo B")).toBeInTheDocument();
        expect(screen.getByText("Outro motivo")).toBeInTheDocument();
    });

    it("exibe quando só há outros motivos", () => {
        render(<ExibeMotivos values={values({motivos_pagamento_antecipado: []})} />);
        expect(screen.getByText("Outro motivo")).toBeInTheDocument();
    });

    it.each([
        ["pagamento posterior ao documento", {data_transacao: "2026-03-20"}],
        ["sem data_transacao", {data_transacao: ""}],
        ["sem data_documento", {data_documento: null}],
        ["sem motivos", {motivos_pagamento_antecipado: [], outros_motivos_pagamento_antecipado: ""}],
    ])("não renderiza com %s", (_, extra) => {
        const {container} = render(<ExibeMotivos values={values(extra)} />);
        expect(container).toBeEmptyDOMElement();
    });
});
