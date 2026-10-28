import {cpfMaskContitional, processoIncorporacaoMask} from "../mascaras";

describe("mascaras", () => {
    it("usa máscara de CPF com até 11 dígitos", () => {
        const mask = cpfMaskContitional("529.982.247-25");
        expect(mask).toHaveLength(14);
        expect(mask[3]).toBe(".");
        expect(mask[11]).toBe("-");
    });

    it("usa máscara de CNPJ com mais de 11 caracteres", () => {
        const mask = cpfMaskContitional("112223330001");
        expect(mask).toHaveLength(18);
        expect(mask[2]).toBe(".");
        expect(mask[10]).toBe("/");
    });

    it("usa máscara de CNPJ quando há letras", () => {
        expect(cpfMaskContitional("AB123")).toHaveLength(18);
    });

    it("processoIncorporacaoMask retorna máscara 0000.0000/0000000-0", () => {
        const mask = processoIncorporacaoMask("12345");
        expect(mask).toHaveLength(19);
        expect(mask[4]).toBe(".");
        expect(mask[9]).toBe("/");
        expect(mask[17]).toBe("-");
    });
});
