import { YupSignupSchemaFornecedores } from "../YupSignupSchemaFornecedores"; // Ajuste o caminho conforme necessário
import * as yup from "yup";

describe("YupSignupSchemaFornecedores Validation Schema", () => {


  it("Testar o yup  de validação do campo CPF/CNPJ", async () => {
    const invalidData = {
      cpf_cnpj: "",
    };
    await expect(YupSignupSchemaFornecedores.isValid(invalidData)).resolves.toBe(false);
    try {
      await YupSignupSchemaFornecedores.validate(invalidData);
    } catch (err) {
      console.log(err.errors)
      expect(err.errors).toEqual(["CPF / CNPJ é obrigatório"]);
    }
  });

  it("Testar o yup de validação do campo Nome", async () => {
    const invalidData = {
      nome: "",
      cpf_cnpj: "01234567890",
    };
    await expect(YupSignupSchemaFornecedores.isValid(invalidData)).resolves.toBe(false);
    try {
      await YupSignupSchemaFornecedores.validate(invalidData);
    } catch (err) {
      console.log(err.errors)
      expect(err.errors).toEqual(["Nome é obrigatório"]);
    }
  });

});