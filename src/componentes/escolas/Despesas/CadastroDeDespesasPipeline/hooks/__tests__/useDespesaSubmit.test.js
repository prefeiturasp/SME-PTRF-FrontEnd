import {renderHook} from "@testing-library/react";
import {useDespesaSubmit} from "../useDespesaSubmit";
import {validaPayloadDespesas, metodosAuxiliares} from "../../utils";
import {getErrorMessage} from "../../../../../../utils/obtemMsgErroAxios";
import {toastCustom} from "../../../../../Globais/ToastCustom";

jest.mock("../../utils", () => ({
    validaPayloadDespesas: jest.fn(),
    metodosAuxiliares: {origemAnaliseLancamento: jest.fn()},
}));
jest.mock("../../../../../../utils/obtemMsgErroAxios", () => ({getErrorMessage: jest.fn()}));
jest.mock("../../../../../Globais/ToastCustom", () => ({
    toastCustom: {ToastCustomError: jest.fn()},
}));

const makeDeps = (extra = {}) => ({
    despesaContext: {verboHttp: "POST", idDespesa: 7},
    parametroLocation: {state: {}},
    despesasTabelas: {tabelas: true},
    enviarFormulario: true,
    setFormErrors: jest.fn(),
    habilitaBtnSalvar: jest.fn(),
    mutationCreate: {mutate: jest.fn()},
    mutationUpdate: {mutate: jest.fn()},
    montaPayloadMotivosPagamentoAntecipado: jest.fn(() => [{id: 1}]),
    txtOutrosMotivosPagamentoAntecipado: "  outro ",
    checkBoxOutrosMotivosPagamentoAntecipado: true,
    validacoesPersonalizadas: jest.fn(async () => ({})),
    ...extra,
});

const setup = (extra) => {
    const deps = makeDeps(extra);
    const {result} = renderHook(() => useDespesaSubmit(deps));
    return {deps, ...result.current};
};

describe("useDespesaSubmit", () => {
    beforeEach(() => {
        metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);
    });

    describe("onSubmit", () => {
        it("interrompe e reabilita botão quando validação retorna null", async () => {
            const {deps, onSubmit} = setup({validacoesPersonalizadas: jest.fn(async () => null)});
            await onSubmit({}, jest.fn());
            expect(deps.habilitaBtnSalvar).toHaveBeenCalled();
            expect(deps.setFormErrors).not.toHaveBeenCalled();
            expect(deps.mutationCreate.mutate).not.toHaveBeenCalled();
        });

        it("cria despesa em POST com payload tratado", async () => {
            const {deps, onSubmit} = setup();
            const values = {};
            const setFieldValue = jest.fn();
            await onSubmit(values, setFieldValue);
            expect(deps.validacoesPersonalizadas).toHaveBeenCalledWith(values, setFieldValue, "despesa_principal");
            expect(deps.setFormErrors).toHaveBeenCalledWith({});
            expect(validaPayloadDespesas).toHaveBeenCalledWith(values, deps.despesasTabelas, deps.parametroLocation);
            expect(values.motivos_pagamento_antecipado).toEqual([{id: 1}]);
            expect(values.outros_motivos_pagamento_antecipado).toBe("  outro ");
            expect(deps.mutationCreate.mutate).toHaveBeenCalledWith({payload: values});
            expect(deps.mutationUpdate.mutate).not.toHaveBeenCalled();
        });

        it("atualiza despesa em PUT", async () => {
            const {deps, onSubmit} = setup({despesaContext: {verboHttp: "PUT", idDespesa: 7}});
            const values = {};
            await onSubmit(values, jest.fn());
            expect(deps.mutationUpdate.mutate).toHaveBeenCalledWith({payload: values, idDespesa: 7});
            expect(deps.mutationCreate.mutate).not.toHaveBeenCalled();
        });

        it("não chama mutation com verbo desconhecido", async () => {
            const {deps, onSubmit} = setup({despesaContext: {verboHttp: "GET"}});
            await onSubmit({}, jest.fn());
            expect(deps.mutationCreate.mutate).not.toHaveBeenCalled();
            expect(deps.mutationUpdate.mutate).not.toHaveBeenCalled();
        });

        it.each([
            ["checkbox desmarcado", {checkBoxOutrosMotivosPagamentoAntecipado: false}],
            ["texto vazio", {txtOutrosMotivosPagamentoAntecipado: "   "}],
        ])("zera outros motivos com %s", async (_, extra) => {
            const {onSubmit} = setup(extra);
            const values = {};
            await onSubmit(values, jest.fn());
            expect(values.outros_motivos_pagamento_antecipado).toBe("");
        });

        it("não salva e reabilita botão quando há erros personalizados com mensagem", async () => {
            const {deps, onSubmit} = setup({validacoesPersonalizadas: jest.fn(async () => ({campo: "inválido"}))});
            await onSubmit({}, jest.fn());
            expect(deps.setFormErrors).toHaveBeenCalledWith({campo: "inválido"});
            expect(deps.habilitaBtnSalvar).toHaveBeenCalled();
            expect(deps.mutationCreate.mutate).not.toHaveBeenCalled();
        });

        it("ignora erros personalizados vazios/nulos", async () => {
            const {deps, onSubmit} = setup({validacoesPersonalizadas: jest.fn(async () => ({a: null, b: undefined, c: ""}))});
            await onSubmit({}, jest.fn());
            expect(deps.mutationCreate.mutate).toHaveBeenCalled();
        });

        it("não salva quando enviarFormulario é falso", async () => {
            const {deps, onSubmit} = setup({enviarFormulario: false});
            await onSubmit({}, jest.fn());
            expect(deps.habilitaBtnSalvar).toHaveBeenCalled();
            expect(deps.mutationCreate.mutate).not.toHaveBeenCalled();
        });

        describe("origem análise de lançamento", () => {
            beforeEach(() => metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true));

            it("envia uuid_solicitacao_acerto a partir de uuid_acerto_documento", async () => {
                const {onSubmit} = setup({parametroLocation: {state: {uuid_acerto_documento: "doc", uuid_solicitacao_acerto: "sol"}}});
                const values = {};
                await onSubmit(values, jest.fn());
                expect(values.uuid_solicitacao_acerto).toBe("doc");
            });

            it("usa uuid_solicitacao_acerto como fallback", async () => {
                const {onSubmit} = setup({parametroLocation: {state: {uuid_solicitacao_acerto: "sol"}}});
                const values = {};
                await onSubmit(values, jest.fn());
                expect(values.uuid_solicitacao_acerto).toBe("sol");
            });

            it("não define uuid quando não existe no state", async () => {
                const {onSubmit} = setup({parametroLocation: {state: {}}});
                const values = {};
                await onSubmit(values, jest.fn());
                expect(values).not.toHaveProperty("uuid_solicitacao_acerto");
            });
        });
    });

    it("onSubmitRef.current aponta para onSubmit", () => {
        const {onSubmit, onSubmitRef} = setup();
        expect(onSubmitRef.current).toBe(onSubmit);
    });

    describe("handleErroCriarDespesa", () => {
        it("exibe mensagem genérica sem response.data", () => {
            const {handleErroCriarDespesa} = setup();
            handleErroCriarDespesa(undefined);
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao tentar salvar despesa.",
                "Verifique se os dados foram preenchidos corretamente."
            );
        });

        it("usa getErrorMessage quando há response.data", () => {
            getErrorMessage.mockReturnValue("mensagem da API");
            const {handleErroCriarDespesa} = setup();
            const response = {data: {x: 1}};
            handleErroCriarDespesa(response);
            expect(getErrorMessage).toHaveBeenCalledWith({response}, "Ocorreu um erro criar/editar despesa.");
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao tentar salvar despesa.", "mensagem da API");
        });
    });
});
