import {validaPayloadDespesas} from "../payloadDespesas";
import {metodosAuxiliares} from "../metodosAuxiliares";

jest.mock("../metodosAuxiliares", () => ({
    metodosAuxiliares: {
        origemAnaliseLancamento: jest.fn(),
        mantemConciliacaoAtualImposto: jest.fn(),
    },
}));

const rateioBase = (extra = {}) => ({
    especificacao_material_servico: {id: 5},
    conta_associacao: {uuid: "conta-1"},
    acao_associacao: {uuid: "acao-1"},
    tipo_custeio: {id: 7},
    tag: {uuid: "tag-1"},
    quantidade_itens_capital: "2",
    valor_item_capital: "1,50",
    valor_rateio: "10,00",
    valor_original: "12,00",
    aplicacao_recurso: "CUSTEIO",
    ...extra,
});

const valuesBase = (extra = {}) => ({
    associacao: "assoc",
    tipo_documento: "3",
    tipo_transacao: "4",
    documento_transacao: "abc",
    valor_total: "1.000,50",
    valor_original: "900,00",
    valor_recursos_proprios: "100,00",
    valor_recusos_acoes: 800.456,
    data_documento: "2026-03-10",
    data_transacao: "2026-03-11",
    rateios: [rateioBase()],
    ...extra,
});

describe("validaPayloadDespesas", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorage.clear();
    });

    it("normaliza campos numéricos, datas e objetos de rateio", () => {
        const r = validaPayloadDespesas(valuesBase());
        expect(r.tipo_documento).toBe(3);
        expect(r.tipo_transacao).toBe(4);
        expect(r.valor_total).toBe(1000.5);
        expect(r.valor_original).toBe(900);
        expect(r.valor_recursos_proprios).toBe(100);
        expect(r.valor_recusos_acoes).toBe(800.46);
        expect(r.data_documento).toBe("2026-03-10");
        expect(r.data_transacao).toBe("2026-03-11");
        expect(r.rateios[0]).toMatchObject({
            especificacao_material_servico: 5,
            conta_associacao: "conta-1",
            acao_associacao: "acao-1",
            tipo_custeio: 7,
            tag: "tag-1",
            quantidade_itens_capital: 2,
            valor_item_capital: 1.5,
            valor_rateio: 10,
            valor_original: 12,
        });
    });

    it("usa o id quando tipo_documento e tipo_transacao são objetos", () => {
        const r = validaPayloadDespesas(valuesBase({tipo_documento: {id: 9}, tipo_transacao: {id: 8}}));
        expect(r.tipo_documento).toBe(9);
        expect(r.tipo_transacao).toBe(8);
    });

    it.each(["", "0", 0, null])("zera tipo_documento/tipo_transacao quando %p", (v) => {
        const r = validaPayloadDespesas(valuesBase({tipo_documento: v, tipo_transacao: v}));
        expect(r.tipo_documento).toBeNull();
        expect(r.tipo_transacao).toBeNull();
    });

    it("define datas vazias como null", () => {
        const r = validaPayloadDespesas(valuesBase({data_documento: "", data_transacao: null}));
        expect(r.data_documento).toBeNull();
        expect(r.data_transacao).toBeNull();
    });

    it("substitui associacao objeto pelo UUID do localStorage", () => {
        localStorage.setItem("UUID", "uuid-assoc");
        const r = validaPayloadDespesas(valuesBase({associacao: {uuid: "x"}}));
        expect(r.associacao).toBe("uuid-assoc");
    });

    it("mantém associacao string", () => {
        expect(validaPayloadDespesas(valuesBase()).associacao).toBe("assoc");
    });

    describe("despesasTabelas", () => {
        const tabelas = {
            tipos_transacao: [
                {id: 4, tem_documento: true},
                {id: 5, tem_documento: false},
            ],
        };

        it("mantém documento_transacao quando o tipo tem documento", () => {
            const r = validaPayloadDespesas(valuesBase(), tabelas);
            expect(r.documento_transacao).toBe("abc");
        });

        it("limpa documento_transacao quando o tipo não tem documento", () => {
            const r = validaPayloadDespesas(valuesBase({tipo_transacao: "5"}), tabelas);
            expect(r.documento_transacao).toBe("");
        });

        it("resolve tipo_transacao informado como objeto", () => {
            const r = validaPayloadDespesas(valuesBase({tipo_transacao: {id: 5}}), tabelas);
            expect(r.documento_transacao).toBe("");
        });

        it("limpa documento_transacao quando não há tipo_transacao", () => {
            const r = validaPayloadDespesas(valuesBase({tipo_transacao: null}), tabelas);
            expect(r.documento_transacao).toBe("");
        });
    });

    describe("rateios com valores não-objeto", () => {
        it("anula strings vazias/zero e converte o restante", () => {
            const r = validaPayloadDespesas(valuesBase({
                rateios: [rateioBase({
                    especificacao_material_servico: "0",
                    conta_associacao: "0",
                    acao_associacao: "",
                    tipo_custeio: "0",
                    tag: "",
                    aplicacao_recurso: "0",
                })],
            }));
            expect(r.rateios[0]).toMatchObject({
                especificacao_material_servico: null,
                conta_associacao: null,
                acao_associacao: null,
                tipo_custeio: null,
                tag: null,
                aplicacao_recurso: null,
            });
        });

        it("converte tipo_custeio e especificacao numéricos em string", () => {
            const r = validaPayloadDespesas(valuesBase({
                rateios: [rateioBase({
                    especificacao_material_servico: "12",
                    tipo_custeio: "3",
                    conta_associacao: "c",
                    acao_associacao: "a",
                })],
            }));
            expect(r.rateios[0].especificacao_material_servico).toBe(12);
            expect(r.rateios[0].tipo_custeio).toBe(3);
            expect(r.rateios[0].conta_associacao).toBe("c");
            expect(r.rateios[0].acao_associacao).toBe("a");
        });

        it("mantém tipo_custeio null", () => {
            const r = validaPayloadDespesas(valuesBase({rateios: [rateioBase({tipo_custeio: null})]}));
            expect(r.rateios[0].tipo_custeio).toBeNull();
        });

        it("anula tag quando escolha_tags é 'nao'", () => {
            const r = validaPayloadDespesas(valuesBase({
                rateios: [rateioBase({tag: "t", escolha_tags: "nao"})],
            }));
            expect(r.rateios[0].tag).toBeNull();
        });
    });

    describe("despesas_impostos", () => {
        const imposto = (extra = {}) => ({
            data_transacao: "2026-04-01",
            rateios: [{
                quantidade_itens_capital: "1",
                valor_item_capital: "2,00",
                valor_rateio: "30,00",
                valor_original: "35,00",
            }],
            ...extra,
        });

        it("normaliza datas, valores e rateios do imposto", () => {
            const r = validaPayloadDespesas(valuesBase({despesas_impostos: [imposto()]}));
            const i = r.despesas_impostos[0];
            expect(i.data_transacao).toBe("2026-04-01");
            expect(i.valor_total).toBe(30);
            expect(i.valor_original).toBe(35);
            expect(i.rateios[0]).toMatchObject({
                quantidade_itens_capital: 1,
                valor_item_capital: 2,
                valor_rateio: 30,
                valor_original: 35,
            });
            expect(metodosAuxiliares.mantemConciliacaoAtualImposto).not.toHaveBeenCalled();
        });

        it("define data_transacao vazia como null", () => {
            const r = validaPayloadDespesas(valuesBase({despesas_impostos: [imposto({data_transacao: ""})]}));
            expect(r.despesas_impostos[0].data_transacao).toBeNull();
        });

        it("mantém conciliação do imposto quando origem é análise de lançamento", () => {
            metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(true);
            const loc = {state: {}};
            validaPayloadDespesas(valuesBase({despesas_impostos: [imposto()]}), null, loc);
            expect(metodosAuxiliares.origemAnaliseLancamento).toHaveBeenCalledWith(loc);
            expect(metodosAuxiliares.mantemConciliacaoAtualImposto).toHaveBeenCalledTimes(1);
        });

        it("não mantém conciliação quando origem não é análise de lançamento", () => {
            metodosAuxiliares.origemAnaliseLancamento.mockReturnValue(false);
            validaPayloadDespesas(valuesBase({despesas_impostos: [imposto()]}), null, {state: {}});
            expect(metodosAuxiliares.mantemConciliacaoAtualImposto).not.toHaveBeenCalled();
        });
    });
});
