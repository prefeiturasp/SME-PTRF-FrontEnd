import { YupSchemaContasAssociacoes } from "../FormValidacao";

describe("YupSchemaContasAssociacoes", () => {
  const valoresValidos = {
    associacao_nome: "EMEF Teste",
    tipo_conta: "tipo-conta-uuid",
    status: "ATIVA",
    data_inicio: "2026-01-01",
  };

  it("valida quando todos os campos obrigatórios estão preenchidos", async () => {
    await expect(YupSchemaContasAssociacoes.validate(valoresValidos)).resolves.toEqual(valoresValidos);
  });

  it("retorna erros para campos obrigatórios vazios", async () => {
    await expect(
      YupSchemaContasAssociacoes.validate(
        {
          associacao_nome: "",
          tipo_conta: "",
          status: "",
          data_inicio: "",
        },
        { abortEarly: false }
      )
    ).rejects.toMatchObject({
      errors: expect.arrayContaining([
        "Associação é obrigatório",
        "Tipo de conta é obrigatório",
        "Status é obrigatório",
        "Data de início é obrigatório",
      ]),
    });
  });
});
