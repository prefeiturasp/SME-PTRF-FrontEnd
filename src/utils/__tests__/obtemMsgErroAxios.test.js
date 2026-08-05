import { getErrorMessage } from "../obtemMsgErroAxios";

describe("getErrorMessage", () => {
  it("retorna mensagem padrão quando não há response.data", () => {
    expect(getErrorMessage({})).toBe("Ocorreu um erro inesperado.");
    expect(getErrorMessage(null)).toBe("Ocorreu um erro inesperado.");
  });

  it("retorna string quando data é string", () => {
    expect(getErrorMessage({ response: { data: "Erro direto" } })).toBe(
      "Erro direto"
    );
  });

  it("prioriza data.mensagem", () => {
    expect(
      getErrorMessage({ response: { data: { mensagem: "Falha na operação" } } })
    ).toBe("Falha na operação");
  });

  it("prioriza data.detail quando não há mensagem", () => {
    expect(
      getErrorMessage({ response: { data: { detail: "Detalhe do erro" } } })
    ).toBe("Detalhe do erro");
  });

  it("extrai mensagens de campos aninhados", () => {
    const err = {
      response: {
        data: {
          nome: ["Campo obrigatório"],
          endereco: { rua: ["Inválida"] },
        },
      },
    };
    const msg = getErrorMessage(err);
    expect(msg).toContain("Nome: Campo obrigatório");
    expect(msg).toContain("Endereco > Rua: Inválida");
  });

  it("extrai mensagens de arrays", () => {
    const err = {
      response: {
        data: {
          itens: ["Erro A", "Erro B"],
        },
      },
    };
    const msg = getErrorMessage(err);
    expect(msg).toContain("Itens: Erro A");
    expect(msg).toContain("Itens: Erro B");
  });

  it("usa mensagemPadrao quando objeto não gera mensagens", () => {
    expect(getErrorMessage({ response: { data: {} } }, "Erro customizado")).toBe(
      "Erro customizado"
    );
    expect(getErrorMessage({ response: { data: {} } })).toBe(
      "Ocorreu um erro inesperado."
    );
  });

  it("formata nomes de campo com underscore", () => {
    const err = {
      response: {
        data: {
          data_inicio: ["Data inválida"],
        },
      },
    };
    expect(getErrorMessage(err)).toBe("Data Inicio: Data inválida");
  });
});
