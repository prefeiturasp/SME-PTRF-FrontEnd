import { TextoDocumentoConsolidadoPC } from "../TextoDocumentoConsolidadoPC";

describe("TextoDocumentoConsolidadoPC", () => {
  describe("com lauda habilitada", () => {
    const texto = new TextoDocumentoConsolidadoPC(true);

    it("retorna textos no contexto de publicação", () => {
      expect(texto.normal()).toBe("publicação");
      expect(texto.possessivo()).toBe("da publicação");
      expect(texto.possessivo_acao()).toBe("da publicação");
      expect(texto.texto_artigo_a()).toBe("gerada após a publicação");
      expect(texto.texto_emissao()).toBe("gerada após a publicação");
      expect(texto.texto_acao()).toBe("publicação");
      expect(texto.texto_acao_simples()).toBe("publicação");
      expect(texto.texto_acao_objeto()).toBe("da publicação");
      expect(texto.texto_titulo_publicacao_modal()).toBe("publicação");
      expect(texto.texto_pagina_publicacao()).toBe("e página da publicação");
      expect(texto.texto_input_label()).toBe(
        "e a página da publicação no Diário Oficial da Cidade"
      );
      expect(texto.texto_remover_publicacao()).toBe("Remover publicação");
      expect(texto.texto_removido()).toBe(
        "e página da publicação removidas com sucesso."
      );
      expect(texto.texto_publicacao_aplicada()).toBe(
        "e página da publicação aplicadas"
      );
      expect(texto.texto_lauda_a_ser_publicada()).toBe(
        " e nova lauda a ser publicada"
      );
      expect(texto.texto_acao_concreta()).toBe("fazer a publicação");
    });
  });

  describe("sem lauda", () => {
    const texto = new TextoDocumentoConsolidadoPC(false);

    it("retorna textos no contexto de relatório/envio", () => {
      expect(texto.normal()).toBe("relatório");
      expect(texto.possessivo()).toBe("do relatório");
      expect(texto.possessivo_acao()).toBe("do envio");
      expect(texto.texto_artigo_a()).toBe("a geração do relatório");
      expect(texto.texto_emissao()).toBe("emitida após a geração do relatório");
      expect(texto.texto_acao()).toBe("envio externo");
      expect(texto.texto_acao_simples()).toBe("envio");
      expect(texto.texto_acao_objeto()).toBe("do envio da documentação");
      expect(texto.texto_titulo_publicacao_modal()).toBe(
        "data do envio da documentação"
      );
      expect(texto.texto_pagina_publicacao()).toBe("");
      expect(texto.texto_input_label()).toBe(
        "do envio externo da documentação"
      );
      expect(texto.texto_remover_publicacao()).toBe(
        "Remover envio externo da documentação"
      );
      expect(texto.texto_removido()).toBe("com sucesso.");
      expect(texto.texto_publicacao_aplicada()).toBe("aplicada");
      expect(texto.texto_lauda_a_ser_publicada()).toBe("");
      expect(texto.texto_acao_concreta()).toBe("gerar o relatório");
    });
  });
});
