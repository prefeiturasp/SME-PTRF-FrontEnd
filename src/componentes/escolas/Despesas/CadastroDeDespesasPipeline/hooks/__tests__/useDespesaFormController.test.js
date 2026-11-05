import React from "react";
import {renderHook, act} from "@testing-library/react";
import {useParams, useLocation} from "react-router-dom";
import {useDespesaFormController} from "../useDespesaFormController";
import {DespesaContext} from "../../../../../../context/Despesa";
import {useDespesaTabelas} from "../useDespesaTabelas";
import {useValidacoesFormDespesa} from "../useValidacoesFormDespesa";
import {useFluxoSalvarDespesa} from "../useFluxoSalvarDespesa";
import {useMutationDespesaConfirmavel} from "../useMutationDespesaConfirmavel";
import {periodoFechado, periodoFechadoImposto, metodosAuxiliares} from "../../utils";
import {deleteDespesa, getValidarDataDaDespesa} from "../../../../../../services/escolas/Despesas.service";
import {getPeriodoPorUuid} from "../../../../../../services/sme/Parametrizacoes.service";
import {visoesService} from "../../../../../../services/visoes.service";
import {getErrorMessage} from "../../../../../../utils/obtemMsgErroAxios";
import {toastCustom} from "../../../../../Globais/ToastCustom";

jest.mock("react-router-dom", () => ({useParams: jest.fn(), useLocation: jest.fn()}));
jest.mock("../useDespesaTabelas", () => ({useDespesaTabelas: jest.fn()}));
jest.mock("../useValidacoesFormDespesa", () => ({useValidacoesFormDespesa: jest.fn()}));
jest.mock("../useFluxoSalvarDespesa", () => ({useFluxoSalvarDespesa: jest.fn()}));
jest.mock("../useMutationDespesaConfirmavel", () => ({useMutationDespesaConfirmavel: jest.fn()}));
jest.mock("../../utils", () => ({
    periodoFechado: jest.fn(),
    periodoFechadoImposto: jest.fn(),
    comparaObjetos: (a, b) => JSON.stringify(a) === JSON.stringify(b),
    trataNumericos: (v) => (typeof v === "string" ? Number(v.replace(/[^\d,]/g, "").replace(",", ".")) : v),
    metodosAuxiliares: {
        origemAnaliseLancamento: jest.fn(),
        getPath: jest.fn(),
        exibeDocumentoTransacao: jest.fn(),
        exibeDocumentoTransacaoImpostoUseEffect: jest.fn(),
        bloqueiaCamposDespesaPrincipal: jest.fn(),
        bloqueiaCamposDespesaImposto: jest.fn(),
        temPermissaoEdicao: jest.fn(),
        ehOperacaoExclusao: jest.fn(),
    },
}));
jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
    deleteDespesa: jest.fn(),
    getValidarDataDaDespesa: jest.fn(),
}));
jest.mock("../../../../../../services/sme/Parametrizacoes.service", () => ({getPeriodoPorUuid: jest.fn()}));
jest.mock("../../../../../../services/visoes.service", () => ({
    visoesService: {getItemUsuarioLogado: jest.fn()},
}));
jest.mock("../../../../../../utils/obtemMsgErroAxios", () => ({getErrorMessage: jest.fn()}));
jest.mock("../../../../../Globais/ToastCustom", () => ({toastCustom: {ToastCustomError: jest.fn()}}));

const aux = metodosAuxiliares;

let tabelasState;
let ctxValue;
let validacoes;
let fluxo;
let mutationArgs;

const baseContexto = ({initialValues, ...extra} = {}) => ({
    idDespesa: "d1",
    verboHttp: "POST",
    ...extra,
    initialValues: {
        outros_motivos_pagamento_antecipado: "",
        rateios: [],
        despesas_impostos: [],
        ...initialValues,
    },
});

const wrapper = ({children}) => <DespesaContext.Provider value={ctxValue}>{children}</DespesaContext.Provider>;

const setup = (props = {}, contexto = {}) => {
    ctxValue = baseContexto(contexto);
    return renderHook(
        () => useDespesaFormController({verbo_http: "POST", veioDeSituacaoPatrimonial: false, ...props}),
        {wrapper}
    );
};

describe("useDespesaFormController", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
        tabelasState = {
            despesasTabelas: {
                contas_associacao: [],
                tipos_documento: [],
                tipos_custeio: [],
                acoes_associacao: [],
            },
            especificaoes_capital: [],
            especificacoes_custeio: {},
            loading: false,
            setLoading: jest.fn(),
        };
        useDespesaTabelas.mockImplementation(() => tabelasState);
        validacoes = {validacoesPersonalizadas: jest.fn(async () => ({})), validateFormDespesas: jest.fn()};
        useValidacoesFormDespesa.mockImplementation(() => validacoes);
        fluxo = {
            onSubmit: jest.fn(),
            serviceIniciaEncadeamentoDosModais: jest.fn(),
            serviceSubmitModais: jest.fn(),
            validaMotivosPagamentoAntecipado: jest.fn(),
        };
        useFluxoSalvarDespesa.mockImplementation(() => fluxo);
        useMutationDespesaConfirmavel.mockImplementation((...args) => {
            mutationArgs = args;
            return {mutationCreate: {id: "c"}, mutationUpdate: {id: "u"}};
        });
        useParams.mockReturnValue({origem: "lista"});
        useLocation.mockReturnValue({state: {}});
        visoesService.getItemUsuarioLogado.mockReturnValue("UE");
        aux.origemAnaliseLancamento.mockReturnValue(false);
        aux.temPermissaoEdicao.mockReturnValue(true);
        aux.ehOperacaoExclusao.mockReturnValue(false);
        periodoFechado.mockResolvedValue(undefined);
        periodoFechadoImposto.mockResolvedValue(undefined);
    });

    afterEach(() => jest.restoreAllMocks());

    describe("estrutura e integração", () => {
        it("expõe loading, contextos, formik e modais", () => {
            tabelasState.loading = true;
            const {result} = setup();
            expect(result.current.loading).toBe(true);
            expect(result.current.setLoading).toBe(tabelasState.setLoading);
            expect(result.current.formik.initialValues()).toBe(ctxValue.initialValues);
            expect(result.current.formik.onSubmit).toBe(fluxo.onSubmit);
            expect(result.current.formik.validateFormDespesas).toBe(validacoes.validateFormDespesas);
            expect(result.current.modais).toMatchObject({origem: "lista", despesaContext: ctxValue, show: false});
            expect(result.current.tabelas.aux).toBe(aux);
            expect(result.current.fluxo.serviceSubmitModais).toBe(fluxo.serviceSubmitModais);
        });

        it("passa parâmetros corretos para useDespesaTabelas", () => {
            setup({veioDeSituacaoPatrimonial: true});
            expect(useDespesaTabelas).toHaveBeenCalledWith({
                parametroLocation: {state: {}},
                veioDeSituacaoPatrimonial: true,
                visao_selecionada: "UE",
            });
        });

        it("veioDeSituacaoPatrimonial força modo somente leitura", () => {
            const {result} = setup({veioDeSituacaoPatrimonial: true});
            expect(result.current.ui.readOnlyCampos).toBe(true);
            expect(result.current.ui.readOnlyBtnAcao).toBe(true);
            expect(result.current.ui.btnSubmitDisable).toBe(true);
            expect(result.current.ui.disableBtnAdicionarImposto).toBe(true);
            expect(result.current.ui.bloqueiaLinkCadastrarEstorno({})).toBe(true);
        });

        it("fora de situação patrimonial os flags iniciam falsos", () => {
            const {result} = setup();
            expect(result.current.ui.readOnlyCampos).toBe(false);
            expect(result.current.ui.btnSubmitDisable).toBe(false);
        });
    });

    describe("sucesso e erro de gravação", () => {
        it("sucesso navega para a origem", async () => {
            setup();
            await mutationArgs[0]({status: 201});
            expect(aux.getPath).toHaveBeenCalledWith("lista", {state: {}});
        });

        it("erro sem response.data usa mensagem genérica", () => {
            const {result} = setup();
            act(() => mutationArgs[1](undefined));
            expect(tabelasState.setLoading).toHaveBeenCalledWith(false);
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Erro ao tentar salvar despesa.",
                "Verifique se os dados foram preenchidos corretamente."
            );
            expect(result.current.ui.btnSubmitDisable).toBe(false);
        });

        it("erro com response.data usa getErrorMessage", () => {
            getErrorMessage.mockReturnValue("detalhe");
            setup();
            act(() => mutationArgs[1]({data: {x: 1}}));
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith("Erro ao tentar salvar despesa.", "detalhe");
        });

        it("setSubmitDisabled (4º argumento) altera btnSubmitDisable", () => {
            const {result} = setup();
            act(() => mutationArgs[3](true));
            expect(result.current.ui.btnSubmitDisable).toBe(true);
        });

        it("desabilita e habilita o botão salvar", () => {
            const {result} = setup();
            act(() => result.current.ui.desabilitaBtnSalvar());
            expect(result.current.ui.btnSubmitDisable).toBe(true);
            act(() => result.current.ui.habilitaBtnSalvar());
            expect(result.current.ui.btnSubmitDisable).toBe(false);
        });
    });

    describe("contas", () => {
        const contas = [
            {uuid: "c1", nome: "Conta 1", status: "ATIVA", data_inicio: "2026-01-01", solicitacao_encerramento: null},
            {uuid: "c2", nome: "Conta 2", status: "INATIVA", data_inicio: "2026-01-01",
                solicitacao_encerramento: {status: "PENDENTE", data_de_encerramento_na_agencia: "2026-06-01"}},
            {uuid: "c3", nome: "Conta 3", status: "INATIVA", data_inicio: "2026-01-01",
                solicitacao_encerramento: {status: "APROVADA", data_de_encerramento_na_agencia: "2026-06-01"}},
            {uuid: "c4", nome: "Conta 4", status: "INATIVA", data_inicio: "2027-01-01", solicitacao_encerramento: null},
        ];

        beforeEach(() => {
            tabelasState.despesasTabelas.contas_associacao = contas.map((c) => ({...c}));
        });

        const opcoes = (hook, ...args) => hook.current.tabelas.renderContaAssociacaoOptions(...args);

        it("filterContas filtra por data de início e marca encerramento", () => {
            const {result} = setup();
            const filtradas = result.current.tabelas.filterContas("2026-03-01");
            expect(filtradas.map((c) => c.uuid)).toEqual(["c1", "c2", "c3"]);
            expect(filtradas[1].dataEncerramentoMaiorOuIgualQueDataTransacao).toBe(true);
            const imp = result.current.tabelas.filterContas("2026-07-01", true);
            expect(imp.find((c) => c.uuid === "c2").dataEncerramentoMaiorOuIgualQueDataTransacaoImposto).toBe(false);
        });

        it("filterContas aceita data já em moment", () => {
            const moment = require("moment");
            const {result} = setup();
            expect(result.current.tabelas.filterContas(moment("2026-03-01")).length).toBe(3);
        });

        it("novo lançamento: ativa selecionável, pendente desabilitada, aprovada oculta", () => {
            const {result} = setup();
            const r = opcoes(result, "2026-03-01");
            expect(r[0].props.children).toBe("Conta 1");
            expect(r[1].props.disabled).toBe(true);
            expect(r[1].props.children).toMatch(/Conta encerrada em 01\/06\/2026/);
            expect(r[2]).toBeUndefined();
        });

        it("edição: pendente desabilitada; aprovada visível/desabilitada só se já usada", () => {
            const {result} = setup(
                {verbo_http: "PUT"},
                {verboHttp: "PUT", initialValues: {
                    rateios: [{conta_associacao: {uuid: "c3"}}],
                    data_transacao: null,
                }}
            );
            const r = opcoes(result, "2026-03-01");
            expect(r[1].props.disabled).toBe(true);
            expect(r[2].props.disabled).toBe(true);
        });

        it("edição: aprovada não usada na despesa fica oculta", () => {
            const {result} = setup({verbo_http: "PUT"}, {verboHttp: "PUT"});
            const r = opcoes(result, "2026-03-01");
            expect(r[2]).toBeUndefined();
        });

        it("considera contas de impostos como já usadas", () => {
            const {result} = setup(
                {verbo_http: "PUT"},
                {verboHttp: "PUT", initialValues: {despesas_impostos: [{rateios: [{conta_associacao: "c3"}]}, {rateios: []}]}}
            );
            const r = opcoes(result, "2026-03-01");
            expect(r[2].props.disabled).toBe(true);
        });

        it("análise de lançamento: habilita se data é anterior ao encerramento, senão desabilita", () => {
            aux.origemAnaliseLancamento.mockReturnValue(true);
            const {result} = setup();
            const ate = opcoes(result, "2026-03-01");
            expect(ate[1].props.disabled).toBe(false);
            const depois = opcoes(result, "2026-07-01");
            expect(depois[1].props.disabled).toBe(true);
            const imposto = opcoes(result, "2026-03-01", true);
            expect(imposto[1].props.disabled).toBe(false);
            const impostoDepois = opcoes(result, "2026-07-01", true);
            expect(impostoDepois[1].props.disabled).toBe(true);
        });

        it("limparSelecaoContasDesabilitadas limpa contas encerradas dos rateios", () => {
            const {result} = setup();
            result.current.tabelas.filterContas("2026-07-01");
            const setFieldValue = jest.fn();
            result.current.tabelas.limparSelecaoContasDesabilitadas(setFieldValue, {
                rateios: [{conta_associacao: {uuid: "c2"}}, {conta_associacao: "c1"}, {conta_associacao: "c3"}, {}],
            });
            expect(setFieldValue).toHaveBeenCalledWith("rateios[0].conta_associacao", null);
            expect(setFieldValue).toHaveBeenCalledWith("rateios[2].conta_associacao", null);
            expect(setFieldValue).toHaveBeenCalledTimes(2);
        });

        it("limparSelecaoContasDesabilitadas limpa contas encerradas dos impostos", () => {
            const {result} = setup();
            result.current.tabelas.filterContas("2026-07-01", true);
            const setFieldValue = jest.fn();
            result.current.tabelas.limparSelecaoContasDesabilitadas(setFieldValue, {
                despesas_impostos: [
                    {rateios: [{conta_associacao: {uuid: "c2"}}]},
                    {rateios: [{conta_associacao: "c1"}]},
                    {rateios: [{conta_associacao: ""}]},
                ],
            }, true);
            expect(setFieldValue).toHaveBeenCalledWith("despesas_impostos[0].rateios[0].conta_associacao", null);
            expect(setFieldValue).toHaveBeenCalledTimes(1);
        });
    });

    describe("efeitos iniciais", () => {
        it("PUT com tipo de transação exibe documento de transação e guarda objeto de comparação", () => {
            const {result} = setup(
                {verbo_http: "PUT"},
                {verboHttp: "PUT", initialValues: {tipo_transacao: {id: 3}, a: 1, despesas_impostos: undefined}}
            );
            expect(aux.exibeDocumentoTransacao).toHaveBeenCalledWith(3, expect.any(Function), expect.any(Function), tabelasState.despesasTabelas);
            expect(aux.exibeDocumentoTransacaoImpostoUseEffect).toHaveBeenCalled();
            expect(result.current.fluxo.houveAlteracoes(ctxValue.initialValues)).toBe(false);
            expect(result.current.fluxo.houveAlteracoes({...ctxValue.initialValues, a: 2})).toBe(true);
        });

        it("PUT aceita tipo_transacao como id simples", () => {
            setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {tipo_transacao: 4}});
            expect(aux.exibeDocumentoTransacao).toHaveBeenCalledWith(4, expect.any(Function), expect.any(Function), expect.anything());
        });

        it("POST não carrega documento de transação", () => {
            setup({}, {initialValues: {tipo_transacao: 4}});
            expect(aux.exibeDocumentoTransacao).not.toHaveBeenCalled();
        });

        it("PUT com data_transacao verifica período fechado da despesa e dos impostos", () => {
            setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {data_transacao: "2026-03-01", despesas_impostos: [{rateios: []}]}});
            expect(periodoFechado).toHaveBeenCalledWith("2026-03-01", expect.any(Function), expect.any(Function), expect.any(Function), expect.any(Function));
            expect(periodoFechadoImposto).toHaveBeenCalled();
        });

        it("PUT sem impostos não verifica período dos impostos", () => {
            setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {data_transacao: "2026-03-01", despesas_impostos: undefined}});
            expect(periodoFechado).toHaveBeenCalled();
            expect(periodoFechadoImposto).not.toHaveBeenCalled();
        });

        it("onShowErroGeral passado ao período exibe modal de erro geral", () => {
            const {result} = setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {data_transacao: "2026-03-01"}});
            const onShowErroGeral = periodoFechado.mock.calls[0][4];
            act(() => onShowErroGeral());
            expect(result.current.modais.showErroGeral).toBe(true);
        });

        it("não verifica período em POST ou sem data", () => {
            setup();
            setup({verbo_http: "PUT"}, {verboHttp: "PUT"});
            expect(periodoFechado).not.toHaveBeenCalled();
        });

        it("análise de lançamento bloqueia campos em vez de consultar período", () => {
            aux.origemAnaliseLancamento.mockReturnValue(true);
            setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {data_transacao: "2026-03-01", despesas_impostos: [{rateios: []}]}});
            expect(validacoes.validateFormDespesas).toHaveBeenCalledTimes(2);
            expect(aux.bloqueiaCamposDespesaPrincipal).toHaveBeenCalled();
            expect(aux.bloqueiaCamposDespesaImposto).toHaveBeenCalled();
            expect(periodoFechado).not.toHaveBeenCalled();
        });

        it("análise de lançamento sem impostos só bloqueia a despesa principal", () => {
            aux.origemAnaliseLancamento.mockReturnValue(true);
            setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {data_transacao: "2026-03-01", despesas_impostos: undefined}});
            expect(aux.bloqueiaCamposDespesaPrincipal).toHaveBeenCalled();
            expect(aux.bloqueiaCamposDespesaImposto).not.toHaveBeenCalled();
        });
    });

    describe("rateios e ações", () => {
        it("removeRateio remove rateio sem estorno", () => {
            const {result} = setup();
            const remove = jest.fn();
            result.current.fluxo.removeRateio(remove, 1, {});
            expect(remove).toHaveBeenCalledWith(1);
        });

        it("removeRateio com estorno abre modal", () => {
            const {result} = setup();
            const remove = jest.fn();
            act(() => result.current.fluxo.removeRateio(remove, 1, {estorno: {uuid: "e"}}));
            expect(remove).not.toHaveBeenCalled();
            expect(result.current.ui.showDeletarRateioComEstorno).toBe(true);
        });

        describe("acaoNaoAceitaTipoRecurso", () => {
            const acao = (aceita) => ({uuid: "a1", acao: {aceita_capital: false, aceita_custeio: false, aceita_livre: false, ...aceita}});
            const values = (rateios) => ({rateios});
            const executa = (aceita, rateio) => {
                tabelasState.despesasTabelas.acoes_associacao = [acao(aceita)];
                setup();
                const deps = useFluxoSalvarDespesa.mock.calls.at(-1)[0];
                let mensagens;
                act(() => { mensagens = deps.acaoNaoAceitaTipoRecurso(values([rateio])); });
                return mensagens;
            };

            it("não gera mensagem sem ação", () => {
                expect(executa({}, {aplicacao_recurso: "CUSTEIO", acao_associacao: ""})).toEqual([]);
            });

            it("ação que não aceita nenhum tipo", () => {
                const m = executa({}, {aplicacao_recurso: "CUSTEIO", acao_associacao: "a1"});
                expect(m).toHaveLength(1);
                expect(m[0].mensagem).toMatch(/não aceita despesas de nenhum tipo/);
                expect(m[0].despesa).toBe(1);
            });

            it("ação que aceita apenas capital", () => {
                const m = executa({aceita_capital: true}, {aplicacao_recurso: "CUSTEIO", acao_associacao: {uuid: "a1"}});
                expect(m[0].mensagem).toMatch(/apenas despesas de capital/);
            });

            it("ação que aceita apenas custeio", () => {
                const m = executa({aceita_custeio: true}, {aplicacao_recurso: "CAPITAL", acao_associacao: "a1"});
                expect(m[0].mensagem).toMatch(/apenas despesas de custeio/);
            });

            it("ação livre ou que aceita o tipo selecionado não gera mensagem", () => {
                expect(executa({aceita_livre: true}, {aplicacao_recurso: "CUSTEIO", acao_associacao: "a1"})).toEqual([]);
            });
        });
    });

    describe("navegação e modais", () => {
        it("onShowModal abre e onCancelarTrue fecha e navega", () => {
            const {result} = setup();
            act(() => result.current.fluxo.onShowModal());
            expect(result.current.modais.show).toBe(true);
            act(() => result.current.fluxo.onCancelarTrue());
            expect(result.current.modais.show).toBe(false);
            expect(aux.getPath).toHaveBeenCalledWith("lista", {state: {}});
        });

        describe("onDeletarTrue", () => {
            const executa = async (erro) => {
                const hook = setup();
                const setShowDelete = jest.fn();
                const setLoading = jest.fn();
                if (erro) deleteDespesa.mockRejectedValue(erro);
                else deleteDespesa.mockResolvedValue({});
                await act(async () => {
                    await hook.result.current.modais.onDeletarTrue(setShowDelete, setLoading, {idDespesa: "d9"}, "orig");
                });
                return {...hook, setShowDelete, setLoading};
            };

            it("remove a despesa e navega", async () => {
                const {setShowDelete, setLoading} = await executa();
                expect(setShowDelete).toHaveBeenCalledWith(false);
                expect(setLoading).toHaveBeenCalledWith(true);
                expect(deleteDespesa).toHaveBeenCalledWith("d9");
                expect(aux.getPath).toHaveBeenCalledWith("orig", {state: {}});
            });

            it("lista itens que referenciam a despesa", async () => {
                const {result, setLoading} = await executa({response: {data: {error: {itens_erro: ["Item 1", "Item 2"]}}}});
                expect(result.current.modais.showModalErroDeletarDespesa).toBe(true);
                expect(result.current.modais.textoModalErroDeletarDespesa).toContain("Item 1");
                expect(result.current.modais.textoModalErroDeletarDespesa).toContain("Item 2");
                expect(setLoading).toHaveBeenLastCalledWith(false);
            });

            it("exibe mensagem de rateio com conta inativa", async () => {
                const {result} = await executa({response: {data: {erro: "rateio_com_conta_status_inativa", mensagem: "Conta inativa"}}});
                expect(result.current.modais.textoModalErroDeletarDespesa).toContain("Conta inativa");
            });

            it("usa mensagem genérica nos demais erros", async () => {
                const {result} = await executa(new Error("x"));
                expect(result.current.modais.textoModalErroDeletarDespesa).toContain("referenciada no sistema");
            });
        });
    });

    describe("predicados", () => {
        it("eh_despesa_com_comprovacao_fiscal", () => {
            const {result} = setup();
            const f = result.current.ui.eh_despesa_com_comprovacao_fiscal;
            expect(f({})).toBe(true);
            expect(f({eh_despesa_sem_comprovacao_fiscal: false})).toBe(true);
            expect(f({eh_despesa_sem_comprovacao_fiscal: true})).toBe(false);
        });

        it("eh_despesa_reconhecida", () => {
            const {result} = setup();
            const f = result.current.ui.eh_despesa_reconhecida;
            expect(f({})).toBe(true);
            expect(f({eh_despesa_reconhecida_pela_associacao: true})).toBe(true);
            expect(f({eh_despesa_reconhecida_pela_associacao: false})).toBe(false);
        });

        it("eh_despesa_com_retencao_imposto", () => {
            const {result} = setup();
            const f = result.current.ui.eh_despesa_com_retencao_imposto;
            expect(f({})).toBe(false);
            expect(f({retem_imposto: true})).toBe(true);
        });

        it("limpa_campos_sem_comprovacao_fiscal zera campos e rateios", () => {
            const {result} = setup();
            const setFieldValue = jest.fn();
            result.current.ui.limpa_campos_sem_comprovacao_fiscal({rateios: [{}, {}]}, setFieldValue);
            expect(setFieldValue).toHaveBeenCalledWith("cpf_cnpj_fornecedor", "");
            expect(setFieldValue).toHaveBeenCalledWith("tipo_documento", null);
            expect(setFieldValue).toHaveBeenCalledWith("rateios[1].especificacao_material_servico", "");
            expect(setFieldValue).toHaveBeenCalledTimes(8);
        });

        it("bloqueiaRateioEstornado", () => {
            const {result} = setup();
            expect(result.current.ui.bloqueiaRateioEstornado({estorno: {uuid: "e"}})).toBe(true);
            expect(result.current.ui.bloqueiaRateioEstornado({estorno: null})).toBe(false);
        });
    });

    describe("bloqueios", () => {
        const rateioCompleto = {conta_associacao: "c", acao_associacao: "a", aplicacao_recurso: "CUSTEIO", valor_rateio: "10,00"};

        it("bloqueiaLinkCadastrarEstorno depende de rateio completo", () => {
            const {result} = setup();
            const f = result.current.ui.bloqueiaLinkCadastrarEstorno;
            expect(f(rateioCompleto)).toBe(false);
            expect(f({...rateioCompleto, valor_rateio: "0,00"})).toBe(true);
            expect(f({})).toBe(true);
        });

        it("bloqueiaLinkCadastrarEstorno em análise de lançamento sem permissão ou exclusão", () => {
            aux.origemAnaliseLancamento.mockReturnValue(true);
            const {result} = setup();
            expect(result.current.ui.bloqueiaLinkCadastrarEstorno(rateioCompleto)).toBe(false);
            aux.temPermissaoEdicao.mockReturnValue(false);
            expect(result.current.ui.bloqueiaLinkCadastrarEstorno(rateioCompleto)).toBe(true);
            aux.temPermissaoEdicao.mockReturnValue(true);
            aux.ehOperacaoExclusao.mockReturnValue(true);
            expect(result.current.ui.bloqueiaLinkCadastrarEstorno(rateioCompleto)).toBe(true);
        });

        it("bloqueiaCamposDespesa", () => {
            const {result} = setup();
            expect(result.current.ui.bloqueiaCamposDespesa()).toBe(false);
            aux.origemAnaliseLancamento.mockReturnValue(true);
            aux.temPermissaoEdicao.mockReturnValue(false);
            expect(result.current.ui.bloqueiaCamposDespesa()).toBe(true);
            aux.temPermissaoEdicao.mockReturnValue(true);
            expect(result.current.ui.bloqueiaCamposDespesa()).toBe(false);
            aux.ehOperacaoExclusao.mockReturnValue(true);
            expect(result.current.ui.bloqueiaCamposDespesa()).toBe(true);
        });

        it("bloqueiaCamposDespesa quando readOnlyCampos", () => {
            const {result} = setup({verbo_http: "PUT"}, {verboHttp: "PUT", initialValues: {data_transacao: "2026-03-01"}});
            act(() => {
                const setReadOnlyCampos = periodoFechado.mock.calls[0][3];
                setReadOnlyCampos(true);
            });
            expect(result.current.ui.bloqueiaCamposDespesa()).toBe(true);
        });
    });

    describe("helpers de tabelas", () => {
        it("tipos_documento_com_recolhimento_imposto", () => {
            tabelasState.despesasTabelas.tipos_documento = [
                {id: 1, eh_documento_de_retencao_de_imposto: true},
                {id: 2, eh_documento_de_retencao_de_imposto: false},
            ];
            const {result} = setup();
            expect(result.current.tabelas.tipos_documento_com_recolhimento_imposto()).toEqual([
                {id: 1, eh_documento_de_retencao_de_imposto: true},
            ]);
        });

        it("tipos_documento_com_recolhimento_imposto sem tabelas", () => {
            tabelasState.despesasTabelas = null;
            const {result} = setup();
            expect(result.current.tabelas.tipos_documento_com_recolhimento_imposto()).toEqual([]);
        });

        it("preenche_tipo_despesa_custeio atribui tributos e tarifas ao imposto", () => {
            tabelasState.despesasTabelas.tipos_custeio = [{id: 7, nome: "Tributos", eh_tributos_e_tarifas: true}, {id: 8}];
            const {result} = setup();
            const values = {despesas_impostos: [{rateios: [{}]}]};
            expect(result.current.tabelas.preenche_tipo_despesa_custeio(values, 0)).toEqual({id: 7, nome: "Tributos", eh_tributos_e_tarifas: true});
            expect(values.despesas_impostos[0].rateios[0].tipo_custeio).toBe("7");
        });

        it("preenche_tipo_despesa_custeio sem tabela retorna vazio", () => {
            tabelasState.despesasTabelas = {};
            const {result} = setup();
            expect(result.current.tabelas.preenche_tipo_despesa_custeio({}, 0)).toBe("");
        });

        it("acoes_custeio filtra recursos próprios e ações que não aceitam custeio", () => {
            tabelasState.despesasTabelas.acoes_associacao = [
                {uuid: "1", e_recursos_proprios: false, acao: {aceita_custeio: true}},
                {uuid: "2", e_recursos_proprios: true, acao: {aceita_custeio: true}},
                {uuid: "3", e_recursos_proprios: false, acao: {aceita_custeio: false}},
            ];
            const {result} = setup();
            expect(result.current.tabelas.acoes_custeio().map((a) => a.uuid)).toEqual(["1"]);
        });

        it("acoes_custeio sem ações", () => {
            tabelasState.despesasTabelas = null;
            const {result} = setup();
            expect(result.current.tabelas.acoes_custeio()).toEqual([]);
        });

        describe("numeroDocumentoImpostoReadOnly", () => {
            beforeEach(() => {
                tabelasState.despesasTabelas.tipos_documento = [
                    {id: 1, numero_documento_digitado: false},
                    {id: 2, numero_documento_digitado: true},
                ];
            });

            it("limpa número e retorna true quando o tipo não digita número (id numérico/objeto)", () => {
                const {result} = setup();
                const values = {despesas_impostos: [{numero_documento: "9"}]};
                expect(result.current.tabelas.numeroDocumentoImpostoReadOnly("1", 0, values)).toBe(true);
                expect(values.despesas_impostos[0].numero_documento).toBe("");
                expect(result.current.tabelas.numeroDocumentoImpostoReadOnly({id: 1}, 0, values)).toBe(true);
            });

            it("retorna false quando digita número ou tipo não encontrado", () => {
                const {result} = setup();
                const values = {despesas_impostos: [{numero_documento: "9"}]};
                expect(result.current.tabelas.numeroDocumentoImpostoReadOnly("2", 0, values)).toBe(false);
                expect(result.current.tabelas.numeroDocumentoImpostoReadOnly("", 0, values)).toBe(false);
                expect(values.despesas_impostos[0].numero_documento).toBe("9");
            });

            it("retorna false sem tabela de tipos", () => {
                tabelasState.despesasTabelas = null;
                const {result} = setup();
                expect(result.current.tabelas.numeroDocumentoImpostoReadOnly("1", 0, {})).toBe(false);
            });
        });
    });

    describe("impostos", () => {
        it("setValorRateioRealizadoImposto", () => {
            const {result} = setup();
            const setFieldValue = jest.fn();
            result.current.fluxo.setValorRateioRealizadoImposto(setFieldValue, "1.234,50", 2);
            expect(setFieldValue).toHaveBeenCalledWith("despesas_impostos[2].rateios[0].valor_rateio", 1234.5);
        });

        it("mostraModalExcluirImposto só abre em PUT", () => {
            const post = setup();
            act(() => post.result.current.fluxo.mostraModalExcluirImposto());
            expect(post.result.current.ui.showExcluirImposto).toBe(false);
            const put = setup({verbo_http: "PUT"}, {verboHttp: "PUT"});
            act(() => put.result.current.fluxo.mostraModalExcluirImposto());
            expect(put.result.current.ui.showExcluirImposto).toBe(true);
        });

        it("cancelarExclusaoImposto restaura retem_imposto e fecha modal", () => {
            const {result} = setup({verbo_http: "PUT"}, {verboHttp: "PUT"});
            act(() => result.current.fluxo.mostraModalExcluirImposto());
            const setFieldValue = jest.fn();
            act(() => result.current.fluxo.cancelarExclusaoImposto(setFieldValue));
            expect(setFieldValue).toHaveBeenCalledWith("retem_imposto", true);
            expect(result.current.ui.showExcluirImposto).toBe(false);
        });
    });

    describe("motivos de pagamento antecipado", () => {
        it("checkbox inicia marcado se há outros motivos", () => {
            const {result} = setup({}, {initialValues: {outros_motivos_pagamento_antecipado: "algo"}});
            expect(result.current.fluxo.checkBoxOutrosMotivosPagamentoAntecipado).toBe(true);
        });

        it("checkbox inicia desmarcado sem outros motivos", () => {
            const {result} = setup();
            expect(result.current.fluxo.checkBoxOutrosMotivosPagamentoAntecipado).toBe(false);
        });

        it("marcar/desmarcar checkbox e editar texto", () => {
            const {result} = setup();
            act(() => result.current.fluxo.handleChangeCheckBoxOutrosMotivosPagamentoAntecipado({target: {checked: true}}));
            act(() => result.current.fluxo.handleChangeTxtOutrosMotivosPagamentoAntecipado({target: {value: "txt"}}));
            expect(result.current.fluxo.checkBoxOutrosMotivosPagamentoAntecipado).toBe(true);
            expect(result.current.fluxo.txtOutrosMotivosPagamentoAntecipado).toBe("txt");
            act(() => result.current.fluxo.handleChangeCheckBoxOutrosMotivosPagamentoAntecipado({target: {checked: false}}));
            expect(result.current.fluxo.checkBoxOutrosMotivosPagamentoAntecipado).toBe(false);
            expect(result.current.fluxo.txtOutrosMotivosPagamentoAntecipado).toBe("");
        });

        it("montaPayloadMotivosPagamentoAntecipado retorna ids selecionados", () => {
            const {result} = setup();
            act(() => result.current.fluxo.setSelectMotivosPagamentoAntecipado([{id: 1}, {id: 5}]));
            const deps = useFluxoSalvarDespesa.mock.calls.at(-1)[0];
            expect(deps.montaPayloadMotivosPagamentoAntecipado()).toEqual([1, 5]);
        });

        it("montaPayloadMotivosPagamentoAntecipado sem seleção retorna lista vazia", () => {
            setup();
            const deps = useFluxoSalvarDespesa.mock.calls.at(-1)[0];
            expect(deps.montaPayloadMotivosPagamentoAntecipado()).toEqual([]);
        });
    });

    describe("fechamento de calendário", () => {
        const data = new Date("2026-03-10T12:00:00Z");

        it("data do pagamento valida a data e não altera erros em caso de sucesso", async () => {
            getValidarDataDaDespesa.mockResolvedValue({});
            const {result} = setup();
            const setFieldValue = jest.fn();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamento(
                    {data_transacao: data, associacao: {uuid: "as"}, despesas_impostos: []}, setFieldValue
                );
            });
            expect(getValidarDataDaDespesa).toHaveBeenCalledWith("as", "2026-03-10");
            expect(setFieldValue).not.toHaveBeenCalled();
        });

        it("data do pagamento sem data não chama API", async () => {
            const {result} = setup();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamento({data_transacao: null, despesas_impostos: []}, jest.fn());
            });
            expect(getValidarDataDaDespesa).not.toHaveBeenCalled();
        });

        it("data do pagamento inválida zera o campo e registra a mensagem", async () => {
            getValidarDataDaDespesa.mockRejectedValue({response: {data: {mensagem: "Data inválida"}}});
            const {result} = setup();
            const setFieldValue = jest.fn();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamento(
                    {data_transacao: data, associacao: "as", despesas_impostos: []}, setFieldValue
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith("data_transacao", null);
            expect(result.current.ui.formErrors.data_transacao).toBe("Data inválida");
        });

        it("data do pagamento com erro sem response apenas zera o campo", async () => {
            getValidarDataDaDespesa.mockRejectedValue(new Error("rede"));
            const {result} = setup();
            const setFieldValue = jest.fn();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamento(
                    {data_transacao: data, despesas_impostos: []}, setFieldValue
                );
            });
            expect(setFieldValue).toHaveBeenCalledWith("data_transacao", null);
            expect(result.current.ui.formErrors.data_transacao).toBeUndefined();
        });

        it("data do pagamento revalida os impostos e ignora validações obsoletas", async () => {
            getValidarDataDaDespesa.mockResolvedValue({});
            validacoes.validacoesPersonalizadas
                .mockResolvedValueOnce({despesa_imposto_data_transacao: "erro"})
                .mockResolvedValueOnce(null);
            const {result} = setup();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamento(
                    {data_transacao: data, despesas_impostos: [{}, {}]}, jest.fn()
                );
            });
            expect(result.current.ui.formErrorsImposto[0]).toEqual({despesa_imposto_data_transacao: "erro"});
            expect(result.current.ui.formErrorsImposto[1]).toBeUndefined();
        });

        it("data do pagamento do imposto registra erros e libera botão", async () => {
            validacoes.validacoesPersonalizadas.mockResolvedValue({despesa_imposto_data_transacao: "erro"});
            const {result} = setup();
            const values = {
                data_transacao: "2026-03-10",
                despesas_impostos: [{data_transacao: "2026-03-01"}],
            };
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamentoImposto(values, jest.fn(), 0);
            });
            expect(result.current.ui.formErrorsImposto[0]).toEqual({despesa_imposto_data_transacao: "erro"});
            expect(result.current.ui.btnSubmitDisable).toBe(true);
        });

        it("data do pagamento do imposto não altera nada se validação for obsoleta", async () => {
            validacoes.validacoesPersonalizadas.mockResolvedValue(null);
            const {result} = setup();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamentoImposto({despesas_impostos: []}, jest.fn(), 0);
            });
            expect(result.current.ui.formErrorsImposto).toEqual([]);
        });

        it("data do pagamento do imposto posterior à principal não bloqueia o botão", async () => {
            validacoes.validacoesPersonalizadas.mockResolvedValue({});
            const {result} = setup();
            const values = {
                data_transacao: "2026-03-01",
                despesas_impostos: [{data_transacao: "2026-03-10"}, {data_transacao: ""}],
            };
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataPagamentoImposto(values, jest.fn(), 0);
            });
            expect(result.current.ui.btnSubmitDisable).toBe(false);
        });

        it("data do documento válida limpa o erro", async () => {
            getValidarDataDaDespesa.mockResolvedValue({});
            const {result} = setup();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataDoDocumento(
                    {data_documento: data, associacao: {uuid: "as"}}, jest.fn()
                );
            });
            expect(getValidarDataDaDespesa).toHaveBeenCalledWith("as", "2026-03-10");
            expect(result.current.ui.formErrors.data_documento).toBe("");
        });

        it("data do documento inválida zera o campo e registra mensagem", async () => {
            getValidarDataDaDespesa.mockRejectedValue({response: {data: {mensagem: "Documento inválido"}}});
            const {result} = setup();
            const setFieldValue = jest.fn();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataDoDocumento({data_documento: data, associacao: "as"}, setFieldValue);
            });
            expect(setFieldValue).toHaveBeenCalledWith("data_documento", null);
            expect(result.current.ui.formErrors.data_documento).toBe("Documento inválido");
        });

        it("data do documento com erro sem response apenas zera o campo", async () => {
            const {result} = setup();
            const setFieldValue = jest.fn();
            await act(async () => {
                await result.current.fluxo.onCalendarCloseDataDoDocumento({data_documento: null}, setFieldValue);
            });
            expect(setFieldValue).toHaveBeenCalledWith("data_documento", null);
        });
    });

    describe("retornaPeriodo", () => {
        it("é repassado à validação e busca período por uuid", async () => {
            getPeriodoPorUuid.mockResolvedValue({referencia: "2026.1"});
            setup();
            const deps = useValidacoesFormDespesa.mock.calls.at(-1)[0];
            await expect(deps.retornaPeriodo("p1")).resolves.toEqual({referencia: "2026.1"});
            expect(getPeriodoPorUuid).toHaveBeenCalledWith("p1");
        });
    });
});
