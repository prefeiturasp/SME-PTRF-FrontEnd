import {
    YupSignupSchemaCadastroDespesa,
    YupSignupSchemaCadastroDespesaSaida,
} from "../schemasDespesa";

describe("YupSignupSchemaCadastroDespesa", () => {
    it("aceita CPF válido", async () => {
        await expect(
            YupSignupSchemaCadastroDespesa.isValid({cpf_cnpj_fornecedor: "529.982.247-25"})
        ).resolves.toBe(true);
    });

    it("rejeita CPF/CNPJ inválido", async () => {
        await expect(
            YupSignupSchemaCadastroDespesa.validate({cpf_cnpj_fornecedor: "123"})
        ).rejects.toThrow("Digite um CPF ou um CNPJ válido");
    });

    it("exige cpf_cnpj_fornecedor", async () => {
        await expect(
            YupSignupSchemaCadastroDespesa.validate({})
        ).rejects.toThrow("Campo CNPJ ou CPF é obrigatório");
    });
});

describe("YupSignupSchemaCadastroDespesaSaida", () => {
    const valido = {
        nome_fornecedor: "Fornecedor",
        tipo_documento: "1",
        data_documento: "2026-01-01",
        tipo_transacao: "2",
        data_transacao: "2026-01-02",
        valor_total: "100,00",
    };

    it("aceita payload completo", async () => {
        await expect(YupSignupSchemaCadastroDespesaSaida.isValid(valido)).resolves.toBe(true);
    });

    it.each([
        ["nome_fornecedor", "Nome Fornecedor é obrigatório"],
        ["tipo_documento", "Tipo de documento é obrigatório"],
        ["data_documento", "Data do documento é obrigatório."],
        ["tipo_transacao", "Tipo da transação é obrigatório."],
        ["data_transacao", "Data do pagamento é obrigatório."],
        ["valor_total", "Valor do crédito é obrigatório."],
    ])("exige %s", async (campo, mensagem) => {
        const payload = {...valido};
        delete payload[campo];
        await expect(YupSignupSchemaCadastroDespesaSaida.validate(payload)).rejects.toThrow(mensagem);
    });

    it("rejeita valor_total menor ou igual a zero", async () => {
        await expect(
            YupSignupSchemaCadastroDespesaSaida.validate({...valido, valor_total: "0,00"})
        ).rejects.toThrow("Valor deve ser maior que zero.");
    });
});
