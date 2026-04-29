export const getErrorMessage = (err, mensagemPadrao) => {
  const data = err?.response?.data;

  if (!data) return "Ocorreu um erro inesperado.";

  if (typeof data === "string") return data;

  if (data.mensagem) return data.mensagem;
  if (data.detail) return data.detail;

  const mensagens = extrairMensagens(data);

  if (mensagens.length > 0) {
    return mensagens.join("\n");
  }

  return mensagemPadrao || "Ocorreu um erro inesperado.";
};

const extrairMensagens = (obj, prefixo = "") => {
  let resultado = [];

  if (typeof obj === "string") {
    return [prefixo ? `${prefixo}: ${obj}` : obj];
  }

  if (Array.isArray(obj)) {
    return obj.flatMap((item) => extrairMensagens(item, prefixo));
  }

  if (typeof obj === "object" && obj !== null) {
    for (const [chave, valor] of Object.entries(obj)) {
      const novoPrefixo = prefixo
        ? `${prefixo} > ${formatFieldName(chave)}`
        : formatFieldName(chave);

      resultado = resultado.concat(extrairMensagens(valor, novoPrefixo));
    }
  }

  return resultado;
};

const formatFieldName = (campo) => {
  return campo
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
};