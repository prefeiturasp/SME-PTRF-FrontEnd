import { formataNomeDreParaTabelas } from "../FormataNomeDreParaTabelas";

describe("formataNomeDreParaTabelas", () => {
    it("deve remover 'DIRETORIA REGIONAL DE EDUCACAO ' do início do nome", () => {
        expect(formataNomeDreParaTabelas("DIRETORIA REGIONAL DE EDUCACAO NORTE")).toBe("NORTE");
        expect(formataNomeDreParaTabelas("DIRETORIA REGIONAL DE EDUCACAO SUL")).toBe("SUL");
    });

    it("deve adicionar um espaço após a barra", () => {
        expect(formataNomeDreParaTabelas("DIRETORIA REGIONAL DE EDUCACAO LESTE/OESTE")).toBe("LESTE/ OESTE");
    });

    it("deve manter o nome inalterado se não começar com 'DIRETORIA REGIONAL DE EDUCACAO '", () => {
        expect(formataNomeDreParaTabelas("DRE CENTRO")).toBe("DRE CENTRO");
    });

    it("deve retornar uma string vazia se o nome for apenas 'DIRETORIA REGIONAL DE EDUCACAO '", () => {
        expect(formataNomeDreParaTabelas("DIRETORIA REGIONAL DE EDUCACAO ")).toBe("");
    });
});
