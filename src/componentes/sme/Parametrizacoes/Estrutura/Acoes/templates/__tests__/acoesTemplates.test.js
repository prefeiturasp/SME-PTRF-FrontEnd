import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import {
  aceitaCapitalTemplate,
  acoesTemplate,
  conferirUnidadesTemplate,
  ordenacaoHeaderTemplate,
  ordenacaoTemplate,
} from "../acoesTemplates";

describe("templates da tabela de ações", () => {
  it("deve colorir a indicação de capital aceito e não aceito", () => {
    const { container, rerender } = render(aceitaCapitalTemplate({ aceita_capital: true }));
    expect(container.firstChild).toHaveStyle({ color: "#297805" });

    rerender(aceitaCapitalTemplate({ aceita_capital: false }));
    expect(container.firstChild).toHaveStyle({ color: "#B40C02" });
  });

  it("deve exibir a ordem e o cabeçalho de ordenação", () => {
    render(
      <>
        {ordenacaoTemplate({ ordem_exibicao: 3 })}
        {ordenacaoHeaderTemplate("#00585E")}
      </>
    );

    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Ordenação")).toBeInTheDocument();
  });

  it("deve apontar para as unidades vinculadas da ação", () => {
    render(
      <MemoryRouter>
        {conferirUnidadesTemplate({ uuid: "acao-1" }, "recurso-9")}
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /Ver UEs vinculadas/ })).toHaveAttribute(
      "href",
      "/associacoes-da-acao/acao-1?recurso_uuid=recurso-9"
    );
  });

  it("deve editar a ação selecionada", async () => {
    const user = userEvent.setup();
    const onEdit = jest.fn();
    const acao = { uuid: "acao-1", nome: "Merenda" };

    render(acoesTemplate(acao, onEdit));
    await user.click(screen.getByRole("button", { name: "Editar" }));

    expect(onEdit).toHaveBeenCalledWith(acao);
  });
});
