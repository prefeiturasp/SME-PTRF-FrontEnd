import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SecaoProximaVigencia } from "../index";

jest.mock("../../PaaCard/PaaCard", () => ({
  PaaCard: ({ dados, onDadosAtualizados }) => (
    <div data-testid="paa-card" data-uuid={dados?.uuid}>
      <button type="button" onClick={onDadosAtualizados}>
        atualizar-dados
      </button>
    </div>
  ),
}));

jest.mock("../../AcoesRetificacaoPaa", () => ({
  AcoesRetificacaoPaa: ({ dados }) => (
    <div data-testid="acoes-retificacao" data-uuid={dados?.uuid} />
  ),
}));

describe("SecaoProximaVigencia", () => {
  const paa = { uuid: "uuid-proxima", referencia: "2027 a 2028" };

  const renderSecao = (props = {}) =>
    render(<SecaoProximaVigencia paa={paa} onDadosAtualizados={jest.fn()} {...props} />);

  it("renderiza a seção com o título e o título do card formatado", () => {
    renderSecao();

    expect(screen.getByTestId("secao-proxima-vigencia")).toBeInTheDocument();
    expect(screen.getByText("Plano da próxima vigência")).toBeInTheDocument();
    expect(screen.getByText("PAA 2027/2028")).toBeInTheDocument();
  });

  it("usa apenas 'PAA' no título quando não há referência", () => {
    renderSecao({ paa: { uuid: "uuid-proxima" } });

    expect(screen.getByText("PAA")).toBeInTheDocument();
  });

  it("mostra o card expandido por padrão e repassa os dados do PAA", () => {
    renderSecao();

    const card = screen.getByTestId("paa-card");
    expect(card).toHaveAttribute("data-uuid", "uuid-proxima");
    expect(screen.getByRole("button", { expanded: true })).toBeInTheDocument();
  });

  it("repassa os dados do PAA para as ações de retificação", () => {
    renderSecao();

    expect(screen.getByTestId("acoes-retificacao")).toHaveAttribute("data-uuid", "uuid-proxima");
  });

  it("chama onDadosAtualizados quando o card solicita atualização", async () => {
    const onDadosAtualizados = jest.fn();
    renderSecao({ onDadosAtualizados });

    await userEvent.click(screen.getByText("atualizar-dados"));

    expect(onDadosAtualizados).toHaveBeenCalledTimes(1);
  });

  it("recolhe e expande o card ao acionar o botão da barra de título", async () => {
    renderSecao();
    const toggle = screen.getByRole("button", { name: "Fechar" });

    await userEvent.click(toggle);

    expect(screen.queryByTestId("paa-card")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Abrir" })).toHaveAttribute("aria-expanded", "false");
    // as ações de retificação ficam na barra e permanecem visíveis
    expect(screen.getByTestId("acoes-retificacao")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Abrir" }));

    expect(screen.getByTestId("paa-card")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar" })).toHaveAttribute("aria-expanded", "true");
  });
});
