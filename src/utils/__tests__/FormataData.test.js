import { formataData } from "../FormataData";

describe("formataData", () => {
    it("deve formatar a data no padrão DD/MM/YYYY por padrão", () => {
        const data = "2025-03-01";
        expect(formataData(data)).toBe("01/03/2025");
    });

    it("deve aceitar um formato personalizado", () => {
        const data = "2025-03-01";
        expect(formataData(data, "YYYY-MM-DD")).toBe("2025-03-01");
    });

    it("deve retornar 'Invalid date' para entradas inválidas", () => {
        expect(formataData(null)).toBe("Invalid date");
        expect(formataData("")).toBe("Invalid date");
        expect(formataData("data inválida")).toBe("Invalid date");
    });

    it("deve lidar com objetos Date corretamente", () => {
        const data = new Date(2025, 2, 1); // Março é 2 porque os meses começam do zero
        expect(formataData(data)).toBe("01/03/2025");
    });
});
