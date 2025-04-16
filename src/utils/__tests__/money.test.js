import { formatMoneyByCentsBRL, formatMoneyBRL, parseMoneyBRL } from "../money";

describe("formatMoneyByCentsBRL", () => {
  it("formata corretamente valores em centavos", () => {
    expect(formatMoneyByCentsBRL(123456)).toBe("1.234,56");
    expect(formatMoneyByCentsBRL(0)).toBe("0,00");
    expect(formatMoneyByCentsBRL(1)).toBe("0,01");
  });

  it("retorna null para valores inválidos", () => {
    expect(formatMoneyByCentsBRL(null)).toBeNull();
    expect(formatMoneyByCentsBRL(undefined)).toBeNull();
    expect(formatMoneyByCentsBRL("")).toBeNull();
    expect(formatMoneyByCentsBRL(NaN)).toBeNull();
  });
});

describe("formatMoneyBRL", () => {
  it("formata corretamente valores numéricos", () => {
    expect(formatMoneyBRL(123456.78)).toBe("123.456,78");
    expect(formatMoneyBRL(0)).toBe("0,00");
    expect(formatMoneyBRL("1000")).toBe("1.000,00");
  });

  it("retorna null para valores inválidos", () => {
    expect(formatMoneyBRL(null)).toBeNull();
    expect(formatMoneyBRL(undefined)).toBeNull();
    expect(formatMoneyBRL("")).toBeNull();
    expect(formatMoneyBRL(NaN)).toBeNull();
  });
});

describe("parseMoneyBRL", () => {
  it("remove caracteres não numéricos e retorna inteiro", () => {
    expect(parseMoneyBRL("1.234,56")).toBe(123456);
    expect(parseMoneyBRL("12,34")).toBe(1234);
    expect(parseMoneyBRL("1.000")).toBe(1000);
  });

  it("retorna null para valores inválidos", () => {
    expect(parseMoneyBRL(null)).toBeNull();
    expect(parseMoneyBRL("")).toBeNull();
    expect(parseMoneyBRL("R$ um real")).toBeNull();
    expect(parseMoneyBRL("abc123")).toBeNull();
  });
});
