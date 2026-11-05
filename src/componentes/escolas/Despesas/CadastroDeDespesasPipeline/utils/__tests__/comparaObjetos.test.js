import {comparaObjetos} from "../comparaObjetos";

describe("comparaObjetos", () => {
    it("retorna true para objetos iguais", () => {
        expect(comparaObjetos({a: 1, b: {c: 2}}, {a: 1, b: {c: 2}})).toBe(true);
    });
    it("retorna false para valores diferentes", () => {
        expect(comparaObjetos({a: 1}, {a: 2})).toBe(false);
    });
    it("retorna false para quantidades de chaves diferentes", () => {
        expect(comparaObjetos({a: 1}, {a: 1, b: 2})).toBe(false);
    });
    it("detecta diferença em objetos aninhados", () => {
        expect(comparaObjetos({a: {b: 1}}, {a: {b: 2}})).toBe(false);
    });
    it("trata null", () => {
        expect(comparaObjetos(null, null)).toBe(true);
        expect(comparaObjetos(null, {})).toBe(false);
        expect(comparaObjetos({a: null}, {a: null})).toBe(true);
        expect(comparaObjetos({a: null}, {a: {}})).toBe(false);
    });
    it("compara arrays", () => {
        expect(comparaObjetos([1, 2], [1, 2])).toBe(true);
        expect(comparaObjetos([1, 2], [1, 3])).toBe(false);
    });
});
