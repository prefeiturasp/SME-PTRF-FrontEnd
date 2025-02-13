import { YupSignupSchemaTags } from "../YupSignupSchemaTags"; // Ajuste o caminho conforme necessário

describe("YupSignupSchemaTags Validation Schema", () => {

  it("Deve validar corretamente quando o campo é obrigatório", async () => {
    const validData = {
      nome: "Teste",
    };
    await expect(YupSignupSchemaTags.isValid(validData)).resolves.toBe(true);
  });

  it("Deve criar um erro quando o campo requerido está em faltando", async () => {
    const invalidData = {
      nome: "",
    };

    await expect(YupSignupSchemaTags.isValid(invalidData)).resolves.toBe(false);
    try {
      await YupSignupSchemaTags.validate(invalidData);
    } catch (err) {
      expect(err.errors).toEqual(["Nome é obrigatório"]);
    }
  });

});
