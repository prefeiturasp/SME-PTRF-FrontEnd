import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import { BotoesAvancarRetroceder } from "../BotoesAvancarRetroceder";
import { RetornaSeFlagAtiva } from "../../DetalhePrestacaoDeContasNaoApresentada/RetornaSeFlagAtiva";

jest.mock("../../DetalhePrestacaoDeContasNaoApresentada/RetornaSeFlagAtiva", () => ({
  RetornaSeFlagAtiva: jest.fn(),
}));

jest.mock("react-tooltip", () => ({
  Tooltip: (props) => (
    <div data-testid={props.id} data-place={props.place} />
  ),
}));

const prestacaoBase = {
  uuid: "pc-uuid",
  status: "RECEBIDA",
};

const defaultProps = {
  prestacaoDeContas: prestacaoBase,
  textoBtnAvancar: "Avançar",
  textoBtnRetroceder: "Voltar",
  metodoAvancar: jest.fn(),
  metodoRetroceder: jest.fn(),
  disabledBtnAvancar: false,
  disabledBtnRetroceder: false,
  esconderBotaoRetroceder: false,
  esconderBotaoAvancar: false,
  tooltipRetroceder: null,
  tooltipAvancar: null,
  setShowModalConcluirPcNaoApresentada: jest.fn(),
};

const setup = (props = {}) =>
  render(<BotoesAvancarRetroceder {...defaultProps} {...props} />);

beforeEach(() => {
  jest.clearAllMocks();
  RetornaSeFlagAtiva.mockReturnValue(false);
});

describe("BotoesAvancarRetroceder", () => {
  it("renderiza botões Avançar e Voltar com textos corretos", () => {
    setup();

    expect(
      screen.getByRole("button", { name: /Voltar/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Avançar/i })
    ).toBeInTheDocument();
  });

  it("chama callbacks ao clicar nos botões", () => {
    const metodoAvancar = jest.fn();
    const metodoRetroceder = jest.fn();

    setup({ metodoAvancar, metodoRetroceder });

    fireEvent.click(screen.getByRole("button", { name: /Voltar/i }));
    fireEvent.click(screen.getByRole("button", { name: /Avançar/i }));

    expect(metodoRetroceder).toHaveBeenCalled();
    expect(metodoAvancar).toHaveBeenCalled();
  });

  it("não renderiza botão de retroceder quando esconderBotaoRetroceder=true", () => {
    setup({ esconderBotaoRetroceder: true });

    expect(
      screen.queryByRole("button", { name: /Voltar/i })
    ).not.toBeInTheDocument();
  });

  it("não renderiza botão de avançar quando esconderBotaoAvancar=true", () => {
    setup({ esconderBotaoAvancar: true });

    expect(
      screen.queryByRole("button", { name: /Avançar/i })
    ).not.toBeInTheDocument();
  });

  it("renderiza tooltip para avançar e retroceder quando informados", () => {
    setup({
      tooltipRetroceder: "Dica voltar",
      tooltipAvancar: "Dica avançar",
    });

    const spanVoltar = screen.getByText("Voltar");
    const spanAvancar = screen.getByText("Avançar");

    expect(spanVoltar).toHaveAttribute(
      "data-tooltip-content",
      "Dica voltar"
    );
    expect(spanAvancar).toHaveAttribute(
      "data-tooltip-content",
      "Dica avançar"
    );
    expect(
      screen.getByTestId("tooltip-id-pc-uuid")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("tooltip-avancar-id-pc-uuid")
    ).toBeInTheDocument();
  });

  it("quando FLAG_ATIVA e status NAO_APRESENTADA renderiza botão 'Concluir como reprovada'", () => {
    RetornaSeFlagAtiva.mockReturnValue(true);
    const setShowModalConcluirPcNaoApresentada = jest.fn();

    setup({
      prestacaoDeContas: { ...prestacaoBase, status: "NAO_APRESENTADA" },
      setShowModalConcluirPcNaoApresentada,
    });

    const btnReprovada = screen.getByRole("button", {
      name: /Concluir como reprovada/i,
    });
    expect(btnReprovada).toBeInTheDocument();

    fireEvent.click(btnReprovada);
    expect(
      setShowModalConcluirPcNaoApresentada
    ).toHaveBeenCalledWith(true);
  });
});

