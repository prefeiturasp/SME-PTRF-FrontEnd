import {
    convertToNumber,
    round,
    trataNumericos,
    calculaValorRateio,
    calculaValorRecursoAcoes,
    calculaValorOriginal,
    apenasNumero,
} from "../numericos";

describe("numericos", () => {
    it("convertToNumber converte string em número", () => {
        expect(convertToNumber("12")).toBe(12);
        expect(convertToNumber("abc")).toBeNaN();
    });

    it("round arredonda para as casas pedidas", () => {
        expect(round(1.005, 2)).toBe(1);
        expect(round("2.456", 2)).toBe(2.46);
        expect(round(3, 2)).toBe(3);
    });

    describe("trataNumericos", () => {
        it("converte string no formato BR", () => {
            expect(trataNumericos("R$ 1.234,56")).toBe(1234.56);
        });
        it("preserva sinal negativo", () => {
            expect(trataNumericos("-1.000,50")).toBe(-1000.5);
        });
        it("retorna o próprio valor se não for string", () => {
            expect(trataNumericos(10)).toBe(10);
            expect(trataNumericos(null)).toBeNull();
        });
    });

    it("calculaValorRateio multiplica valores tratados", () => {
        expect(calculaValorRateio("2", "1,50")).toBe(3);
        expect(calculaValorRateio(2, 3)).toBe(6);
    });

    it("calculaValorRecursoAcoes subtrai recursos próprios do total", () => {
        expect(calculaValorRecursoAcoes({valor_total: "1.000,00", valor_recursos_proprios: "250,50"})).toBe(749.5);
    });

    it("calculaValorOriginal subtrai recursos próprios do valor original", () => {
        expect(calculaValorOriginal({valor_original: "500,00", valor_recursos_proprios: "100,25"})).toBe(399.75);
    });

    it("apenasNumero aceita vazio e dígitos", () => {
        expect(apenasNumero("")).toBe(true);
        expect(apenasNumero("123")).toBe(true);
        expect(apenasNumero("12a")).toBe(false);
        expect(apenasNumero("1,2")).toBe(false);
    });
});
