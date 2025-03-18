import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { useGetTabelasReceitas } from "../hooks/useGetTabelasReceitas";
import ReceitasPrevistas from "..";


jest.mock("../hooks/useGetTabelasReceitas", () => ({
  useGetTabelasReceitas: jest.fn(),
}));

describe("ReceitasPrevistas Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar corretamente", () => {
    useGetTabelasReceitas.mockReturnValue({
      data: { acoes_associacao: [] },
      isLoading: false,
    });

    render(<ReceitasPrevistas />);
    const titulo = screen.getByRole("heading", { level: 4, name: /receitas previstas/i });
    expect(titulo).toBeInTheDocument();
  });

  it("deve mudar de aba corretamente", () => {
    useGetTabelasReceitas.mockReturnValue({
      data: { acoes_associacao: [] },
      isLoading: false,
    });

    render(<ReceitasPrevistas />);
    const tabDetalhamento = screen.getByText("Detalhamento de recursos próprios");
    fireEvent.click(tabDetalhamento);

    expect(tabDetalhamento).toHaveClass("btn-escolhe-acao-active");
  });

  it("deve exibir os dados da tabela corretamente", async () => {
    useGetTabelasReceitas.mockReturnValue({
      data: {
        acoes_associacao: [
          { nome: "Recurso 1", valor_custeio: 1000, valor_capital: 500, valor_livre: 200, total: 1700, fixed: false },
        ],
      },
      isLoading: false,
    });

    render(<ReceitasPrevistas />);

    expect(screen.getByText("Recurso 1")).toBeInTheDocument();
    expect(screen.getByText("Custeio (R$)")).toBeInTheDocument();
    expect(screen.getByText("Capital (R$)")).toBeInTheDocument();
  });

  it("não deve renderizar o botão de edição quando `fixed` for `true`", () => {
    useGetTabelasReceitas.mockReturnValue({
      data: {
        acoes_associacao: [
          { nome: "Total do PTRF", fixed: true },
        ],
      },
      isLoading: false,
    });

    render(<ReceitasPrevistas />);

    expect(screen.queryByLabelText("Editar")).not.toBeInTheDocument();
  });

  it("deve renderizar o botão de edição quando `fixed` for `false`", () => {
    useGetTabelasReceitas.mockReturnValue({
      data: {
        acoes_associacao: [
          { nome: "Recurso Editável", fixed: false },
        ],
      },
      isLoading: false,
    });

    render(<ReceitasPrevistas />);
    expect(screen.getByLabelText("Editar")).toBeInTheDocument();
  });
});
