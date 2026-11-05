import {
    valida_cpf_cnpj,
    valida_cpf_cnpj_permitindo_cnpj_zerado,
    valida_cnpj,
    valida_cpf_exportado,
} from "../cpfCnpj";

describe("cpfCnpj", () => {
    describe("valida_cpf_cnpj", () => {
        it("aceita CPF válido com e sem máscara", () => {
            expect(valida_cpf_cnpj("529.982.247-25")).toBe(true);
            expect(valida_cpf_cnpj("52998224725")).toBe(true);
        });
        it("rejeita CPF com dígito verificador errado", () => {
            expect(valida_cpf_cnpj("529.982.247-26")).toBe(false);
        });
        it("rejeita sequências repetidas", () => {
            expect(valida_cpf_cnpj("111.111.111-11")).toBe(false);
            expect(valida_cpf_cnpj("11.111.111/1111-11")).toBe(false);
        });
        it("rejeita CNPJ zerado", () => {
            expect(valida_cpf_cnpj("00.000.000/0000-00")).toBe(false);
        });
        it("aceita CNPJ válido", () => {
            expect(valida_cpf_cnpj("11.222.333/0001-81")).toBe(true);
        });
        it("rejeita CNPJ inválido", () => {
            expect(valida_cpf_cnpj("11.222.333/0001-82")).toBe(false);
        });
        it("rejeita tamanho inválido e vazio", () => {
            expect(valida_cpf_cnpj("123")).toBe(false);
            expect(valida_cpf_cnpj("")).toBe(false);
            expect(valida_cpf_cnpj(undefined)).toBe(false);
        });
    });

    describe("valida_cpf_cnpj_permitindo_cnpj_zerado", () => {
        it("aceita CNPJ zerado", () => {
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("00.000.000/0000-00")).toBe(true);
        });
        it("valida CPF e CNPJ normalmente", () => {
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("529.982.247-25")).toBe(true);
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("529.982.247-26")).toBe(false);
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("11.222.333/0001-81")).toBe(true);
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("11.222.333/0001-82")).toBe(false);
        });
        it("rejeita sequências repetidas e documentos inválidos", () => {
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("00000000000")).toBe(false);
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("99999999999999")).toBe(false);
            expect(valida_cpf_cnpj_permitindo_cnpj_zerado("12")).toBe(false);
        });
    });

    describe("valida_cnpj", () => {
        it("valida CNPJ numérico", () => {
            expect(valida_cnpj("11222333000181")).toBe(true);
            expect(valida_cnpj("11222333000182")).toBe(false);
        });
        it("rejeita vazio, zerado e formato inválido", () => {
            expect(valida_cnpj("")).toBe(false);
            expect(valida_cnpj("00000000000000")).toBe(false);
            expect(valida_cnpj("1122233300018A")).toBe(false);
        });
        it("aceita CNPJ alfanumérico com DV correto", () => {
            // 12 primeiros caracteres alfanuméricos; DV calculado pelo algoritmo oficial
            const base = "12ABC34501DE";
            const candidatos = [];
            for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) candidatos.push(`${base}${a}${b}`);
            const validos = candidatos.filter((c) => valida_cnpj(c));
            expect(validos).toHaveLength(1);
        });
    });

    describe("valida_cpf_exportado", () => {
        it("valida CPF", () => {
            expect(valida_cpf_exportado("529.982.247-25")).toBe(true);
            expect(valida_cpf_exportado("529.982.247-24")).toBe(false);
        });
    });
});
