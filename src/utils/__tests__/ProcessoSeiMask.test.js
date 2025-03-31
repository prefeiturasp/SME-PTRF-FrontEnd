import { processoSeiMask } from "../ProcessoSeiMask";

describe("processoSeiMask", () => {
    it("deve retornar a máscara correta para um processo SEI", () => {
        const expectedMask = [
            /\d/, /\d/, /\d/, /\d/, '.', 
            /\d/, /\d/, /\d/, /\d/, '/', 
            /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, 
            '-', /\d/
        ];

        expect(processoSeiMask("202300000001234")).toEqual(expectedMask);
    });

    it("deve remover caracteres não numéricos", () => {
        const result = processoSeiMask("2023.0000/0000000-0");
        expect(result).toEqual([
            /\d/, /\d/, /\d/, /\d/, '.', 
            /\d/, /\d/, /\d/, /\d/, '/', 
            /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, 
            '-', /\d/
        ]);
    });

    it("deve lidar com entrada vazia", () => {
        expect(processoSeiMask("")).toEqual([
            /\d/, /\d/, /\d/, /\d/, '.', 
            /\d/, /\d/, /\d/, /\d/, '/', 
            /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, 
            '-', /\d/
        ]);
    });
});
