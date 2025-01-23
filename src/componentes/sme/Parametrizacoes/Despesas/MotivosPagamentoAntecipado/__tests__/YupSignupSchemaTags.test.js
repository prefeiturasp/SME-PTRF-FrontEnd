import { YupSignupSchemaTags } from "../YupSignupSchemaTags"; // Ajuste o caminho conforme necessário
import * as yup from "yup";

describe("YupSignupSchemaTags Validation Schema", () => {

  it("deve validar corretamente quando o campo é obrigatório", async () => {
    const validData = {
      motivo: "Teste", // motivo válido
    };
    await expect(YupSignupSchemaTags.isValid(validData)).resolves.toBe(true);
  });

  it("deve apresentar erro quando o campo obrigatório não for preenchido", async () => {
    const invalidData = {
      motivo: "", // motivo inválido (vazio)
    };

    await expect(YupSignupSchemaTags.isValid(invalidData)).resolves.toBe(false);
    try {
      await YupSignupSchemaTags.validate(invalidData);
    } catch (err) {
      expect(err.errors).toEqual(["Nome do motivo é obrigatório"]);
    }
  });

});
