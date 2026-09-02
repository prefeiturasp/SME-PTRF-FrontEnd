import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { TopoComBotoes } from "../../components/ReordenarAcoes/components/TopoComBotoes";
import { useReordenarAcoesContext } from "../../components/ReordenarAcoes/hooks/useReordenarAcoesContext";

// Configura o atributo de teste do Testing Library caso o projeto utilize 'data-qa'
configure({ testIdAttribute: "data-qa" });

// Mock do hook de contexto de reordenação
jest.mock("../../components/ReordenarAcoes/hooks/useReordenarAcoesContext", () => ({
  useReordenarAcoesContext: jest.fn(),
}));

describe("Componente <TopoComBotoes />", () => {
  const mockHandleSalvarOrdenacaoBtnVoltar = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useReordenarAcoesContext.mockReturnValue({
      handleSalvarOrdenacaoBtnVoltar: mockHandleSalvarOrdenacaoBtnVoltar,
    });
  });

  test("deve renderizar o título, o texto descritivo e o botão 'Voltar'", () => {
    render(<TopoComBotoes />);

    // Valida o título do topo
    const titulo = screen.getByRole("heading", {
      level: 4,
      name: "Alterar ordenação",
    });
    expect(titulo).toBeInTheDocument();
    expect(titulo).toHaveClass("titulo-itens-painel", "mb-1");

    // Valida o texto instrucional
    expect(
      screen.getByText(
        /Arraste o ícone ao lado de cada ação para reorganizar a ordem\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /A ordenação será exibida em todas as listas de ações para as UEs vinculadas\./i
      )
    ).toBeInTheDocument();

    // Valida a exibição do botão
    const btnVoltar = screen.getByRole("button", { name: "Voltar" });
    expect(btnVoltar).toBeInTheDocument();
    expect(btnVoltar).toHaveClass("btn", "btn-primary", "ml-3", "text-nowrap");
  });

  test("deve acionar handleSalvarOrdenacaoBtnVoltar ao clicar no botão 'Voltar'", () => {
    render(<TopoComBotoes />);

    const btnVoltar = screen.getByRole("button", { name: "Voltar" });
    fireEvent.click(btnVoltar);

    expect(mockHandleSalvarOrdenacaoBtnVoltar).toHaveBeenCalledTimes(1);
  });
});