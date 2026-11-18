import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PaaCardBarraTitulo } from "../PaaCardBarraTitulo";

describe("PaaCardBarraTitulo", () => {
  const renderBarra = (props = {}) =>
    render(<PaaCardBarraTitulo titulo="PAA 2026" isAberto={false} onToggle={jest.fn()} {...props} />);

  it("renderiza o título", () => {
    renderBarra();

    expect(screen.getByText("PAA 2026")).toHaveClass("paa-card-barra-titulo__texto");
  });

  it("quando fechado, indica 'Abrir' e aria-expanded falso", () => {
    renderBarra({ isAberto: false });

    expect(screen.getByAltText("Abrir")).toBeInTheDocument();
    expect(screen.queryByAltText("Fechar")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir" })).toHaveAttribute("aria-expanded", "false");
  });

  it("quando aberto, indica 'Fechar' e aria-expanded verdadeiro", () => {
    renderBarra({ isAberto: true });

    expect(screen.getByAltText("Fechar")).toBeInTheDocument();
    expect(screen.queryByAltText("Abrir")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveAttribute("aria-expanded", "true");
  });

  it("chama onToggle ao clicar no botão", async () => {
    const onToggle = jest.fn();
    renderBarra({ onToggle });

    await userEvent.click(screen.getByRole("button"));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("renderiza as ações extras antes do botão de alternar", () => {
    renderBarra({ acoesExtras: <span data-testid="acao-extra">Retificar</span> });

    const acao = screen.getByTestId("acao-extra");
    const botao = screen.getByRole("button");
    expect(acao).toBeInTheDocument();
    expect(acao.compareDocumentPosition(botao) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("clicar na ação extra não aciona o onToggle", async () => {
    const onToggle = jest.fn();
    renderBarra({ onToggle, acoesExtras: <button type="button">Retificar</button> });

    await userEvent.click(screen.getByRole("button", { name: "Retificar" }));

    expect(onToggle).not.toHaveBeenCalled();
  });

  it("renderiza sem ações extras", () => {
    renderBarra();

    expect(screen.getAllByRole("button")).toHaveLength(1);
  });
});
