import React, {createContext, useContext, useMemo} from "react";

const DespesaTabelasContext = createContext(null);
const DespesaUiContext = createContext(null);
const DespesaFluxoContext = createContext(null);

export const DespesaTabelasProvider = ({value, children}) => (
    <DespesaTabelasContext.Provider value={value}>{children}</DespesaTabelasContext.Provider>
);

export const DespesaUiProvider = ({value, children}) => (
    <DespesaUiContext.Provider value={value}>{children}</DespesaUiContext.Provider>
);

export const DespesaFluxoProvider = ({value, children}) => (
    <DespesaFluxoContext.Provider value={value}>{children}</DespesaFluxoContext.Provider>
);

/**
 * Compõe os três contexts do formulário pipeline.
 * Preferir os hooks específicos (useDespesaTabelasCtx / useDespesaUiCtx / useDespesaFluxoCtx)
 * para reduzir re-renders; useDespesaFormPipeline mantém compatibilidade.
 */
export const DespesaFormPipelineProvider = ({tabelas, ui, fluxo, children}) => (
    <DespesaTabelasProvider value={tabelas}>
        <DespesaUiProvider value={ui}>
            <DespesaFluxoProvider value={fluxo}>
                {children}
            </DespesaFluxoProvider>
        </DespesaUiProvider>
    </DespesaTabelasProvider>
);

const requireCtx = (ctx, name) => {
    if (!ctx) {
        throw new Error(`${name} deve ser usado dentro de DespesaFormPipelineProvider`);
    }
    return ctx;
};

export const useDespesaTabelasCtx = () =>
    requireCtx(useContext(DespesaTabelasContext), "useDespesaTabelasCtx");

export const useDespesaUiCtx = () =>
    requireCtx(useContext(DespesaUiContext), "useDespesaUiCtx");

export const useDespesaFluxoCtx = () =>
    requireCtx(useContext(DespesaFluxoContext), "useDespesaFluxoCtx");

/** Compat: une os três contexts (use só quando realmente precisar de tudo). */
export const useDespesaFormPipeline = () => {
    const tabelas = useDespesaTabelasCtx();
    const ui = useDespesaUiCtx();
    const fluxo = useDespesaFluxoCtx();
    return useMemo(() => ({...tabelas, ...ui, ...fluxo}), [tabelas, ui, fluxo]);
};
