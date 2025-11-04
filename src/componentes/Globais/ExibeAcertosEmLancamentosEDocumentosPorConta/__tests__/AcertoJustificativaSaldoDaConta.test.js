import React from "react";
import { render, screen } from "@testing-library/react";
import { AcertoJustificativaSaldoDaConta } from "../AcertoJustificativaSaldoDaConta";

describe("AcertoJustificativaSaldoDaConta", () => {
    it("renderiza o aviso quando a solicitação de justificativa está ativa", () => {
        const props = {
            solicitar_correcao_de_justificativa_de_conciliacao: true
        };

        render(<AcertoJustificativaSaldoDaConta extratosBancariosAjustes={props} />);

        expect(
            screen.getByText(/Incluir justificativa/i)
        ).toBeInTheDocument();
    });

    it("não renderiza nada quando a solicitação não está ativa", () => {
        const { container } = render(
            <AcertoJustificativaSaldoDaConta extratosBancariosAjustes={{ solicitar_correcao_de_justificativa_de_conciliacao: false }} />
        );

        expect(container).toBeEmptyDOMElement();
    });
});
