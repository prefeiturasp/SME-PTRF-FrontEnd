import { YupSchemaDetalheTipoCredito } from "../YupSchemaDetalheTipoCredito";

describe("YupSchemaDetalheTipoCredito", () => {
  it("deve importar schema sem erros", () => {
    expect(YupSchemaDetalheTipoCredito).toBeDefined();
  });

  describe("Validação com dados corretos", () => {
    it("deve validar dados completos válidos", async () => {
      const data = {
        nome: "Detalhe de Tipo de Crédito",
        tipo_receita: "uuid-tipo-receita",
        recurso_uuid: "uuid-recurso"
      };

      const result = await YupSchemaDetalheTipoCredito.validate(data);
      expect(result).toEqual(data);
    });

    it("deve validar dados com valores mínimos", async () => {
      const data = {
        nome: "A",
        tipo_receita: "1",
        recurso_uuid: "1"
      };

      const result = await YupSchemaDetalheTipoCredito.validate(data);
      expect(result.nome).toBe("A");
      expect(result.tipo_receita).toBe("1");
      expect(result.recurso_uuid).toBe("1");
    });

    it("deve validar dados com valores longos", async () => {
      const data = {
        nome: "Detalhe muito longo para validação ".repeat(5),
        tipo_receita: "uuid-tipo-receita-".repeat(10),
        recurso_uuid: "uuid-recurso-".repeat(10)
      };

      const result = await YupSchemaDetalheTipoCredito.validate(data);
      expect(result.nome).toBe(data.nome);
    });
  });

  describe("Validação com dados inválidos", () => {
    it("deve rejeitar dados completamente vazios", async () => {
      const data = {
        nome: "",
        tipo_receita: "",
        recurso_uuid: ""
      };

      await expect(YupSchemaDetalheTipoCredito.validate(data)).rejects.toThrow();
    });

    it("deve rejeitar quando nome está vazio", async () => {
      const data = {
        nome: "",
        tipo_receita: "uuid",
        recurso_uuid: "uuid"
      };

      await expect(YupSchemaDetalheTipoCredito.validate(data)).rejects.toThrow("Detalhe é obrigatório");
    });

    it("deve rejeitar quando tipo_receita está vazio", async () => {
      const data = {
        nome: "Válido",
        tipo_receita: "",
        recurso_uuid: "uuid"
      };

      await expect(YupSchemaDetalheTipoCredito.validate(data)).rejects.toThrow("Tipo de crédito é obrigatório");
    });

    it("deve rejeitar quando recurso_uuid está vazio", async () => {
      const data = {
        nome: "Válido",
        tipo_receita: "uuid",
        recurso_uuid: ""
      };

      await expect(YupSchemaDetalheTipoCredito.validate(data)).rejects.toThrow("Recurso é obrigatório");
    });

    it("deve rejeitar quando campos obrigatórios estão faltando", async () => {
      const data = { nome: "Válido" };

      await expect(YupSchemaDetalheTipoCredito.validate(data)).rejects.toThrow();
    });

    it("deve rejeitar com objeto vazio", async () => {
      await expect(YupSchemaDetalheTipoCredito.validate({})).rejects.toThrow();
    });
  });

  describe("Validação de tipos", () => {
    it("deve validar com strings normais", async () => {
      const data = {
        nome: "Nome do Detalhe",
        tipo_receita: "tipo-1",
        recurso_uuid: "recurso-1"
      };

      const result = await YupSchemaDetalheTipoCredito.validate(data);
      expect(typeof result.nome).toBe("string");
    });

    it("deve permitir números como strings", async () => {
      const data = {
        nome: "123",
        tipo_receita: "456",
        recurso_uuid: "789"
      };

      const result = await YupSchemaDetalheTipoCredito.validate(data);
      expect(result.nome).toBe("123");
    });
  });
});
