import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BotaoElaboracaoPaa } from "..";

const botaoHabilitado = { visivel: true, habilitado: true, rotulo: "Elaborar novo PAA", mensagem: "" };
const botaoBloqueado = { visivel: true, habilitado: false, rotulo: "Elaborar novo PAA", mensagem: "Motivo do bloqueio" };
const botaoOculto = { ...botaoBloqueado, visivel: false };

describe("BotaoElaboracaoPaa", () => {
  it("não renderiza sem botão", () => {
    expect(render(<BotaoElaboracaoPaa botao={null} />).container).toBeEmptyDOMElement();
  });

  it("não renderiza quando o botão está oculto", () => {
    expect(render(<BotaoElaboracaoPaa botao={botaoOculto} />).container).toBeEmptyDOMElement();
  });

  it("habilitado mostra o rótulo e dispara o clique com o próprio botão", () => {
    const onClick = jest.fn();
    render(<BotaoElaboracaoPaa botao={botaoHabilitado} processando={false} onClick={onClick} />);

    const botao = screen.getByTestId("elaborar-paa-button");
    fireEvent.click(botao);

    expect(botao).toBeEnabled();
    expect(botao).toHaveTextContent("Elaborar novo PAA");
    expect(botao).not.toHaveAttribute("title");
    expect(onClick).toHaveBeenCalledWith(botaoHabilitado);
  });

  it("bloqueado fica desabilitado e mostra o motivo no title", () => {
    const onClick = jest.fn();
    render(<BotaoElaboracaoPaa botao={botaoBloqueado} processando={false} onClick={onClick} />);

    const botao = screen.getByTestId("elaborar-paa-button");

    expect(botao).toBeDisabled();
    expect(botao).toHaveAttribute("title", "Motivo do bloqueio");
  });

  it("fica desabilitado enquanto processa", () => {
    render(<BotaoElaboracaoPaa botao={botaoHabilitado} processando onClick={jest.fn()} />);

    expect(screen.getByTestId("elaborar-paa-button")).toBeDisabled();
  });
});
