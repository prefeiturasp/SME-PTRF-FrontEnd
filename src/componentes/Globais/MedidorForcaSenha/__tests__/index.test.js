import { medidorForcaSenhaVerifica, MedidorForcaSenha } from "../index";

describe("medidorForcaSenhaVerifica", () => {
  let element;

  beforeEach(() => {
    element = document.createElement("div");
    element.classList.add = jest.fn();
    element.classList.remove = jest.fn();
  });

  it("retorna true quando senhas são iguais", () => {
    element.id = "senhas_iguais";

    const result = medidorForcaSenhaVerifica(
      "Senha123",
      null,
      element,
      "Senha123"
    );

    expect(result).toBe(true);
    expect(element.classList.remove).toHaveBeenCalledWith(
      "forca-senha-invalida"
    );
    expect(element.classList.add).toHaveBeenCalledWith("forca-senha-valida");
  });

  it("retorna false quando senhas são diferentes", () => {
    element.id = "senhas_iguais";

    const result = medidorForcaSenhaVerifica(
      "Senha123",
      null,
      element,
      "Senha456"
    );

    expect(result).toBe(false);
    expect(element.classList.add).toHaveBeenCalledWith("forca-senha-invalida");
  });

  it("valida tamanho entre 8 e 12 caracteres", () => {
    element.id = "entre_oito_ate_doze";

    const result = medidorForcaSenhaVerifica("Senha123", null, element);

    expect(result).toBe(true);
    expect(element.classList.add).toHaveBeenCalledWith("forca-senha-valida");
  });

  it("falha quando tamanho é menor que 8", () => {
    element.id = "entre_oito_ate_doze";

    const result = medidorForcaSenhaVerifica("Ab1", null, element);

    expect(result).toBe(false);
    expect(element.classList.add).toHaveBeenCalledWith("forca-senha-invalida");
  });

  it("valida regex corretamente", () => {
    element.id = "letra_maiuscula";

    const result = medidorForcaSenhaVerifica(
      "Senha123",
      /(?=.*[A-Z])/,
      element
    );

    expect(result).toBe(true);
  });

  it("retorna false quando regex não bate", () => {
    element.id = "letra_maiuscula";

    const result = medidorForcaSenhaVerifica(
      "senha123",
      /(?=.*[A-Z])/,
      element
    );

    expect(result).toBe(false);
  });
});

describe("MedidorForcaSenha", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="letra_minuscula"></div>
      <div id="letra_maiuscula"></div>
      <div id="senhas_iguais"></div>
      <div id="espaco_em_branco"></div>
      <div id="caracteres_acentuados"></div>
      <div id="numero_ou_caracter_especial"></div>
      <div id="entre_oito_ate_doze"></div>
    `;

    jest.spyOn(Storage.prototype, "setItem");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("calcula força máxima da senha válida", () => {
    MedidorForcaSenha({
      senha: "Senha@123",
      confirmacao_senha: "Senha@123",
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("medidorSenha", 7);
  });

  it("reduz força quando senha é fraca", () => {
    MedidorForcaSenha({
      senha: "abc",
      confirmacao_senha: "abc",
    });

    expect(localStorage.setItem).toHaveBeenCalled();
    const valor = localStorage.setItem.mock.calls[0][1];
    expect(valor).toBeLessThan(7);
  });

  it("não soma ponto quando senhas são diferentes", () => {
    MedidorForcaSenha({
      senha: "Senha@123",
      confirmacao_senha: "Senha@456",
    });

    const valor = localStorage.setItem.mock.calls[0][1];
    expect(valor).toBeLessThan(7);
  });
});
