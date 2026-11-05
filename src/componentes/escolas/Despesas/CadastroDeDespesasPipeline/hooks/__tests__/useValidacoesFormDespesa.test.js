import {renderHook} from "@testing-library/react";
import {useValidacoesFormDespesa} from "../useValidacoesFormDespesa";
import {getPeriodoFechadoCached} from "../../utils/getPeriodoFechadoCached";
import {valida_cpf_cnpj, metodosAuxiliares} from "../../utils";

jest.mock("../../utils/getPeriodoFechadoCached", () => ({getPeriodoFechadoCached: jest.fn()}));
jest.mock("../../utils", () => ({
    valida_cpf_cnpj: jest.fn(),
    metodosAuxiliares: {
        origemAnaliseLancamento: jest.fn(),
        get_nome_razao_social: jest.fn(),
        getErroValorRealizadoRateios: jest.fn(),
        getErroValorOriginalRateios: jest.fn(),
    },
}));

const makeDeps = (extra = {}) => ({
    salvandoDespesaRef: {current: false},
    setEnviarFormulario: jest.fn(),
    setBtnSubmitDisable: jest.fn(),
    parametroLocation: {state: {periodo_uuid: "p1"}},
    retornaPeriodo: jest.fn(),
    setReadOnlyBtnAcao: jest.fn(),
    setShowPeriodoFechado: jest.fn(),
    setReadOnlyCampos: jest.fn(),
    onShowErroGeral: jest.fn(),
    setShowPeriodoFechadoImposto: jest.fn(),
    setDisableBtnAdicionarImposto: jest.fn(),
    setReadOnlyCamposImposto: jest.fn(),
    eh_despesa_reconhecida: jest.fn(() => true),
    despesasTabelas: {tipos_documento: [{id: 1, numero_documento_digitado: true, pode_reter_imposto: true}]},
    setNumeroDocumentoReadOnly: jest.fn(),
    setShowRetencaoImposto: jest.fn(),
    ...extra,
});

const setup = (extra) => {
    const deps = makeDeps(extra);
    const {result} = renderHook(() => useValidacoesFormDespesa(deps));
    return {deps, ...result.current};
};

const setf = jest.fn();

describe("useValidacoesFormDespesa", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        valida_cpf_cnpj.mockReturnValue(true);
        metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);
        metodosAuxiliares.getErroValorRealizadoRateios.mockReturnValue(0);
        metodosAuxiliares.getErroValorOriginalRateios.mockReturnValue(0);
        getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: true, periodo_referencia: "2026.1"});
    });

    afterEach(() => jest.restoreAllMocks());

    describe("validacoesPersonalizadas", () => {
        it("sem erros habilita envio e botão", async () => {
            const {deps, validacoesPersonalizadas} = setup();
            const erros = await validacoesPersonalizadas({cpf_cnpj_fornecedor: "123", nome_fornecedor: "n"}, setf);
            expect(erros).toEqual({});
            expect(metodosAuxiliares.get_nome_razao_social).toHaveBeenCalledWith("123", setf, "n");
            expect(deps.setEnviarFormulario).toHaveBeenLastCalledWith(true);
            expect(deps.setBtnSubmitDisable).toHaveBeenLastCalledWith(false);
        });

        it("não reabilita botão enquanto salva", async () => {
            const {deps, validacoesPersonalizadas} = setup({salvandoDespesaRef: {current: true}});
            await validacoesPersonalizadas({}, setf);
            expect(deps.setBtnSubmitDisable).not.toHaveBeenCalled();
        });

        it("exige boletim de ocorrência para despesa não reconhecida", async () => {
            const {deps, validacoesPersonalizadas} = setup({eh_despesa_reconhecida: jest.fn(() => false)});
            const erros = await validacoesPersonalizadas({}, setf);
            expect(erros).toEqual({numero_boletim_de_ocorrencia: "Digite um número de boletim de ocorrência"});
            expect(deps.setEnviarFormulario).toHaveBeenCalledWith(false);
            expect(deps.setBtnSubmitDisable).toHaveBeenCalledWith(true);
        });

        it("aceita despesa não reconhecida com boletim", async () => {
            const {validacoesPersonalizadas} = setup({eh_despesa_reconhecida: jest.fn(() => false)});
            expect(await validacoesPersonalizadas({numero_boletim_de_ocorrencia: "123"}, setf)).toEqual({});
        });

        it("rejeita CPF/CNPJ inválido", async () => {
            valida_cpf_cnpj.mockReturnValue(false);
            const {deps, validacoesPersonalizadas} = setup();
            const erros = await validacoesPersonalizadas({cpf_cnpj_fornecedor: "1"}, setf);
            expect(erros).toEqual({cpf_cnpj_fornecedor: "Digite um CPF ou um CNPJ válido"});
            expect(deps.setEnviarFormulario).toHaveBeenLastCalledWith(false);
            expect(metodosAuxiliares.get_nome_razao_social).not.toHaveBeenCalled();
        });

        it("rejeita CPF/CNPJ só com espaços", async () => {
            const {validacoesPersonalizadas} = setup();
            const erros = await validacoesPersonalizadas({cpf_cnpj_fornecedor: "   "}, setf);
            expect(erros.cpf_cnpj_fornecedor).toBeDefined();
        });

        describe("despesa principal (fluxo normal)", () => {
            it("marca período fechado", async () => {
                getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: false});
                const {deps, validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                expect(erros).toEqual({data_transacao: "Período Fechado"});
                expect(deps.setEnviarFormulario).toHaveBeenLastCalledWith(false);
                expect(deps.setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
                expect(deps.setShowPeriodoFechado).toHaveBeenCalledWith(true);
                expect(deps.setReadOnlyCampos).toHaveBeenCalledWith(true);
            });

            it("período fechado com retenção de imposto mantém envio habilitado", async () => {
                getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: false});
                const {deps, validacoesPersonalizadas} = setup();
                await validacoesPersonalizadas({data_transacao: "2026-03-10", retem_imposto: true}, setf, "despesa_principal");
                expect(deps.setEnviarFormulario).toHaveBeenLastCalledWith(true);
            });

            it("período aberto libera campos", async () => {
                const {deps, validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                expect(erros).toEqual({});
                expect(deps.setReadOnlyBtnAcao).toHaveBeenCalledWith(false);
                expect(deps.setShowPeriodoFechado).toHaveBeenCalledWith(false);
                expect(deps.setReadOnlyCampos).toHaveBeenCalledWith(false);
            });

            it("erro na API bloqueia e exibe erro geral", async () => {
                getPeriodoFechadoCached.mockRejectedValue(new Error("x"));
                const {deps, validacoesPersonalizadas} = setup();
                await validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                expect(deps.onShowErroGeral).toHaveBeenCalled();
                expect(deps.setReadOnlyCampos).toHaveBeenCalledWith(true);
            });

            it("retorna null quando uma validação mais nova supera a resposta (sucesso)", async () => {
                let resolve1;
                getPeriodoFechadoCached
                    .mockImplementationOnce(() => new Promise((r) => { resolve1 = r; }))
                    .mockResolvedValueOnce({aceita_alteracoes: true});
                const {validacoesPersonalizadas} = setup();
                const p1 = validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                const p2 = validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                resolve1({aceita_alteracoes: true});
                expect(await p1).toBeNull();
                expect(await p2).toEqual({});
            });

            it("retorna null quando validação stale falha na API", async () => {
                let reject1;
                getPeriodoFechadoCached
                    .mockImplementationOnce(() => new Promise((_, r) => { reject1 = r; }))
                    .mockResolvedValueOnce({aceita_alteracoes: true});
                const {deps, validacoesPersonalizadas} = setup();
                const p1 = validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                const p2 = validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, "despesa_principal");
                reject1(new Error("x"));
                expect(await p1).toBeNull();
                await p2;
                expect(deps.onShowErroGeral).not.toHaveBeenCalled();
            });

            it("não consulta período sem data_transacao ou para outra origem", async () => {
                const {validacoesPersonalizadas} = setup();
                await validacoesPersonalizadas({}, setf, "despesa_principal");
                await validacoesPersonalizadas({data_transacao: "2026-03-10"}, setf, null);
                expect(getPeriodoFechadoCached).not.toHaveBeenCalled();
            });
        });

        describe("despesa principal (análise de lançamento)", () => {
            beforeEach(() => metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true));
            const values = {data_transacao: "2026-03-10"};

            it("aceita data dentro do período da devolução", async () => {
                const {deps, validacoesPersonalizadas} = setup({retornaPeriodo: jest.fn(async () => ({referencia: "2026.1"}))});
                const erros = await validacoesPersonalizadas(values, setf, "despesa_principal");
                expect(erros).toEqual({data_transacao: null});
                expect(deps.retornaPeriodo).toHaveBeenCalledWith("p1");
                expect(deps.setReadOnlyBtnAcao).toHaveBeenCalledWith(false);
                expect(getPeriodoFechadoCached).toHaveBeenCalledTimes(1);
            });

            it("rejeita data fora do período da devolução", async () => {
                const {deps, validacoesPersonalizadas} = setup({retornaPeriodo: jest.fn(async () => ({referencia: "2025.2"}))});
                const erros = await validacoesPersonalizadas(values, setf, "despesa_principal");
                expect(erros.data_transacao).toMatch(/período referente à devolução/);
                expect(deps.setReadOnlyBtnAcao).toHaveBeenCalledWith(true);
            });

            it("trata erro ao buscar período", async () => {
                const {validacoesPersonalizadas} = setup({retornaPeriodo: jest.fn(async () => { throw new Error("x"); })});
                await expect(validacoesPersonalizadas(values, setf, "despesa_principal")).resolves.toEqual({});
            });

            it("retorna null se stale", async () => {
                let resolve1;
                const retornaPeriodo = jest.fn()
                    .mockImplementationOnce(() => new Promise((r) => { resolve1 = r; }))
                    .mockResolvedValueOnce({referencia: "2026.1"});
                const {validacoesPersonalizadas} = setup({retornaPeriodo});
                const p1 = validacoesPersonalizadas(values, setf, "despesa_principal");
                const p2 = validacoesPersonalizadas(values, setf, "despesa_principal");
                await new Promise((r) => setTimeout(r, 0));
                resolve1({referencia: "2026.1"});
                expect(await p1).toBeNull();
                await p2;
            });

            it("retorna null se stale e a busca falha", async () => {
                let reject1;
                const retornaPeriodo = jest.fn()
                    .mockImplementationOnce(() => new Promise((_, r) => { reject1 = r; }))
                    .mockResolvedValueOnce({referencia: "2026.1"});
                const {validacoesPersonalizadas} = setup({retornaPeriodo});
                const p1 = validacoesPersonalizadas(values, setf, "despesa_principal");
                const p2 = validacoesPersonalizadas(values, setf, "despesa_principal");
                await new Promise((r) => setTimeout(r, 0));
                reject1(new Error("x"));
                expect(await p1).toBeNull();
                await p2;
            });
        });

        describe("despesa imposto", () => {
            const comImposto = (dataImposto, dataPrincipal = "2026-03-10") => ({
                data_transacao: dataPrincipal,
                despesas_impostos: [{data_transacao: dataImposto}],
            });

            it("erro quando imposto sem data da despesa principal", async () => {
                const {deps, validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas(comImposto("2026-03-12", ""), setf, "despesa_imposto", 0);
                expect(erros).toEqual({despesa_imposto_data_transacao: "Data do imposto sem data de despesa"});
                expect(deps.setBtnSubmitDisable).toHaveBeenCalledWith(true);
            });

            it("erro quando data do imposto é anterior à da despesa", async () => {
                const {deps, validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas(comImposto("2026-03-01"), setf, "despesa_imposto", 0);
                expect(erros).toEqual({despesa_imposto_data_transacao: "Data do imposto menor que data da despesa"});
                expect(deps.setEnviarFormulario).toHaveBeenLastCalledWith(false);
            });

            it("libera campos do imposto quando período está aberto", async () => {
                const {deps, validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas(comImposto("2026-03-12"), setf, "despesa_imposto", 0);
                expect(erros).toEqual({});
                expect(deps.setShowPeriodoFechadoImposto).toHaveBeenCalledWith(false);
                expect(deps.setDisableBtnAdicionarImposto).toHaveBeenCalledWith(false);
                expect(deps.setReadOnlyCamposImposto.mock.calls[0][0]({})).toEqual({0: false});
            });

            it("bloqueia imposto em período fechado", async () => {
                getPeriodoFechadoCached.mockResolvedValue({aceita_alteracoes: false});
                const {deps, validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas(comImposto("2026-03-12"), setf, "despesa_imposto", 0);
                expect(erros).toEqual({despesa_imposto_data_transacao: null});
                expect(deps.setShowPeriodoFechadoImposto).toHaveBeenCalledWith(true);
                expect(deps.setDisableBtnAdicionarImposto).toHaveBeenCalledWith(true);
                expect(deps.setReadOnlyCamposImposto.mock.calls[0][0]({})).toEqual({0: true});
            });

            it("erro na API bloqueia e exibe erro geral", async () => {
                getPeriodoFechadoCached.mockRejectedValue(new Error("x"));
                const {deps, validacoesPersonalizadas} = setup();
                await validacoesPersonalizadas(comImposto("2026-03-12"), setf, "despesa_imposto", 0);
                expect(deps.onShowErroGeral).toHaveBeenCalled();
                expect(deps.setReadOnlyCamposImposto.mock.calls[0][0]({})).toEqual({0: true});
            });

            it("não consulta período em análise de lançamento", async () => {
                metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
                const {validacoesPersonalizadas} = setup();
                const erros = await validacoesPersonalizadas(comImposto("2026-03-12"), setf, "despesa_imposto", 0);
                expect(erros).toEqual({});
                expect(getPeriodoFechadoCached).not.toHaveBeenCalled();
            });

            it("retorna null quando stale (sucesso e erro)", async () => {
                let resolve1;
                getPeriodoFechadoCached
                    .mockImplementationOnce(() => new Promise((r) => { resolve1 = r; }))
                    .mockResolvedValueOnce({aceita_alteracoes: true});
                const {validacoesPersonalizadas} = setup();
                const v = comImposto("2026-03-12");
                const p1 = validacoesPersonalizadas(v, setf, "despesa_imposto", 0);
                const p2 = validacoesPersonalizadas(v, setf, "despesa_imposto", 0);
                resolve1({aceita_alteracoes: true});
                expect(await p1).toBeNull();
                await p2;

                let reject3;
                getPeriodoFechadoCached
                    .mockImplementationOnce(() => new Promise((_, r) => { reject3 = r; }))
                    .mockResolvedValueOnce({aceita_alteracoes: true});
                const p3 = validacoesPersonalizadas(v, setf, "despesa_imposto", 0);
                const p4 = validacoesPersonalizadas(v, setf, "despesa_imposto", 0);
                reject3(new Error("x"));
                expect(await p3).toBeNull();
                await p4;
            });
        });
    });

    describe("validateFormDespesas", () => {
        it("conta campos inválidos do DOM e não retorna erros quando tudo confere", async () => {
            document.body.innerHTML = '<input class="is_invalid"/><input class="is_invalid"/>';
            const {validateFormDespesas} = setup();
            const values = {};
            expect(await validateFormDespesas(values)).toEqual({});
            expect(values.qtde_erros_form_despesa).toBe(2);
            document.body.innerHTML = "";
        });

        it("configura número do documento e retenção de imposto pelo tipo (id numérico)", async () => {
            const {deps, validateFormDespesas} = setup();
            await validateFormDespesas({tipo_documento: "1", numero_documento: "9"});
            expect(deps.setNumeroDocumentoReadOnly).toHaveBeenCalledWith(false);
            expect(deps.setShowRetencaoImposto).toHaveBeenCalledWith(true);
        });

        it("aceita tipo_documento como objeto e limpa número quando não é digitado", async () => {
            const {deps, validateFormDespesas} = setup({
                despesasTabelas: {tipos_documento: [{id: 1, numero_documento_digitado: false, pode_reter_imposto: false}]},
            });
            const values = {tipo_documento: {id: 1}, numero_documento: "9"};
            await validateFormDespesas(values);
            expect(values.numero_documento).toBe("");
            expect(deps.setNumeroDocumentoReadOnly).toHaveBeenCalledWith(true);
            expect(deps.setShowRetencaoImposto).toHaveBeenCalledWith(false);
        });

        it("trata tipo de documento não encontrado ou tabelas ausentes", async () => {
            const a = setup();
            await a.validateFormDespesas({tipo_documento: "99"});
            expect(a.deps.setNumeroDocumentoReadOnly).toHaveBeenCalledWith(false);
            expect(a.deps.setShowRetencaoImposto).toHaveBeenCalledWith(false);

            const b = setup({despesasTabelas: null});
            await b.validateFormDespesas({tipo_documento: "1"});
            expect(b.deps.setShowRetencaoImposto).toHaveBeenCalledWith(false);
        });

        it("reporta diferença de valores dos recursos e originais", async () => {
            metodosAuxiliares.getErroValorRealizadoRateios.mockReturnValue(10);
            metodosAuxiliares.getErroValorOriginalRateios.mockReturnValue(5);
            const {validateFormDespesas} = setup();
            const errors = await validateFormDespesas({});
            expect(errors.valor_recusos_acoes).toMatch(/O total das despesas classificadas/);
            expect(errors.valor_original).toMatch(/O total das despesas originais/);
        });
    });
});
