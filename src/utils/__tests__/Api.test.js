import { addFiltersToQueryString } from "../Api";

describe("Função addFiltersToQueryString", () => {
  it("deve retornar uma query string com um único filtro", () => {
    const resultado = addFiltersToQueryString("", { nome: "joao" });
    expect(resultado).toBe("nome=joao");
  });

  it("deve adicionar múltiplos filtros corretamente", () => {
    const resultado = addFiltersToQueryString("", { nome: "joao", idade: 30 });
    expect(resultado).toBe("nome=joao&idade=30");
  });

  it("deve adicionar filtros a uma query string já existente", () => {
    const resultado = addFiltersToQueryString("pagina=2", { nome: "ana" });
    expect(resultado).toBe("pagina=2&nome=ana");
  });

  it("deve ignorar filtros com valor undefined", () => {
    const resultado = addFiltersToQueryString("", {
      nome: undefined,
      ativo: true,
    });
    expect(resultado).toBe("ativo=true");
  });

  it("deve ignorar filtros com valor null", () => {
    const resultado = addFiltersToQueryString("", { nome: null, ativo: true });
    expect(resultado).toBe("ativo=true");
  });

  it("deve retornar string vazia se não houver filtros válidos", () => {
    const resultado = addFiltersToQueryString("", {
      nome: null,
      idade: undefined,
    });
    expect(resultado).toBe("");
  });

  it("deve lidar com valores booleanos e números", () => {
    const resultado = addFiltersToQueryString("", { ativo: false, idade: 25 });
    expect(resultado).toBe("ativo=false&idade=25");
  });
});
