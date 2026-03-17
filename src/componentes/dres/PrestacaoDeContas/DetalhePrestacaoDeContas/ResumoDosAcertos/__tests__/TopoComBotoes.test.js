import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { TopoComBotoes } from "../TopoComBotoes";
import { RetornaSeTemPermissaoEdicaoAcompanhamentoDePc } from "../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";

jest.mock("../../../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc", () => ({
  RetornaSeTemPermissaoEdicaoAcompanhamentoDePc: jest.fn(),
}));

jest.mock("../../AssociacaoEPeriodoDoCabecalho", () => (props) => (
  <div data-testid="associacao-periodo-mock">
    {props.prestacaoDeContas && props.prestacaoDeContas.status}
  </div>
));

const defaultProps = {
  onClickBtnVoltar: jest.fn(),
  setShowModalConfirmaDevolverParaAcerto: jest.fn(),
  podeDevolver: true,
  prestacaoDeContas: { status: "EM_ANALISE" },
};

const setup = (props = {}) =>
  render(<TopoComBotoes {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(true);
});

describe("TopoComBotoes", () => {
  it("renderiza título, botão Voltar e botão Devolver para Associação", () => {
    setup();

    expect(
      screen.getByTestId("associacao-periodo-mock")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Voltar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Devolver para Associação/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Resumo de acertos")
    ).toBeInTheDocument();
  });

  it("chama onClickBtnVoltar ao clicar no botão Voltar", () => {
    const onClickBtnVoltar = jest.fn();
    setup({ onClickBtnVoltar });

    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    expect(onClickBtnVoltar).toHaveBeenCalled();
  });

  it("usa onClickDevolver quando fornecido", () => {
    const onClickDevolver = jest.fn();
    setup({ onClickDevolver });

    fireEvent.click(
      screen.getByRole("button", { name: /Devolver para Associação/i })
    );
    expect(onClickDevolver).toHaveBeenCalled();
  });

  it("quando onClickDevolver não é passado, chama setShowModalConfirmaDevolverParaAcerto", () => {
    const setShowModalConfirmaDevolverParaAcerto = jest.fn();
    setup({ setShowModalConfirmaDevolverParaAcerto });

    fireEvent.click(
      screen.getByRole("button", { name: /Devolver para Associação/i })
    );
    expect(setShowModalConfirmaDevolverParaAcerto).toHaveBeenCalledWith(true);
  });

  it("desabilita botão Devolver quando não tem permissão ou podeDevolver=false ou devolverDisabled=true", () => {
    RetornaSeTemPermissaoEdicaoAcompanhamentoDePc.mockReturnValue(false);

    setup({ podeDevolver: false, devolverDisabled: true });

    const botaoDevolver = screen.getByRole("button", {
      name: /Devolver para Associação/i,
    });

    expect(botaoDevolver).toBeDisabled();
    expect(botaoDevolver).toHaveClass("btn-disabled");
  });
});

