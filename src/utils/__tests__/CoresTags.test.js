import { coresTagsAssociacoes, coresTagsDespesas } from "../CoresTags";


describe("coresTagsDespesas", () => {
    it("deve retornar a classe correta para cada chave", () => {
        expect(coresTagsDespesas[1]).toBe("tag-purple");
        expect(coresTagsDespesas[2]).toBe("tag-darkblue");
        expect(coresTagsDespesas[3]).toBe("tag-orange");
        expect(coresTagsDespesas[4]).toBe("tag-green");
        expect(coresTagsDespesas[5]).toBe("tag-blank");
        expect(coresTagsDespesas[6]).toBe("tag-red-white");
        expect(coresTagsDespesas[7]).toBe("tag-red");
        expect(coresTagsDespesas[8]).toBe("tag-neutral-2");
        expect(coresTagsDespesas[9]).toBe("tag-blue");
        expect(coresTagsDespesas[10]).toBe("tag-blue-white");
        expect(coresTagsDespesas[11]).toBe("tag-verde-claro");
    });

    it("deve retornar undefined para chaves inexistentes", () => {
        expect(coresTagsDespesas[12]).toBeUndefined();
    });
});

describe("coresTagsAssociacoes", () => {
    it("deve retornar a classe correta para cada chave", () => {
        expect(coresTagsAssociacoes[1]).toBe("tag-neutral-3");
        expect(coresTagsAssociacoes[2]).toBe("tag-neutral-2");
    });

    it("deve retornar undefined para chaves inexistentes", () => {
        expect(coresTagsAssociacoes[3]).toBeUndefined();
    });
});
