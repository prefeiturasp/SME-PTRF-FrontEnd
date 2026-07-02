import { UrlsMenuInterno } from "../UrlsMenuInterno";

describe("UrlsMenuInterno", () => {
  it("possui a rota de cargas de contas das associações", () => {
    expect(UrlsMenuInterno).toEqual([
      {
        label: "Cargas de arquivo",
        url: "parametro-arquivos-de-carga",
        origem: "CARGA_CONTAS_ASSOCIACOES",
      },
    ]);
  });
});
