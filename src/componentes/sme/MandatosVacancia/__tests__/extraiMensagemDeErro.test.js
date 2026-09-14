import { extraiMensagemDeErro } from "../extraiMensagemDeErro";

describe("extraiMensagemDeErro (MandatosVacancia)", () => {
    it("deve retornar o fallback padrão quando não houver response.data", () => {
        expect(extraiMensagemDeErro(new Error("qualquer"))).toBe(
            "Houve um erro ao tentar fazer essa atualização."
        );
    });

    it("deve retornar o fallback customizado quando informado", () => {
        expect(extraiMensagemDeErro({}, "Mensagem própria")).toBe("Mensagem própria");
    });

    it("deve retornar a própria string quando response.data for uma string", () => {
        expect(extraiMensagemDeErro({ response: { data: "Erro em texto puro" } })).toBe(
            "Erro em texto puro"
        );
    });

    it("deve priorizar o campo detail", () => {
        const error = { response: { data: { detail: "As datas do mandato se sobrepõem." } } };
        expect(extraiMensagemDeErro(error)).toBe("As datas do mandato se sobrepõem.");
    });

    it("deve usar o campo mensagem quando não houver detail", () => {
        const error = { response: { data: { mensagem: "Não é possível excluir." } } };
        expect(extraiMensagemDeErro(error)).toBe("Não é possível excluir.");
    });

    it("deve juntar as mensagens de erros de validação por campo do DRF", () => {
        const error = {
            response: {
                data: {
                    data_final: ["Formato inválido para data. Use um dos formatos a seguir: YYYY-MM-DD."],
                },
            },
        };
        expect(extraiMensagemDeErro(error)).toBe(
            "Formato inválido para data. Use um dos formatos a seguir: YYYY-MM-DD."
        );
    });

    it("deve juntar mensagens de múltiplos campos", () => {
        const error = {
            response: {
                data: {
                    data_inicial: ["Este campo é obrigatório."],
                    referencia_mandato: ["Já existe."],
                },
            },
        };
        expect(extraiMensagemDeErro(error)).toBe("Este campo é obrigatório. Já existe.");
    });

    it("deve cair no fallback quando o objeto de erro não tiver strings reconhecíveis", () => {
        const error = { response: { data: { campo: { aninhado: 1 } } } };
        expect(extraiMensagemDeErro(error)).toBe(
            "Houve um erro ao tentar fazer essa atualização."
        );
    });
});
