import { metodosAuxiliares } from "../metodosAuxiliares";

describe("metodosAuxiliares (pipeline) - limpaCamposExclusivosAplicacaoRecurso", () => {
  it("limpa os campos exclusivos de capital ao mudar para CUSTEIO", () => {
    const setFieldValue = jest.fn();
    metodosAuxiliares.limpaCamposExclusivosAplicacaoRecurso(setFieldValue, 0, "CUSTEIO");

    expect(setFieldValue).toHaveBeenCalledWith("rateios[0].quantidade_itens_capital", "");
    expect(setFieldValue).toHaveBeenCalledWith("rateios[0].valor_item_capital", "");
    expect(setFieldValue).toHaveBeenCalledWith("rateios[0].nao_exibir_em_rel_bens", false);
    expect(setFieldValue).toHaveBeenCalledWith(
      "rateios[0].numero_processo_incorporacao_capital",
      ""
    );
  });

  it("limpa os campos exclusivos de capital quando aplicacaoRecurso está vazio", () => {
    const setFieldValue = jest.fn();
    metodosAuxiliares.limpaCamposExclusivosAplicacaoRecurso(setFieldValue, 1, "");

    expect(setFieldValue).toHaveBeenCalledWith("rateios[1].quantidade_itens_capital", "");
    expect(setFieldValue).toHaveBeenCalledWith("rateios[1].valor_item_capital", "");
  });

  it("não altera os campos de capital ao mudar para CAPITAL", () => {
    const setFieldValue = jest.fn();
    metodosAuxiliares.limpaCamposExclusivosAplicacaoRecurso(setFieldValue, 0, "CAPITAL");

    expect(setFieldValue).not.toHaveBeenCalled();
  });

  it("usa o index correto ao montar o path do rateio", () => {
    const setFieldValue = jest.fn();
    metodosAuxiliares.limpaCamposExclusivosAplicacaoRecurso(setFieldValue, 3, "CUSTEIO");

    expect(setFieldValue).toHaveBeenCalledWith("rateios[3].valor_item_capital", "");
  });
});
