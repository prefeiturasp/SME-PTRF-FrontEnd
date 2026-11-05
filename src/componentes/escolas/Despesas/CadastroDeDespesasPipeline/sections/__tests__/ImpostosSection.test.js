import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import {Formik} from "formik";
import {ImpostosSection} from "../ImpostosSection";
import {DespesaFormPipelineProvider} from "../../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../../services/visoes.service";

jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn()},
}));
jest.mock("../../../../../../services/auth.service", () => ({ASSOCIACAO_UUID: "UUID"}));
jest.mock("../../../RetemImposto", () => ({
    RetemImposto: (p) => <div data-testid="retem-imposto" data-disabled={String(p.disabled)} />,
}));
jest.mock("../../impostos/DespesaImposto", () => ({
    DespesaImposto: (p) => (
        <div data-testid={`imposto-${p.index}`} data-disabled={String(p.disabled)}>
            <button type="button" onClick={() => p.remove(p.index)}>remover-{p.index}</button>
        </div>
    ),
}));

const renderiza = ({values = {}, ui = {}} = {}) => {
    const initialValues = {
        despesa_anterior_ao_uso_do_sistema_editavel: true,
        despesas_impostos: [],
        ...values,
    };
    const u = {
        readOnlyCampos: false,
        showRetencaoImposto: true,
        eh_despesa_com_retencao_imposto: jest.fn(() => true),
        disableBtnAdicionarImposto: false,
        ...ui,
    };
    const f = {mostraModalExcluirImposto: jest.fn()};
    render(
        <Formik initialValues={initialValues} onSubmit={jest.fn()}>
            <DespesaFormPipelineProvider tabelas={{}} ui={u} fluxo={f}>
                <ImpostosSection />
            </DespesaFormPipelineProvider>
        </Formik>
    );
    return {u, f};
};

describe("ImpostosSection", () => {
    beforeEach(() => {
        visoesService.getPermissoes.mockReturnValue(true);
        localStorage.setItem("UUID", "assoc-1");
    });

    it("não renderiza nada quando showRetencaoImposto é falso", () => {
        renderiza({ui: {showRetencaoImposto: false}});
        expect(screen.queryByTestId("retem-imposto")).not.toBeInTheDocument();
    });

    it("renderiza RetemImposto e botão de adicionar", () => {
        renderiza();
        expect(screen.getByTestId("retem-imposto")).toHaveAttribute("data-disabled", "false");
        expect(screen.getByRole("button", {name: "+ Adicionar imposto"})).toBeEnabled();
    });

    it("oculta botão adicionar quando despesa não tem retenção de imposto", () => {
        renderiza({ui: {eh_despesa_com_retencao_imposto: jest.fn(() => false)}});
        expect(screen.queryByRole("button", {name: "+ Adicionar imposto"})).not.toBeInTheDocument();
    });

    it("desabilita adicionar conforme disableBtnAdicionarImposto, permissão e editabilidade", () => {
        renderiza({ui: {disableBtnAdicionarImposto: true}});
        expect(screen.getByRole("button", {name: "+ Adicionar imposto"})).toBeDisabled();
    });

    it("desabilita sem permissão", () => {
        visoesService.getPermissoes.mockReturnValue(false);
        renderiza({values: {despesas_impostos: [{}]}});
        expect(screen.getByRole("button", {name: "+ Adicionar imposto"})).toBeDisabled();
        expect(screen.getByTestId("retem-imposto")).toHaveAttribute("data-disabled", "true");
        expect(screen.getByTestId("imposto-0")).toHaveAttribute("data-disabled", "true");
    });

    it("desabilita com readOnlyCampos ou despesa não editável", () => {
        renderiza({ui: {readOnlyCampos: true}, values: {despesa_anterior_ao_uso_do_sistema_editavel: false}});
        expect(screen.getByTestId("retem-imposto")).toHaveAttribute("data-disabled", "true");
    });

    it("lista impostos existentes e permite remover", () => {
        renderiza({values: {despesas_impostos: [{}, {}]}});
        expect(screen.getByTestId("imposto-0")).toBeInTheDocument();
        expect(screen.getByTestId("imposto-1")).toBeInTheDocument();
        fireEvent.click(screen.getByText("remover-0"));
        expect(screen.queryByTestId("imposto-1")).not.toBeInTheDocument();
        expect(screen.getByTestId("imposto-0")).toBeInTheDocument();
    });

    it("adiciona um novo imposto ao clicar", () => {
        renderiza();
        expect(screen.queryByTestId("imposto-0")).not.toBeInTheDocument();
        fireEvent.click(screen.getByRole("button", {name: "+ Adicionar imposto"}));
        expect(screen.getByTestId("imposto-0")).toBeInTheDocument();
    });
});
