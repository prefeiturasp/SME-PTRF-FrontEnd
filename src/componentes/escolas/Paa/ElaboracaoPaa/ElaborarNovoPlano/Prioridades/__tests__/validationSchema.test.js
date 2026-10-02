import { createValidationSchema, importaPrioridadesValidationSchema } from "../validationSchema";

const base = {
  prioridade: "Merenda",
  recurso: "recurso-1",
  tipo_aplicacao: "CAPITAL",
  especificacao_material: "Geladeira",
  valor_total: 1500,
};

const mensagemDe = async (schema, valores) => {
  try {
    await schema.validate(valores);
    return null;
  } catch (erro) {
    return erro.message;
  }
};

describe("validação de prioridade do PAA", () => {
  it("deve aceitar uma prioridade de capital com os campos obrigatórios", async () => {
    await expect(createValidationSchema("OUTROS", "CAPITAL").validate(base)).resolves.toMatchObject(base);
  });

  it("deve exigir ação da associação quando o recurso é PTRF", async () => {
    expect(await mensagemDe(createValidationSchema("PTRF", "CAPITAL"), base)).toBe("Ação é obrigatório");

    await expect(
      createValidationSchema("PTRF", "CAPITAL").validate({ ...base, acao_associacao: "acao-1" })
    ).resolves.toMatchObject({ acao_associacao: "acao-1" });
  });

  it("deve exigir programa e ação quando o recurso é PDDE", async () => {
    const schema = createValidationSchema("PDDE", "CAPITAL");
    const erro = await schema.validate(base, { abortEarly: false }).catch((falha) => falha);

    expect(erro.errors).toEqual(expect.arrayContaining([
      "Programa é obrigatório",
      "Ação é obrigatório",
    ]));

    await expect(
      schema.validate({ ...base, programa_pdde: "programa-1", acao_pdde: "acao-1" })
    ).resolves.toMatchObject({ programa_pdde: "programa-1", acao_pdde: "acao-1" });
  });

  it("deve exigir o tipo de despesa quando a aplicação é custeio", async () => {
    const valores = { ...base, tipo_aplicacao: "CUSTEIO" };

    expect(await mensagemDe(createValidationSchema("OUTROS", "CUSTEIO"), valores)).toBe(
      "Tipo de despesa é obrigatório"
    );
  });

  it("deve recusar valor total vazio ou igual a zero", async () => {
    expect(await mensagemDe(createValidationSchema("OUTROS", "CAPITAL"), { ...base, valor_total: 0 })).toBe(
      "Valor total é obrigatório!"
    );
    expect(await mensagemDe(createValidationSchema("OUTROS", "CAPITAL"), { ...base, valor_total: null })).toBe(
      "Valor total é obrigatório!"
    );
  });

  it("deve exigir descrição fora de capital quando a flag está ativa", async () => {
    const schema = createValidationSchema("OUTROS", "CUSTEIO", true);
    const valores = { ...base, tipo_aplicacao: "CUSTEIO", tipo_despesa_custeio: "tipo-1" };

    expect(await mensagemDe(schema, valores)).toBe("Descrição é obrigatória");
    expect(
      await mensagemDe(schema, { ...valores, descricao: "x".repeat(101) })
    ).toBe("Descrição deve ter no máximo 100 caracteres");

    await expect(
      createValidationSchema("OUTROS", "CAPITAL", true).validate(base)
    ).resolves.toMatchObject(base);
  });
});

describe("validação da importação de prioridades", () => {
  it("deve exigir o PAA anterior", async () => {
    expect(await mensagemDe(importaPrioridadesValidationSchema(), {})).toBe("PAA anterior é obrigatório");
    await expect(
      importaPrioridadesValidationSchema().validate({ uuid_paa_anterior: "paa-anterior" })
    ).resolves.toEqual({ uuid_paa_anterior: "paa-anterior" });
  });
});
