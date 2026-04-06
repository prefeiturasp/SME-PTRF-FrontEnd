import { render, screen } from "@testing-library/react";
import LinkCustomSemAcao from "../LinkCustomSemAcao";

describe("LinkCustomSemAcao", () => {
  it("deve renderizar o componente com children", () => {
    render(
      <LinkCustomSemAcao classeCssBotao="minha-classe">
        Conteúdo teste
      </LinkCustomSemAcao>
    );

    expect(screen.getByText("Conteúdo teste")).toBeInTheDocument();
  });

  it("deve aplicar a classe CSS corretamente", () => {
    render(
      <LinkCustomSemAcao classeCssBotao="classe-teste">
        Teste
      </LinkCustomSemAcao>
    );

    const elemento = screen.getByText("Teste");
    expect(elemento).toHaveClass("classe-teste");
  });

  it("deve renderizar children complexos (JSX)", () => {
    render(
      <LinkCustomSemAcao classeCssBotao="classe-jsx">
        <strong>Texto em negrito</strong>
      </LinkCustomSemAcao>
    );

    expect(screen.getByText("Texto em negrito")).toBeInTheDocument();
  });

  it("não deve quebrar sem props", () => {
    const { container } = render(<LinkCustomSemAcao />);

    expect(container).toBeInTheDocument();
  });
});