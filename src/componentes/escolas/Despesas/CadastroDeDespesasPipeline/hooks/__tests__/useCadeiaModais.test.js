import {renderHook} from "@testing-library/react";
import {useCadeiaModais} from "../useCadeiaModais";
import {getDespesaCadastrada, getMotivosPagamentoAntecipado} from "../../../../../../services/escolas/Despesas.service";
import {validaPayloadDespesas, metodosAuxiliares} from "../../utils";

jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
    getDespesaCadastrada: jest.fn(),
    getMotivosPagamentoAntecipado: jest.fn(),
}));
jest.mock("../../utils", () => ({
    validaPayloadDespesas: jest.fn(),
    metodosAuxiliares: {
        verificarSaldo: jest.fn(),
        origemAnaliseLancamento: jest.fn(),
        mantemConciliacaoAtual: jest.fn(),
    },
}));

const makeDeps = (extra = {}) => ({
    despesaContext: {
        idDespesa: 3,
        initialValues: {motivos_pagamento_antecipado: [{id: 9}], outros_motivos_pagamento_antecipado: "x"},
    },
    parametroLocation: {state: {}},
    setExibeMsgErroValorRecursos: jest.fn(),
    setExibeMsgErroValorOriginal: jest.fn(),
    setSaldosInsuficientesDaConta: jest.fn(),
    setSaldosInsuficientesDaAcao: jest.fn(),
    setModalState: jest.fn(),
    acaoNaoAceitaTipoRecurso: jest.fn(() => []),
    setListaDemotivosPagamentoAntecipado: jest.fn(),
    setSelectMotivosPagamentoAntecipado: jest.fn(),
    setTxtOutrosMotivosPagamentoAntecipado: jest.fn(),
    habilitaBtnSalvar: jest.fn(),
    onSubmitRef: {current: jest.fn()},
    ...extra,
});

const setup = (extra) => {
    const deps = makeDeps(extra);
    const {result} = renderHook(() => useCadeiaModais(deps));
    return {deps, ...result.current};
};

const setf = jest.fn();

describe("useCadeiaModais", () => {
    beforeEach(() => {
        metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);
        metodosAuxiliares.verificarSaldo.mockResolvedValue({situacao_do_saldo: "ok"});
        getDespesaCadastrada.mockResolvedValue({despesa_ja_lancada: false});
        getMotivosPagamentoAntecipado.mockResolvedValue([{id: 1}]);
        document.body.innerHTML = "";
    });

    describe("serviceIniciaEncadeamentoDosModais", () => {
        it("sinaliza erros de valor e reabilita botão quando há erros", async () => {
            const {deps, serviceIniciaEncadeamentoDosModais} = setup();
            await serviceIniciaEncadeamentoDosModais({}, {valor_recusos_acoes: "x", valor_original: "y"}, setf);
            expect(deps.setExibeMsgErroValorRecursos).toHaveBeenCalledWith(true);
            expect(deps.setExibeMsgErroValorOriginal).toHaveBeenCalledWith(true);
            expect(deps.habilitaBtnSalvar).toHaveBeenCalled();
            expect(metodosAuxiliares.verificarSaldo).not.toHaveBeenCalled();
        });

        it("limpa mensagens e segue até o submit sem data_transacao", async () => {
            const {deps, serviceIniciaEncadeamentoDosModais} = setup();
            const values = {rateios: [], data_transacao: null};
            await serviceIniciaEncadeamentoDosModais(values, {}, setf);
            expect(deps.setExibeMsgErroValorRecursos).toHaveBeenCalledWith(false);
            expect(deps.setExibeMsgErroValorOriginal).toHaveBeenCalledWith(false);
            expect(deps.setModalState).toHaveBeenCalledWith("close");
            expect(deps.onSubmitRef.current).toHaveBeenCalledWith(values, setf);
        });

        it("aceita errors nulo (sem erros)", async () => {
            const {serviceIniciaEncadeamentoDosModais} = setup();
            await expect(serviceIniciaEncadeamentoDosModais({rateios: []}, {}, setf)).resolves.toBeUndefined();
        });
    });

    describe("saldo da conta", () => {
        it.each(["saldo_conta_insuficiente", "lancamento_anterior_implantacao"])(
            "abre modal de saldo insuficiente da conta (%s)",
            async (situacao) => {
                const retorno = {situacao_do_saldo: situacao};
                metodosAuxiliares.verificarSaldo.mockResolvedValue(retorno);
                const {deps, serviceIniciaEncadeamentoDosModais} = setup();
                await serviceIniciaEncadeamentoDosModais({data_transacao: "2026-01-01", rateios: []}, {}, setf);
                expect(deps.setSaldosInsuficientesDaConta).toHaveBeenCalledWith(retorno);
                expect(deps.setModalState).toHaveBeenCalledWith("saldo-insuficiente-conta");
                expect(deps.onSubmitRef.current).not.toHaveBeenCalled();
            }
        );

        it("impossivel_determinar pula direto para o submit", async () => {
            metodosAuxiliares.verificarSaldo.mockResolvedValue({situacao_do_saldo: "impossivel_determinar"});
            const {deps, serviceIniciaEncadeamentoDosModais} = setup();
            await serviceIniciaEncadeamentoDosModais({data_transacao: "2026-01-01", rateios: []}, {}, setf);
            expect(deps.setModalState).toHaveBeenCalledWith("close");
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });
    });

    describe("serviceSubmitModais", () => {
        it("saldo_insuficiente_conta_validado abre modal quando ação não aceita tipo de recurso", async () => {
            const {deps, serviceSubmitModais} = setup({acaoNaoAceitaTipoRecurso: jest.fn(() => ["acao"])});
            await serviceSubmitModais({}, setf, {}, "saldo_insuficiente_conta_validado");
            expect(deps.setModalState).toHaveBeenCalledWith("acao-nao-aceita-tipo-de-aplicacao");
        });

        it("acao_nao_aceita_tipo_de_aplicacao_validado abre modal de saldo insuficiente da ação", async () => {
            const retorno = {situacao_do_saldo: "saldo_insuficiente"};
            metodosAuxiliares.verificarSaldo.mockResolvedValue(retorno);
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais({data_transacao: "2026-01-01"}, setf, {}, "acao_nao_aceita_tipo_de_aplicacao_validado");
            expect(deps.setSaldosInsuficientesDaAcao).toHaveBeenCalledWith(retorno);
            expect(deps.setModalState).toHaveBeenCalledWith("saldo-insuficiente-acao");
        });

        it("saldo da ação suficiente avança para despesa já demonstrada (sem conferido)", async () => {
            const {deps, serviceSubmitModais} = setup();
            const values = {data_transacao: "2026-01-01", rateios: [{conferido: false}]};
            await serviceSubmitModais(values, setf, {}, "acao_nao_aceita_tipo_de_aplicacao_validado");
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("saldo_insuficiente_acao_validado abre modal quando há rateio conferido", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais({rateios: [{conferido: true}]}, setf, {}, "saldo_insuficiente_acao_validado");
            expect(deps.setModalState).toHaveBeenCalledWith("despesa-ja-demonstrada");
        });

        it("saldo_insuficiente_acao_validado na análise de lançamento mantém conciliação e segue", async () => {
            metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
            const {deps, serviceSubmitModais} = setup();
            const values = {rateios: [{conferido: true}]};
            await serviceSubmitModais(values, setf, {}, "saldo_insuficiente_acao_validado");
            expect(metodosAuxiliares.mantemConciliacaoAtual).toHaveBeenCalledWith(values);
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("despesa_ja_demonstrada_validado abre modal quando despesa já cadastrada", async () => {
            getDespesaCadastrada.mockResolvedValue({despesa_ja_lancada: true});
            const {deps, serviceSubmitModais} = setup();
            const values = {tipo_documento: 1, numero_documento: "10", cpf_cnpj_fornecedor: "123"};
            await serviceSubmitModais(values, setf, {}, "despesa_ja_demonstrada_validado");
            expect(getDespesaCadastrada).toHaveBeenCalledWith(1, "10", "123", 3);
            expect(deps.setModalState).toHaveBeenCalledWith("despesa-ja-cadastrada");
        });

        it("despesa_ja_demonstrada_validado não consulta duplicidade se já tem uuid", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais(
                {tipo_documento: 1, numero_documento: "10", uuid: "u", rateios: []}, setf, {}, "despesa_ja_demonstrada_validado"
            );
            expect(getDespesaCadastrada).not.toHaveBeenCalled();
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("despesa_ja_demonstrada_validado segue quando não é duplicada", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais(
                {tipo_documento: 1, numero_documento: "10", rateios: []}, setf, {}, "despesa_ja_demonstrada_validado"
            );
            expect(getDespesaCadastrada).toHaveBeenCalled();
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("despesa_ja_cadastrada_validado abre modal de pagamento antecipado", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais(
                {data_transacao: "2026-01-01", data_documento: "2026-02-01"}, setf, {}, "despesa_ja_cadastrada_validado"
            );
            expect(deps.setListaDemotivosPagamentoAntecipado).toHaveBeenCalledWith([{id: 1}]);
            expect(deps.setSelectMotivosPagamentoAntecipado).toHaveBeenCalledWith([{id: 9}]);
            expect(deps.setTxtOutrosMotivosPagamentoAntecipado).toHaveBeenCalledWith("x");
            expect(deps.setModalState).toHaveBeenCalledWith("pagamento-antecipado");
        });

        it("despesa_ja_cadastrada_validado segue se pagamento não é antecipado", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais(
                {data_transacao: "2026-03-01", data_documento: "2026-02-01", rateios: []}, setf, {}, "despesa_ja_cadastrada_validado"
            );
            expect(getMotivosPagamentoAntecipado).not.toHaveBeenCalled();
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("pagamento_antecipado_validado abre modal quando há campos incompletos", async () => {
            document.body.innerHTML = '<div class="despesa_incompleta"></div><div class="despesa_incompleta"></div>';
            const {deps, serviceSubmitModais} = setup();
            const values = {};
            await serviceSubmitModais(values, setf, {}, "pagamento_antecipado_validado");
            expect(values.despesa_incompleta).toBe(2);
            expect(deps.setModalState).toHaveBeenCalledWith("despesa-imcompleta");
        });

        it("pagamento_antecipado_validado segue quando completa", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais({}, setf, {}, "pagamento_antecipado_validado");
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("pagamento_antecipado_validado ignora incompletude na análise de lançamento", async () => {
            metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
            document.body.innerHTML = '<div class="despesa_incompleta"></div>';
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais({}, setf, {}, "pagamento_antecipado_validado");
            expect(deps.setModalState).not.toHaveBeenCalledWith("despesa-imcompleta");
            expect(deps.onSubmitRef.current).toHaveBeenCalled();
        });

        it("despesa_incompleta_validado fecha modal e submete", async () => {
            const {deps, serviceSubmitModais} = setup();
            const values = {a: 1};
            await serviceSubmitModais(values, setf, {}, "despesa_incompleta_validado");
            expect(deps.setModalState).toHaveBeenCalledWith("close");
            expect(deps.onSubmitRef.current).toHaveBeenCalledWith(values, setf);
        });

        it("mensagem desconhecida não faz nada", async () => {
            const {deps, serviceSubmitModais} = setup();
            await serviceSubmitModais({}, setf, {}, "qualquer");
            expect(deps.setModalState).not.toHaveBeenCalled();
            expect(deps.onSubmitRef.current).not.toHaveBeenCalled();
        });
    });

    it("validaMotivosPagamentoAntecipado sem datas segue para o próximo passo", async () => {
        const {deps, validaMotivosPagamentoAntecipado} = setup();
        await validaMotivosPagamentoAntecipado({}, {}, setf);
        expect(validaPayloadDespesas).toHaveBeenCalled();
        expect(deps.onSubmitRef.current).toHaveBeenCalled();
    });
});
