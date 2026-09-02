import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalInfoNaoPodeGravar } from "../components/ModalInfoNaoPodeGravar";
import { useAcoesContext } from "../hooks/useAcoesContext";

// Mock do hook useAcoesContext
jest.mock("../hooks/useAcoesContext", () => ({
  useAcoesContext: jest.fn(),
}));

// Mock do componente ModalBootstrap genérico
jest.mock("../../../../../Globais/ModalBootstrap", () => ({
  ModalBootstrap: ({
    show,
    onHide,
    titulo,
    bodyText,
    primeiroBotaoOnclick,
    primeiroBotaoTexto,
    primeiroBotaoCss,
  }) => {
    if (!show) return null;
    return (
      <div data-testid="modal-info-nao-pode-gravar">
        <h2>{titulo}</h2>
        <div>{bodyText}</div>
        <button
          data-testid="modal-btn-fechar"
          className={`btn btn-${primeiroBotaoCss}`}
          onClick={primeiroBotaoOnclick}
        >
          {primeiroBotaoTexto}
        </button>
        <button data-testid="modal-btn-hide" onClick={onHide}>
          onHide
        </button>
      </div>
    );
  },
}));

describe("Componente <ModalInfoNaoPodeGravar />", () => {
  const mockHandleCloseInfoNaoPodeGravar = jest.fn();

  const defaultContextValues = {
    showModalInfoNaoPodeGravar: true,
    handleCloseInfoNaoPodeGravar: mockHandleCloseInfoNaoPodeGravar,
    mensagemModalInfoNaoPodeGravar:
      "Não é possível gravar a ação pois existem pendências cadastradas.",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAcoesContext.mockReturnValue(defaultContextValues);
  });

  test("deve renderizar o modal com título, mensagem e botão de fechar quando showModalInfoNaoPodeGravar for true", () => {
    render(<ModalInfoNaoPodeGravar />);

    expect(screen.getByText("Atualização não permitida")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Não é possível gravar a ação pois existem pendências cadastradas."
      )
    ).toBeInTheDocument();

    const btnFechar = screen.getByRole("button", { name: "Fechar" });
    expect(btnFechar).toBeInTheDocument();
    expect(btnFechar).toHaveClass("btn-success");
  });

  test("não deve renderizar o modal quando showModalInfoNaoPodeGravar for false", () => {
    useAcoesContext.mockReturnValue({
      ...defaultContextValues,
      showModalInfoNaoPodeGravar: false,
    });

    render(<ModalInfoNaoPodeGravar />);

    expect(
      screen.queryByTestId("modal-info-nao-pode-gravar")
    ).not.toBeInTheDocument();
  });

  test("deve chamar handleCloseInfoNaoPodeGravar ao clicar no botão 'Fechar'", () => {
    render(<ModalInfoNaoPodeGravar />);

    const btnFechar = screen.getByRole("button", { name: "Fechar" });
    fireEvent.click(btnFechar);

    expect(mockHandleCloseInfoNaoPodeGravar).toHaveBeenCalledTimes(1);
  });

  test("deve chamar handleCloseInfoNaoPodeGravar ao acionar a propriedade onHide do modal", () => {
    render(<ModalInfoNaoPodeGravar />);

    const btnHide = screen.getByTestId("modal-btn-hide");
    fireEvent.click(btnHide);

    expect(mockHandleCloseInfoNaoPodeGravar).toHaveBeenCalledTimes(1);
  });
});