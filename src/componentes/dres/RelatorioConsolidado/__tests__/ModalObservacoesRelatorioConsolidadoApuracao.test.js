import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalObservacoesRelatorioConsolidadoApuracao } from "../ModalObservacoesRelatorioConsolidadoApuracao";

const setup = (observacao, extra = {}) => {
  const props = {
    show: true,
    titulo: "Observações",
    observacao: { observacao },
    onChangeObservacao: jest.fn(),
    serviceObservacao: jest.fn(),
    handleClose: jest.fn(),
    ...extra,
  };
  render(<ModalObservacoesRelatorioConsolidadoApuracao {...props} />);
  return props;
};

describe("ModalObservacoesRelatorioConsolidadoApuracao", () => {
  it("com observação: mostra Excluir, salva, cancela e altera", () => {
    const props = setup("texto existente");
    expect(screen.getByText("Observações")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "novo" } });
    expect(props.onChangeObservacao).toHaveBeenCalledWith("novo");
    fireEvent.click(screen.getByText("Excluir"));
    expect(props.serviceObservacao).toHaveBeenCalledWith({ operacao: "deletar" });
    fireEvent.click(screen.getByText("Salvar"));
    expect(props.serviceObservacao).toHaveBeenCalledWith({ operacao: "salvar" });
    fireEvent.click(screen.getByText("Cancelar"));
    expect(props.handleClose).toHaveBeenCalled();
  });

  it("sem observação: sem Excluir e Salvar desabilitado", () => {
    setup("");
    expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
    expect(screen.getByText("Salvar")).toBeDisabled();
  });
});
