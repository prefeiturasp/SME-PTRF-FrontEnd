import { YupSignupSchemaMandatosVacancia } from "../YupSignupSchemaMandatosVacancia";

describe("YupSignupSchemaMandatosVacancia", () => {
    const valoresValidos = {
        referencia_mandato: "2023 a 2025",
        data_inicial: new Date(2023, 0, 1),
        data_final: new Date(2025, 11, 31),
    };

    it("deve validar quando todos os campos estão corretos", async () => {
        await expect(YupSignupSchemaMandatosVacancia.isValid(valoresValidos)).resolves.toBe(true);
    });

    it("deve exigir referencia_mandato", async () => {
        await expect(
            YupSignupSchemaMandatosVacancia.validate({ ...valoresValidos, referencia_mandato: "" })
        ).rejects.toThrow("Referência do mandato é obrigatório");
    });

    it("deve exigir data_inicial", async () => {
        await expect(
            YupSignupSchemaMandatosVacancia.validate({ ...valoresValidos, data_inicial: null })
        ).rejects.toThrow("Data inicial é obrigatória");
    });

    it("deve exigir data_final", async () => {
        await expect(
            YupSignupSchemaMandatosVacancia.validate({ ...valoresValidos, data_final: null })
        ).rejects.toThrow("Data final é obrigatória");
    });

    it("não deve permitir data_final menor que data_inicial", async () => {
        await expect(
            YupSignupSchemaMandatosVacancia.validate({
                ...valoresValidos,
                data_inicial: new Date(2025, 0, 1),
                data_final: new Date(2023, 0, 1),
            })
        ).rejects.toThrow("A data final não pode ser menor que a data inicial");
    });
});
