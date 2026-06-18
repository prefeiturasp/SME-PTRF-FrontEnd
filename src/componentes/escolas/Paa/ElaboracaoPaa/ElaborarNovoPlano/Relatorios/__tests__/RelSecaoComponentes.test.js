import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { RelSecaoComponentes } from "../RelSecaoComponentes";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../styles.css", () => ({}));

describe("RelSecaoComponentes", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renderiza os três componentes de seção", () => {
    render(<RelSecaoComponentes />);

    expect(screen.getByText("Plano de Aplicação")).toBeInTheDocument();
    expect(screen.getByText("Plano Orçamentário")).toBeInTheDocument();
    expect(screen.getByText("Atividades Previstas")).toBeInTheDocument();
  });

  test("renderiza os botões de ação corretos", () => {
    render(<RelSecaoComponentes />);

    const botoes = screen.getAllByRole("button");
    expect(botoes).toHaveLength(3);
    expect(botoes[0]).toHaveTextContent("Visualizar");
    expect(botoes[1]).toHaveTextContent("Visualizar");
    expect(botoes[2]).toHaveTextContent("Editar");
  });

  test("navega para rota do Plano de Aplicação ao clicar", () => {
    render(<RelSecaoComponentes />);

    fireEvent.click(screen.getAllByRole("button")[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/relatorios-componentes/plano-aplicacao");
  });

  test("navega para rota do Plano Orçamentário ao clicar", () => {
    render(<RelSecaoComponentes />);

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(mockNavigate).toHaveBeenCalledWith("/relatorios-componentes/plano-orcamentario");
  });

  test("navega para rota de Atividades Previstas ao clicar", () => {
    render(<RelSecaoComponentes />);

    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(mockNavigate).toHaveBeenCalledWith("/relatorios-componentes/atividades-previstas");
  });

  test("último item possui classe sem-borda", () => {
    const { container } = render(<RelSecaoComponentes />);

    const itens = container.querySelectorAll(".componentes-secao-item");
    expect(itens[2]).toHaveClass("sem-borda");
    expect(itens[0]).not.toHaveClass("sem-borda");
    expect(itens[1]).not.toHaveClass("sem-borda");
  });

  test("botões com variante secundaria possuem classe btn-outline-success", () => {
    const { container } = render(<RelSecaoComponentes />);

    const botoes = container.querySelectorAll(".componentes-secao-botao");
    botoes.forEach((botao) => {
      expect(botao).toHaveClass("btn-outline-success");
    });
  });
});
