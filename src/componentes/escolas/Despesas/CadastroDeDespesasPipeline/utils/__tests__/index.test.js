import * as utils from "../index";

describe("utils/index (barrel do CadastroDeDespesasPipeline)", () => {
    it.each([
        "convertToNumber", "round", "trataNumericos", "calculaValorRateio", "calculaValorRecursoAcoes",
        "calculaValorOriginal", "apenasNumero",
        "cpfMaskContitional", "processoIncorporacaoMask",
        "valida_cpf_cnpj", "valida_cpf_cnpj_permitindo_cnpj_zerado", "valida_cnpj", "valida_cpf_exportado",
        "comparaObjetos",
        "periodoFechado", "periodoFechadoImposto",
        "getPeriodoFechadoCached", "limparCachePeriodoFechado",
        "validaPayloadDespesas",
        "YupSignupSchemaCadastroDespesa", "YupSignupSchemaCadastroDespesaSaida",
        "metodosAuxiliares",
    ])("exporta %s", (nome) => {
        expect(utils[nome]).toBeDefined();
    });
});
