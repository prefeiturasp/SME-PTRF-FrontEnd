import {metodosAuxiliares as aux, apenasNumero} from "../metodosAuxiliares";
import {deleteDespesa, getNomeRazaoSocial} from "../../../../../../services/escolas/Despesas.service";
import {getVerificarSaldo} from "../../../../../../services/escolas/RateiosDespesas.service";

jest.mock("../../../../../../services/escolas/Despesas.service", () => ({
    deleteDespesa: jest.fn(),
    getNomeRazaoSocial: jest.fn(),
}));
jest.mock("../../../../../../services/escolas/RateiosDespesas.service", () => ({
    getVerificarSaldo: jest.fn(),
}));

const loc = (state) => ({state});
const analiseUE = (extra = {}) => loc({origem_visao: "UE", origem: "/consulta-detalhamento-analise-da-dre", ...extra});
const analiseDRE = (extra = {}) => loc({origem_visao: "DRE", origem: "/dre-detalhe-prestacao-de-contas-resumo-acertos", ...extra});

describe("metodosAuxiliares (pipeline)", () => {
    beforeEach(() => {
        jest.spyOn(console, "log").mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    describe("modais simples", () => {
        it("onShowModal / onShowAvisoCapitalModal / onShowErroGeral", () => {
            const set = jest.fn();
            aux.onShowModal(set);
            aux.onShowAvisoCapitalModal(set);
            aux.onShowErroGeral(set);
            expect(set).toHaveBeenCalledTimes(3);
            expect(set).toHaveBeenCalledWith(true);
        });

        it("onHandleClose fecha todos os modais", () => {
            const setters = Array.from({length: 7}, () => jest.fn());
            aux.onHandleClose(...setters);
            setters.forEach((s) => expect(s).toHaveBeenCalledWith(false));
        });

        it("handleAvisoCapital só abre aviso para CAPITAL", () => {
            const set = jest.fn();
            aux.handleAvisoCapital("CUSTEIO", set);
            expect(set).not.toHaveBeenCalled();
            aux.handleAvisoCapital("CAPITAL", set);
            expect(set).toHaveBeenCalledWith(true);
        });
    });

    describe("onShowDeleteModal", () => {
        const run = (values) => {
            const setShowDelete = jest.fn();
            const setTexto = jest.fn();
            aux.onShowDeleteModal(setShowDelete, setTexto, values);
            expect(setShowDelete).toHaveBeenCalledWith(true);
            return setTexto.mock.calls[0][0];
        };

        it("estorno e imposto", () => {
            expect(run({retem_imposto: true, rateios: [{estorno: {uuid: "e"}}]})).toMatch(/estorno vinculado e do imposto vinculado/);
        });
        it("apenas estorno", () => {
            expect(run({retem_imposto: false, rateios: [{}, {estorno: {uuid: "e"}}]})).toMatch(/crédito de estorno vinculado\. Confirma/);
        });
        it("apenas imposto", () => {
            expect(run({retem_imposto: true, rateios: [{estorno: {}}]})).toMatch(/imposto retido/);
        });
        it("texto padrão", () => {
            expect(run({rateios: []})).toMatch(/Tem certeza que deseja excluir/);
        });
    });

    describe("navegação", () => {
        let assign;
        let originalLocation;

        beforeEach(() => {
            originalLocation = window.location;
            assign = jest.fn();
            delete window.location;
            window.location = {assign, pathname: "/atual"};
            sessionStorage.clear();
        });
        afterEach(() => {
            window.location = originalLocation;
        });

        it("getPath: lista de despesas quando origem é undefined", () => {
            aux.getPath(undefined);
            expect(assign).toHaveBeenCalledWith("/lista-de-despesas");
            expect(sessionStorage.getItem("previousPath")).toBe("/atual");
        });

        it("getPath: detalhe das prestações quando há origem", () => {
            aux.getPath("pc");
            expect(assign).toHaveBeenCalledWith("/detalhe-das-prestacoes");
        });

        it.each([
            ["requer_inclusao_documento_gasto", "tabela-acertos-documentos"],
            ["requer_atualizacao_lancamento_gasto", "tabela-acertos-lancamentos"],
            ["requer_exclusao_lancamento_gasto", "tabela-acertos-lancamentos"],
            ["outra", ""],
        ])("getPath: análise de lançamento com operação %s", (operacao, ancora) => {
            aux.getPath("x", analiseUE({uuid_pc: "pc1", operacao}));
            expect(assign).toHaveBeenCalledWith(`/consulta-detalhamento-analise-da-dre/pc1#${ancora}`);
        });

        it("getPath: análise sem uuid_pc mantém o caminho padrão", () => {
            aux.getPath(undefined, analiseUE());
            expect(assign).toHaveBeenCalledWith("/lista-de-despesas");
        });

        it("getPath: location que não é análise mantém o caminho padrão", () => {
            aux.getPath(undefined, loc({}));
            expect(assign).toHaveBeenCalledWith("/lista-de-despesas");
        });

        it("onCancelarTrue fecha modal, mostra loading e navega", () => {
            const setShow = jest.fn();
            const setLoading = jest.fn();
            aux.onCancelarTrue(setShow, setLoading, undefined);
            expect(setShow).toHaveBeenCalledWith(false);
            expect(setLoading).toHaveBeenCalledWith(true);
            expect(assign).toHaveBeenCalledWith("/lista-de-despesas");
        });

        it("onDeletarTrue: sucesso navega", async () => {
            deleteDespesa.mockResolvedValue({});
            const setShowDelete = jest.fn();
            const setLoading = jest.fn();
            aux.onDeletarTrue(setShowDelete, setLoading, {idDespesa: "d1"}, undefined);
            await new Promise((r) => setTimeout(r, 0));
            expect(deleteDespesa).toHaveBeenCalledWith("d1");
            expect(setShowDelete).toHaveBeenCalledWith(false);
            expect(assign).toHaveBeenCalledWith("/lista-de-despesas");
        });

        it("onDeletarTrue: erro exibe alerta e desliga loading", async () => {
            deleteDespesa.mockRejectedValue(new Error("x"));
            window.alert = jest.fn();
            const setLoading = jest.fn();
            aux.onDeletarTrue(jest.fn(), setLoading, {idDespesa: "d1"}, undefined);
            await new Promise((r) => setTimeout(r, 0));
            expect(setLoading).toHaveBeenLastCalledWith(false);
            expect(window.alert).toHaveBeenCalled();
            expect(assign).not.toHaveBeenCalled();
        });
    });

    describe("serviços", () => {
        it("verificarSaldo usa idDespesa do contexto", async () => {
            getVerificarSaldo.mockResolvedValue({situacao_do_saldo: "ok"});
            await expect(aux.verificarSaldo({a: 1}, {idDespesa: "d1"})).resolves.toEqual({situacao_do_saldo: "ok"});
            expect(getVerificarSaldo).toHaveBeenCalledWith({a: 1}, "d1");
        });

        describe("get_nome_razao_social", () => {
            it("preenche o nome do fornecedor quando vazio", async () => {
                getNomeRazaoSocial.mockResolvedValue([{nome: "Fornecedor X"}]);
                const set = jest.fn();
                await aux.get_nome_razao_social("123", set);
                expect(set).toHaveBeenCalledWith("nome_fornecedor", "Fornecedor X");
            });
            it("não consulta quando já há nome", async () => {
                const set = jest.fn();
                await aux.get_nome_razao_social("123", set, "Já preenchido");
                expect(getNomeRazaoSocial).not.toHaveBeenCalled();
                expect(set).not.toHaveBeenCalled();
            });
            it.each([[null], [[]], [[{}]]])("ignora resposta sem nome (%j)", async (resp) => {
                getNomeRazaoSocial.mockResolvedValue(resp);
                const set = jest.fn();
                await aux.get_nome_razao_social("123", set);
                expect(set).not.toHaveBeenCalled();
            });
        });
    });

    describe("documento de transação", () => {
        const tabelas = {tipos_transacao: [{id: 1, nome: "Cheque", tem_documento: true}, {id: 2, nome: "Dinheiro", tem_documento: false}]};

        it("exibeDocumentoTransacao mostra e rotula quando tem documento", () => {
            const css = jest.fn();
            const label = jest.fn();
            aux.exibeDocumentoTransacao("1", css, label, tabelas);
            expect(css).toHaveBeenCalledWith("");
            expect(label).toHaveBeenCalledWith("Cheque");
        });

        it.each([
            ["tipo sem documento", "2", tabelas],
            ["tipo inexistente", "9", tabelas],
            ["valor vazio", "", tabelas],
            ["sem tabelas", "1", null],
            ["tabelas sem tipos", "1", {}],
        ])("exibeDocumentoTransacao esconde com %s", (_, valor, t) => {
            const css = jest.fn();
            const label = jest.fn();
            aux.exibeDocumentoTransacao(valor, css, label, t);
            expect(css).toHaveBeenCalledWith("escondeItem");
            expect(label).not.toHaveBeenCalled();
        });

        it("exibeDocumentoTransacaoImposto mostra e rotula por índice", () => {
            const css = jest.fn();
            const label = jest.fn();
            aux.exibeDocumentoTransacaoImposto("1", label, {0: "x"}, css, {0: "escondeItem"}, tabelas, 1);
            expect(css).toHaveBeenCalledWith({0: "escondeItem", 1: ""});
            expect(label).toHaveBeenCalledWith({0: "x", 1: "Cheque"});
        });

        it.each([
            ["tipo sem documento", "2", tabelas],
            ["valor vazio", "", tabelas],
            ["sem tabelas", "1", undefined],
        ])("exibeDocumentoTransacaoImposto esconde com %s", (_, valor, t) => {
            const css = jest.fn();
            const label = jest.fn();
            aux.exibeDocumentoTransacaoImposto(valor, label, {}, css, {}, t, 0);
            expect(css).toHaveBeenCalledWith({0: "escondeItem"});
            expect(label).not.toHaveBeenCalled();
        });

        it("exibeDocumentoTransacaoImpostoUseEffect acumula estados para cada imposto", () => {
            const css = jest.fn();
            const label = jest.fn();
            aux.exibeDocumentoTransacaoImpostoUseEffect(
                [{tipo_transacao: "1"}, {tipo_transacao: "2"}, {tipo_transacao: ""}],
                label, [], css, [], tabelas
            );
            expect(css).toHaveBeenCalledTimes(3);
            expect(css.mock.calls[0][0](["a"])).toEqual(["a", ""]);
            expect(label.mock.calls[0][0]([])).toEqual(["Cheque"]);
            expect(css.mock.calls[1][0]([])).toEqual([{1: "escondeItem"}]);
            expect(css.mock.calls[2][0]([])).toEqual([{2: "escondeItem"}]);
            expect(label).toHaveBeenCalledTimes(1);
        });
    });

    describe("valores", () => {
        it("setValorRealizado trata o valor numérico", () => {
            const set = jest.fn();
            aux.setValorRealizado(set, "1.234,50");
            expect(set).toHaveBeenCalledWith("valor_total", 1234.5);
        });

        it("limpaTipoDespesaCusteio", () => {
            const set = jest.fn();
            aux.limpaTipoDespesaCusteio(set, 2);
            expect(set).toHaveBeenCalledWith("rateios[2].tipo_custeio", null);
            expect(set).toHaveBeenCalledWith("rateios[2].especificacao_material_servico", "");
        });

        it("setaValoresCusteioCapital só atua quando mais_de_um_tipo_de_despesa é 'nao'", () => {
            const values = {valor_total: "100,00", valor_original: "100,00", valor_recursos_proprios: "10,00"};
            const set = jest.fn();
            aux.setaValoresCusteioCapital("nao", values, set);
            expect(set).toHaveBeenCalledWith("rateios[0].valor_rateio", 90);
            expect(set).toHaveBeenCalledWith("rateios[0].quantidade_itens_capital", "");
            expect(set).toHaveBeenCalledWith("rateios[0].valor_item_capital", 90);

            const set2 = jest.fn();
            aux.setaValoresCusteioCapital("sim", values, set2);
            aux.setaValoresCusteioCapital(null, values, set2);
            aux.setaValoresCusteioCapital(undefined, values, set2);
            expect(set2).not.toHaveBeenCalled();
        });

        describe("getErroValorOriginalRateios", () => {
            const base = {valor_original: "100,00", valor_recursos_proprios: "0,00"};

            it("zero quando custeio e capital fecham o total", () => {
                const values = {...base, rateios: [
                    {aplicacao_recurso: "CUSTEIO", valor_original: "60,00"},
                    {aplicacao_recurso: "CAPITAL", quantidade_itens_capital: "2", valor_item_capital: "20,00"},
                ]};
                expect(aux.getErroValorOriginalRateios(values)).toBe(0);
            });

            it("retorna a diferença quando não fecha", () => {
                const values = {...base, rateios: [{aplicacao_recurso: "CUSTEIO", valor_original: "40,00"}]};
                expect(aux.getErroValorOriginalRateios(values)).toBe(60);
            });

            it("considera impostos retidos", () => {
                const values = {
                    ...base,
                    retem_imposto: true,
                    rateios: [{aplicacao_recurso: "CUSTEIO", valor_original: "90,00"}],
                    despesas_impostos: [{rateios: [{valor_original: "10,00"}]}, {rateios: []}],
                };
                expect(aux.getErroValorOriginalRateios(values)).toBe(0);
            });

            it("ignora impostos quando retem_imposto é falso ou lista vazia", () => {
                const values = {
                    ...base,
                    retem_imposto: true,
                    despesas_impostos: [],
                    rateios: [{aplicacao_recurso: "CUSTEIO", valor_original: "100,00"}],
                };
                expect(aux.getErroValorOriginalRateios(values)).toBe(0);
            });
        });

        describe("getErroValorRealizadoRateios", () => {
            const base = {valor_total: "100,00", valor_recursos_proprios: "20,00"};

            it("zero quando os rateios fecham o valor dos recursos do programa", () => {
                const values = {...base, rateios: [{valor_rateio: "50,00"}, {valor_rateio: "30,00"}]};
                expect(aux.getErroValorRealizadoRateios(values)).toBe(0);
            });

            it("diferença quando não fecha", () => {
                const values = {...base, rateios: [{valor_rateio: "50,00"}]};
                expect(aux.getErroValorRealizadoRateios(values)).toBe(30);
            });

            it("desconta impostos retidos", () => {
                const values = {
                    ...base,
                    retem_imposto: true,
                    despesas_impostos: [{rateios: [{valor_rateio: "10,00"}]}, {rateios: []}],
                    rateios: [{valor_rateio: "70,00"}],
                };
                expect(aux.getErroValorRealizadoRateios(values)).toBe(0);
            });
        });
    });

    describe("apenasNumero / onHandleChangeApenasNumero", () => {
        it("apenasNumero", () => {
            expect(apenasNumero("")).toBe(true);
            expect(apenasNumero("123")).toBe(true);
            expect(apenasNumero("12a")).toBe(false);
        });

        it("onHandleChangeApenasNumero só atualiza com dígitos", () => {
            const set = jest.fn();
            aux.onHandleChangeApenasNumero({target: {value: "12"}}, set, "campo");
            expect(set).toHaveBeenCalledWith("campo", "12");
            aux.onHandleChangeApenasNumero({target: {value: "1a"}}, set, "campo");
            expect(set).toHaveBeenCalledTimes(1);
        });
    });

    describe("origemAnaliseLancamento", () => {
        it.each([
            ["null", null, false],
            ["sem state", {}, false],
            ["UE na rota correta", analiseUE(), true],
            ["UE em outra rota", loc({origem_visao: "UE", origem: "/outra"}), false],
            ["DRE na rota correta", analiseDRE(), true],
            ["DRE em outra rota", loc({origem_visao: "DRE", origem: "/outra"}), false],
            ["visão desconhecida", loc({origem_visao: "X"}), false],
        ])("%s", (_, l, esperado) => {
            expect(aux.origemAnaliseLancamento(l)).toBe(esperado);
        });
    });

    describe("conciliação", () => {
        it("mantemConciliacaoAtual marca update_conferido nos rateios", () => {
            const values = {rateios: [{}, {}]};
            aux.mantemConciliacaoAtual(values);
            expect(values.rateios.every((r) => r.update_conferido === true)).toBe(true);
        });

        it("mantemConciliacaoAtualImposto marca update_conferido nos rateios do imposto", () => {
            const imposto = {rateios: [{}, {}]};
            aux.mantemConciliacaoAtualImposto(imposto);
            expect(imposto.rateios.every((r) => r.update_conferido === true)).toBe(true);
        });
    });

    describe("permissões e operações", () => {
        it("temPermissaoEdicao", () => {
            expect(aux.temPermissaoEdicao(loc({tem_permissao_de_edicao: true}))).toBe(true);
            expect(aux.temPermissaoEdicao(loc({tem_permissao_de_edicao: false}))).toBe(false);
            expect(aux.temPermissaoEdicao(loc(undefined))).toBe(false);
            expect(aux.temPermissaoEdicao(null)).toBe(false);
        });

        it.each([
            ["ehOperacaoAtualizacao", "requer_atualizacao_lancamento_gasto"],
            ["ehOperacaoExclusao", "requer_exclusao_lancamento_gasto"],
        ])("%s", (nome, operacao) => {
            expect(aux[nome](loc({operacao}))).toBe(true);
            expect(aux[nome](loc({operacao: "outra"}))).toBe(false);
            expect(aux[nome](null)).toBe(false);
            expect(aux[nome]({})).toBe(false);
        });
    });

    describe("bloqueios da análise de lançamento", () => {
        it("bloqueiaCamposDespesaPrincipal sem permissão na visão DRE bloqueia botão", () => {
            const campos = jest.fn();
            const btn = jest.fn();
            aux.bloqueiaCamposDespesaPrincipal(loc({tem_permissao_de_edicao: false, origem_visao: "DRE"}), campos, btn);
            expect(campos).toHaveBeenCalledWith(true);
            expect(btn).toHaveBeenCalledWith(true);
        });

        it("sem permissão na UE com operação diferente de exclusão bloqueia botão", () => {
            const campos = jest.fn();
            const btn = jest.fn();
            aux.bloqueiaCamposDespesaPrincipal(loc({tem_permissao_de_edicao: false, origem_visao: "UE", operacao: "requer_atualizacao_lancamento_gasto"}), campos, btn);
            expect(btn).toHaveBeenCalledWith(true);
        });

        it("operação de exclusão na UE bloqueia campos mas mantém o botão", () => {
            const campos = jest.fn();
            const btn = jest.fn();
            aux.bloqueiaCamposDespesaPrincipal(loc({tem_permissao_de_edicao: true, origem_visao: "UE", operacao: "requer_exclusao_lancamento_gasto"}), campos, btn);
            expect(campos).toHaveBeenCalledWith(true);
            expect(btn).toHaveBeenCalledWith(false);
        });

        it("com permissão e sem exclusão nada é bloqueado", () => {
            const campos = jest.fn();
            const btn = jest.fn();
            aux.bloqueiaCamposDespesaPrincipal(loc({tem_permissao_de_edicao: true, operacao: "requer_atualizacao_lancamento_gasto"}), campos, btn);
            expect(campos).not.toHaveBeenCalled();
            expect(btn).not.toHaveBeenCalled();
        });

        it("bloqueiaCamposDespesaImposto bloqueia cada imposto sem permissão", () => {
            const setReadOnly = jest.fn();
            const setDisable = jest.fn();
            const ctx = {initialValues: {despesas_impostos: [{}, {}]}};
            aux.bloqueiaCamposDespesaImposto(loc({tem_permissao_de_edicao: false}), setReadOnly, setDisable, ctx);
            expect(setReadOnly).toHaveBeenCalledTimes(2);
            expect(setReadOnly.mock.calls[1][0]({0: true})).toEqual({0: true, 1: true});
            expect(setDisable).toHaveBeenCalledWith(true);
        });

        it("bloqueiaCamposDespesaImposto em exclusão com permissão também bloqueia", () => {
            const setReadOnly = jest.fn();
            const setDisable = jest.fn();
            aux.bloqueiaCamposDespesaImposto(
                loc({tem_permissao_de_edicao: true, operacao: "requer_exclusao_lancamento_gasto"}),
                setReadOnly, setDisable, {initialValues: {despesas_impostos: [{}]}}
            );
            expect(setDisable).toHaveBeenCalledWith(true);
        });

        it("bloqueiaCamposDespesaImposto não faz nada com permissão e sem exclusão", () => {
            const setReadOnly = jest.fn();
            aux.bloqueiaCamposDespesaImposto(loc({tem_permissao_de_edicao: true}), setReadOnly, jest.fn(), {initialValues: {despesas_impostos: [{}]}});
            expect(setReadOnly).not.toHaveBeenCalled();
        });
    });

    describe("mostraBotaoDeletar", () => {
        it("false quando location existe sem permissão de edição", () => {
            expect(aux.mostraBotaoDeletar("d1", loc({tem_permissao_de_edicao: false}))).toBe(false);
        });

        it("fluxo normal depende de idDespesa", () => {
            expect(aux.mostraBotaoDeletar("d1", null)).toBe(true);
            expect(aux.mostraBotaoDeletar(null, null)).toBe(false);
            expect(aux.mostraBotaoDeletar("d1", loc({tem_permissao_de_edicao: true}))).toBe(true);
        });

        it("análise de lançamento: exclusão mostra, atualização e inclusão ocultam", () => {
            const mk = (operacao) => analiseUE({tem_permissao_de_edicao: true, operacao});
            expect(aux.mostraBotaoDeletar("d1", mk("requer_exclusao_lancamento_gasto"))).toBe(true);
            expect(aux.mostraBotaoDeletar("d1", mk("requer_atualizacao_lancamento_gasto"))).toBe(false);
            expect(aux.mostraBotaoDeletar("d1", mk("requer_inclusao_documento_gasto"))).toBe(false);
        });

        it("análise de lançamento com operação desconhecida retorna undefined", () => {
            expect(aux.mostraBotaoDeletar("d1", analiseUE({tem_permissao_de_edicao: true, operacao: "x"}))).toBeUndefined();
        });
    });

    describe("documentoTransacaoObrigatorio", () => {
        const tabelas = {tipos_transacao: [{id: 1, tem_documento: true}, {id: 2, tem_documento: false}]};

        it("true quando o tipo tem documento (id, string ou objeto)", () => {
            expect(aux.documentoTransacaoObrigatorio(1, tabelas)).toBe(true);
            expect(aux.documentoTransacaoObrigatorio("1", tabelas)).toBe(true);
            expect(aux.documentoTransacaoObrigatorio({id: 1}, tabelas)).toBe(true);
        });

        it("false nos demais casos", () => {
            expect(aux.documentoTransacaoObrigatorio(2, tabelas)).toBe(false);
            expect(aux.documentoTransacaoObrigatorio(9, tabelas)).toBe(false);
            expect(aux.documentoTransacaoObrigatorio("", tabelas)).toBe(false);
            expect(aux.documentoTransacaoObrigatorio(1, null)).toBe(false);
            expect(aux.documentoTransacaoObrigatorio(1, {})).toBe(false);
        });
    });
});
