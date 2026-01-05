import { Ordinais }  from "../ValidacoesNumeros";

describe("Ordinais", () => {
    it("deve retornar a forma ordinal correta para dezenas", () => {
        expect(Ordinais(10)).toBe("Décima ");
        expect(Ordinais(20)).toBe("Vigésima ");
        expect(Ordinais(30)).toBe("Trigésima ");
        expect(Ordinais(40)).toBe("Quadragésima ");
        expect(Ordinais(50)).toBe("Quinquagésima ");
        expect(Ordinais(60)).toBe("Sexagésima ");
        expect(Ordinais(70)).toBe("Septuagésima ");
        expect(Ordinais(80)).toBe("Octogésima ");
        expect(Ordinais(90)).toBe("Nonagésimo ");
    });

    it("deve retornar a forma ordinal correta para números compostos", () => {
        expect(Ordinais(11)).toBe("Décima Primeira");
        expect(Ordinais(22)).toBe("Vigésima Segunda");
        expect(Ordinais(35)).toBe("Trigésima Quinta");
        expect(Ordinais(48)).toBe("Quadragésima Oitava");
        expect(Ordinais(59)).toBe("Quinquagésima Nona");
    });

    it("deve retornar a forma ordinal correta para números primários", () => {
        expect(Ordinais(1)).toBe("Segunda");
        expect(Ordinais(2)).toBe("Terceira");
        expect(Ordinais(3)).toBe("Quarta");
    });

    it("deve retornar a forma ordinal correta para números de 0 a 9", () => {
        expect(Ordinais(0)).toBe("Primeira");
        expect(Ordinais(4)).toBe("Quinta");
        expect(Ordinais(5)).toBe("Sexta");
        expect(Ordinais(6)).toBe("Sétima");
        expect(Ordinais(7)).toBe("Oitava");
        expect(Ordinais(8)).toBe("Nona");
    });
});
