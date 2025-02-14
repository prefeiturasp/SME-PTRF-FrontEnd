import { YupSignupSchemaTags } from "../YupSignupSchemaTags"; // Ajuste o caminho conforme necessário
import * as yup from "yup";

describe("YupSignupSchemaTags Validation Schema", () => {

  it("deve validar corretamente quando o campo é obrigatório", async () => {
    const validData = {
      nome: "Teste", // nome válido
    };
    await expect(YupSignupSchemaTags.isValid(validData)).resolves.toBe(true);
  });

  it("should throw an error when the required field is missing", async () => {
    const invalidData = {
      nome: "", // nome inválido (vazio)
    };

    await expect(YupSignupSchemaTags.isValid(invalidData)).resolves.toBe(false);
    try {
      await YupSignupSchemaTags.validate(invalidData);
    } catch (err) {
      expect(err.errors).toEqual(["Nome é obrigatório"]);
    }
  });

});
