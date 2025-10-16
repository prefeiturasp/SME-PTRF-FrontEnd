import { toOrdinal, registerOrdinalPrototype } from "../Ordinal";

describe("Ordinal", () => {
    beforeEach(() => {
        registerOrdinalPrototype();
    });

    it("converte 1 para primeiro", () => {
        expect((1).toOrdinal()).toBe("primeiro");
    });

    it("converte 2 para segundo", () => {
        expect((2).toOrdinal()).toBe("segundo");
    });

    it("converte 3 para terceiro", () => {
        expect((3).toOrdinal()).toBe("terceiro");
    });

    it("converte 4 para quarto", () => {
        expect((4).toOrdinal()).toBe("quarto");
    });

    it("converte 5 para quinto", () => {
        expect((5).toOrdinal()).toBe("quinto");
    });

    it("converte com gênero feminino", () => {
        expect((1).toOrdinal({ genero: "a" })).toBe("primeira");
        expect((2).toOrdinal({ genero: "a" })).toBe("segunda");
    });

    it("converte com maiúscula", () => {
        expect((1).toOrdinal({ maiuscula: true })).toBe("Primeiro");
        expect((2).toOrdinal({ maiuscula: true })).toBe("Segundo");
    });

    it("converte números de 1 a 9", () => {
        expect((1).toOrdinal()).toBe("primeiro");
        expect((3).toOrdinal()).toBe("terceiro");
        expect((5).toOrdinal()).toBe("quinto");
    });

    it("converte 6 para sexto", () => {
        expect((6).toOrdinal()).toBe("sexto");
    });

    it("converte 7 para sétimo", () => {
        expect((7).toOrdinal()).toBe("sétimo");
    });

    it("converte 8 para oitavo", () => {
        expect((8).toOrdinal()).toBe("oitavo");
    });

    it("converte 9 para nono", () => {
        expect((9).toOrdinal()).toBe("nono");
    });

    it("lança erro para número não inteiro", () => {
        expect(() => toOrdinal.call(1.5)).toThrow("Não implementado para números não inteiros.");
    });

    it("lança erro para número maior que 999", () => {
        expect(() => toOrdinal.call(1000)).toThrow("Não implementado para números maiores que 999.");
    });

    it("lança erro para número menor que 1", () => {
        expect(() => toOrdinal.call(0)).toThrow("Não implementado para números negativos.");
        expect(() => toOrdinal.call(-1)).toThrow("Não implementado para números negativos.");
    });

    it("registerOrdinalPrototype adiciona método ao prototype", () => {
        delete Number.prototype.toOrdinal;
        registerOrdinalPrototype();
        expect(typeof (1).toOrdinal).toBe("function");
    });

    it("registerOrdinalPrototype não sobrescreve se já existir", () => {
        const original = Number.prototype.toOrdinal;
        registerOrdinalPrototype();
        expect(Number.prototype.toOrdinal).toBe(original);
    });
});

