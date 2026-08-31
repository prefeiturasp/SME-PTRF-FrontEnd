import { extraiMensagemDeErroVacancia } from "../extraiMensagemDeErroVacancia";

describe("extraiMensagemDeErroVacancia", () => {
    it("deve retornar mensagem padrão quando não há response", () => {
        expect(extraiMensagemDeErroVacancia({})).toBe("Erro inesperado, tente novamente.");
    });

    it("deve priorizar o campo mensagem (formato da v2)", () => {
        const error = {
            response: {
                data: {
                    mensagem: "Já existe um ocupante ativo para este cargo.",
                    detail: "outro erro",
                },
            },
        };

        expect(extraiMensagemDeErroVacancia(error)).toBe(
            "Já existe um ocupante ativo para este cargo."
        );
    });

    it("deve usar non_field_errors quando mensagem não existir", () => {
        const error = {
            response: {
                data: {
                    non_field_errors: ["Primeiro erro.", "Segundo erro."],
                },
            },
        };

        expect(extraiMensagemDeErroVacancia(error)).toBe("Primeiro erro. Segundo erro.");
    });

    it("deve usar detail quando mensagem e non_field_errors não existirem", () => {
        const error = {
            response: {
                data: {
                    detail: "Falha inesperada.",
                },
            },
        };

        expect(extraiMensagemDeErroVacancia(error)).toBe("Falha inesperada.");
    });

    it("deve retornar mensagem padrão quando nenhum campo conhecido existir", () => {
        const error = {
            response: {
                data: {},
            },
        };

        expect(extraiMensagemDeErroVacancia(error)).toBe("Erro inesperado, tente novamente.");
    });
});
