import { formatarDataIso, formatarIntervalo } from "../formatarPeriodo";

describe("formatarDataIso", () => {
  it("converte aaaa-mm-dd em dd/mm/aaaa", () => {
    expect(formatarDataIso("2026-05-01")).toBe("01/05/2026");
  });

  it("devolve vazio sem data", () => {
    expect(formatarDataIso(null)).toBe("");
    expect(formatarDataIso("")).toBe("");
  });
});

describe("formatarIntervalo", () => {
  it("mostra os anos de início e fim do período", () => {
    expect(formatarIntervalo("2026-05-01", "2027-04-30")).toBe("2026/2027");
  });

  it("repete o ano quando o período está dentro de um único ano", () => {
    expect(formatarIntervalo("2026-02-01", "2026-12-31")).toBe("2026/2026");
  });
});
