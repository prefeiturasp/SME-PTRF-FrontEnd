import { validarDAC11A } from "../validators";

describe("validarDAC11A", () => {
  it("deve validar um CCM válido com 12 dígitos", () => {
    expect(validarDAC11A("123456789010")).toBe(true);
  });

  it("deve validar outro CCM válido com zeros à esquerda", () => {
    expect(validarDAC11A("000012345679")).toBe(true);
  });

  it("deve invalidar um CCM com DV incorreto", () => {
    expect(validarDAC11A("123456789019")).toBe(false); // DV errado
  });

  it("deve invalidar um CCM com menos de 12 dígitos", () => {
    expect(validarDAC11A("12345678901")).toBe(false);
  });

  it("deve invalidar um CCM com mais de 12 dígitos", () => {
    expect(validarDAC11A("1234567890123")).toBe(false);
  });

  it("deve invalidar caracteres não numéricos", () => {
    expect(validarDAC11A("ABCD-EFGHIJK")).toBe(false);
  });
});
