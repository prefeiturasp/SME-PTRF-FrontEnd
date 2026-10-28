import React from "react";
import {render, screen} from "@testing-library/react";
import {CadastroDeDespesasPipeline} from "../index";
import {DespesaFormPipeline} from "../DespesaFormPipeline";

jest.mock("../CadastroForm", () => ({
    CadastroForm: (props) => <div data-testid="cadastro-form">{JSON.stringify(props)}</div>,
}));

describe("entradas do CadastroDeDespesasPipeline", () => {
    it("DespesaFormPipeline repassa props para CadastroForm", () => {
        render(<DespesaFormPipeline verbo_http="POST" veioDeSituacaoPatrimonial={true} />);
        expect(JSON.parse(screen.getByTestId("cadastro-form").textContent)).toEqual({
            verbo_http: "POST",
            veioDeSituacaoPatrimonial: true,
        });
    });

    it("CadastroDeDespesasPipeline repassa props até CadastroForm", () => {
        render(<CadastroDeDespesasPipeline verbo_http="PUT" veioDeSituacaoPatrimonial={false} />);
        expect(JSON.parse(screen.getByTestId("cadastro-form").textContent)).toEqual({
            verbo_http: "PUT",
            veioDeSituacaoPatrimonial: false,
        });
    });
});
