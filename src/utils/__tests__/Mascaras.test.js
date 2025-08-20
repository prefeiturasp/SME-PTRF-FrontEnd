import { formatProcessoIncorporacao, parsetFormattedProcessoIncorporacao, getCCMMask } from "../Mascaras";

describe("formatProcessoIncorporacao", () => {
  it("deve formatar corretamente quando vazio", () => {
    expect(formatProcessoIncorporacao("")).toBe("");
  });

  it("deve formatar até 4 dígitos", () => {
    expect(formatProcessoIncorporacao("1234")).toBe("1234");
  });

  it("deve adicionar ponto depois do 4º dígito", () => {
    expect(formatProcessoIncorporacao("12345")).toBe("1234.5");
    expect(formatProcessoIncorporacao("12345678")).toBe("1234.5678");
  });

  it("deve adicionar / depois do 8º dígito", () => {
    expect(formatProcessoIncorporacao("123456789")).toBe("1234.5678/9");
    expect(formatProcessoIncorporacao("123456789123456")).toBe("1234.5678/9123456");
  });

  it("deve adicionar - no último dígito se tiver 16", () => {
    expect(formatProcessoIncorporacao("1234567891234567")).toBe("1234.5678/9123456-7");
  });

  it("deve remover caracteres não numéricos", () => {
    expect(formatProcessoIncorporacao("12a34b5678/9123456-7")).toBe("1234.5678/9123456-7");
  });

  it("deve limitar a 16 dígitos", () => {
    expect(formatProcessoIncorporacao("123456789123456789999")).toBe("1234.5678/9123456-7");
  });
});

describe("parsetFormattedProcessoIncorporacao", () => {
  it("deve retornar apenas números", () => {
    expect(parsetFormattedProcessoIncorporacao("1234.5678/9123456-7")).toBe("1234567891234567");
  });

  it("deve truncar para 16 dígitos", () => {
    expect(parsetFormattedProcessoIncorporacao("123456789123456789999")).toBe("1234567891234567");
  });

  it("deve lidar com string vazia", () => {
    expect(parsetFormattedProcessoIncorporacao("")).toBe("");
  });
});

describe("getCCMMask", () => {
  it("deve retornar máscara longa quando mais de 8 dígitos", () => {
    const mask = getCCMMask("1234567890");
    expect(mask).toEqual([/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/]);
  });

  it("deve retornar máscara curta quando até 8 dígitos", () => {
    const mask = getCCMMask("12345678");
    expect(mask).toEqual([/\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/]);
  });

  it("deve ignorar caracteres não numéricos ao decidir máscara", () => {
    const mask = getCCMMask("1234-5678");
    expect(mask).toEqual([/\d/, ".", /\d/, /\d/, /\d/, ".", /\d/, /\d/, /\d/, "-", /\d/]);
  });
});
