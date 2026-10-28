import React from "react";
import {render, screen} from "@testing-library/react";
import {
    DespesaFormPipelineProvider,
    DespesaTabelasProvider,
    useDespesaTabelasCtx,
    useDespesaUiCtx,
    useDespesaFluxoCtx,
    useDespesaFormPipeline,
} from "../DespesaFormPipelineContext";

const Mostra = ({hook}) => {
    const v = hook();
    return <div data-testid="out">{JSON.stringify(v)}</div>;
};

describe("DespesaFormPipelineContext", () => {
    const tabelas = {t: 1};
    const ui = {u: 2};
    const fluxo = {f: 3};

    const renderiza = (hook) =>
        render(
            <DespesaFormPipelineProvider tabelas={tabelas} ui={ui} fluxo={fluxo}>
                <Mostra hook={hook} />
            </DespesaFormPipelineProvider>
        );

    it("cada hook retorna seu contexto", () => {
        renderiza(useDespesaTabelasCtx);
        expect(screen.getByTestId("out")).toHaveTextContent(JSON.stringify(tabelas));
    });

    it("useDespesaUiCtx retorna ui", () => {
        renderiza(useDespesaUiCtx);
        expect(screen.getByTestId("out")).toHaveTextContent(JSON.stringify(ui));
    });

    it("useDespesaFluxoCtx retorna fluxo", () => {
        renderiza(useDespesaFluxoCtx);
        expect(screen.getByTestId("out")).toHaveTextContent(JSON.stringify(fluxo));
    });

    it("useDespesaFormPipeline une os três contextos", () => {
        renderiza(useDespesaFormPipeline);
        expect(JSON.parse(screen.getByTestId("out").textContent)).toEqual({t: 1, u: 2, f: 3});
    });

    describe("fora do provider", () => {
        beforeEach(() => jest.spyOn(console, "error").mockImplementation(() => {}));
        afterEach(() => jest.restoreAllMocks());

        it.each([
            ["useDespesaTabelasCtx", useDespesaTabelasCtx],
            ["useDespesaUiCtx", useDespesaUiCtx],
            ["useDespesaFluxoCtx", useDespesaFluxoCtx],
        ])("%s lança erro", (nome, hook) => {
            expect(() => render(<Mostra hook={hook} />)).toThrow(
                `${nome} deve ser usado dentro de DespesaFormPipelineProvider`
            );
        });

        it("useDespesaFormPipeline lança erro sem provider", () => {
            expect(() => render(<Mostra hook={useDespesaFormPipeline} />)).toThrow();
        });

        it("lança se só o contexto de tabelas existir", () => {
            expect(() =>
                render(
                    <DespesaTabelasProvider value={tabelas}>
                        <Mostra hook={useDespesaFormPipeline} />
                    </DespesaTabelasProvider>
                )
            ).toThrow("useDespesaUiCtx");
        });
    });
});
