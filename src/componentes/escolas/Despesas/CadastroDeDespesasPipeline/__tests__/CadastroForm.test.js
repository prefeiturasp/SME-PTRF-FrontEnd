import React from "react";
import {render, screen} from "@testing-library/react";
import {CadastroForm} from "../CadastroForm";
import {useDespesaFormController} from "../hooks/useDespesaFormController";

jest.mock("../hooks/useDespesaFormController", () => ({
    useDespesaFormController: jest.fn(),
}));
jest.mock("../CadastroFormFormik", () => ({
    CadastroFormFormik: (props) => <div data-testid="formik">{Object.keys(props).join(",")}</div>,
}));
jest.mock("../DespesaFormModais", () => ({
    DespesaFormModais: (props) => <div data-testid="modais">{props.marca}</div>,
}));
jest.mock("../../../../../utils/Loading", () => () => <div data-testid="loading" />);

const controller = (loading) => ({
    loading,
    tabelas: {},
    ui: {},
    fluxo: {},
    formik: {initialValues: jest.fn(), onSubmit: jest.fn(), validateFormDespesas: jest.fn()},
    modais: {marca: "m"},
});

describe("CadastroForm", () => {
    it("mostra Loading e modais enquanto carrega", () => {
        useDespesaFormController.mockReturnValue(controller(true));
        render(<CadastroForm verbo_http="POST" veioDeSituacaoPatrimonial={false} />);
        expect(useDespesaFormController).toHaveBeenCalledWith({verbo_http: "POST", veioDeSituacaoPatrimonial: false});
        expect(screen.getByTestId("loading")).toBeInTheDocument();
        expect(screen.queryByTestId("formik")).not.toBeInTheDocument();
        expect(screen.getByTestId("modais")).toHaveTextContent("m");
    });

    it("renderiza o formulário quando terminou de carregar", () => {
        useDespesaFormController.mockReturnValue(controller(false));
        render(<CadastroForm verbo_http="PUT" />);
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
        expect(screen.getByTestId("formik")).toHaveTextContent("initialValues,onSubmit,validateFormDespesas");
    });
});
