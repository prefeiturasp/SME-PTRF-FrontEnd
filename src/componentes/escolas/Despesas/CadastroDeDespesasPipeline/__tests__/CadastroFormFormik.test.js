import React from "react";
import {render, screen, act} from "@testing-library/react";
import {CadastroFormFormik} from "../CadastroFormFormik";
import {DespesaFormPipelineProvider} from "../context/DespesaFormPipelineContext";
import {visoesService} from "../../../../../services/visoes.service";

jest.mock("../../../../../services/visoes.service", () => ({
    visoesService: {getPermissoes: jest.fn()},
}));
jest.mock("../sections/DocumentoSection", () => ({DocumentoSection: () => <div data-testid="documento" />}));
jest.mock("../sections/ImpostosSection", () => ({ImpostosSection: () => <div data-testid="impostos" />}));
jest.mock("../sections/RateiosSection", () => ({RateiosSection: () => <div data-testid="rateios" />}));
jest.mock("../sections/AcoesSection", () => ({
    AcoesSection: ({podeHabilitar}) => <div data-testid="acoes" data-pode={String(podeHabilitar)} />,
}));

const renderiza = ({values = {}, ui = {}, verboHttp = "PUT"} = {}) => {
    const iv = {status: "COMPLETO", qtde_erros_form_despesa: 0, ...values};
    const initialValues = jest.fn(() => iv);
    const result = render(
        <DespesaFormPipelineProvider
            tabelas={{despesaContext: {verboHttp}}}
            ui={{readOnlyBtnAcao: false, ...ui}}
            fluxo={{}}
        >
            <CadastroFormFormik
                initialValues={initialValues}
                onSubmit={jest.fn()}
                validateFormDespesas={jest.fn(async () => ({}))}
            />
        </DespesaFormPipelineProvider>
    );
    return {initialValues, ...result};
};

describe("CadastroFormFormik", () => {
    beforeEach(() => {
        jest.useFakeTimers();
        visoesService.getPermissoes.mockReturnValue(true);
    });
    afterEach(() => jest.useRealTimers());

    it("renderiza as quatro seções do formulário", () => {
        renderiza();
        ["documento", "impostos", "rateios", "acoes"].forEach((id) =>
            expect(screen.getByTestId(id)).toBeInTheDocument()
        );
    });

    it("não exibe banner quando status é COMPLETO", () => {
        renderiza({values: {qtde_erros_form_despesa: 3}});
        expect(screen.queryByText(/campos não preenchidos/)).not.toBeInTheDocument();
    });

    it("exibe banner com a quantidade de erros em PUT incompleto", async () => {
        renderiza({values: {status: "INCOMPLETO", qtde_erros_form_despesa: 3}});
        expect(await screen.findByText(/O cadastro possui 3 campos não preenchidos/)).toBeInTheDocument();
    });

    it("não exibe banner em POST", () => {
        renderiza({verboHttp: "POST", values: {status: "INCOMPLETO", qtde_erros_form_despesa: 3}});
        expect(screen.queryByText(/campos não preenchidos/)).not.toBeInTheDocument();
    });

    it("não exibe banner sem erros", () => {
        renderiza({values: {status: "INCOMPLETO", qtde_erros_form_despesa: 0}});
        expect(screen.queryByText(/campos não preenchidos/)).not.toBeInTheDocument();
    });

    it("habilita podeHabilitar após 1s quando despesa editável e com permissão", () => {
        renderiza({values: {despesa_anterior_ao_uso_do_sistema_editavel: true}});
        expect(screen.getByTestId("acoes")).toHaveAttribute("data-pode", "false");
        act(() => jest.advanceTimersByTime(1000));
        expect(screen.getByTestId("acoes")).toHaveAttribute("data-pode", "true");
    });

    it.each([
        ["readOnlyBtnAcao", {ui: {readOnlyBtnAcao: true}, values: {despesa_anterior_ao_uso_do_sistema_editavel: true}}],
        ["despesa não editável", {values: {despesa_anterior_ao_uso_do_sistema_editavel: false}}],
        ["campo de edição ausente", {values: {}}],
    ])("mantém desabilitado com %s", (_, opts) => {
        renderiza(opts);
        act(() => jest.advanceTimersByTime(2000));
        expect(screen.getByTestId("acoes")).toHaveAttribute("data-pode", "false");
    });

    it("mantém desabilitado sem permissão de deletar", () => {
        visoesService.getPermissoes.mockReturnValue(false);
        renderiza({values: {despesa_anterior_ao_uso_do_sistema_editavel: true}});
        act(() => jest.advanceTimersByTime(2000));
        expect(screen.getByTestId("acoes")).toHaveAttribute("data-pode", "false");
    });

    it("cancela o timer ao desmontar", () => {
        const {unmount} = renderiza({values: {despesa_anterior_ao_uso_do_sistema_editavel: true}});
        unmount();
        expect(() => act(() => jest.advanceTimersByTime(2000))).not.toThrow();
    });
});
