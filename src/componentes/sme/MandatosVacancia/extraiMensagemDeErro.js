export const extraiMensagemDeErro = (
    error,
    fallback = "Houve um erro ao tentar fazer essa atualização."
) => {
    const dados = error?.response?.data;
    if (!dados) return fallback;
    if (typeof dados === "string") return dados;

    if (dados.detail) return dados.detail;
    if (dados.mensagem) return dados.mensagem;

    // erros de validação por campo do DRF: { campo: ["msg", ...], ... }
    if (typeof dados === "object") {
        const mensagens = Object.values(dados)
            .flat()
            .filter((m) => typeof m === "string");
        if (mensagens.length) return mensagens.join(" ");
    }

    return fallback;
};
